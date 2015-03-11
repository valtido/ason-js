var JOM, jom,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

JOM = (function() {
  var cache, stack;

  cache = {};

  stack = {};

  function JOM() {
    window["jom"] = this;
    this.clear_cache();
    this.clear_stack();
    this.tasks();
    this;
  }

  JOM.prototype.tasks = function() {
    return setTimeout((function(_this) {
      return function() {
        _this.run_template();
        return _this.tasks();
      };
    })(this), 100);
  };

  JOM.prototype.resolve = function(path) {
    var first, href, pr, result, second, url;
    href = location.href || window.location.href;
    pr = href.replace(location.protocol + "//", "").replace(location.host, "");
    url = pr;
    first = path[0];
    second = path[1];
    result = "";
    switch (first) {
      case "/":
        "";
        if (second !== "/") {
          result = path;
        }
        break;
      case ".":
        result = url.replace(/([\/]?[^\/]+[\/]?)$/g, "/" + path);
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
    stack.component = {};
    return stack.collection = {};
  };

  JOM.prototype.clear_cache = function() {
    cache.template = {};
    cache.component = {};
    return cache.collection = {};
  };

  JOM.prototype.add_collection = function(name, data, schema) {
    if (data == null) {
      data = {};
    }
    return stack.collection[name] = {
      name: name,
      data: data,
      schema: schema
    };
  };

  JOM.prototype.add_template = function(template) {
    var $template, name;
    if (template === void 0) {
      throw new Error("jom: template element is required");
    }
    $template = $(template);
    if ($template.length === 0) {
      throw new Error("jom: template element is required");
    }
    name = $template.attr('name');
    if (name === void 0) {
      throw new Error("jom: template name is required");
    }
    return stack.template[name] = {
      name: name,
      element: $template.get(0)
    };
  };

  JOM.prototype.run_template = function() {
    var all;
    all = $('link[rel="import"]');
    return all.each(function(i, n) {
      var $n, $tempalte, name, url;
      $n = $(n);
      url = jom.resolve($n.attr("href"));
      if (cache.template[url] !== void 0) {
        $tempalte = $($n.get(0)["import"]).find('template');
        name = $template.attr('name');
        add_template(template);
        if (name === void 0) {
          throw new Error("jom: template name is missing");
        }
        return false;
      }
      return cache.template[url] = template;
    });
  };

  JOM.getter('asset', function() {
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

  JOM.getter('template', function() {
    return stack.template;
  });

  JOM.getter('collection', function() {
    return stack.collection;
  });

  JOM.getter('component', function() {
    return stack.component;
  });

  return JOM;

})();

jom = JOM = new JOM();

//# sourceMappingURL=../map/jom.js.map
