describe "Observe", ->
  beforeEach (done) ->
    setTimeout ->
      done()
    , 0
  it "should exists", (done)->
    expect(Object.observe).toBeDefined()
    expect(Array.observe).toBeDefined()
    done()
