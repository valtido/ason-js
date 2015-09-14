var a, asset;

asset = "";

a = "";

describe("Asset", function() {
  beforeEach(function() {
    asset = "";
    return a = "";
  });
  it("should exist", function() {
    asset = "<link rel='asset' source='test' type='text/plain' />";
    a = new Asset(asset);
    return expect(a).toBeDefined();
  });
  it("should have properties", function() {
    asset = "<link rel='asset' source='test' type='text/plain' asset=plain />";
    a = new Asset(asset);
    expect(a.rel).toBeDefined();
    expect(a.name).toBeDefined();
    expect(a.source).toBeDefined();
    expect(a.original).toBeDefined();
    expect(a.clone).toBeDefined();
    expect(a.asset).toBeDefined();
    expect(a.content_type).toBeDefined();
    expect(a.content_type.full).toBeDefined();
    expect(a.content_type.part).toBeDefined();
    expect(a.content_type.type).toBeDefined();
    expect(a.content_type.media).toBeDefined();
    expect(a.content_type.params).toBeDefined();
    expect(a.element).toBeDefined();
    return expect(a.create_element).toBeDefined();
  });
  it("should throw error if type if not defined", function() {
    asset = "<link source='test' />";
    return expect(function() {
      return a = new Asset(asset);
    }).toThrow(new Error("jom: rel=asset is required"));
  });
  it("should throw error if type if not defined", function() {
    asset = "<link rel='asset' source='test' />";
    return expect(function() {
      return a = new Asset(asset);
    }).toThrow(new Error("jom: asset type is required"));
  });
  it("should throw error if type if not valid", function() {
    asset = "<link rel='asset' source='test' type='not/good' />";
    return expect(function() {
      return a = new Asset(asset);
    }).toThrow(new Error("jom: asset media `not/good` type is not valid"));
  });
  it("should accept content type params", function() {
    asset = "<link rel='asset' source='test' type='text/css; charset=utf-8' asset=css />";
    a = new Asset(asset);
    expect(a.name).toBe(null);
    expect(a.rel).toBe("asset");
    expect(a.source).toBe("test");
    expect(a.clone.length).toBe(1);
    expect(a.content_type.full).toBe("text/css; charset=utf-8");
    expect(a.content_type.part).toBe("text/css");
    expect(a.content_type.type).toBe("text");
    expect(a.content_type.media).toBe("css");
    return expect(a.content_type.params).toBe("charset=utf-8");
  });
  it("should accept css", function() {
    asset = "<link rel='asset' source='test' type='text/css' asset=css />";
    a = new Asset(asset);
    expect(a.name).toBe(null);
    expect(a.rel).toBe("asset");
    expect(a.source).toBe("test");
    expect(a.clone.length).toBe(1);
    expect(a.content_type.full).toBe("text/css");
    expect(a.content_type.part).toBe("text/css");
    expect(a.content_type.type).toBe("text");
    expect(a.content_type.media).toBe("css");
    return expect(a.content_type.params).toBe(null);
  });
  it("should accept template", function() {
    asset = "<link rel='asset' source='test' type='text/html' asset=template />";
    a = new Asset(asset);
    expect(a.name).toBe(null);
    expect(a.rel).toBe("asset");
    expect(a.source).toBe("test");
    expect(a.clone.length).toBe(1);
    expect(a.content_type.full).toBe("text/html");
    expect(a.content_type.part).toBe("text/html");
    expect(a.content_type.type).toBe("text");
    expect(a.content_type.media).toBe("html");
    return expect(a.content_type.params).toBe(null);
  });
  it("should accept javascript", function() {
    asset = "<link rel='asset' source='test' type='text/javascript' asset=javascript />";
    a = new Asset(asset);
    expect(a.name).toBe(null);
    expect(a.rel).toBe("asset");
    expect(a.source).toBe("test");
    expect(a.clone.length).toBe(1);
    expect(a.content_type.full).toBe("text/javascript");
    expect(a.content_type.part).toBe("text/javascript");
    expect(a.content_type.type).toBe("text");
    expect(a.content_type.media).toBe("javascript");
    return expect(a.content_type.params).toBe(null);
  });
  it("should accept json", function() {
    asset = "<link rel='asset' source='test' type='text/json'  asset=collection />";
    a = new Asset(asset);
    expect(a.name).toBe(null);
    expect(a.rel).toBe("asset");
    expect(a.source).toBe("test");
    expect(a.clone.length).toBe(1);
    expect(a.content_type.full).toBe("text/json");
    expect(a.content_type.part).toBe("text/json");
    expect(a.content_type.type).toBe("text");
    expect(a.content_type.media).toBe("json");
    return expect(a.content_type.params).toBe(null);
  });
  return xit("should accept collection", function() {
    asset = "<link rel='asset' source='test' type='text/collection' />";
    a = new Asset(asset);
    expect(a.name).toBe(null);
    expect(a.rel).toBe("asset");
    expect(a.source).toBe("test");
    expect(a.clone.length).toBe(1);
    expect(a.content_type.full).toBe("text/collection");
    expect(a.content_type.part).toBe("text/collection");
    expect(a.content_type.type).toBe("text");
    expect(a.content_type.media).toBe("collection");
    return expect(a.content_type.params).toBe(null);
  });
});

var collection;

collection = {};

describe("collections: ", function() {
  beforeEach(function() {
    var data;
    collection = {};
    return data = null;
  });
  it("should exists", function() {
    expect(Collection).toBeDefined();
    return expect(jjv).toBeDefined();
  });
  it("should have the following properties", function() {
    var data;
    data = [
      {
        name: "valtid"
      }
    ];
    collection = new Collection("profile", data);
    expect(collection.name).toBeDefined();
    expect(collection.data).toBeDefined();
    expect(collection.schema).toEqual({});
    expect(collection.errors).toEqual(null);
    expect(collection.observing).toEqual(false);
    expect(collection.attach_data).toBeDefined();
    expect(collection.attach_schema).toBeDefined();
    expect(collection.errors_to_string).toBeDefined();
    expect(collection.is_valid).toBeDefined();
    expect(collection.join).toBeDefined();
    return expect(collection.findByPath).toBeDefined();
  });
  it("should fail to add a new collection", function() {
    return expect(function() {
      return new Collection();
    }).toThrow(new Error("jom: collection name is required"));
  });
  it("should check if data is null", function() {
    collection = new Collection("profile");
    collection.attach_data(null);
    return expect(collection.data).toEqual([]);
  });
  it("should check if schema is null", function() {
    collection = new Collection("profile");
    collection.attach_schema(null);
    return expect(collection.schema).toEqual({});
  });
  describe("errors; ", function() {
    return it("should get errors in a string", function() {
      var data, err, schema;
      data = {
        name: "Valtid"
      };
      schema = {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "title": "Profile",
        "type": "number"
      };
      collection = new Collection("profile", data, schema);
      err = '{"validation":{"type":"number"}}';
      expect(collection.is_valid()).toEqual(false);
      expect(collection.errors).not.toEqual(null);
      return expect(collection.errors_to_string()).toBe(err);
    });
  });
  describe("adding; ", function() {
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
  describe("Schema; ", function() {
    it("should fail to add collection without $schema", function() {
      var data, schema;
      data = {
        name: "Valtid"
      };
      schema = {
        "title": "Profile",
        "type": "array",
        "items": {
          "title": "Collection",
          "type": "object",
          "properties": {
            "name": {
              "title": "Name of person",
              "type": "string"
            }
          },
          "required": ["name"]
        }
      };
      collection = new Collection("profile", data, schema);
      expect(collection.schema["$schema"]).not.toBeDefined();
      return expect(function() {
        return collection.is_valid();
      }).toThrow(new Error("jom: $schema is missing"));
    });
    it("should fail to be valid return false", function() {
      var data, schema;
      data = {
        name: "Valtid"
      };
      schema = {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "title": "Profile",
        "type": "array",
        "items": {
          "title": "Collection",
          "type": "object",
          "properties": {
            "name": {
              "title": "Name of person",
              "type": "number"
            }
          },
          "required": ["name"]
        }
      };
      collection = new Collection("profile", data, schema);
      return expect(collection.is_valid()).toBe(false);
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
        "items": {
          "title": "Profile",
          "type": "object",
          "properties": {
            "name": {
              "title": "Name of person",
              "type": "string"
            }
          },
          "required": ["name"]
        }
      };
      collection = new Collection("profile", data, schema);
      return expect(collection.is_valid()).toEqual(true);
    });
  });
  describe("join; ", function() {
    return it("should join two or more strings to json path", function() {
      var c;
      collection = new Collection("profile");
      c = collection;
      expect(c.join("person", "name")).toEqual("person.name");
      expect(c.join("person[0]", "name")).toEqual("person[0].name");
      expect(c.join("person", "[0].name")).toEqual("person[0].name");
      return expect(c.join("person", "name", "first")).toEqual("person.name.first");
    });
  });
  return describe("find; ", function() {
    it("should find a string ", function() {
      var profile_data;
      profile_data = {
        name: "Valtid",
        gender: "Male"
      };
      collection = new Collection("profile", profile_data);
      expect(collection.findByPath("[0].name")).toEqual("Valtid");
      return expect(collection.findByPath("[0].gender")).toEqual("Male");
    });
    it("should find an object", function() {
      var profile_data;
      profile_data = {
        name: "Valtid",
        gender: "Male"
      };
      collection = new Collection("profile", profile_data);
      return expect(collection.findByPath("[0]")).toEqual(profile_data);
    });
    return it("should not find undefined", function() {
      var profile_data;
      profile_data = void 0;
      collection = new Collection("profile", profile_data);
      collection.data = void 0;
      return expect(collection.findByPath("[0]")).toEqual(profile_data);
    });
  });
});

var component;

component = {};

describe("components:: ", function() {
  beforeEach(function() {
    component = {};
    $('foot').html("");
    $('body').html("");
    $('head link[rel=asset]').remove();
    return $('component').remove();
  });
  it("should exists", function() {
    return expect(Component).toBeDefined();
  });
  it("should have properties defined", function() {
    var c;
    c = "<component template=profile collections=profile />";
    component = new Component(c);
    expect(component.attr).toBeDefined();
    expect(component.template).toBeDefined();
    expect(component.collections).toBeDefined();
    expect(component.path).toBeDefined();
    expect(component.element).toBeDefined();
    expect(component.events).toBeDefined();
    expect(component.ready).toBeDefined();
    expect(component.hide).toBeDefined();
    expect(component.show).toBeDefined();
    expect(component.enable).toBeDefined();
    expect(component.disable).toBeDefined();
    expect(component.destroy).toBeDefined();
    expect(component.create_shadow).toBeDefined();
    expect(component.define_template).toBeDefined();
    expect(component.define_collection).toBeDefined();
    expect(component.attr).toEqual({
      template: "profile",
      collections: "profile"
    });
    expect(component.root).not.toEqual(null);
    expect(component.element.shadowRoot).not.toEqual(null);
    expect(component.handlebars).toBeDefined();
    expect(component.handle_template_scripts).toBeDefined();
    expect(component.trigger).toBeDefined();
    return expect(component.on).toBeDefined();
  });
  describe("required properties", function() {
    it("should fail no arguments", function() {
      return expect(function() {
        return component = new Component();
      }).toThrow(new Error("jom: component is required"));
    });
    it("should fail no template", function() {
      var c;
      c = "<component />";
      return expect(function() {
        return new Component(c);
      }).toThrow(new Error("jom: component template is required"));
    });
    it("should fail no collections", function() {
      var c;
      c = "<component template=profile />";
      return expect(function() {
        return component = new Component(c);
      }).toThrow(new Error("jom: component collections is required"));
    });
    return it("should pass and set component to element", function() {
      var c;
      c = "<component template=profile collections=profile />";
      component = new Component(c);
      return expect(component.element.component).toBe(true);
    });
  });
  describe("handle_template_scripts; ", function() {
    return it("should wrap script tags, for encapsulatation", function() {
      var c, content, expected_content, new_content;
      c = "<component template=profile collections=profile />";
      component = new Component(c);
      content = "<div>\n  <div>Test</div>\n  <script> var a = 1; </script>\n</div>";
      new_content = component.handle_template_scripts(content);
      expected_content = "(function(){\n          var\n          shadow      = jom.shadow,\n          body        = shadow.body,\n          host        = shadow.host,\n          root        = shadow.root,\n          component   = host.component,\n          collections = component.collections\n          ;\n          var a = 1;\n})()";
      new_content = $.trim($(new_content).text()).replace(/[\s]+/g, " ");
      expected_content = $.trim(expected_content).replace(/[\s]+/g, " ");
      return expect(new_content).toEqual(expected_content);
    });
  });
  describe("handlebars; ", function() {
    it("should replace handles with data", function() {
      var c, collection, content, data, expected_content, new_content;
      data = {
        handlebar: {
          and: {
            path: "thing"
          }
        },
        dog: ["Rocky"]
      };
      collection = new Collection("profile", data);
      c = "<component template=profile collections=profile />";
      component = new Component(c);
      component.define_collection(collection);
      content = "<div>\n  <div>I will test</div>\n  <div>some\n    '\n    <span>${0:[0].handlebar.and.path}</span>\n    '\n    even if it has an array\n    '\n    <span>${0:[0].dog[0]}</span>\n    '\n  </div>\n</div>";
      new_content = component.handlebars(content, component);
      expected_content = "I will test some ' thing ' even if it has an array ' Rocky '";
      new_content = $.trim($(new_content).text()).replace(/[\s]+/g, " ");
      expected_content = $.trim(expected_content).replace(/[\s]+/g, " ");
      expect(component.handles.length).toEqual(2);
      return expect(new_content).toEqual(expected_content);
    });
    return it("should replace handles attributes with data", function() {
      var c, collection, content, data, expected_content, new_content;
      jom.env = "dev";
      data = {
        handlebar: {
          and: {
            path: "thing"
          }
        },
        dog: ["Rocky"]
      };
      collection = new Collection("profile", data);
      c = "<component template=profile collections=profile />";
      component = new Component(c);
      component.define_collection(collection);
      content = "<div>\n  <div>I will test</div>\n  <div>some\n    <span>${0:[0].handlebar.and.path}</span>\n    even if it has an array\n    <span value=\"${0:[0].dog[0]}\"></span>\n  </div>\n</div>";
      new_content = component.handlebars(content, component);
      expected_content = "I will test some thing even if it has an array";
      new_content = $.trim($(new_content).text()).replace(/[\s]+/g, " ");
      expected_content = $.trim(expected_content).replace(/[\s]+/g, " ");
      expect(component.handles.length).toEqual(2);
      return expect(new_content).toEqual(expected_content);
    });
  });
  describe("defines; ", function() {
    it("should define a template", function() {
      var c, t, template;
      c = "<component template=profile collections=profile />";
      component = new Component(c);
      t = "<template name=user schemas=users><div body></div></template>";
      template = new Template(t);
      component.define_template(template);
      return expect(component.template).toBe(template);
    });
    it("should throw an error when defining a template", function() {
      var c, t;
      c = "<component template=profile collections=profile />";
      component = new Component(c);
      t = "<template name=user schemas=users><div body></div></template>";
      return expect(function() {
        return component.define_template(t);
      }).toThrow(new Error("jom: template cant be added"));
    });
    it("should define a collections", function() {
      var c, collection, data;
      c = "<component template=profile collections=profile />";
      component = new Component(c);
      data = [
        {
          name: "valtid"
        }
      ];
      collection = new Collection("profile", data);
      component.define_collection(collection);
      return expect(component.collections[0]).toBe(collection);
    });
    return it("should throw an error when defining a collections", function() {
      var c, collections;
      c = "<component template=profile collections=profile />";
      component = new Component(c);
      collections = [
        {
          name: "valtid"
        }
      ];
      return expect(function() {
        return component.define_collection(collections);
      }).toThrow(new Error("jom: collection cant be added"));
    });
  });
  describe("shadowRoot; ", function() {
    return it("should wrap if shadowRoot is not native", function() {
      var $c, c, x;
      c = "<component template=profile collections=profile />";
      $c = $(c);
      x = $c.get(0);
      expect(x.createShadowRoot).toBeDefined();
      component = new Component(x);
      return expect(x.createShadowRoot).toBeDefined();
    });
  });
  xdescribe("trigger; ", function() {
    it("should trigger changes", function() {});
    it("should trigger changes cover attributes", function() {});
    return it("should trigger changes and throw errors", function() {});
  });
  describe("on event; ", function() {
    return it("should push events to the queue", function() {
      var c;
      c = "<component template=profile collections=profile />";
      component = new Component(c);
      expect(component.events.length).toEqual(0);
      component.on("change", "name", function() {});
      expect(component.events.length).toEqual(1);
      expect(component.events[0].path).toEqual("name");
      return expect(component.events[0].type).toEqual("change");
    });
  });
  describe("trigger event; ", function() {
    return xit("should trigger all events that match path and type", function() {
      var c, changes, collections, data, output, trigger;
      output = false;
      c = "<component template=profile collections=profile />";
      component = new Component(c);
      data = [
        {
          name: "valtid"
        }
      ];
      collections = new Collection("profile", data);
      component.define_collection(collections);
      expect(component.events.length).toEqual(0);
      component.on("change", "name", function() {
        output = true;
        return expect(output).toEqual(true);
      });
      expect(component.events.length).toEqual(1);
      expect(component.events[0].path).toEqual("name");
      expect(component.events[0].type).toEqual("change");
      expect(output).toEqual(false);
      changes = [
        {
          path: "[0].name",
          value: "Valtid Caushi"
        }
      ];
      trigger = component.trigger(changes, collections);
      return expect(output).toEqual(true);
    });
  });
  return describe("repeat; ", function() {
    return it("should repeat the same thing over and over", function() {
      var c, collection, data, expected, out, repeater;
      c = "<component template=profile collections=profile />";
      component = new Component(c);
      repeater = "<div repeat=\"${0:[0].names}\">\n  <div name=\"${name}\"></div>\n</div>";
      data = [
        {
          names: [
            {
              name: "Valtid"
            }, {
              name: "John"
            }
          ]
        }
      ];
      collection = new Collection("profile", data);
      component.define_collection(collection);
      out = component.repeat(repeater);
      expected = "<div repeat=\"${profile:[0].names}\">\n  <div name=\"${name}\"></div>\n  <div name=\"${name}\"></div>\n</div>";
      return expect(out.children().length).toEqual(2);
    });
  });
});

var link;

link = "";

describe("jom: ", function() {
  beforeEach(function() {
    jom.components = [];
    $('foot').html("");
    $('body').html("");
    $('head link[rel=asset]').remove();
    $('component').remove();
    return jom.assets = [];
  });
  it("should be defined", function() {
    return expect(jom).toBeDefined();
  });
  it("Key features to be present", function() {
    var sh;
    sh = jom.shadow;
    expect(sh).toBeDefined();
    expect(window.Root).toBeDefined();
    expect(jom.components).toBeDefined();
    expect(jom.templates).toBeDefined();
    expect(jom.collections).toBeDefined();
    expect(jom.assets).toBeDefined();
    expect(jom.schemas).toBeDefined();
    expect(jom.load_components).toBeDefined();
    expect(jom.load_templates).toBeDefined();
    expect(jom.load_collections).toBeDefined();
    expect(jom.load_assets).toBeDefined();
    expect(jom.load_schemas).toBeDefined();
    expect(jom.inject_assets).toBeDefined();
    expect(jom.assemble_components).toBeDefined();
    expect(jom.watch_collections).toBeDefined();
    expect(jom.tasks).toBeDefined();
    expect(jom.resolve).toBeDefined();
    expect(jom.env).toBeDefined();
    return expect(jom.app).toBeDefined();
  });
  it("path resolver", function() {
    return expect(jom.resolve("/location")).toBe("/location");
  });
  it("path resolve default", function() {
    return expect(jom.resolve("location")).toBe("/location");
  });
  describe("schemas, ", function() {
    return it("should push new schemas", function() {
      expect(jom.schemas.length).toEqual(0);
      link = "<link rel=asset source=data.json type='text/json' asset=schema />";
      $('head').append(link);
      jom.load_assets();
      expect(jom.assets[0].queued).not.toBeDefined();
      jom.inject_assets();
      expect(jom.assets[0].queued).toBe(true);
      $('foot script[asset=schema]').get(0).data = {};
      jom.load_schemas();
      expect(jom.schemas.length).toEqual(1);
      expect($('html>foot').length).toBe(1);
      return expect($('html>foot').children().length).toBe(1);
    });
  });
  describe("assets, ", function() {
    it("should push new assets", function() {
      expect(jom.assets.length).toEqual(0);
      link = "<link rel=asset source=data.json type='text/json' asset=collection />";
      $('head').append(link);
      jom.load_assets();
      return expect(jom.assets.length).toEqual(1);
    });
    return it("should inject assets to the page", function() {
      expect(jom.assets.length).toEqual(0);
      link = "<link rel=asset source=data.json type='text/json' asset=collection />";
      $('head').append(link);
      jom.load_assets();
      expect(jom.assets[0].queued).not.toBeDefined();
      jom.inject_assets();
      expect(jom.assets[0].queued).toBe(true);
      expect(jom.assets.length).toEqual(1);
      expect($('html>foot').length).toBe(1);
      return expect($('html>foot').children().length).toBe(1);
    });
  });
  describe("component, ", function() {
    return it("should gather components", function() {
      var component;
      expect(jom.components.length).toEqual(0);
      component = "<component template=profile collections=profile />";
      $('body').append(component);
      jom.load_components();
      return expect(jom.components.length).toEqual(1);
    });
  });
  describe("template, ", function() {
    return it("should gather templates", function() {
      var doc, filter, foot, t;
      expect(jom.templates).toEqual([]);
      expect(jom.templates.length).toEqual(0);
      link = "<link rel=asset source=template.html type='text/html' asset=template />";
      foot = $('foot>link[rel=import]');
      expect($('head>link[rel=asset]').length).toEqual(0);
      $('head').append(link);
      expect($('head>link[rel=asset]').length).toEqual(1);
      expect(foot.length).toEqual(0);
      doc = document.implementation.createHTMLDocument("test");
      t = doc.createElement("template");
      doc.querySelector("head").appendChild(t);
      jom.load_assets();
      jom.inject_assets();
      $(foot.selector).get(0)["import"] = doc;
      filter = $(foot.selector).filter(function(i, link) {
        link["import"] = doc;
        return link["import"] !== null;
      });
      jom.load_templates();
      return expect($(foot.selector).length).toEqual(1);
    });
  });
  describe("collection, ", function() {
    return it("should gather collections", function() {
      var script;
      expect(jom.collections).toEqual([]);
      script = "<script source=data.json type='text/json' name=profile asset=collection />";
      $('foot').append(script);
      $('foot>script[source="data.json"]').get(0).data = [];
      jom.load_collections();
      return expect(jom.get('collection', "profile")).toBeDefined();
    });
  });
  describe("tasks, ", function() {
    return it("should cover tasks", function() {
      var a, asset;
      asset = "<link rel='asset' source='test' type='text/json' asset=collection />";
      a = new Asset(asset);
      jom.assets.push(a);
      expect(jom.assets.length).toEqual(1);
      return jom.tasks();
    });
  });
  describe("assemble, ", function() {
    return xit("should assemble a component", function() {
      var $c, all, c, collection, com, component, data, ref, t, template;
      c = "<component template=profile collections=profile />";
      expect($('body>component').length).toEqual(0);
      $('body').append(c);
      expect($('body>component').length).toEqual(1);
      $c = $(c);
      t = "<template name=profile><div body></div></template>";
      template = new Template(t);
      data = [
        {
          name: "valtid"
        }
      ];
      collection = new Collection("profile", data);
      jom.collections.profile = collection;
      jom.templates.profile = template;
      jom.load_components();
      jom.load_collections();
      jom.load_templates();
      expect(jom.components.length).toEqual(1);
      component = jom.components[0];
      component.define_template(template);
      expect(component.template).toBeDefined();
      expect(component.template).toBe(template);
      component.define_collection(collection);
      com = component;
      if (template && collection && ((ref = collection.data) != null ? ref.length : void 0)) {
        all = true;
      } else {
        all = false;
      }
      jom.assemble_components();
      expect(all).toBe(true);
      expect(component.collections).toBeDefined();
      expect(component.collections[collection.name]).toBe(collection);
      expect(component.collections[collection.name].data).toBeDefined();
      expect(component.collections[collection.name].data).toEqual(data);
      expect(collection).toBeDefined();
      expect(collection.data).toEqual(data);
      component.template.clone();
      expect(component.template.cloned).not.toEqual(null);
      expect(component.collections[collection.name].findByPath("[0].name")).toEqual("valtid");
      return expect(component.ready).toBe(true);
    });
  });
  describe("disabled, ", function() {
    it("should be enabled", function() {
      var c, component;
      c = "<component template=profile collections=profile />";
      component = new Component(c);
      return expect(component.enable()).toBe(false);
    });
    return it("should be enabled", function() {
      var c, component;
      c = "<component template=profile collections=profile />";
      component = new Component(c);
      return expect(component.disable()).toBe(true);
    });
  });
  return describe("watch_collections, ", function() {
    beforeEach(function(done) {
      return setTimeout(function() {
        return done();
      }, 1);
    });
    return it("should not watch if it's already watched", function() {
      var c, collection, component, data;
      data = [
        {
          name: "valtid"
        }
      ];
      collection = new Collection("profile", data);
      jom.collections.profile = collection;
      c = "<component template=profile collections=profile />";
      expect($('body>component').length).toEqual(0);
      $('body').append(c);
      jom.load_components();
      expect($('body>component').length).toEqual(1);
      expect(jom.components.length).toEqual(1);
      jom.watch_collections();
      component = jom.components[0];
      component.trigger = function(changes, collections) {
        expect(jom.components.length).toEqual(1);
        expect(collections.path).toBe("[0].name");
        return expect(collections.value).toBe("Tom");
      };
      return collection.data[0].name = "Tom";
    });
  });
});

var person, result, xcollection;

xcollection = {
  Collection: {
    profile: [
      {
        name: "Valtid",
        age: "26"
      }
    ]
  }
};

person = {
  age: 18,
  name: {
    birth: {
      first: 'Valtid',
      last: 'Caushi'
    },
    current: {
      first: 'Lee',
      last: 'Mack'
    }
  },
  children: ['Tom', 'Ben', 'Mike'],
  mixed: [
    'Manchester', 'London', {
      "town": "barnet",
      "interests": ['Museum', 'Library', 'Football']
    }, 'liverpool'
  ]
};

result = null;

new Observe(person, function(changes) {
  var item, key, results;
  results = [];
  for (key in changes) {
    item = changes[key];
    results.push(result = item);
  }
  return results;
});

new Observe(xcollection.Collection, function(changes) {
  var item, key, results;
  results = [];
  for (key in changes) {
    item = changes[key];
    results.push(result = item);
  }
  return results;
});

describe("Observer", function() {
  beforeEach(function(done) {
    return setTimeout(function() {
      result = null;
      return done();
    }, 1);
  });
  it("should fail and throw if no root", function(done) {
    expect(function() {
      return new Observe();
    }).toThrow(new Error("Observe: Object missing."));
    return done();
  });
  it("should fail and throw if no callback", function(done) {
    expect(function() {
      return new Observe(person);
    }).toThrow(new Error("Observe: Callback should be a function."));
    return done();
  });
  it("should notify age change", function(done) {
    person.age = 1;
    return setTimeout(function() {
      expect(result).not.toBe(null);
      expect(result.path).toBe("age");
      expect(result.value).toBe(1);
      return done();
    }, 1);
  });
  it("should notify when array is popped", function(done) {
    person.children.pop();
    return setTimeout(function() {
      expect(result).not.toBe(null);
      expect(result.path).toBe("children[2]");
      expect(result.value[0]).toBe("Tom");
      expect(result.value[1]).toBe("Ben");
      return done();
    }, 1);
  });
  it("should notify when array is pushed", function(done) {
    person.children.push("Joe");
    return setTimeout(function() {
      expect(result).not.toBe(null);
      expect(result.path).toBe("children[2]");
      expect(result.value).toBe("Joe");
      return done();
    }, 1);
  });
  it("should notify when array is modified directly", function(done) {
    person.children[2] = "Kim";
    return setTimeout(function() {
      expect(result).not.toBe(null);
      expect(result.path).toBe("children[2]");
      expect(result.value).toBe("Kim");
      return done();
    }, 1);
  });
  it("should notify when array is sorted", function(done) {
    person.children.sort();
    return setTimeout(function() {
      expect(result).not.toBe(null);
      expect(person.children[0]).toBe("Ben");
      expect(person.children[1]).toBe("Kim");
      expect(person.children[2]).toBe("Tom");
      return done();
    }, 1);
  });
  it("should notify when deep chanin", function(done) {
    person.name.birth.first = 'Valtido';
    return setTimeout(function() {
      expect(result).not.toBe(null);
      expect(result.path).toBe("name.birth.first");
      expect(result.value).toBe("Valtido");
      return done();
    }, 1);
  });
  it("should notify when adding deep chanin", function(done) {
    person.name.birth.middle = 'Blah';
    return setTimeout(function() {
      expect(result).not.toBe(null);
      expect(result.path).toBe("name.birth.middle");
      expect(result.value).toBe("Blah");
      return done();
    }, 1);
  });
  it("should notify when adding an object", function(done) {
    person.hair = {
      color: "brown"
    };
    return setTimeout(function() {
      expect(result).not.toBe(null);
      expect(result.path).toBe("hair");
      expect(result.value.color).toBe("brown");
      return done();
    }, 1);
  });
  it("should notify when changing a complex deep object", function(done) {
    person.mixed[2].interests[2] = 'Music Festival';
    return setTimeout(function() {
      expect(result).not.toBe(null);
      expect(result.path).toBe("mixed[2].interests[2]");
      expect(result.value).toBe("Music Festival");
      return done();
    }, 1);
  });
  it("should notify when pushing into a deep chanin", function(done) {
    var alternative;
    alternative = {
      "alternatives": [
        'Music_Festival', {
          "tv": 'bbc'
        }
      ]
    };
    person.mixed[2].interests.push(alternative);
    return setTimeout(function() {
      expect(result).not.toBe(null);
      expect(result.path).toBe("mixed[2].interests[3]");
      expect(result.value.alternatives[1].tv).toBe("bbc");
      return done();
    }, 1);
  });
  it("should notify when changing a deep complex obj in the future", function(done) {
    person.mixed[2].interests[3].alternatives[1].tv = "ITV";
    return setTimeout(function() {
      expect(result).not.toBe(null);
      expect(result.path).toBe("mixed[2].interests[3].alternatives[1].tv");
      expect(result.value).toBe("ITV");
      return done();
    }, 1);
  });
  it("should notify when changing a deep super complex future obj", function(done) {
    xcollection.Collection.profile.push({
      name: "Ton",
      age: 18
    });
    return setTimeout(function() {
      expect(result).not.toBe(null);
      expect(result.path).toBe("profile[1]");
      expect(result.value.name).toBe("Ton");
      expect(result.value.age).toBe(18);
      return done();
    }, 1);
  });
  return it("should notify when changing a deep super complex future obj 2", function(done) {
    xcollection.Collection.profile[1].name = "Tom";
    return setTimeout(function() {
      expect(result).not.toBe(null);
      expect(result.path).toBe("profile[1].name");
      expect(result.value).toBe("Tom");
      return done();
    }, 1);
  });
});

describe("schemas: ", function() {
  return it("should have properties", function() {
    var obj, schema;
    obj = {
      name: {
        first: 'Valtid',
        last: 'Caushi'
      }
    };
    schema = new Schema("user", obj);
    expect(schema.name).toBeDefined();
    expect(schema.description).toBeDefined();
    return expect(schema.tree).toBeDefined();
  });
});

var s;

s = "";

describe("Shadow", function() {
  beforeEach(function() {
    s = "";
    $('foot').html("");
    $('body').html("");
    $('head link[rel=asset]').remove();
    return $('component').remove();
  });
  it("Should exist", function() {
    return expect(Shadow).toBeDefined();
  });
  it("Should not throw errors", function() {
    return expect(function() {
      return s = new Shadow();
    }).not.toThrow();
  });
  it("Should have properties defined", function() {
    s = new Shadow();
    expect(s.root).toBeDefined();
    expect(s.body).toBeDefined();
    expect(s.host).toBeDefined();
    return expect(s.traverseAncestry).toBeDefined();
  });
  it("Should test traverseAncestry", function() {
    var c, com, shad, t;
    window["sh"] = "valtid";
    s = "<script> window['sh'] = new Shadow();</script>";
    t = $("<template>" + s + "</template>");
    com = $('<component />').get(0);
    $(com).appendTo(document.body);
    if (com.createShadowRoot === void 0) {
      com = wrap(com);
    }
    shad = com.createShadowRoot();
    c = document.importNode(t.get(0).content, true);
    shad.appendChild(c);
    sh.root = com.shadowRoot;
    sh.traverseAncestry({
      parentNode: shad
    });
    return expect(sh.host.tagName.toLowerCase()).toBe("component");
  });
  return it("Should test traverseAncestry", function() {
    var c, com, shad, t;
    window["sh"] = "valtid";
    s = "<script> window['sh'] = new Shadow();</script>";
    t = $("<template>" + s + "</template>");
    com = $('<component template=t collection=c />').get(0);
    $(com).appendTo(document.body);
    if (com.createShadowRoot === void 0) {
      com = wrap(com);
    }
    shad = com.createShadowRoot();
    c = document.importNode(t.get(0).content, true);
    shad.appendChild(c);
    sh.root = com.shadowRoot;
    sh.traverseAncestry(null);
    return expect(sh.host.tagName.toLowerCase()).toBe("component");
  });
});

var t, template;

t = "";

template = "";

describe("Template", function() {
  beforeEach(function() {
    t = "";
    return template = "";
  });
  it("should exist", function() {
    return expect(Template).toBeDefined();
  });
  it("should have properties", function() {
    t = "<template name=user schemas='users'><div body></div></template>";
    template = new Template(t);
    expect(template.name).toBeDefined();
    expect(template.element).toBeDefined();
    expect(template.body).toBeDefined();
    return expect(template.schemas).toBeDefined();
  });
  it("should throw error if no arguments", function() {
    return expect(function() {
      return template = new Template();
    }).toThrow(new Error("jom: template is required"));
  });
  it("should throw error if no name found", function() {
    t = "<template></template>";
    return expect(function() {
      return template = new Template(t);
    }).toThrow(new Error("jom: template name attr is required"));
  });
  it("should throw error if no schema found", function() {
    t = "<template name=profile><div body> My text </div> </template>";
    return expect(function() {
      return template = new Template(t);
    }).toThrow(new Error("jom: template schemas attr is required"));
  });
  it("should throw error if no body found", function() {
    t = "<template name=profile> <div> My text </div> </template>";
    return expect(function() {
      return template = new Template(t);
    }).toThrow(new Error("jom: template body attr is required"));
  });
  it("should produce a clone of the template", function() {
    t = "<template name=user schemas=users><div body></div></template>";
    template = new Template(t);
    template.clone();
    expect(template.cloned).toBeDefined();
    return expect(template.cloned).not.toEqual(null);
  });
  return describe("template schemas,", function() {
    return it("should require the same amount of schemas", function() {
      template = new Template('<template name=user schema=user></template>');
      expect(template.schemas_list.length).toBe(1);
      template = new Template('<template name=user schema="user,comment"></template>');
      return expect(template.schemas_list.length).toBe(2);
    });
  });
});

describe("Other things", function() {
  it("should cover helper get/set stuff", function() {
    var XFAKE, fake;
    expect(Function.setter).toBeDefined();
    expect(Function.getter).toBeDefined();
    expect(Function.property).toBeDefined();
    XFAKE = (function() {
      function XFAKE(firstName, lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
      }

      XFAKE.getter("length", function() {
        return 1;
      });

      XFAKE.getter("add", function() {
        return 5;
      });

      XFAKE.setter("add", function(value) {
        return this.value = 5;
      });

      XFAKE.property("fullname", {
        get: function() {
          return this.firstName + " " + this.lastName;
        },
        set: function(name) {
          var ref;
          return ref = name.split(' '), this.firstName = ref[0], this.lastName = ref[1], ref;
        }
      });

      return XFAKE;

    })();
    fake = new XFAKE("Valtid", "Caushi");
    expect(fake.length).toBe(1);
    fake.add = 10;
    expect(fake.value).toBe(5);
    expect(fake.firstName).toBe("Valtid");
    return expect(fake.lastName).toBe("Caushi");
  });
  return it("should cover jQuery stuff", function() {
    expect($.fn.findAll).toBeDefined();
    expect($("*").findAll("*")).toBeDefined();
    expect($("div").value).toBeDefined();
    expect($("div").value("a")).toBeDefined();
    expect($("div").value("a", true)).toBeDefined();
    expect($("div").value("a", false)).toBeDefined();
    expect($("div").value("a", "woof")).toBeDefined();
    return expect($("div").value()).not.toBeDefined();
  });
});
