describe "JOM", ->
  it "should be defined", ->
    expect(JOM).toBeDefined()

  it "Key features to be present", ->
    expect(JOM.components).toBeDefined()
    expect(JOM.templates).toBeDefined()
    expect(JOM.collections).toBeDefined()
    expect(JOM.assets).toBeDefined()
