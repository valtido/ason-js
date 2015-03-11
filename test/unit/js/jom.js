describe("jom", function() {
  it("should be defined", function() {
    return expect(jom).toBeDefined();
  });
  it("Key features to be present", function() {
    var sh;
    expect(jom.get_stack).toBeDefined();
    expect(jom.get_cache).toBeDefined();
    expect(jom.clear_cache).toBeDefined();
    expect(jom.clear_stack).toBeDefined();
    expect(jom.run_template).toBeDefined();
    expect(jom.component).toBeDefined();
    expect(jom.template).toBeDefined();
    expect(jom.collection).toBeDefined();
    expect(jom.asset).toBeDefined();
    sh = jom.shadow;
    expect(sh).toBeDefined();
    expect(window.Root).toBeDefined();
    expect(jom.tasks).toBeDefined();
    return expect(jom.resolve).toBeDefined();
  });
  it("template as an object", function() {
    return expect(jom.template).toEqual({});
  });
  it("jom path resolver", function() {
    return expect(jom.resolve("/location")).toBe("/location");
  });
  it("jom clear cache", function() {
    jom.clear_cache();
    return expect(jom.get_cache()).toEqual({
      template: {},
      component: {},
      collection: {}
    });
  });
  it("jom clear stack", function() {
    jom.clear_stack();
    return expect(jom.get_stack()).toEqual({
      template: {},
      component: {},
      collection: {}
    });
  });
  return it("jom add template", function() {
    var name, outter, template;
    expect(jom.template).toEqual({});
    expect(Object.keys(jom.template).length).toEqual(0);
    name = "profile";
    template = "<template name=profile><div>Test</div></template>";
    jom.add_template(template);
    outter = $(template).get(0).outerHTML;
    expect(Object.keys(jom.template).length).toEqual(1);
    expect(jom.template["profile"].name).toEqual("profile");
    return expect(jom.template["profile"].element.outerHTML).toBe(outter);
  });
});

//# sourceMappingURL=../map/jom.js.map
