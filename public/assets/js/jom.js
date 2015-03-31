var Observe;

Observe = (function() {
  function Observe(root, callback, curr, path) {
    var base, item, key, new_path, type_of_curr, _i, _len;
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
      for (key = _i = 0, _len = curr.length; _i < _len; key = ++_i) {
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
    console.log("go back to value change how it works");
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

var Asset;

Asset = (function() {
  function Asset(asset) {
    var $asset, params, part, split, type;
    $asset = $(asset);
    this.rel = $asset.attr("rel");
    if (this.rel === void 0) {
      throw new Error("jom: rel=asset is required");
    }
    this.name = ($asset.attr("name")) || null;
    this.source = $asset.attr("source");
    this.origin = $asset.clone();
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
    this;
  }

  Asset.prototype.create_element = function(asset) {
    var element, part;
    part = this.content_type.part;
    switch (part) {
      case 'text/template':
        element = "<link    rel=import href='" + this.source + "' type='text/template' />";
        break;
      case 'text/css':
        element = "<link    href='" + this.source + "' rel='stylesheet' type='text/css' />";
        break;
      case 'text/javascript':
        element = "<script  src='" + this.source + "' type='text/javascript' async=true />";
        break;
      case 'text/json':
        element = "<script  source='" + this.source + "' type='" + part + "' async='true' name='" + this.name + "' />";
        break;
      case "text/plain":
        element = "<script  type='" + part + "' async='true' />";
        break;
      default:
        element = null;
        if (typeof console !== "undefined" && console !== null) {
          if (typeof console.warn === "function") {
            console.warn("media: ", part);
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

  Collection.prototype.attach_data = function(data) {
    var item, length, _i, _len;
    if (data == null) {
      data = [];
    }
    length = data.length || Object.keys(data).length;
    if (length) {
      if (Array.isArray(data)) {
        for (_i = 0, _len = data.length; _i < _len; _i++) {
          item = data[_i];
          this.data.push(item);
        }
      } else {
        this.data.push(data);
      }
    }
    return this.data;
  };

  Collection.prototype.attach_schema = function(schema) {
    if (schema == null) {
      schema = {};
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

  Collection.prototype.stich = function(a, b) {
    var args, arr, first, result, stich;
    stich = this.stich;
    b = "" + b;
    first = b[0];
    result = first === "[" ? a + b : a + "." + b;
    if (arguments.length > 2) {
      args = Array.prototype.splice.call(arguments, 2);
      arr = [];
      arr.push(result);
      arr.push.apply(arr, args);
      result = this.stich.apply(this, arr);
    }
    return result;
  };

  Collection.prototype.findByPath = function(path) {
    var item, regx, result, split, text, _i, _len;
    regx = /(\[)(\d+)(\])/g;
    text = path.replace(regx, ".$2").replace(/^\.*/, "");
    split = text.split(".");
    result = this.data;
    for (_i = 0, _len = split.length; _i < _len; _i++) {
      item = split[_i];
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
    var $component, collection, path, template;
    if (component === void 0) {
      throw new Error("jom: component is required");
    }
    $component = $(component);
    $component.get(0).component = true;
    template = $component.attr("template");
    collection = $component.attr("collection");
    path = $component.attr("path");
    if (!template) {
      throw new Error("jom: component template is required");
    }
    if (!collection) {
      throw new Error("jom: component collection is required");
    }
    this.attr = {
      template: template,
      collection: collection
    };
    this.element = $component.get(0);
    if (!this.element.createShadowRoot) {
      this.element = wrap(this.element);
    }
    this.hide();
    this.ready = false;
    this.template = null;
    this.collection = null;
    this.path = path || "[0]";
    this.create_shadow();
    this.root = this.element.shadowRoot;
    this.template_ready = false;
    this.collection_ready = false;
    this.handles = [];
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
    return this.collection = collection;
  };

  Component.prototype.handlebars = function(content, collection) {
    var $content, nodes;
    $content = $(content);
    nodes = $content.findAll('*').not('script, style, link').each((function(_this) {
      return function(i, node) {
        var attr, key, new_text, path, text, _i, _len, _ref;
        text = $(node).text();
        if ($(node).children().length === 0 && regx.test(text) === true) {
          key = text.match(regx)[1];
          path = collection.stich(_this.path, key);
          new_text = collection.findByPath($.trim(path));
          $(node).text(text.replace(regx, new_text));
          _this.handles.push(node);
          node.handle = {
            type: "node",
            path: path,
            full: collection.stich(collection.name, path)
          };
        }
        _ref = node.attributes;
        for (key = _i = 0, _len = _ref.length; _i < _len; key = ++_i) {
          attr = _ref[key];
          if (regx.test(attr.value)) {
            text = attr.value;
            key = text.match(regx)[1];
            path = collection.stich(_this.path, key);
            new_text = collection.findByPath($.trim(path));
            attr.value = text.replace(regx, new_text);
            _this.handles.push(node);
            node.handle = {
              attr: attr,
              type: "attr",
              path: path,
              full: collection.stich(collection.name, path)
            };
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
    scripts = $(content).find('script');
    return $(scripts).not('[src]').eq(0).each(function(i, script) {
      var front, is_script_prepared, reg;
      front = "(function(shadow,body, host, root, component, collection, data){";
      reg = new RegExp("^" + (escapeRegExp(front)));
      is_script_prepared = reg.test(script.text);
      script.text = front + "\n" + script.text + "\n}).apply(\n  (shadow = jom.shadow) && shadow.body,\n  [\n   shadow     = shadow,\n   body       = shadow.body,\n   host       = shadow.host,\n   root       = shadow.root,\n   component  = host.component,\n   collection = component.collection,\n   data       = component.collection.findByPath(component.path)\n  ]\n)";
      return script;
    });
  };

  return Component;

})();

var Template;

Template = (function() {
  function Template(template) {
    var $template, t;
    if (template == null) {
      template = null;
    }
    $template = $(template);
    if ($template.length === 0) {
      throw new Error("jom: template is required");
    }
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
    this.cloned = null;
    this;
  }

  Template.prototype.clone = function() {
    return this.cloned = this.element.cloneNode(true);
  };

  return Template;

})();

var JOM, jom;

JOM = (function() {
  var cache, stack;

  cache = {};

  stack = {};

  function JOM() {
    window["jom"] = this;
    $('html').append('<foot/>');
    this.clear_cache();
    this.clear_stack();
    this.tasks();
    this;
  }

  JOM.prototype.tasks = function() {
    return setTimeout((function(_this) {
      return function() {
        _this.load_assets();
        _this.load_components();
        _this.load_templates();
        _this.load_collections();
        _this.inject_assets();
        _this.assemble_components();
        return _this.tasks();
      };
    })(this), 100);
  };

  JOM.prototype.inject_assets = function() {
    return $.each(stack.asset, function(i, asset) {
      var foot;
      if ((asset.queued != null) !== true) {
        asset.queued = true;
        foot = $('html>foot');
        if (asset.content_type.part === "text/json") {
          $.getJSON(asset.source).done(function(response) {
            return foot.find("script[source='" + asset.source + "']").get(0).data = response;
          });
        }
        return foot.append(asset.element);
      }
    });
  };

  JOM.prototype.load_assets = function() {
    return $('head link[rel="asset"]').each(function(i, asset) {
      var exists;
      exists = $(stack.asset).filter(function() {
        return this.source === $(asset).attr("source");
      });
      if ("asset" in asset === false && exists.length === 0) {
        asset.asset = true;
        return stack.asset.push(new Asset(asset));
      }
    });
  };

  JOM.prototype.load_components = function() {
    return $('component').each(function(i, component) {
      var c;
      if ("component" in component === false) {
        component.component = true;
        c = new Component(component);
        stack.component.push(c);
        return component.component = c;
      }
    });
  };

  JOM.prototype.load_templates = function() {
    return $("foot link[rel=import]").filter(function(i, link) {
      return link["import"] !== null;
    }).each(function(i, link) {
      var name, template;
      template = link["import"].querySelector("template");
      if ("template" in template === false && link["import"] !== void 0) {
        template.template = true;
        name = $(template).attr('name');
        return stack.template[name] = new Template(template);
      }
    });
  };

  JOM.prototype.load_collections = function() {
    return $("foot script[type='text/json']").each(function(i, collection) {
      var data, name;
      if ("collection" in collection === false && collection.data !== void 0) {
        collection.collection = true;
        name = $(collection).attr("name");
        data = collection.data;
        return stack.collection[name] = new Collection(name, data);
      }
    });
  };

  JOM.prototype.observe = function(component, collection) {
    if (collection.observing === true) {
      return false;
    }
    collection.observing = true;
    new Observe(collection.data, function(changes) {
      var change, key, path, _results;
      _results = [];
      for (key in changes) {
        change = changes[key];
        path = collection.stich(collection.name, change.path);
        _results.push($(component.handles).each(function(i, handle) {
          if (handle.handle.full === path) {
            switch (handle.handle.type) {
              case "attr":
                return $(handle).attr(handle.handle.attr.name, change.value);
              case "node":
                return $(handle).text(change.value);
              default:
                throw new Error("unexpected handle type");
            }
          }
        }));
      }
      return _results;
    });
    return true;
  };

  JOM.prototype.assemble_components = function() {
    return $.each(stack.component, function(i, component) {
      var collection, template, _ref;
      if (component.ready !== true) {
        template = jom.template[component.attr.template];
        collection = jom.collection[component.attr.collection];
        if (template !== void 0 && collection !== void 0 && ((_ref = collection.data) != null ? _ref.length : void 0)) {
          component.define_template(template);
          component.define_collection(collection);
          component.template.clone();
          component.hide();
          component.root.appendChild($('<div>Loading...</div>').get(0));
          component.handlebars(component.template.cloned, component.collection);
          $(component.root.children).remove();
          component.handle_template_scripts(component.template.cloned);
          component.root.appendChild(component.template.cloned);
          jom.observe(component, component.collection);
          component.show();
          return component.ready = true;
        }
      }
    });
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

  JOM.prototype.get_stack = function() {
    return stack;
  };

  JOM.prototype.get_cache = function() {
    return cache;
  };

  JOM.prototype.clear_stack = function() {
    stack.template = {};
    stack.collection = {};
    stack.component = [];
    return stack.asset = [];
  };

  JOM.prototype.clear_cache = function() {
    cache.template = {};
    cache.collection = {};
    cache.component = [];
    return cache.asset = [];
  };

  JOM.getter('asset', function() {
    return stack.asset;
  });

  JOM.getter('shadow', function() {
    return new Shadow();
  });

  JOM.getter('template', function() {
    return stack.template;
  });

  JOM.getter('component', function() {
    return stack.component;
  });

  JOM.getter('collection', function() {
    return stack.collection;
  });

  return JOM;

})();

jom = JOM = new JOM();
