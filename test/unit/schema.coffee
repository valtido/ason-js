describe "schemas: ", ->

  it "should have properties", ->
    obj =
      name:
        first: 'Valtid'
        last : 'Caushi'

    schema = new Schema "user", obj
    expect(schema.name).toBeDefined()
    expect(schema.description).toBeDefined()
    expect(schema.tree).toBeDefined()
