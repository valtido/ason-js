describe("Other things", function() {
  it("should cover helper get/set stuff", function() {
    expect(Function.setter).toBeDefined();
    expect(typeof Function.setter).toBe("function");
    expect(Function.getter).toBeDefined();
    return expect(Function.property).toBeDefined();
  });
  return it("should cover jQuery stuff", function() {
    expect($.fn.findAll).toBeDefined();
    expect($("*").findAll("*")).toBeDefined();
    expect($("div").value).toBeDefined();
    return expect($("div").value("a")).toBeDefined();
  });
});

//# sourceMappingURL=../map/_helpers_.js.map
