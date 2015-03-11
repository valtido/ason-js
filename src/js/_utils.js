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

//# sourceMappingURL=../map/_utils.js.map
