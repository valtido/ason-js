var Collection;

Collection = (function() {
  var env;

  env = jjv();

  function Collection(name, data, schema) {
    if (data == null) {
      data = [];
    }
    if (schema == null) {
      schema = {};
    }
    if (name === void 0 || typeof name !== "string") {
      throw new Error("jom: collection name is required");
    }
    this.name = name;
    this.data = [];
    this.schema = {};
    this.attach_schema(schema);
    this.attach_data(data);
  }

  Collection.prototype.attach_data = function(data) {
    var item, length, _i, _len;
    if (data == null) {
      data = [];
    }
    length = data.length || Object.keys(data).length;
    if (length) {
      if (Array.isArray(data)) {
        for (_i = 0, _len = data.length; _i < _len; _i++) {
          item = data[_i];
          this.data.push(item);
        }
      } else {
        this.data.push(data);
      }
    }
    return this.data;
  };

  Collection.prototype.attach_schema = function(schema) {
    if (schema == null) {
      schema = {};
    }
    return this.schema = schema;
  };

  Collection.prototype.is_valid = function() {
    var errors, length;
    env = jjv();
    length = Object.keys(this.schema).length;
    if (length === 0) {
      return true;
    }
    if (this.schema["$schema"] === void 0) {
      throw new Error("jom: $schema is missing");
      return false;
    }
    env.addSchema(this.name, this.schema);
    errors = env.validate(this.name, this.data);
    if (!errors) {
      return true;
    }
    console.debug("jom: validation_error ", errors);
    return false;
  };

  return Collection;

})();

//# sourceMappingURL=../map/collection.js.map
