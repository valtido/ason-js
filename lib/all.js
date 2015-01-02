var Collection, Collections, Component, JOM, Observe, Template, jom,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Collection = (function() {
  var changeStack, doSave, saveStack;

  changeStack = [];

  saveStack = [];

  Collection.prototype.autoSaveValue = false;

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

  function Collection(name, data, options) {
    this.name = name;
    this.data = data != null ? data : [];
    if (options == null) {
      options = {};
    }
    if (options.autoSave) {
      this.autoSave = options.autoSave;
    }
    this.name = name;
    this.data = data;
    this.schema = {};
    Observe(this.data, function(changes) {
      var item, _i, _len;
      for (_i = 0, _len = changeStack.length; _i < _len; _i++) {
        item = changeStack[_i];
        item.call(item, changes);
      }
      if (this.autoSave === true) {
        return doSave();
      }
    }, null, name);
    this;
  }

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

  Collection.prototype.findByPath = function(path) {};

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
  var insert, stack;

  stack = {};

  Collections.getter('collections', function() {
    return Object.keys(stack);
  });

  insert = function(collection, data, options) {
    var result;
    if (options == null) {
      options = {};
    }
    result = new Collection(collection, data, options);
    return stack[collection] = result;
  };

  function Collections() {
    this.collections;
  }

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
      return stack[collection];
    }
    if (arguments.length === 2) {
      if (_.isArray(data) === true) {
        return stack[collection] = insert(collection, data, options);
      }
    }
    return stack;
  };

  Collections.prototype.byPath = function(path) {
    var item, regx, result, split, text, _i, _len;
    regx = /(\[)(\d+)(\])/g;
    text = path.replace(regx, ".$2");
    split = text.split(".");
    result = this;
    for (_i = 0, _len = split.length; _i < _len; _i++) {
      item = split[_i];
      result = result[item] || void 0;
    }
    return result;
  };

  return Collections;

})();

Component = (function() {
  function Component() {
    var all;
    all = $('component');
    all.each((function(_this) {
      return function(i, n) {
        return _this.prepare(n);
      };
    })(this));
  }

  Component.prototype.prepare = function(element) {
    var el;
    return el = $(element);
  };

  Component.getter('list', function() {
    return $('component');
  });

  return Component;

})();

JOM = (function() {
  var collections, components;

  collections = new Collections();

  components = new Component();

  function JOM() {
    this.templates;
    this;
  }

  JOM.prototype.tasks = function() {
    return setTimeout((function(_this) {
      return function() {
        _this.templates;
        return _this.tasks();
      };
    })(this), 10);
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

  JOM.getter('templates', function() {
    var importers, templates;
    importers = $("link[rel=import]");
    templates = $("template");
    importers.each(function(i, importer) {
      var template;
      template = $('template', importer["import"]);
      template = template.filter(function() {
        return $(this).prop('filtered') !== true;
      });
      template.prop('filtered', true);
      if (template.length) {
        return templates = templates.add(template);
      }
    });
    templates.filter(function() {
      return $(this).prop('finalized') !== true;
    }).each(function(i, template) {
      return $(template).prop('finalized', true);
    });
    return templates.prependTo(document.head);
  });

  JOM.getter('collections', function() {
    return collections;
  });

  JOM.getter('components', function() {
    return components;
  });

  return JOM;

})();

jom = JOM = new JOM();

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
  function Template() {}

  return Template;

})();

//# sourceMappingURL=all.js.map
