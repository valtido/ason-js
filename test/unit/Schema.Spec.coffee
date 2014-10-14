scheme = data = tree = {}

describe "Schema", ->
  beforeEach ->
    data = mock.data.login.done (res)->
      data = res
      tree = mock.tree.login.done (res)->
        tree = res

  it "should be defined", ->
    expect(mock).toBeDefined()

  it "should validate the data against the schema", ->
    scheme = new Schema data, tree
    expect(scheme.valid).toBe true
