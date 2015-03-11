am = new AssetManager()
describe "Asset Manager", ->
  it "should exist", ->
    expect(am).toBeDefined()
  it "should have properties", ->
    # console.log(am)
    expect(am.update_status).toBeDefined()
    expect(am.load).toBeDefined()
    expect(am.error).toBeDefined()
    expect(am.process).toBeDefined()
    expect(am.ready).toBeDefined()
    expect(am.image).toBeDefined()
    expect(am.html).toBeDefined()
    expect(am.template).toBeDefined()
    expect(am.json).toBeDefined()
    expect(am.collection).toBeDefined()
    expect(am.js).toBeDefined()
    expect(am.css).toBeDefined()
    expect(am.include).toBeDefined()
