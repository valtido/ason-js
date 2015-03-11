var collection;

collection = {};

describe("collections", function() {
  beforeEach(function() {
    return collection = {};
  });
  it("should exists", function() {
    return expect(Collection).toBeDefined();
  });
  it("should have the following properties", function() {
    var data;
    data = [
      {
        name: "valtid"
      }
    ];
    collection = new Collection("profile", data);
    expect(collection.attach_data).toBeDefined();
    expect(collection.attach_schema).toBeDefined();
    expect(collection.is_valid).toBeDefined();
    return expect(jjv).toBeDefined();
  });
  it("should fail to add a new collection", function() {
    return expect(function() {
      return new Collection();
    }).toThrow(new Error("jom: collection name is required"));
  });
  describe("adding", function() {
    it("should add a new simple collection", function() {
      collection = new Collection("profile");
      expect(collection.name).toEqual("profile");
      expect(collection.data).toEqual([]);
      expect(collection.schema).toEqual({});
      return expect(collection.is_valid()).toEqual(true);
    });
    it("should add collection with data as array", function() {
      var data;
      data = [
        {
          name: "valtid"
        }
      ];
      collection = new Collection("profile", data);
      expect(collection.name).toEqual("profile");
      expect(collection.data).toEqual(data);
      expect(collection.schema).toEqual({});
      return expect(collection.is_valid()).toEqual(true);
    });
    return it("should add collection with data as object", function() {
      var data;
      data = {
        name: "Valtid"
      };
      collection = new Collection("profile", data);
      expect(collection.name).toEqual("profile");
      expect(collection.data).toEqual([data]);
      expect(collection.schema).toEqual({});
      return expect(collection.is_valid()).toEqual(true);
    });
  });
  return describe("collection Schema", function() {
    it("should fail to add collection without $schema", function() {
      var data, schema;
      data = {
        name: "Valtid"
      };
      schema = {
        "title": "Profile",
        "type": "array",
        "properties": {
          "name": {
            "title": "Name of person",
            "type": "string"
          }
        }
      };
      collection = new Collection("profile", data, schema);
      return expect(function() {
        return collection.is_valid();
      }).toThrow(new Error("jom: $schema is missing"));
    });
    return it("should add collection with $schema", function() {
      var data, schema;
      data = {
        name: "Valtid"
      };
      schema = {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "title": "Profile",
        "type": "array",
        "properties": {
          "name": {
            "title": "Name of person",
            "type": "string"
          }
        },
        "required": []
      };
      collection = new Collection("profile", data, schema);
      return expect(collection.is_valid()).toEqual(true);
    });
  });
});

//# sourceMappingURL=../map/collections.js.map
