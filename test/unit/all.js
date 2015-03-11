describe("Other things", function() {
  it("should cover helper get/set stuff", function() {
    expect(Function.setter).toBeDefined();
    expect(typeof Function.setter).toBe("function");
    expect(Function.getter).toBeDefined();
    return expect(Function.property).toBeDefined();
  });
  return it("should cover jQuery stuff", function() {
    expect($.fn.findAll).toBeDefined();
    expect($("*").findAll("*")).toBeDefined();
    expect($("div").value).toBeDefined();
    return expect($("div").value("a")).toBeDefined();
  });
});

//# sourceMappingURL=../map/_helpers_.js.map

var am;

am = new AssetManager();

describe("Asset Manager", function() {
  it("should exist", function() {
    return expect(am).toBeDefined();
  });
  return it("should have properties", function() {
    expect(am.update_status).toBeDefined();
    expect(am.load).toBeDefined();
    expect(am.error).toBeDefined();
    expect(am.process).toBeDefined();
    expect(am.ready).toBeDefined();
    expect(am.image).toBeDefined();
    expect(am.html).toBeDefined();
    expect(am.template).toBeDefined();
    expect(am.json).toBeDefined();
    expect(am.collection).toBeDefined();
    expect(am.js).toBeDefined();
    expect(am.css).toBeDefined();
    return expect(am.include).toBeDefined();
  });
});

//# sourceMappingURL=../map/asset_manager.js.map

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

var component;

component = {};

describe("components", function() {
  beforeEach(function() {
    return component = {};
  });
  it("should exists", function() {
    return expect(Component).toBeDefined();
  });
  return it("should have properties defined", function() {
    var c1, c2, c3, cc3;
    cc3 = '';
    c1 = $("<component />");
    c2 = $("<component template='template_name' />");
    c3 = $("<component template='template_name' collection='collection_name'/>");
    expect(function() {
      var cc1;
      return cc1 = new Component(c1);
    }).toThrow(new Error("jom: template is required"));
    expect(function() {
      var cc2;
      return cc2 = new Component(c2);
    }).toThrow(new Error("jom: collection is required"));
    expect(function() {
      return cc3 = new Component(c3);
    }).not.toThrow(new Error("jom: collection is required"));
    return expect(cc3.transform).toBeDefined();
  });
});

//# sourceMappingURL=../map/component.js.map

describe("jom", function() {
  it("should be defined", function() {
    return expect(jom).toBeDefined();
  });
  it("Key features to be present", function() {
    var sh;
    expect(jom.get_stack).toBeDefined();
    expect(jom.get_cache).toBeDefined();
    expect(jom.clear_cache).toBeDefined();
    expect(jom.clear_stack).toBeDefined();
    expect(jom.run_template).toBeDefined();
    expect(jom.component).toBeDefined();
    expect(jom.template).toBeDefined();
    expect(jom.collection).toBeDefined();
    expect(jom.asset).toBeDefined();
    sh = jom.shadow;
    expect(sh).toBeDefined();
    expect(window.Root).toBeDefined();
    expect(jom.tasks).toBeDefined();
    return expect(jom.resolve).toBeDefined();
  });
  it("template as an object", function() {
    return expect(jom.template).toEqual({});
  });
  it("jom path resolver", function() {
    return expect(jom.resolve("/location")).toBe("/location");
  });
  it("jom clear cache", function() {
    jom.clear_cache();
    return expect(jom.get_cache()).toEqual({
      template: {},
      component: {},
      collection: {}
    });
  });
  it("jom clear stack", function() {
    jom.clear_stack();
    return expect(jom.get_stack()).toEqual({
      template: {},
      component: {},
      collection: {}
    });
  });
  return it("jom add template", function() {
    var name, outter, template;
    expect(jom.template).toEqual({});
    expect(Object.keys(jom.template).length).toEqual(0);
    name = "profile";
    template = "<template name=profile><div>Test</div></template>";
    jom.add_template(template);
    outter = $(template).get(0).outerHTML;
    expect(Object.keys(jom.template).length).toEqual(1);
    expect(jom.template["profile"].name).toEqual("profile");
    return expect(jom.template["profile"].element.outerHTML).toBe(outter);
  });
});

//# sourceMappingURL=../map/jom.js.map
