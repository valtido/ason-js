var component;

component = {};

describe("components", function() {
  beforeEach(function() {
    return component = {};
  });
  it("should exists", function() {
    return expect(Component).toBeDefined();
  });
  return it("should have properties defined", function() {
    var c1, c2, c3, cc3;
    cc3 = '';
    c1 = $("<component />");
    c2 = $("<component template='template_name' />");
    c3 = $("<component template='template_name' collection='collection_name'/>");
    expect(function() {
      var cc1;
      return cc1 = new Component(c1);
    }).toThrow(new Error("jom: template is required"));
    expect(function() {
      var cc2;
      return cc2 = new Component(c2);
    }).toThrow(new Error("jom: collection is required"));
    expect(function() {
      return cc3 = new Component(c3);
    }).not.toThrow(new Error("jom: collection is required"));
    return expect(cc3.transform).toBeDefined();
  });
});

//# sourceMappingURL=../map/component.js.map
