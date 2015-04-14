collection = {}
describe "collections: ", ->
  beforeEach ->
    collection = {}
    data = null
    jom.clear_stack()
    jom.clear_cache()

  it "should exists", ->
    expect(Collection).toBeDefined()
    expect(jjv).toBeDefined()

  it "should have the following properties", ->
    data = [ name: "valtid" ]
    collection = new Collection "profile", data

    expect(collection.name).toBeDefined()
    expect(collection.data).toBeDefined()
    expect(collection.attach_data).toBeDefined()
    expect(collection.attach_schema).toBeDefined()
    expect(collection.errors_to_string).toBeDefined()
    expect(collection.is_valid).toBeDefined()
    expect(collection.findByPath).toBeDefined()
    expect(collection.join).toBeDefined()
    expect(collection.errors).toEqual null
    expect(collection.observing).toEqual false

  it "should fail to add a new collection", ->
    expect(-> new Collection())
    .toThrow new Error "jom: collection name is required"

  it "should check if data is null", ->
    collection = new Collection "profile"

    collection.attach_data null
    expect(collection.data).toEqual []

  it "should check if schema is null", ->
    collection = new Collection "profile"

    collection.attach_schema null
    expect(collection.schema).toEqual {}

  describe "errors; ", ->
    it "should get errors in a string", ->
      data = name: "Valtid"
      schema =
        "$schema" : "http://json-schema.org/draft-04/schema#"
        "title": "Profile"
        "type" : "number"
      collection = new Collection "profile", data, schema

      err = '{"validation":{"type":"number"}}'

      expect(collection.is_valid()).toEqual false
      expect(collection.errors).not.toEqual null
      expect(collection.errors_to_string()).toBe err

  describe "adding; ", ->
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

  describe "Schema; ", ->
    it "should fail to add collection without $schema", ->
      data = name: "Valtid"
      schema =
        # "$schema" : "http://json-schema.org/draft-04/schema#"
        "title": "Profile"
        "type" : "array"
        "items":
          "title": "Collection"
          "type": "object"
          "properties":
            "name":
              "title": "Name of person"
              "type":"string"
          "required": ["name"]
      collection = new Collection "profile", data, schema

      expect(collection.schema["$schema"]).not.toBeDefined()
      expect(-> collection.is_valid())
      .toThrow new Error "jom: $schema is missing"

    it "should fail to be valid return false", ->
      data = name: "Valtid"
      schema =
        "$schema" : "http://json-schema.org/draft-04/schema#"
        "title": "Profile"
        "type" : "array"
        "items":
          "title": "Collection"
          "type": "object"
          "properties":
            "name":
              "title": "Name of person"
              "type":"number"
          "required": ["name"]
      collection = new Collection "profile", data, schema

      expect(collection.is_valid()).toBe false

    it "should add collection with $schema", ->
      data = name: "Valtid"
      schema =
        "$schema" : "http://json-schema.org/draft-04/schema#"
        "title": "Profile"
        "type" : "array"
        "items":
          "title": "Profile"
          "type" : "object"
          "properties":
            "name":
              "title": "Name of person"
              "type":"string"
          "required": ["name"]
      collection = new Collection "profile", data, schema

      expect(collection.is_valid()).toEqual true

  describe "join; ", ->
    it "should join two or more strings to json path", ->
      collection = new Collection "profile"
      c = collection
      expect(c.join "person","name").toEqual "person.name"
      expect(c.join "person[0]","name").toEqual "person[0].name"
      expect(c.join "person","[0].name").toEqual "person[0].name"
      expect(c.join "person","name","first").toEqual "person.name.first"

  describe "find; ", ->
    it "should find a string ", ->
      profile_data =
        name : "Valtid"
        gender : "Male"
      collection = new Collection "profile", profile_data

      expect( collection.findByPath "[0].name" ).toEqual "Valtid"
      expect( collection.findByPath "[0].gender" ).toEqual "Male"

    it "should find an object", ->
      profile_data =
        name : "Valtid"
        gender : "Male"
      collection = new Collection "profile", profile_data

      expect( collection.findByPath "[0]" ).toEqual profile_data

    it "should not find undefined", ->
      profile_data = undefined
      collection = new Collection "profile", profile_data
      collection.data = undefined

      expect( collection.findByPath "[0]" ).toEqual profile_data
