var am;

am = new AssetManager();

describe("Asset Manager", function() {
  it("should exist", function() {
    return expect(am).toBeDefined();
  });
  return it("should have properties", function() {
    expect(am.update_status).toBeDefined();
    expect(am.load).toBeDefined();
    expect(am.error).toBeDefined();
    expect(am.process).toBeDefined();
    expect(am.ready).toBeDefined();
    expect(am.image).toBeDefined();
    expect(am.html).toBeDefined();
    expect(am.template).toBeDefined();
    expect(am.json).toBeDefined();
    expect(am.collection).toBeDefined();
    expect(am.js).toBeDefined();
    expect(am.css).toBeDefined();
    return expect(am.include).toBeDefined();
  });
});

//# sourceMappingURL=../map/asset_manager.js.map
