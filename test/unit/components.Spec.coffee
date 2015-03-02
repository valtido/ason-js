describe "components", ->
  beforeEach (done)->
    setTimeout ->
      x = {}
      done() if jom.components.list
    , 1000

  it "should exists", ->
    expect(jom).toBeDefined()
    expect(jom.components).toBeDefined()

  it "should be empty", (done)->
    expect(jom.components.list()).toEqual([])
    done()
