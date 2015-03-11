collection = {}
describe "collections", ->
  beforeEach ->
    collection = {}
  it "should exists", ->
    expect(Collection).toBeDefined()
  it "should have the following properties", ->
    data = [ name: "valtid" ]
    collection = new Collection "profile", data
    expect(collection.attach_data).toBeDefined()
    expect(collection.attach_schema).toBeDefined()
    expect(collection.is_valid).toBeDefined()
    expect(jjv).toBeDefined()

  it "should fail to add a new collection", ->
    expect(-> new Collection())
    .toThrow new Error "jom: collection name is required"
  describe "adding", ->
    it "should add a new simple collection", ->
      collection = new Collection "profile"

      expect(collection.name).toEqual "profile"
      expect(collection.data).toEqual []
      expect(collection.schema).toEqual {}
      expect(collection.is_valid()).toEqual true

    it "should add collection with data as array", ->
      data = [ name: "valtid" ]
      collection = new Collection "profile", data

      expect(collection.name).toEqual "profile"
      expect(collection.data).toEqual data
      expect(collection.schema).toEqual {}
      expect(collection.is_valid()).toEqual true

    it "should add collection with data as object", ->
      data = name: "Valtid"
      collection = new Collection "profile", data

      expect(collection.name).toEqual "profile"
      expect(collection.data).toEqual [data]
      expect(collection.schema).toEqual {}
      expect(collection.is_valid()).toEqual true

  describe "collection Schema", ->
    it "should fail to add collection without $schema", ->
      data = name: "Valtid"
      schema =
        # "$schema" : "http://json-schema.org/draft-04/schema#"
        "title": "Profile"
        "type" : "array"
        "properties":
          "name":
            "title": "Name of person"
            "type":"string"
      collection = new Collection "profile", data, schema

      expect(-> collection.is_valid())
      .toThrow new Error "jom: $schema is missing"

    it "should add collection with $schema", ->
      data = name: "Valtid"
      schema =
        "$schema" : "http://json-schema.org/draft-04/schema#"
        "title": "Profile"
        "type" : "array"
        "properties":
          "name":
            "title": "Name of person"
            "type":"string"
        "required": []
      collection = new Collection "profile", data, schema

      expect(collection.is_valid()).toEqual true
