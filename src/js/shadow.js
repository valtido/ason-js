var Shadow;

Shadow = (function() {
  function Shadow() {
    var _ref, _ref1, _ref2, _ref3, _ref4;
    this.root = ((_ref = document.currentScript) != null ? _ref.parentNode : void 0) || ((_ref1 = arguments.callee) != null ? (_ref2 = _ref1.caller) != null ? (_ref3 = _ref2.caller) != null ? (_ref4 = _ref3["arguments"][0]) != null ? _ref4.target : void 0 : void 0 : void 0 : void 0);
    this.traverseAncestry();
    this.root;
  }

  Shadow.prototype.traverseAncestry = function() {
    var _ref;
    if ((_ref = this.root) != null ? _ref.parentNode : void 0) {
      this.root = this.root.parentNode;
      return this.traverseAncestry();
    }
  };

  Shadow.getter("body", function() {
    return $(this.root).children().filter('[body]').get(0);
  });

  Shadow.getter("host", function() {
    return this.root.host;
  });

  return Shadow;

})();

Object.defineProperty(window, "Root", {
  get: function() {
    return new Shadow();
  }
});

//# sourceMappingURL=../map/shadow.js.map
