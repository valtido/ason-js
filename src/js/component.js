var Component, Components;

Component = (function() {
  var get_key_only, occurrences, regx, replacer, test;

  regx = "\\${([^{}]+)}";

  test = function(str) {
    return (new RegExp(regx, "g")).test(str);
  };

  replacer = function() {};

  get_key_only = function(str) {
    var r;
    r = str.match(new RegExp(regx));
    return r[0].slice(2, -1);
  };

  function Component(element) {
    var el, num, path, split;
    this.element = element;
    this.elements = {};
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
    if (this.template_url === void 0) {
      throw new Error("jom: template is required");
    }
    if (path === void 0) {
      throw new Error("jom: collection is required");
    }
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
      front = "(function(shadow,body, host, root, component, collection, data){";
      reg = new RegExp("^" + (escapeRegExp(front)));
      is_script_prepared = reg.test(script.text);
      script.text = "" + front + "\n" + script.text + "\n}).apply(\n  (shadow = jom.shadow) && shadow.body,\n  [\n   shadow     = shadow,\n   body       = shadow.body,\n   host       = shadow.host,\n   root       = shadow.root,\n   component  = host.component,\n   collection = component.collection,\n   data       = component.data\n  ]\n)";
      return script;
    });
  };

  Component.prototype.bind = function(type, element, path) {
    var attribute, obj;
    if (this.elements[path] === void 0) {
      this.elements[path] = [];
    }
    switch (type) {
      case "node":
        obj = {
          type: type,
          element: element,
          callback: function(value) {
            var h;
            h = $(element).text(value).trigger("change.text", value).parents("[body]").get(0).parentNode.host;
            return $(h).trigger("change", value);
          }
        };
        break;
      case "attribute":
      case "attr":
        attribute = arguments[3];
        obj = {
          type: type,
          element: element,
          attribute: attribute,
          callback: function(value) {
            var h;
            h = $(element).attr(attribute, value).trigger("change.attr." + attribute, value).parents("[body]").get(0).parentNode.host;
            return $(h).trigger("change", value);
          }
        };
        break;
      default:
        throw new Error("Component: Data not bound");
    }
    return this.elements[path].push(obj);
  };

  Component.prototype.bind_attribute = function(attr, element) {
    var path, txt;
    if (test(attr.value)) {
      txt = attr.value.replace(new RegExp(regx, "gmi"), replacer);
      path = get_key_only(attr.value);
      $(element).attr(attr.name, txt);
      return this.bind("attr", element, path, attr.name);
    }
  };

  Component.prototype.bind_node = function(element) {
    var $el, path, raw_text, txt;
    $el = $(element);
    raw_text = $el.text();
    if (test(raw_text)) {
      txt = raw_text.replace(new RegExp(regx, "gmi"), replacer);
      path = get_key_only(raw_text);
      $el.text(txt);
      return this.bind("node", element, path);
    }
  };

  Component.prototype.data_transform = function() {
    var content, element, nodes, self;
    element = [];
    content = $(this.content);
    self = this;
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
          args = ["Component: no data found. `%s` in %o", match, element];
          if (typeof console !== "undefined" && console !== null) {
            if ((_ref = console.warn) != null) {
              _ref.apply(console, args);
            }
          }
          if ((typeof jom !== "undefined" && jom !== null ? jom.env : void 0) === "production") {
            return "";
          }
          return match;
        }
      };
    })(this);
    nodes = content.findAll('*').not('script, style').each(function() {
      var attr, key, _i, _len, _ref, _results;
      if ($(this).children().length === 0 && test($(this).text())) {
        self.bind_node(this);
      }
      _ref = this.attributes;
      _results = [];
      for (key = _i = 0, _len = _ref.length; _i < _len; key = ++_i) {
        attr = _ref[key];
        if (test(attr.value)) {
          _results.push(self.bind_attribute(attr, this));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    });
    return Observe(this.data, (function(_this) {
      return function(changes) {
        var change, key, path, _results;
        path = "";
        _results = [];
        for (key in changes) {
          change = changes[key];
          path = change.path;
          _results.push(_this.elements[path].forEach(function(item, index) {
            return item.callback(change.value);
          }));
        }
        return _results;
      };
    })(this));
  };

  occurrences = function(string, subString, allowOverlapping) {
    var n, pos, step;
    if (allowOverlapping == null) {
      allowOverlapping = true;
    }
    string += "";
    subString += "";
    if (subString.length <= 0) {
      return string.length + 1;
    }
    n = 0;
    pos = 0;
    step = (allowOverlapping ? 1. : subString.length);
    while (true) {
      pos = string.indexOf(subString, pos);
      if (pos >= 0) {
        n++;
        pos += step;
      } else {
        break;
      }
    }
    return n;
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

//# sourceMappingURL=../map/component.js.map
