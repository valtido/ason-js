describe "templates", ->
  beforeEach (done)->
    setTimeout ->
      x = {}
      done() if jom.templates.list
    , 100

  it "should exists", ->
    expect(jom).toBeDefined()
    expect(jom.templates).toBeDefined()

  it "should be empty", (done)->
    expect(jom.templates.list()).toEqual([])
    done()
