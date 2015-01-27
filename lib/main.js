var AssetManager, Collection, Collections, Component, Components, JOM, Observe, Shadow, Template, Templates, asset_stack, jom,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

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

asset_stack = [];

AssetManager = function() {
  var collection, context, css, error, html, image, include, js, json, load, process, ready, running, template, update_status;
  running = false;
  context = document.head;
  update_status = function(element, message) {
    var asset_element, el;
    el = $(element);
    if (el.length) {
      asset_element = $(element).prop('asset');
      if (asset_element) {
        el = el.add(asset_element);
      }
      return el.attr('status', message);
    }
  };
  load = function() {
    return update_status(this, "loaded");
  };
  error = function() {
    var source;
    update_status(this, "failed");
    source = $($(this).prop('asset')).attr('source');
    throw new Error("Asset: Failed to load `" + source + "`");
  };
  process = function() {
    var asset, item, result, _css, _html, _js, _json, _schema;
    if (running === true) {
      return false;
    }
    running = true;
    _html = [];
    _js = [];
    _css = [];
    _json = [];
    _schema = [];
    while (asset_stack.length) {
      item = asset_stack[0];
      asset = item.asset;
      switch (item.type) {
        case "text/template":
          result = template(item, asset);
          _html.push({
            asset: asset,
            element: result
          });
          break;
        case "text/collection":
        case "application/collection":
          result = collection(item, asset);
          _json.push({
            asset: asset,
            element: result
          });
          break;
        case "text/json":
        case "application/json":
          result = json(item, asset);
          _json.push({
            asset: asset,
            element: result
          });
          break;
        case "text/html":
          result = html(item, asset);
          _html.push({
            asset: asset,
            element: result
          });
          break;
        case "text/javascript":
          result = js(item, asset);
          _js.push({
            asset: asset,
            element: result
          });
          break;
        case "text/stylesheet":
        case "text/css":
          result = css(item, asset);
          _css.push({
            asset: asset,
            element: result
          });
          break;
        default:
          throw new Error("Asset: failed to queue");
      }
      $(result).prop('asset', asset);
      update_status(item, 'init');
      result.onload = load;
      result.onerror = error;
      asset_stack.shift();
    }
    include(_css);
    include(_html);
    include(_js);
    include(_json);
    if (context.onAssetLoad !== void 0) {
      context.onAssetLoad.apply(context, []);
    }
    ready();
    return running = false;
  };
  ready = function() {
    if ((window.ason && window.ason.app === void 0) || document.body === null) {
      setTimeout(function() {
        return ready();
      }, 50);
      return false;
    }
    return $('body').trigger('assets_ready');
  };
  image = function(item, asset) {
    image = document.createElement("img");
    image.setAttribute('src', source);
    return image;
  };
  html = function(item, asset) {
    var link;
    link = document.createElement("link");
    link.setAttribute('href', item.source);
    link.setAttribute('rel', "import");
    link.setAttribute('type', item.type || 'text/javascript');
    return link;
  };
  template = function(item, asset) {
    var link, name;
    name = $(asset).attr('name');
    if (!name) {
      throw new Error("Asset: template `name` attr required `" + item.source + "`");
    }
    link = document.createElement("link");
    link.setAttribute('href', item.source);
    link.setAttribute('rel', "import");
    link.setAttribute('type', item.type || 'text/javascript');
    return link;
  };
  json = function(item, asset) {
    var collection, data, script, xhr;
    data = [];
    collection = $(asset).attr("collection");
    if (!(collection && collection.length)) {
      throw new Error("Asset: Collection ID is required");
    }
    script = document.createElement("script");
    xhr = $.getJSON(item.source);
    xhr.done(function(response) {
      var text;
      if (!(response instanceof Array)) {
        if (typeof console !== "undefined" && console !== null) {
          if (typeof console.warn === "function") {
            console.warn("Asset: `%o` should be an Array", response);
          }
        }
      }
      text = JSON.stringify(response);
      script.innerText = script.textContent = text;
      return script.json = response;
    });
    xhr.fail(error);
    script.setAttribute('origin', item.source);
    script.setAttribute('type', 'text/json');
    return script;
  };
  collection = function(item, asset) {
    var data, script, text, xhr;
    data = [];
    collection = $(asset).attr("name");
    if (!(collection && collection.length)) {
      throw new Error("Asset: Collection `name` attr is required");
    }
    script = document.createElement("script");
    if (item.source) {
      xhr = $.getJSON(item.source);
      xhr.done(function(response) {
        var text;
        if (!(response instanceof Array)) {
          if (typeof console !== "undefined" && console !== null) {
            if (typeof console.warn === "function") {
              console.warn("Asset: `%o` should be an Array", response);
            }
          }
        }
        text = JSON.stringify(response);
        script.innerText = script.textContent = text;
        return script.data = {
          name: collection,
          json: response
        };
      });
      xhr.fail(error);
    } else {
      text = $(asset).text();
      script.innerText = script.textContent = text;
      script.collection = response;
    }
    if (item.source) {
      script.setAttribute('origin', item.source);
    }
    script.setAttribute('type', 'text/collection');
    script.setAttribute('name', collection);
    return script;
  };
  js = function(item, asset) {
    var script;
    script = document.createElement("script");
    script.setAttribute('src', item.source);
    script.setAttribute('type', item.type || 'text/javascript');
    return script;
  };
  css = function(item, asset) {
    var style;
    style = document.createElement("link");
    style.setAttribute('href', item.source);
    style.setAttribute('rel', 'stylesheet');
    style.setAttribute('type', item.type || 'text/css');
    return style;
  };
  include = function(result) {
    var item, target, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = result.length; _i < _len; _i++) {
      item = result[_i];
      target = item.asset.root || document.head;
      _results.push(target.appendChild(item.element));
    }
    return _results;
  };
  $('link[rel="asset"]').not('[status]').each(function(i, asset) {
    var $asset, source, type;
    $asset = $(asset);
    type = $asset.attr('type');
    source = $asset.attr('source');
    return asset_stack.push({
      source: source,
      type: type,
      asset: asset
    });
  });
  process();
  return this;
};

AssetManager();

$(function() {
  return AssetManager();
});

Shadow = (function() {
  function Shadow() {
    var _ref;
    this.root = ((_ref = document.currentScript) != null ? _ref.parentNode : void 0) || arguments.callee.caller.caller["arguments"][0].target;
    this.traverseAncestry();
    this.root;
  }

  Shadow.prototype.traverseAncestry = function() {
    if (this.root.parentNode) {
      this.root = this.root.parentNode;
      return this.traverseAncestry();
    }
  };

  Shadow.property("body", {
    get: function() {
      return $(this.root).children().filter('[body]').get(0);
    }
  });

  Shadow.property("host", {
    get: function() {
      return this.root.host;
    }
  });

  return Shadow;

})();

Object.defineProperty(window, "Root", {
  get: function() {
    return new Shadow();
  }
});

Collection = (function() {
  var changeStack, data, doSave, saveStack;

  changeStack = [];

  saveStack = [];

  Collection.prototype.autoSaveValue = false;

  data = [];

  doSave = function() {
    var item, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = changeStack.length; _i < _len; _i++) {
      item = changeStack[_i];
      _results.push($.ajax.done(function(response) {
        return item.call(item, "success");
      }).fail(function() {
        return item.call(item, "error");
      }));
    }
    return _results;
  };

  function Collection(element, options) {
    var $el;
    this.element = element;
    if (options == null) {
      options = {};
    }
    $el = $(this.element);
    this.el = $el.get(0);
    if (options.autoSave) {
      this.autoSave = options.autoSave;
    }
    this.name = $el.attr("name");
  }

  Collection.prototype.ready = function(callback) {
    return setTimeout((function(_this) {
      return function() {
        data = _this.el.data;
        if (!(data && data.json)) {
          return _this.ready.call(_this, callback);
        } else {
          _this.data = _this.el.data.json;
          _this.schema = {};
          return callback.apply(_this, [_this.data, _this.name, changeStack, _this.autoSave, _this.doSave]);
        }
      };
    })(this), 100);
  };

  Collection.getter('length', function(value) {
    return this.data.length;
  });

  Collection.getter('autoSave', function(value) {
    return this.autoSaveValue;
  });

  Collection.setter('autoSave', function(value) {
    if (typeof value !== "boolean") {
      throw new Error("Collection: autoSave should be a `boolean` value");
    }
    if (value === true) {
      return this.save();
    }
  });

  Collection.prototype.find = function(where, callback) {
    var err, result;
    result = _.where(this.data, where);
    err = false;
    if (callback) {
      callback.call(this, err, result);
    }
    return result;
  };

  Collection.prototype.findByPath = function(path) {
    return jom.collections.findByPath(path, this.data);
  };

  Collection.prototype.on = function(type, path, callback) {
    switch (type) {
      case "change":
        this.change.call(this, callback);
        break;
      case "save":
        this.save.call(this, callback);
        break;
      default:
        throw new Error("Collection: Event not found `" + type + "`");
    }
    return this;
  };

  Collection.prototype.change = function(callback) {
    return changeStack.push(callback);
  };

  Collection.prototype.save = function(callback) {
    saveStack.push(callback);
    throw new Error("should save now!!!!");
  };

  return Collection;

})();

Collections = (function() {
  var element_to_collection, stack;

  stack = {};

  Collections.getter('collections', function() {
    return Object.keys(stack);
  });

  element_to_collection = function(all_plain_elements) {
    return all_plain_elements.each(function(i, n) {
      var collection;
      n.collection = true;
      collection = new Collection(n);
      return collection.ready(function(data, name, changeStack, autoSave, doSave) {
        stack[name] = collection;
        return Observe(stack[name].data, function(changes) {
          var item, _i, _len;
          console.log("Observer: change detected");
          for (_i = 0, _len = changeStack.length; _i < _len; _i++) {
            item = changeStack[_i];
            item.call(item, changes);
          }
          if (autoSave === true) {
            return doSave.call(collection);
          }
        }, null, name);
      });
    });
  };

  function Collections() {
    var all, existing, plain;
    all = $('script[type="text/collection"]');
    plain = all.filter(function() {
      return !("collection" in this);
    });
    existing = all.filter(function() {
      return "collection" in this;
    });
    if (plain.length > 0) {
      element_to_collection.call(this, plain);
    }
  }

  Collections.prototype.list = function() {
    return stack;
  };

  Collections.prototype.model = function(collection, data, options) {
    if (data == null) {
      data = [];
    }
    if (options == null) {
      options = {};
    }
    if (arguments.length === 0) {
      return stack;
    }
    if (arguments.length === 1) {
      if (stack[collection]) {
        return stack[collection];
      } else {
        return new Collection();
      }
    }
    return stack;
  };

  Collections.prototype.findByPath = function() {
    return this.byPath.apply(this, arguments);
  };

  Collections.prototype.byPath = function(path, data) {
    var item, regx, result, split, text, _i, _len;
    regx = /(\[)(\d+)(\])/g;
    text = path.replace(regx, ".$2").replace(/^\.*/, "");
    split = text.split(".");
    if (data) {
      result = data;
    } else {
      result = stack;
    }
    for (_i = 0, _len = split.length; _i < _len; _i++) {
      item = split[_i];
      if (result === void 0) {
        return result;
      }
      result = result[item] || void 0;
    }
    return result;
  };

  return Collections;

})();

Component = (function() {
  function Component(element) {
    var el, num, path, split;
    this.element = element;
    if (!this.element) {
      return this;
    }
    this.element["component"] = this;
    el = $(element);
    num = el.length;
    if (num > 1) {
      throw new Error("Component: `length` is > 1");
    }
    this.template_url = el.attr('template');
    path = el.attr('collection');
    split = path.split(':');
    this.collection_name = split[0];
    this.collection_path = split.slice(1).join(':');
    return this;
  }

  Component.prototype.ready = function(callback) {
    return setTimeout((function(_this) {
      return function() {
        var body, children, collection, template, _ref;
        template = jom.templates.find_by_url(_this.template_url);
        collection = jom.collections.model(_this.collection_name);
        _this.data = collection.findByPath(_this.collection_path);
        if (!(template && ((_ref = collection.data) != null ? _ref.length : void 0) > 0 && _this.element)) {
          return _this.ready.call(_this, callback);
        } else {
          _this.template = template.cloneNode(true);
          body = document.createElement('div');
          body.setAttribute('body', "");
          children = _this.template.content.children;
          $(children).appendTo(body);
          _this.template.content.appendChild(body);
          _this.collection = collection;
          _this.transform();
          _this.element.template = _this.template;
          _this.element.collection = _this.collection;
          return callback.apply(_this, [_this.element]);
        }
      };
    })(this), 100);
  };

  Component.prototype.transform = function() {
    var content;
    this.shadow = this.element.createShadowRoot();
    this.handle_template_scripts();
    content = document.importNode(this.template.content, true);
    this.shadow.appendChild(content);
    this.content = this.shadow.querySelector('[body]');
    return this.data_transform();
  };

  Component.prototype.handle_template_scripts = function() {
    var escapeRegExp, scripts;
    escapeRegExp = function(str) {
      return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    };
    scripts = this.template.content.querySelectorAll('script');
    return $(scripts).not('[src]').eq(0).each(function(i, script) {
      var front, is_script_prepared, reg;
      front = "(function (shadow, body, host, root, collection){";
      reg = new RegExp("^" + (escapeRegExp(front)));
      is_script_prepared = reg.test(script.text);
      script.text = "" + front + "\n" + script.text + "\n}).apply(\n  (shadow = jom.shadow) && shadow.body,\n  [\n   shadow     = shadow,\n   body       = shadow.body,\n   host       = shadow.host,\n   root       = shadow.root,\n   collection = host.component.collection\n   data       = host.component.data\n  ]\n)";
      return script;
    });
  };

  Component.prototype.data_transform = function() {
    var all_text, element, get_key_only, nodes_only, regx, replacer, test, text;
    regx = '\\$\\{(?:\\w|\\[|\\]|\\.|\\"|\\\'|\\n)*\}';
    test = function(str) {
      return (new RegExp(regx)).test(str);
    };
    element = [];
    get_key_only = function(str) {
      return str.slice(2, -1);
    };
    replacer = (function(_this) {
      return function(match) {
        var args, key, path, value, _ref;
        key = get_key_only(match);
        element.jsonpath = "" + _this.collection_name + "." + key;
        path = "" + _this.collection_path + "." + key;
        value = jom.collections.findByPath(path, _this.collection.data);
        if (value !== void 0) {
          return value;
        } else {
          args = ["Component: no data found. `%s` in %o", match, element.get(0)];
          if (typeof console !== "undefined" && console !== null) {
            if ((_ref = console.warn) != null) {
              _ref.apply(console, args);
            }
          }
          if (ason && ason.env === "production") {
            return "";
          }
          return match;
        }
      };
    })(this);
    all_text = $(this.content).findAll('*').filter(function() {
      return test($(this).text());
    });
    nodes_only = all_text.filter(function() {
      return $(this).children().length === 0;
    });
    return text = nodes_only.each(function(i, el) {
      var $el, raw_text, txt;
      element = el;
      $el = $(el);
      raw_text = $el.text();
      if (test(raw_text)) {
        txt = raw_text.replace(new RegExp(regx, "g"), replacer);
        return $el.text(txt);
      }
    });
  };

  return Component;

})();

Components = (function() {
  var element_to_component, stack;

  stack = [];

  element_to_component = function(all_plain_elements) {
    return all_plain_elements.each(function(i, n) {
      var component;
      component = new Component(n);
      return component.ready(function(element) {
        return stack.push(element);
      });
    });
  };

  function Components() {
    var all, existing, plain;
    all = $('component');
    plain = all.filter(function() {
      return !("component" in this);
    });
    existing = all.filter(function() {
      return "component" in this;
    });
    if (plain.length > 0) {
      element_to_component.call(this, plain);
    }
  }

  Components.prototype.list = function() {
    return stack;
  };

  Components.prototype.find_by_name = function(name) {
    return stack[name];
  };

  return Components;

})();

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
          new_path = "" + (base || '') + "[" + key + "]";
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
            new_path = "" + base + "." + key;
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
          new_path = "" + (base || '') + "[" + index_or_name + "]";
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
            new_path = "" + base + "." + change.name;
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

Template = (function() {
  function Template(link) {
    var num;
    this.link = link;
    this.el = $(link);
    num = this.el.length;
    if (num > 1) {
      throw new Error("Component: `length` is > 1");
    }
  }

  Template.prototype.ready = function(callback) {
    return setTimeout((function(_this) {
      return function() {
        _this.template = $('template', _this.link["import"]);
        if (_this.template.length === 0) {
          return _this.ready.call(_this, callback);
        } else {
          _this.link["template"] = _this.template;
          _this.url = _this.el.attr('href');
          _this.element = _this.template.get(0);
          if (_this.element) {
            _this.element.url = _this.url;
          }
          return callback.apply(_this, [_this.template.get(0)]);
        }
      };
    })(this), 100);
  };

  return Template;

})();

Templates = (function() {
  var element_to_template, stack;

  stack = [];

  element_to_template = function(all_plain_elements) {
    return all_plain_elements.each(function(i, n) {
      var template;
      n.template = true;
      template = new Template(n);
      return template.ready(function(element) {
        return stack.push(element);
      });
    });
  };

  function Templates() {
    var all, existing, plain;
    all = $('link[rel="import"]');
    all.each(function(i, n) {
      var href, length;
      href = $(n).attr('href');
      length = $("link[rel='import'][href='" + href + "']").length;
      if (length > 1) {
        return $(n).remove();
      }
    });
    plain = all.filter(function() {
      return !("template" in this);
    });
    existing = all.filter(function() {
      return "template" in this;
    });
    if (plain.length > 0) {
      element_to_template.call(this, plain);
    }
  }

  Templates.prototype.list = function() {
    return stack;
  };

  Templates.prototype.find_by_url = function(url) {
    var item, _i, _len;
    for (_i = 0, _len = stack.length; _i < _len; _i++) {
      item = stack[_i];
      if (item.url === url && url !== void 0) {
        return item;
      }
    }
  };

  return Templates;

})();

JOM = (function() {
  var stack;

  stack = {
    templates: [],
    components: [],
    collections: []
  };

  function JOM() {
    window["jom"] = this;
    this.tasks();
    this;
  }

  JOM.prototype.tasks = function() {
    return setTimeout((function(_this) {
      return function() {
        stack.templates = new Templates();
        stack.collections = new Collections();
        stack.components = new Components();
        return _this.tasks();
      };
    })(this), 1000);
  };

  JOM.getter('assets', function() {
    var all, assets, css_content, html_content, js_content, json_content, links;
    links = $('link[rel="asset"]');
    all = links.filter(function() {
      return $(this).data('finalized') !== true;
    }).each(function(i, asset) {
      return asset;
    });
    js_content = ["text/javascript"];
    json_content = ["text/json", "application/json"];
    css_content = ["text/css"];
    html_content = ["text/html"];
    assets = {};
    assets.all = all;
    assets.js = all.filter(function() {
      var _ref;
      return _ref = $(this).attr('type'), __indexOf.call(js_content, _ref) >= 0;
    });
    assets.css = all.filter(function() {
      var _ref;
      return _ref = $(this).attr('type'), __indexOf.call(css_content, _ref) >= 0;
    });
    assets.json = all.filter(function() {
      var _ref;
      return _ref = $(this).attr('type'), __indexOf.call(json_content, _ref) >= 0;
    });
    assets.html = all.filter(function() {
      var _ref;
      return _ref = $(this).attr('type'), __indexOf.call(html_content, _ref) >= 0;
    });
    return assets;
  });

  JOM.getter('shadow', function() {
    return new Shadow();
  });

  JOM.getter('templates', function() {
    return stack.templates;
  });

  JOM.getter('collections', function() {
    return stack.collections;
  });

  JOM.getter('components', function() {
    return stack.components;
  });

  JOM.getter('components_old', function() {
    var result;
    result = [];
    new Components();
    $('component').each(function(i, component) {
      return result.push(component);
    });
    return result;
  });

  return JOM;

})();

jom = JOM = new JOM();

//# sourceMappingURL=main.js.map
