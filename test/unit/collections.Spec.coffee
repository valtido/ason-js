describe "collections", ->
  beforeEach (done)->
    setTimeout ->
      x = {}
      done() if jom.collections.list
    , 100

  it "should exists", ->
    expect(jom).toBeDefined()
    expect(jom.collections).toBeDefined()

  it "should be empty", (done)->
    expect(jom.collections.list()).toEqual({})
    done()
