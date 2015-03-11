var Template, Templates;

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
  var element_to_template;

  element_to_template = function(all_plain_elements) {
    return all_plain_elements.each((function(_this) {
      return function(i, n) {
        var template;
        n.template = true;
        template = new Template(n);
        return template.ready(function(element) {
          var name;
          name = $(element).attr('name');
          if (name === void 0) {
            throw new Error("Templates: template name is required");
          }
          return _this[name] = {
            name: name,
            element: element
          };
        });
      };
    })(this));
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

  Templates.prototype.find_by_name = function(name) {
    var item;
    for (item in this) {
      if (item.name === name && name !== void 0) {
        return item;
      }
    }
  };

  Templates.prototype.find_by_url = function(url) {
    var item;
    for (item in this) {
      if (item.url === url && url !== void 0) {
        return item;
      }
    }
  };

  Templates.getter('list', function() {
    var item, obj, _i, _len;
    obj = {};
    for (_i = 0, _len = this.length; _i < _len; _i++) {
      item = this[_i];
      obj[item.name] = item;
    }
    return obj;
  });

  return Templates;

})();

//# sourceMappingURL=../map/template.js.map
