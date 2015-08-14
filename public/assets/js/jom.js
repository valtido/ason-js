/* jshint proto: true */

/**
 * jjv.js -- A javascript library to validate json input through a json-schema.
 *
 * Copyright (c) 2013 Alex Cornejo.
 *
 * Redistributable under a MIT-style open source license.
 */

(function () {
  var clone = function (obj) {
      // Handle the 3 simple types (string, number, function), and null or undefined
      if (obj === null || typeof obj !== 'object') return obj;
      var copy;

      // Handle Date
      if (obj instanceof Date) {
          copy = new Date();
          copy.setTime(obj.getTime());
          return copy;
      }

      // handle RegExp
      if (obj instanceof RegExp) {
        copy = new RegExp(obj);
        return copy;
      }

      // Handle Array
      if (obj instanceof Array) {
          copy = [];
          for (var i = 0, len = obj.length; i < len; i++)
              copy[i] = clone(obj[i]);
          return copy;
      }

      // Handle Object
      if (obj instanceof Object) {
          copy = {};
//           copy = Object.create(Object.getPrototypeOf(obj));
          for (var attr in obj) {
              if (obj.hasOwnProperty(attr))
                copy[attr] = clone(obj[attr]);
          }
          return copy;
      }

      throw new Error("Unable to clone object!");
  };

  var clone_stack = function (stack) {
    var new_stack = [ clone(stack[0]) ], key = new_stack[0].key, obj = new_stack[0].object;
    for (var i = 1, len = stack.length; i< len; i++) {
      obj = obj[key];
      key = stack[i].key;
      new_stack.push({ object: obj, key: key });
    }
    return new_stack;
  };

  var copy_stack = function (new_stack, old_stack) {
    var stack_last = new_stack.length-1, key = new_stack[stack_last].key;
    old_stack[stack_last].object[key] = new_stack[stack_last].object[key];
  };

  var handled = {
    'type': true,
    'not': true,
    'anyOf': true,
    'allOf': true,
    'oneOf': true,
    '$ref': true,
    '$schema': true,
    'id': true,
    'exclusiveMaximum': true,
    'exclusiveMininum': true,
    'properties': true,
    'patternProperties': true,
    'additionalProperties': true,
    'items': true,
    'additionalItems': true,
    'required': true,
    'default': true,
    'title': true,
    'description': true,
    'definitions': true,
    'dependencies': true
  };

  var fieldType = {
    'null': function (x) {
      return x === null;
    },
    'string': function (x) {
      return typeof x === 'string';
    },
    'boolean': function (x) {
      return typeof x === 'boolean';
    },
    'number': function (x) {
      // Use x === x instead of !isNaN(x) for speed
      return typeof x === 'number' && x === x;
    },
    'integer': function (x) {
      return typeof x === 'number' && x%1 === 0;
    },
    'object': function (x) {
      return x && typeof x === 'object' && !Array.isArray(x);
    },
    'array': function (x) {
      return Array.isArray(x);
    },
    'date': function (x) {
      return x instanceof Date;
    }
  };

  // missing: uri, date-time, ipv4, ipv6
  var fieldFormat = {
    'alpha': function (v) {
      return (/^[a-zA-Z]+$/).test(v);
    },
    'alphanumeric': function (v) {
      return (/^[a-zA-Z0-9]+$/).test(v);
    },
    'identifier': function (v) {
      return (/^[-_a-zA-Z0-9]+$/).test(v);
    },
    'hexadecimal': function (v) {
      return (/^[a-fA-F0-9]+$/).test(v);
    },
    'numeric': function (v) {
      return (/^[0-9]+$/).test(v);
    },
    'date-time': function (v) {
      return !isNaN(Date.parse(v)) && v.indexOf('/') === -1;
    },
    'uppercase': function (v) {
      return v === v.toUpperCase();
    },
    'lowercase': function (v) {
      return v === v.toLowerCase();
    },
    'hostname': function (v) {
      return v.length < 256 && (/^([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])(\.([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]{0,61}[a-zA-Z0-9]))*$/).test(v);
    },
    'uri': function (v) {
      return (/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/).test(v);
    },
    'email': function (v) { // email, ipv4 and ipv6 adapted from node-validator
      return (/^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/).test(v);
    },
    'ipv4': function (v) {
      if ((/^(\d?\d?\d)\.(\d?\d?\d)\.(\d?\d?\d)\.(\d?\d?\d)$/).test(v)) {
        var parts = v.split('.').sort();
        if (parts[3] <= 255)
          return true;
      }
      return false;
    },
    'ipv6': function(v) {
      return (/^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/).test(v);
     /*  return (/^::|^::1|^([a-fA-F0-9]{1,4}::?){1,7}([a-fA-F0-9]{1,4})$/).test(v); */
    }
  };

  var fieldValidate = {
    'readOnly': function (v, p) {
      return false;
    },
    // ****** numeric validation ********
    'minimum': function (v, p, schema) {
      return !(v < p || schema.exclusiveMinimum && v <= p);
    },
    'maximum': function (v, p, schema) {
      return !(v > p || schema.exclusiveMaximum && v >= p);
    },
    'multipleOf': function (v, p) {
      return (v/p)%1 === 0 || typeof v !== 'number';
    },
    // ****** string validation ******
    'pattern': function (v, p) {
      if (typeof v !== 'string')
        return true;
      var pattern, modifiers;
      if (typeof p === 'string')
        pattern=p;
      else {
        pattern=p[0];
        modifiers=p[1];
      }
      var regex = new RegExp(pattern, modifiers);
      return regex.test(v);
    },
    'minLength': function (v, p) {
      return v.length >= p || typeof v !== 'string';
    },
    'maxLength': function (v, p) {
      return v.length <= p || typeof v !== 'string';
    },
    // ***** array validation *****
    'minItems': function (v, p) {
      return v.length >= p || !Array.isArray(v);
    },
    'maxItems': function (v, p) {
      return v.length <= p || !Array.isArray(v);
    },
    'uniqueItems': function (v, p) {
      var hash = {}, key;
      for (var i = 0, len = v.length; i < len; i++) {
        key = JSON.stringify(v[i]);
        if (hash.hasOwnProperty(key))
          return false;
        else
          hash[key] = true;
      }
      return true;
    },
    // ***** object validation ****
    'minProperties': function (v, p) {
      if (typeof v !== 'object')
        return true;
      var count = 0;
      for (var attr in v) if (v.hasOwnProperty(attr)) count = count + 1;
      return count >= p;
    },
    'maxProperties': function (v, p) {
      if (typeof v !== 'object')
        return true;
      var count = 0;
      for (var attr in v) if (v.hasOwnProperty(attr)) count = count + 1;
      return count <= p;
    },
    // ****** all *****
    'constant': function (v, p) {
      return JSON.stringify(v) == JSON.stringify(p);
    },
    'enum': function (v, p) {
      var i, len, vs;
      if (typeof v === 'object') {
        vs = JSON.stringify(v);
        for (i = 0, len = p.length; i < len; i++)
          if (vs === JSON.stringify(p[i]))
            return true;
      } else {
        for (i = 0, len = p.length; i < len; i++)
          if (v === p[i])
            return true;
      }
      return false;
    }
  };

  var normalizeID = function (id) {
    return id.indexOf("://") === -1 ? id : id.split("#")[0];
  };

  var resolveURI = function (env, schema_stack, uri) {
    var curschema, components, hash_idx, name;

    hash_idx = uri.indexOf('#');

    if (hash_idx === -1) {
      if (!env.schema.hasOwnProperty(uri))
        return null;
      return [env.schema[uri]];
    }

    if (hash_idx > 0) {
      name = uri.substr(0, hash_idx);
      uri = uri.substr(hash_idx+1);
      if (!env.schema.hasOwnProperty(name)) {
        if (schema_stack && schema_stack[0].id === name)
          schema_stack = [schema_stack[0]];
        else
          return null;
      } else
        schema_stack = [env.schema[name]];
    } else {
      if (!schema_stack)
        return null;
      uri = uri.substr(1);
    }

    if (uri === '')
      return [schema_stack[0]];

    if (uri.charAt(0) === '/') {
      uri = uri.substr(1);
      curschema = schema_stack[0];
      components = uri.split('/');
      while (components.length > 0) {
        if (!curschema.hasOwnProperty(components[0]))
          return null;
        curschema = curschema[components[0]];
        schema_stack.push(curschema);
        components.shift();
      }
      return schema_stack;
    } else // FIX: should look for subschemas whose id matches uri
      return null;
  };

  var resolveObjectRef = function (object_stack, uri) {
    var components, object, last_frame = object_stack.length-1, skip_frames, frame, m = /^(\d+)/.exec(uri);

    if (m) {
      uri = uri.substr(m[0].length);
      skip_frames = parseInt(m[1], 10);
      if (skip_frames < 0 || skip_frames > last_frame)
        return;
      frame = object_stack[last_frame-skip_frames];
      if (uri === '#')
        return frame.key;
    } else
      frame = object_stack[0];

    object = frame.object[frame.key];

    if (uri === '')
      return object;

    if (uri.charAt(0) === '/') {
      uri = uri.substr(1);
      components = uri.split('/');
      while (components.length > 0) {
        components[0] = components[0].replace(/~1/g, '/').replace(/~0/g, '~');
        if (!object.hasOwnProperty(components[0]))
          return;
        object = object[components[0]];
        components.shift();
      }
      return object;
    } else
      return;
  };

  var checkValidity = function (env, schema_stack, object_stack, options) {
    var i, len, count, hasProp, hasPattern;
    var p, v, malformed = false, objerrs = {}, objerr, props, matched;
    var sl = schema_stack.length-1, schema = schema_stack[sl], new_stack;
    var ol = object_stack.length-1, object = object_stack[ol].object, name = object_stack[ol].key, prop = object[name];
    var errCount, minErrCount;

    if (schema.hasOwnProperty('$ref')) {
      schema_stack= resolveURI(env, schema_stack, schema.$ref);
      if (!schema_stack)
        return {'$ref': schema.$ref};
      else
        return checkValidity(env, schema_stack, object_stack, options);
    }

    if (schema.hasOwnProperty('type')) {
      if (typeof schema.type === 'string') {
        if (options.useCoerce && env.coerceType.hasOwnProperty(schema.type))
          prop = object[name] = env.coerceType[schema.type](prop);
        if (!env.fieldType[schema.type](prop))
          return {'type': schema.type};
      } else {
        malformed = true;
        for (i = 0, len = schema.type.length; i < len && malformed; i++)
          if (env.fieldType[schema.type[i]](prop))
            malformed = false;
        if (malformed)
          return {'type': schema.type};
      }
    }

    if (schema.hasOwnProperty('allOf')) {
      for (i = 0, len = schema.allOf.length; i < len; i++) {
        objerr = checkValidity(env, schema_stack.concat(schema.allOf[i]), object_stack, options);
        if (objerr)
          return objerr;
      }
    }

    if (!options.useCoerce && !options.useDefault && !options.removeAdditional) {
      if (schema.hasOwnProperty('oneOf')) {
        minErrCount = Infinity;
        for (i = 0, len = schema.oneOf.length, count = 0; i < len; i++) {
          objerr = checkValidity(env, schema_stack.concat(schema.oneOf[i]), object_stack, options);
          if (!objerr) {
            count = count + 1;
            if (count > 1)
              break;
          } else {
            errCount = objerr.schema ? Object.keys(objerr.schema).length : 1;
            if (errCount < minErrCount) {
                minErrCount = errCount;
                objerrs = objerr;
            }
          }
        }
        if (count > 1)
          return {'oneOf': true};
        else if (count < 1)
          return objerrs;
        objerrs = {};
      }

      if (schema.hasOwnProperty('anyOf')) {
        objerrs = null;
        minErrCount = Infinity;
        for (i = 0, len = schema.anyOf.length; i < len; i++) {
          objerr = checkValidity(env, schema_stack.concat(schema.anyOf[i]), object_stack, options);
          if (!objerr) {
            objerrs = null;
            break;
          }
          else {
            errCount = objerr.schema ? Object.keys(objerr.schema).length : 1;
            if (errCount < minErrCount) {
                minErrCount = errCount;
                objerrs = objerr;
            }
          }
        }
        if (objerrs)
          return objerrs;
      }

      if (schema.hasOwnProperty('not')) {
        objerr = checkValidity(env, schema_stack.concat(schema.not), object_stack, options);
        if (!objerr)
          return {'not': true};
      }
    } else {
      if (schema.hasOwnProperty('oneOf')) {
        minErrCount = Infinity;
        for (i = 0, len = schema.oneOf.length, count = 0; i < len; i++) {
          new_stack = clone_stack(object_stack);
          objerr = checkValidity(env, schema_stack.concat(schema.oneOf[i]), new_stack, options);
          if (!objerr) {
            count = count + 1;
            if (count > 1)
              break;
            else
              copy_stack(new_stack, object_stack);
          } else {
            errCount = objerr.schema ? Object.keys(objerr.schema).length : 1;
            if (errCount < minErrCount) {
                minErrCount = errCount;
                objerrs = objerr;
            }
          }
        }
        if (count > 1)
          return {'oneOf': true};
        else if (count < 1)
          return objerrs;
        objerrs = {};
      }

      if (schema.hasOwnProperty('anyOf')) {
        objerrs = null;
        minErrCount = Infinity;
        for (i = 0, len = schema.anyOf.length; i < len; i++) {
          new_stack = clone_stack(object_stack);
          objerr = checkValidity(env, schema_stack.concat(schema.anyOf[i]), new_stack, options);
          if (!objerr) {
            copy_stack(new_stack, object_stack);
            objerrs = null;
            break;
          }
          else {
            errCount = objerr.schema ? Object.keys(objerr.schema).length : 1;
            if (errCount < minErrCount) {
                minErrCount = errCount;
                objerrs = objerr;
            }
          }
        }
        if (objerrs)
          return objerrs;
      }

      if (schema.hasOwnProperty('not')) {
        new_stack = clone_stack(object_stack);
        objerr = checkValidity(env, schema_stack.concat(schema.not), new_stack, options);
        if (!objerr)
          return {'not': true};
      }
    }

    if (schema.hasOwnProperty('dependencies')) {
      for (p in schema.dependencies)
        if (schema.dependencies.hasOwnProperty(p) && prop.hasOwnProperty(p)) {
          if (Array.isArray(schema.dependencies[p])) {
            for (i = 0, len = schema.dependencies[p].length; i < len; i++)
              if (!prop.hasOwnProperty(schema.dependencies[p][i])) {
                return {'dependencies': true};
              }
          } else {
            objerr = checkValidity(env, schema_stack.concat(schema.dependencies[p]), object_stack, options);
            if (objerr)
              return objerr;
          }
        }
    }

    if (!Array.isArray(prop)) {
      props = [];
      objerrs = {};
      for (p in prop)
        if (prop.hasOwnProperty(p))
          props.push(p);

      if (options.checkRequired && schema.required) {
        for (i = 0, len = schema.required.length; i < len; i++)
          if (!prop.hasOwnProperty(schema.required[i])) {
            objerrs[schema.required[i]] = {'required': true};
            malformed = true;
          }
      }

      hasProp = schema.hasOwnProperty('properties');
      hasPattern = schema.hasOwnProperty('patternProperties');
      if (hasProp || hasPattern) {
        i = props.length;
        while (i--) {
          matched = false;
          if (hasProp && schema.properties.hasOwnProperty(props[i])) {
            matched = true;
            objerr = checkValidity(env, schema_stack.concat(schema.properties[props[i]]), object_stack.concat({object: prop, key: props[i]}), options);
            if (objerr !== null) {
              objerrs[props[i]] = objerr;
              malformed = true;
            }
          }
          if (hasPattern) {
            for (p in schema.patternProperties)
              if (schema.patternProperties.hasOwnProperty(p) && props[i].match(p)) {
                matched = true;
                objerr = checkValidity(env, schema_stack.concat(schema.patternProperties[p]), object_stack.concat({object: prop, key: props[i]}), options);
                if (objerr !== null) {
                  objerrs[props[i]] = objerr;
                  malformed = true;
                }
              }
          }
          if (matched)
            props.splice(i, 1);
        }
      }

      if (options.useDefault && hasProp && !malformed) {
        for (p in schema.properties)
          if (schema.properties.hasOwnProperty(p) && !prop.hasOwnProperty(p) && schema.properties[p].hasOwnProperty('default'))
            prop[p] = schema.properties[p]['default'];
      }

      if (options.removeAdditional && hasProp && schema.additionalProperties !== true && typeof schema.additionalProperties !== 'object') {
        for (i = 0, len = props.length; i < len; i++)
          delete prop[props[i]];
      } else {
        if (schema.hasOwnProperty('additionalProperties')) {
          if (typeof schema.additionalProperties === 'boolean') {
            if (!schema.additionalProperties) {
              for (i = 0, len = props.length; i < len; i++) {
                objerrs[props[i]] = {'additional': true};
                malformed = true;
              }
            }
          } else {
            for (i = 0, len = props.length; i < len; i++) {
              objerr = checkValidity(env, schema_stack.concat(schema.additionalProperties), object_stack.concat({object: prop, key: props[i]}), options);
              if (objerr !== null) {
                objerrs[props[i]] = objerr;
                malformed = true;
              }
            }
          }
        }
      }
      if (malformed)
        return {'schema': objerrs};
    } else {
      if (schema.hasOwnProperty('items')) {
        if (Array.isArray(schema.items)) {
          for (i = 0, len = schema.items.length; i < len; i++) {
            objerr = checkValidity(env, schema_stack.concat(schema.items[i]), object_stack.concat({object: prop, key: i}), options);
            if (objerr !== null) {
              objerrs[i] = objerr;
              malformed = true;
            }
          }
          if (prop.length > len && schema.hasOwnProperty('additionalItems')) {
            if (typeof schema.additionalItems === 'boolean') {
              if (!schema.additionalItems)
                return {'additionalItems': true};
            } else {
              for (i = len, len = prop.length; i < len; i++) {
                objerr = checkValidity(env, schema_stack.concat(schema.additionalItems), object_stack.concat({object: prop, key: i}), options);
                if (objerr !== null) {
                  objerrs[i] = objerr;
                  malformed = true;
                }
              }
            }
          }
        } else {
          for (i = 0, len = prop.length; i < len; i++) {
            objerr = checkValidity(env, schema_stack.concat(schema.items), object_stack.concat({object: prop, key: i}), options);
            if (objerr !== null) {
              objerrs[i] = objerr;
              malformed = true;
            }
          }
        }
      } else if (schema.hasOwnProperty('additionalItems')) {
        if (typeof schema.additionalItems !== 'boolean') {
          for (i = 0, len = prop.length; i < len; i++) {
            objerr = checkValidity(env, schema_stack.concat(schema.additionalItems), object_stack.concat({object: prop, key: i}), options);
            if (objerr !== null) {
              objerrs[i] = objerr;
              malformed = true;
            }
          }
        }
      }
      if (malformed)
        return {'schema': objerrs};
    }

    for (v in schema) {
      if (schema.hasOwnProperty(v) && !handled.hasOwnProperty(v)) {
        if (v === 'format') {
          if (env.fieldFormat.hasOwnProperty(schema[v]) && !env.fieldFormat[schema[v]](prop, schema, object_stack, options)) {
            objerrs[v] = true;
            malformed = true;
          }
        } else {
          if (env.fieldValidate.hasOwnProperty(v) && !env.fieldValidate[v](prop, schema[v].hasOwnProperty('$data') ? resolveObjectRef(object_stack, schema[v].$data) : schema[v], schema, object_stack, options)) {
            objerrs[v] = true;
            malformed = true;
          }
        }
      }
    }

    if (malformed)
      return objerrs;
    else
      return null;
  };

  var defaultOptions = {
    useDefault: false,
    useCoerce: false,
    checkRequired: true,
    removeAdditional: false
  };

  function Environment() {
    if (!(this instanceof Environment))
      return new Environment();

    this.coerceType = {};
    this.fieldType = clone(fieldType);
    this.fieldValidate = clone(fieldValidate);
    this.fieldFormat = clone(fieldFormat);
    this.defaultOptions = clone(defaultOptions);
    this.schema = {};
  }

  Environment.prototype = {
    validate: function (name, object, options) {
      var schema_stack = [name], errors = null, object_stack = [{object: {'__root__': object}, key: '__root__'}];

      if (typeof name === 'string') {
        schema_stack = resolveURI(this, null, name);
        if (!schema_stack)
          throw new Error('jjv: could not find schema \'' + name + '\'.');
      }

      if (!options) {
        options = this.defaultOptions;
      } else {
        for (var p in this.defaultOptions)
          if (this.defaultOptions.hasOwnProperty(p) && !options.hasOwnProperty(p))
            options[p] = this.defaultOptions[p];
      }

      errors = checkValidity(this, schema_stack, object_stack, options);

      if (errors)
        return {validation: errors.hasOwnProperty('schema') ? errors.schema : errors};
      else
        return null;
    },

    resolveRef: function (schema_stack, $ref) {
      return resolveURI(this, schema_stack, $ref);
    },

    addType: function (name, func) {
      this.fieldType[name] = func;
    },

    addTypeCoercion: function (type, func) {
      this.coerceType[type] = func;
    },

    addCheck: function (name, func) {
      this.fieldValidate[name] = func;
    },

    addFormat: function (name, func) {
      this.fieldFormat[name] = func;
    },

    addSchema: function (name, schema) {
      if (!schema && name) {
        schema = name;
        name = undefined;
      }
      if (schema.hasOwnProperty('id') && typeof schema.id === 'string' && schema.id !== name) {
        if (schema.id.charAt(0) === '/')
          throw new Error('jjv: schema id\'s starting with / are invalid.');
        this.schema[normalizeID(schema.id)] = schema;
      } else if (!name) {
        throw new Error('jjv: schema needs either a name or id attribute.');
      }
      if (name)
        this.schema[normalizeID(name)] = schema;
    }
  };

  // Export for use in server and client.
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = Environment;
  else if (typeof define === 'function' && define.amd)
    define(function () {return Environment;});
  else
    this.jjv = Environment;
}).call(this);

var Observe;

Observe = (function() {
  function Observe(root, callback, curr, path) {
    var base, item, j, key, len, new_path, type_of_curr;
    if (curr == null) {
      curr = null;
    }
    if (path == null) {
      path = null;
    }
    curr = curr || root;
    if (!root) {
      throw new Error("Observe: Object missing.");
    }
    if (typeof callback !== "function") {
      throw new Error("Observe: Callback should be a function.");
    }
    type_of_curr = curr.constructor.name;
    if (type_of_curr === "Array") {
      base = path;
      for (key = j = 0, len = curr.length; j < len; key = ++j) {
        item = curr[key];
        if (typeof item === "object") {
          new_path = (base || '') + "[" + key + "]";
          new Observe(root, callback, item, new_path);
          new_path = "";
        }
      }
    }
    if (type_of_curr === "Object") {
      base = path;
      for (key in curr) {
        item = curr[key];
        if (typeof item === "object") {
          if (base) {
            new_path = base + "." + key;
          }
          if (!base) {
            new_path = "" + key;
          }
          new Observe(root, callback, item, new_path);
          new_path = "";
        }
      }
    }
    if (curr.constructor.name === "Array") {
      base = path;
      Array.observe(curr, function(changes) {
        var original, result;
        result = {};
        original = {};
        changes.forEach(function(change, i) {
          var index_or_name, is_add, part;
          index_or_name = change.index > -1 ? change.index : change.name;
          new_path = (base || '') + "[" + index_or_name + "]";
          part = {
            path: new_path,
            value: change.object[change.index] || change.object[change.name] || change.object
          };
          is_add = change.addedCount > 0 || change.type === "add";
          if (typeof part.value === "object" && is_add) {
            new Observe(root, callback, part.value, part.path);
            new_path = "";
          }
          result[i] = part;
          return original[i] = change;
        });
        return callback(result, original);
      });
    } else if (curr.constructor.name === "Object") {
      base = path;
      Object.observe(curr, function(changes) {
        var original, result;
        result = {};
        original = {};
        changes.forEach(function(change, i) {
          var is_add, part;
          if (base) {
            new_path = base + "." + change.name;
          }
          if (!base) {
            new_path = "" + change.name;
          }
          part = {
            path: new_path,
            value: change.object[change.name]
          };
          is_add = change.type === "add" || change.addedCount > 0;
          if (typeof part.value === "object" && is_add) {
            new Observe(root, callback, part.value, part.path);
            new_path = "";
          }
          result[i] = part;
          return original[i] = change;
        });
        return callback(result, original);
      });
    }
  }

  return Observe;

})();

Function.prototype.getter = function(prop, get) {
  return Object.defineProperty(this.prototype, prop, {
    get: get,
    configurable: true,
    enumerable: false
  });
};

Function.prototype.setter = function(prop, set) {
  return Object.defineProperty(this.prototype, prop, {
    set: set,
    configurable: true,
    enumerable: false
  });
};

Function.prototype.property = function(prop, desc) {
  return Object.defineProperty(this.prototype, prop, desc);
};

if ($.fn.findAll == null) {
  $.fn.findAll = function(selector) {
    return this.find(selector).add(this.filter(selector));
  };
}

if ($.fn.value == null) {
  $.fn.value = function(val, text) {
    var txt;
    if (text == null) {
      text = false;
    }
    console.info("go back to value change how it works");
    if (val) {
      $(this).data('value', arguments[0]);
      if (text === true) {
        txt = $.trim(val);
        $(this).text(txt);
      }
      $(this).trigger('jom.change');
      return $(this);
    }
    return $(this).data('value');
  };
}

var Asset,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Asset = (function() {
  Asset.name = null;

  Asset.source = "";

  Asset.origin = "";

  Asset.content_type = {};

  Asset.element = {};

  function Asset(asset) {
    var $asset, arr, params, part, ref, split, type;
    $asset = $(asset);
    this.rel = $asset.attr("rel");
    if (this.rel === void 0) {
      throw new Error("jom: rel=asset is required");
    }
    this.name = ($asset.attr("name")) || null;
    this.source = $asset.attr("source");
    this.asset = $asset.attr("asset");
    this.original = asset;
    this.clone = $asset.clone();
    type = $asset.attr("type");
    if (type === void 0) {
      throw new Error("jom: asset type is required");
    }
    split = type.split(";");
    part = $.trim(split[0]);
    params = $.trim(split[1]) || null;
    this.content_type = {
      full: type,
      part: part,
      type: part.split("/")[0],
      media: part.split("/")[1],
      params: params
    };
    $asset.get(0).asset = true;
    this.element = this.create_element();
    switch (this.content_type.part) {
      case 'text/html':
        this.error('name');
        this.error('source');
        this.error('asset');
        break;
      case 'text/json':
        this.error('name');
        this.error('source');
        this.error('asset');
        break;
      default:
        this.error('source');
    }
    arr = ['schema', 'collection', 'template', 'javascript', 'css', 'img', 'plain'];
    if (this.asset && (ref = this.asset, indexOf.call(arr, ref) >= 0) === false) {
      throw new Error("jom: asset attr '" + this.asset + "' is not valid");
    }
    this;
  }

  Asset.prototype.error = function(type) {
    var arr;
    arr = ['name', 'source', 'asset'];
    if (indexOf.call(arr, type) >= 0 && this[type] === void 0) {
      throw new Error("jom: " + type + " attr is required");
    }
  };

  Asset.prototype.create_element = function() {
    var element;
    switch (this.content_type.part) {
      case 'text/html':
        element = "<link    rel=import href='" + this.source + "' type='text/html' name='" + this.name + "' asset='" + this.asset + "' />";
        break;
      case 'text/css':
        element = "<link    href='" + this.source + "' rel='stylesheet' type='text/css' name='" + this.name + "' asset='" + this.asset + "' />";
        break;
      case 'text/javascript':
        element = "<script  src='" + this.source + "' type='text/javascript' async=true name='" + this.name + "' asset='" + this.asset + "' />";
        break;
      case 'text/json':
        element = "<script  source='" + this.source + "' type='" + this.content_type.part + "' async='true' name='" + this.name + "' asset='" + this.asset + "' />";
        break;
      case "text/plain":
        element = "<script  type='" + this.content_type.part + "' async='true' name='" + this.name + "' asset='" + this.asset + "' />";
        break;
      default:
        element = null;
        if (typeof console !== "undefined" && console !== null) {
          if (typeof console.warn === "function") {
            console.warn("media: ", this.content_type.part);
          }
        }
        throw new Error("jom: asset media `" + this.content_type.full + "` type is not valid");
    }
    return element;
  };

  return Asset;

})();

var Shadow;

Shadow = (function() {
  function Shadow() {
    var _ref, _ref1, _ref2, _ref3, _ref4;
    this.root = ((_ref = document.currentScript) != null ? _ref.parentNode : void 0) || ((_ref1 = arguments.callee) != null ? (_ref2 = _ref1.caller) != null ? (_ref3 = _ref2.caller) != null ? (_ref4 = _ref3["arguments"][0]) != null ? _ref4.target : void 0 : void 0 : void 0 : void 0) || null;
    this.traverseAncestry();
    this.root;
  }

  Shadow.prototype.traverseAncestry = function(parent) {
    var _ref;
    if (((_ref = this.root) != null ? _ref.parentNode : void 0) || parent) {
      this.root = this.root.parentNode || parent;
      return this.traverseAncestry(this.root.parentNode);
    }
  };

  Shadow.getter("body", function() {
    return ($(this.root).children().filter('[body]').get(0)) || null;
  });

  Shadow.getter("host", function() {
    var _ref;
    return ((_ref = this.root) != null ? _ref.host : void 0) || null;
  });

  return Shadow;

})();

Object.defineProperty(window, "Root", {
  get: function() {
    return new Shadow();
  }
});

var Collection;

Collection = (function() {
  var env;

  Collection.name = "";

  Collection.data = [];

  Collection.schema = {};

  Collection.errors = null;

  Collection.observing = false;

  env = jjv();

  function Collection(name, data, schema) {
    if (data == null) {
      data = [];
    }
    if (schema == null) {
      schema = {};
    }
    if (name === void 0 || !name || typeof name !== "string") {
      throw new Error("jom: collection name is required");
    }
    this.name = name;
    this.data = [];
    this.schema = {};
    this.attach_schema(schema);
    this.attach_data(data);
    this.errors = null;
    this.observing = false;
  }

  Collection.prototype.generate_id = function() {
    return new Date().getTime();
  };

  Collection.prototype.meta = function() {
    return {
      id: this.generate_id()
    };
  };

  Collection.prototype.attach_data = function(data) {
    var i, item, len, length;
    if (data == null) {
      data = [];
    }
    length = data.length || Object.keys(data).length;
    if (length) {
      if (Array.isArray(data)) {
        for (i = 0, len = data.length; i < len; i++) {
          item = data[i];
          item.meta = this.meta();
          Object.defineProperty(item, "meta", {
            enumerable: false
          });
          this.data.push(item);
        }
      } else {
        data.meta = this.meta();
        Object.defineProperty(data, "meta", {
          enumerable: false
        });
        this.data.push(data);
      }
    }
    return this.data;
  };

  Collection.prototype.attach_schema = function(schema) {
    if (schema == null) {
      schema = {};
    }
    if (schema === void 0) {
      throw new Error("collection: schema is missing");
    }
    return this.schema = schema;
  };

  Collection.prototype.errors_to_string = function() {
    return JSON.stringify(this.errors);
  };

  Collection.prototype.is_valid = function() {
    var length;
    env = jjv();
    length = Object.keys(this.schema).length;
    if (length === 0) {
      return true;
    }
    if (this.schema["$schema"] === void 0) {
      throw new Error("jom: $schema is missing");
    }
    env.addSchema(this.name, this.schema);
    this.errors = env.validate(this.name, this.data);
    if (!this.errors) {
      return true;
    }
    return false;
  };

  Collection.prototype.join = function(a, b) {
    var args, arr, first, join, result;
    join = this.join;
    b = "" + b;
    first = b[0];
    result = first === "[" ? a + b : a + "." + b;
    if (arguments.length > 2) {
      args = Array.prototype.splice.call(arguments, 2);
      arr = [];
      arr.push(result);
      arr.push.apply(arr, args);
      result = this.join.apply(this, arr);
    }
    return result;
  };

  Collection.prototype.findByPath = function(path) {
    var i, item, len, regx, result, split, text;
    regx = /(\[)(\d+)(\])/g;
    text = path.replace(regx, ".$2").replace(/^\.*/, "");
    split = text.split(".");
    result = this.data;
    for (i = 0, len = split.length; i < len; i++) {
      item = split[i];
      if (result === void 0) {
        return result;
      }
      result = result[item];
    }
    return result;
  };

  return Collection;

})();

var Component;

Component = (function() {
  var disabled, regx, regxG;

  disabled = false;

  regx = /\${([^\s{}]+)}/;

  regxG = /\${([^\s{}]+)}/g;

  function Component(component) {
    var $component, collections, path, template;
    if (component === void 0) {
      throw new Error("jom: component is required");
    }
    $component = $(component);
    $component.get(0).component = true;
    template = $component.attr("template");
    collections = $component.attr("collections");
    path = $component.attr("path");
    if (!template) {
      throw new Error("jom: component template is required");
    }
    if (!collections) {
      throw new Error("jom: component collections is required");
    }
    this.skip = false;
    this.attr = {
      template: template,
      collections: collections
    };
    collections = collections.split(/\s*,\s*/g);
    this.collections_list = collections;
    this.element = $component.get(0);
    if (!this.element.createShadowRoot) {
      this.element = wrap(this.element);
    }
    this.hide();
    this.ready = false;
    this.template = null;
    this.collections = [];
    this.path = path || "[0]";
    this.data = [];
    this.create_shadow();
    this.root = this.element.shadowRoot;
    this.handles = [];
    this.events = [];
    this.scripts = [];
    this.scripts.status = "init";
    this.init = {
      template: false,
      collections: false
    };
    this;
  }

  Component.prototype.hide = function() {
    var $root;
    $root = $(this.root);
    return $root.find("");
  };

  Component.prototype.show = function() {};

  Component.prototype.enable = function() {
    return disabled = false;
  };

  Component.prototype.disable = function() {
    return disabled = true;
  };

  Component.prototype.destroy = function() {};

  Component.prototype.create_shadow = function() {
    return this.element.createShadowRoot();
  };

  Component.prototype.define_template = function(template) {
    if (!template || template instanceof Template === false) {
      throw new Error("jom: template cant be added");
    }
    return this.template = template;
  };

  Component.prototype.define_collection = function(collection) {
    if (!collection || collection instanceof Collection === false) {
      throw new Error("jom: collection cant be added");
    }
    this.collections.push(collection);
    return this.collections;
  };

  Component.prototype.watcher = function(changes, collection) {
    var change, key, results;
    throw new Error("what watcher!!!");
    if (collection.name === this.collection.name) {
      results = [];
      for (key in changes) {
        change = changes[key];
        if (change.path.slice(0, this.path.length) === this.path) {
          results.push($(this.handles).each((function(_this) {
            return function(i, handle) {
              var event, j, k, len, len1, partial, ref, ref1, results1;
              if (handle.handle.path === change.path) {
                $(handle).trigger('change', change);
                partial = change.path.replace(_this.path, "").replace(/^\./, "");
                ref = _this.events;
                for (j = 0, len = ref.length; j < len; j++) {
                  event = ref[j];
                  if (event.type === "change:before" && event.path === partial) {
                    event.callback.call(_this);
                  }
                }
                switch (handle.handle.type) {
                  case "attr_name":
                    $(handle).attr(handle.handle.attr.name, "");
                    break;
                  case "attr_value":
                    $(handle).attr(handle.handle.attr.name, change.value);
                    break;
                  case "node":
                    $(handle).text(change.value);
                    break;
                  default:
                    throw new Error("jom: unexpected handle type");
                }
                ref1 = _this.events;
                results1 = [];
                for (k = 0, len1 = ref1.length; k < len1; k++) {
                  event = ref1[k];
                  if (event.type === "change" && event.path === partial) {
                    results1.push(event.callback.call(_this));
                  } else {
                    results1.push(void 0);
                  }
                }
                return results1;
              }
            };
          })(this)));
        } else {
          results.push(void 0);
        }
      }
      return results;
    }
  };

  Component.prototype.handlebars = function(content, component) {
    var $content, c, collections;
    collections = component.collections;
    $content = $(content);
    c = $content.findAll('*').not('script, style, link, [repeat]').filter(function() {
      return $(this).parents('[repeat]').length === 0;
    });
    c.each((function(_this) {
      return function(i, node) {
        var attr, collection, e, j, key, len, name, new_text, path, raw, ref, ref1, ref2, ref3, text;
        text = $(node).text();
        if ($(node).children().length === 0 && regx.test(text) === true) {
          raw = text;
          key = text.match(regx)[1];
          ref = key.split(':'), collection = ref[0], path = ref[1];
          collection = collections[collection];
          if (collection === void 0) {
            throw new Error("component: `" + raw + "` is wrong, start with collection.");
          }
          new_text = collection.findByPath($.trim(path));
          if (new_text === void 0) {
            if (jom.env === "production") {
              console.info(new_text);
              new_text = "";
            } else {
              throw new Error("Data: not found for `" + raw + "` key.");
            }
          }
          $(node).text(text.replace(regx, new_text));
          node.handle = {
            type: "node",
            path: path,
            full: collection.join(collection.name, path)
          };
          _this.handles.push(node);
        }
        ref1 = node.attributes;
        for (key = j = 0, len = ref1.length; j < len; key = ++j) {
          attr = ref1[key];
          if (regx.test(attr.name)) {
            text = attr.name;
            raw = text;
            try {
              key = text.match(regx)[1];
            } catch (_error) {
              e = _error;
              throw new Error("Component: wrong key on attr name " + text);
            }
            ref2 = key.split(':'), collection = ref2[0], path = ref2[1];
            collection = collections[collection];
            if (collection === void 0) {
              throw new Error("component: `" + raw + "` is wrong, start with collection.");
            }
            new_text = collection.findByPath($.trim(path));
            if (new_text === void 0 && jom.env === "production") {
              new_text = "";
            }
            name = text.replace(regx, new_text);
            $(node).removeAttr(attr.name).attr(name, attr.value);
            node.handle = {
              attr: attr,
              type: "attr_name",
              path: path,
              full: collection.join(collection.name, path)
            };
            _this.handles.push(node);
          }
          if (regx.test(attr.value)) {
            text = attr.value;
            raw = text;
            try {
              key = text.match(regx)[1];
            } catch (_error) {
              e = _error;
              throw new Error("Component: wrong key on attr value " + text);
            }
            ref3 = key.split(':'), collection = ref3[0], path = ref3[1];
            if (collection === void 0) {
              throw new Error("component: `" + raw + "` is wrong, start with collection.");
            }
            collection = collections[collection];
            new_text = collection.findByPath($.trim(path));
            if (new_text === void 0 && jom.env === "production") {
              new_text = "";
            }
            attr.value = text.replace(regx, new_text);
            node.handle = {
              attr: attr,
              type: "attr_value",
              path: path,
              full: collection.join(collection.name, path)
            };
            _this.handles.push(node);
          }
        }
        return node;
      };
    })(this));
    return $content;
  };

  Component.prototype.handle_template_scripts = function(content) {
    var escapeRegExp, scripts;
    escapeRegExp = function(str) {
      return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    };
    scripts = $(content).add(content.children).find('script');
    $(scripts).filter('[src]').each(function(i, script) {
      return script.onload = function() {
        return script.has_loaded = true;
      };
    });
    return $(scripts).not('[src]').eq(0).each(function(i, script) {
      var front, is_script_prepared, reg;
      front = "";
      reg = new RegExp("^" + (escapeRegExp(front)));
      is_script_prepared = reg.test(script.text);
      script.text = "(function(){\nvar\nshadow      = jom.shadow,\nbody        = shadow.body,\nhost        = shadow.host,\nroot        = shadow.root,\ncomponent   = host.component,\ncollections = component.collections\n;\n\n" + script.text + "\n})()";
      return script;
    });
  };

  Component.prototype.on = function(type, path, callback) {
    var event, j, len, types;
    types = type.split(" ");
    for (j = 0, len = types.length; j < len; j++) {
      type = types[j];
      event = {
        type: type,
        path: path,
        callback: callback
      };
      this.events.push(event);
    }
    return this;
  };

  Component.prototype.trigger = function(type, params) {
    var event, handle, j, k, l, len, len1, len2, ref, ref1, types;
    if (params == null) {
      params = {};
    }
    types = type.split(" ");
    for (j = 0, len = types.length; j < len; j++) {
      type = types[j];
      ref = this.events;
      for (k = 0, len1 = ref.length; k < len1; k++) {
        event = ref[k];
        if (type === event.type) {
          ref1 = this.handles;
          for (l = 0, len2 = ref1.length; l < len2; l++) {
            handle = ref1[l];
            if (handle.handle.path.indexOf(event.path) !== -1) {
              event.callback.call(handle, event, params);
            }
          }
        }
      }
    }
    return this;
  };

  Component.prototype.repeat = function(element, data) {
    var $element, clone, collection, e, index, item, j, key, len, path, prefix, raw, ref, repeat, x;
    if (data == null) {
      data = null;
    }
    if (data === null) {
      data = [];
    }
    $element = $(element);
    key = $element.attr('repeat');
    raw = key;
    if (key === void 0) {
      throw new Error("component: `repeat` attr missing");
    }
    try {
      key = key.match(regx)[1];
    } catch (_error) {
      e = _error;
      throw new Error("Component: Wrong key `" + key + "`");
    }
    repeat = $([]);
    ref = key.split(":"), collection = ref[0], path = ref[1];
    if (collection === void 0) {
      throw new Error("component: `" + raw + "` is wrong, start with collection.");
    }
    if (path !== void 0 && path.length) {
      data = this.collections[collection].findByPath(path);
    } else {
      data = this.collections[collection].data;
    }
    if (data === void 0) {
      throw new Error("component: data not found `" + path + "`");
    }
    if (path === void 0) {
      path = "";
    }
    for (index = j = 0, len = data.length; j < len; index = ++j) {
      item = data[index];
      clone = $element.clone();
      clone.attr("repeated", true);
      clone.attr("repeat", null);
      clone.attr('repeat-index', index);
      prefix = this.collections[collection].join(path, "[" + index + "]");
      prefix = collection + ":" + prefix;
      x = clone[0].outerHTML.replace(/(\${)([^\s{}]+)(})/g, "$1" + prefix + ".$2$3");
      x = x.replace(/(\{repeat\.index})/g, index);
      x = x.replace(/(\{repeat\.length})/g, data.length);
      repeat = repeat.add(x);
    }
    return repeat;
  };

  return Component;

})();


/*
Template class, keeps an instance of template information
Each template can only exist once
 */
var Template;

Template = (function() {

  /*
  Template constructor
  @param template [HTMLElement | String ]
  @return Template
   */
  function Template(template) {
    var $template, i, key, len, schema, schemas, t;
    if (template == null) {
      template = null;
    }
    this.original = template;
    $template = $(template);
    if ($template.length === 0) {
      throw new Error("jom: template is required");
    }
    this.ready = false;
    this.name = $template.attr("name");
    if (this.name === void 0) {
      throw new Error("jom: template name attr is required");
    }
    t = $template.get(0);
    this.element = document.importNode(t.content, true);
    this.body = $(this.element).children("[body]");
    $template.get(0).template = true;
    if (this.body === void 0 || this.body.length === 0) {
      throw new Error("jom: template body attr is required");
    }
    this.schemas = [];
    schemas = $.trim($template.attr('schemas'));
    schemas = schemas.split(',');
    for (key = i = 0, len = schemas.length; i < len; key = ++i) {
      schema = schemas[key];
      schemas[key] = $.trim(schema);
    }
    this.schemas_list = schemas;
    schemas = schemas.join(',');
    this.schemas_attr = schemas;
    this.schemas_ready = false;
    this.cloned = null;
    this.show_loader();
    this.load_schemas();
    this;
  }

  Template.prototype.load_schemas = function() {
    var i, j, len, len1, ref, ref1, results, schema;
    if (this.schemas_ready === true) {
      return this.ready = true;
    } else {
      this.schemas_ready = true;
      if (this.schemas_list.length === 0) {
        this.schemas_ready = false;
      }
      ref = this.schemas_list;
      for (i = 0, len = ref.length; i < len; i++) {
        schema = ref[i];
        if (jom.schemas.get(schema) === null) {
          this.schemas_ready = false;
        }
      }
      if (this.schemas_ready === true) {
        ref1 = this.schemas_list;
        results = [];
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          schema = ref1[j];
          results.push(this.schemas.push(jom.schemas.get(schema)));
        }
        return results;
      }
    }
  };

  Template.prototype.show_loader = function() {
    var css, loader;
    loader = $('<div class="temporary_loader"><i class="icon-loader animate-spin">Loading...</i></div>');
    css = {
      position: "absolute",
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      "text-align": "center",
      display: "block",
      "background-color": "#fff"
    };
    loader.css(css);
    loader.children('i').css({
      position: 'absolute',
      top: "50%"
    });
    $('.temporary_loader', this.element).remove();
    return $(this.element).append(loader);
  };

  Template.prototype.hide_loader = function(content) {
    return $(content).add(content.children).findAll('.temporary_loader').remove();
  };

  Template.prototype.define_schema = function(schema) {
    if (!schema || schema instanceof Schema === false) {
      throw new Error("jom: template schemas attr is required");
    }
    return this.schemas.push(schema);
  };

  return Template;

})();

var Schema;

Schema = (function() {
  function Schema(name, obj, description) {
    if (description == null) {
      description = null;
    }
    this.name = name;
    if (!this.name) {
      throw new Error("Schema: name is not defined");
    }
    this.description = description;
    this.tree = obj;
  }

  return Schema;

})();

var JOM, jom,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

JOM = (function() {
  var observer;

  observer = {};

  function JOM() {
    var self;
    self = window["jom"] = this;
    $('html').append('<foot/>');
    this.templates = [];
    this.collections = [];
    this.components = [];
    this.assets = [];
    this.schemas = [];
    this.collections.get = function(name) {
      return self.get('collection', name);
    };
    this.templates.get = function(name) {
      return self.get('template', name);
    };
    this.schemas.get = function(name) {
      return self.get('schema', name);
    };
    this.components.get = function(name) {
      return self.get('component', name);
    };
    this.assets.get = function(name) {
      return self.get('asset', name);
    };
    this.tasks();
    this.env = "production";
    this.app = {
      title: "JOM is Awesome"
    };
    this;
  }

  JOM.prototype.tasks = function() {
    return setTimeout((function(_this) {
      return function() {
        _this.load_assets();
        _this.load_components();
        _this.load_templates();
        _this.load_collections();
        _this.load_schemas();
        _this.inject_assets();
        _this.assemble_components();
        _this.watch_collections();
        return _this.tasks();
      };
    })(this), 100);
  };

  JOM.prototype.get = function(what, name) {
    var arr, item, j, key, len, ref, ref1;
    if (name == null) {
      name = false;
    }
    arr = ['collection', 'template', 'asset', 'schema'];
    if (ref = !what, indexOf.call(arr, ref) >= 0) {
      throw new Error("jom: cannot get anything naughty.");
    }
    if (name === false) {
      return this[what + "s"];
    }
    ref1 = this[what + "s"];
    for (key = j = 0, len = ref1.length; j < len; key = ++j) {
      item = ref1[key];
      if (name === item.name) {
        return this[what + "s"][key];
      }
    }
    return null;
  };

  JOM.prototype.inject_assets = function() {
    return $.each(this.assets, function(i, asset) {
      var foot;
      if ((asset.queued != null) !== true) {
        asset.queued = true;
        foot = $('html>foot');
        if (asset.content_type.part === "text/json") {
          $.getJSON(asset.source).done(function(response) {
            return foot.find("script[source='" + asset.source + "']").get(0).data = response;
          }).error(function(err) {
            throw new Error('Faild: to load a json asset');
          });
        }
        return foot.append(asset.element);
      }
    });
  };

  JOM.prototype.load_assets = function() {
    return $('link[rel="asset"]').each((function(_this) {
      return function(i, asset) {
        var exists;
        exists = $(_this.assets).filter(function() {
          return _this.source === $(asset).attr("source");
        });
        if ("jinit" in asset === false && exists.length === 0) {
          asset.jinit = true;
          return _this.assets.push(new Asset(asset));
        }
      };
    })(this));
  };

  JOM.prototype.load_schemas = function() {
    return $('foot script[asset=schema]').each((function(_this) {
      return function(i, schema) {
        var name, obj, s;
        if ("jinit" in schema === false && schema.data !== void 0) {
          schema.jinit = true;
          s = schema.data || {};
          name = $(schema).attr('name');
          obj = new Schema(name, s);
          return _this.schemas.push(obj);
        }
      };
    })(this));
  };

  JOM.prototype.load_components = function() {
    return $('component').each((function(_this) {
      return function(i, component) {
        var c;
        if ("jinit" in component === false) {
          component.jinit = true;
          c = new Component(component);
          _this.components.push(c);
          return component.component = c;
        }
      };
    })(this));
  };

  JOM.prototype.load_templates = function() {
    return $("foot link[rel=import][asset=template]").filter(function(i, link) {
      return link["import"] !== null;
    }).each((function(_this) {
      return function(i, link) {
        var name, template;
        template = link["import"].querySelector("template");
        if (template && "jinit" in template === false && link["import"] !== void 0) {
          template.jinit = true;
          name = $(template).attr('name');
          return _this.templates.push(new Template(template));
        }
      };
    })(this));
  };

  JOM.prototype.load_collections = function() {
    return $("foot script[type='text/json'][asset=collection]").each((function(_this) {
      return function(i, collection) {
        var data, name;
        if ("jinit" in collection === false && collection.data !== void 0) {
          collection.jinit = true;
          name = $(collection).attr("name");
          data = collection.data;
          return _this.collections.push(new Collection(name, data));
        }
      };
    })(this));
  };

  JOM.prototype.assemble_components = function() {
    var timeout;
    timeout = 60 * 1000;
    if (jom.env !== "production") {
      timeout = 10 * 1000;
    }
    return $.each(this.components, (function(_this) {
      return function(i, component) {
        var c, collections_available, j, k, len, len1, ref, ref1, template;
        if (component.skip === true) {
          return false;
        }
        if (component.ready === true) {
          component.skip = true;
          component.template.hide_loader(component.root);
          return false;
        }
        if ("timer" in component === false) {
          component.timer = new Date();
        }
        if (new Date() - component.timer > timeout) {
          throw new Error("jom: Component `" + component.name + "` timedout");
        }
        template = jom.templates.get(component.attr.template);
        if (component.init.template === false && template) {
          component.init.template = true;
          template = new Template(template.original);
          template.show_loader();
          component.define_template(template);
          component.handle_template_scripts(template.element);
          component.template.component = component;
          component.root.appendChild(template.element);
          template.element = component.root;
        }
        if (template && template.ready === false) {
          component.template.load_schemas();
        }
        if (component.init.collections === false) {
          collections_available = true;
          if (component.collections_list.length === 0) {
            collections_available = false;
          }
          ref = component.collections_list;
          for (j = 0, len = ref.length; j < len; j++) {
            c = ref[j];
            if (jom.collections.get(c) === null) {
              collections_available = false;
            }
          }
        }
        if (component.init.collections === false && collections_available === true) {
          component.init.collections = true;
          ref1 = component.collections_list;
          for (k = 0, len1 = ref1.length; k < len1; k++) {
            c = ref1[k];
            component.define_collection(jom.collections.get(c));
          }
        }
        if (component.init.template === true && component.init.collections === true && component.template.ready === true && _this.scripts_loaded(component) === true) {
          _this.repeater(component);
          component.handlebars(component.root.children, component);
          _this.image_source_change(component);
          component.show();
          component.ready = true;
          return component.trigger('ready');
        }
      };
    })(this));
  };

  JOM.prototype.scripts_loaded = function(component) {
    var all_done, scripts;
    all_done = true;
    scripts = $('script[src]', component.root);
    $(scripts).each(function(i, script) {
      if ((script.has_loaded != null) !== true) {
        return all_done = false;
      }
    });
    return all_done;
  };

  JOM.prototype.image_source_change = function(component) {
    return $('[body] img', component.root).not('[repeat] img').each(function(i, image) {
      var $image;
      $image = $(image);
      return $image.attr('src', $image.attr("source"));
    });
  };

  JOM.prototype.repeater = function(component, context) {
    if (context == null) {
      context = null;
    }
    context = context || $(component.template.element.children).filter('[body]');
    return $('[repeat]', context).each(function(i, repeater) {
      var items;
      repeater = $(repeater);
      items = component.repeat(repeater);
      items.insertAfter(repeater);
      return repeater.hide();
    });
  };

  JOM.prototype.watch_collections = function() {
    var collection, key, ref, results;
    ref = this.collections;
    results = [];
    for (key in ref) {
      collection = ref[key];
      if (collection.observing === false) {
        collection.observing = true;
        results.push(new Observe(collection.data, (function(_this) {
          return function(changes) {
            var change, results1;
            results1 = [];
            for (key in changes) {
              change = changes[key];
              results1.push($.each(_this.components, function(i, component) {
                $(component.root).find('[repeated]').remove();
                $(component.root).find('[repeat]').show();
                _this.repeater(component, component.root);
                component.handlebars(component.root, component);
                _this.image_source_change(component);
                $(component.root.host).trigger("change", [change, component.data, component.collection]);
                $(component.root).find('[repeat]').hide();
                return component.trigger("change", change);
              }));
            }
            return results1;
          };
        })(this)));
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  JOM.prototype.resolve = function(path) {
    var first, href, pr, result, second, url;
    href = location.href;
    pr = href.replace(location.protocol + "//", "").replace(location.host, "");
    url = pr;
    first = path[0];
    second = path[1];
    result = "";
    switch (first) {
      case "/":
        if (second !== "/") {
          result = path;
        }
        break;
      default:
        result = url.replace(/([\/]?[^\/]+[\/]?)$/g, "/" + path);
    }
    return result;
  };

  JOM.getter('shadow', function() {
    return new Shadow();
  });

  return JOM;

})();

jom = JOM = new JOM();
