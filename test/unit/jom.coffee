link = ""
describe "jom: ", ->
  beforeEach ->
    jom.components = []
    $('foot').html("")
    $('body').html("")
    $('head link[rel=asset]').remove()

    $('component').remove()
    jom.assets = []

  it "should be defined", ->
    expect(jom).toBeDefined()

  it "Key features to be present", ->
    sh = jom.shadow
    expect(sh).toBeDefined()
    expect(window.Root).toBeDefined()

    expect(jom.components).toBeDefined()
    expect(jom.templates).toBeDefined()
    expect(jom.collections).toBeDefined()
    expect(jom.assets).toBeDefined()
    expect(jom.schemas).toBeDefined()

    expect(jom.load_components).toBeDefined()
    expect(jom.load_templates).toBeDefined()
    expect(jom.load_collections).toBeDefined()
    expect(jom.load_assets).toBeDefined()
    expect(jom.load_schemas).toBeDefined()

    expect(jom.inject_assets).toBeDefined()
    expect(jom.assemble_components).toBeDefined()
    expect(jom.watch_collections).toBeDefined()

    expect(jom.tasks).toBeDefined()
    expect(jom.resolve).toBeDefined()
    expect(jom.env).toBeDefined()
    expect(jom.app).toBeDefined()

  it "path resolver", ->
    expect(jom.resolve "/location").toBe "/location"
  it "path resolve default", ->
    expect(jom.resolve "location").toBe "/location"

  describe "schemas, ", ->
    it "should push new schemas", ->
      expect(jom.schemas.length).toEqual 0
      link = "<link rel=asset source=data.json type='text/json' asset=schema />"
      $('head').append link

      jom.load_assets()

      expect(jom.assets[0].queued).not.toBeDefined()
      jom.inject_assets()
      expect(jom.assets[0].queued).toBe true

      jom.load_schemas();

      expect(jom.schemas.length).toEqual 1
      expect($('html>foot').length).toBe 1
      expect($('html>foot').children().length).toBe 1
  describe "assets, ", ->
    it "should push new assets", ->
      expect(jom.assets.length).toEqual 0

      link = "<link rel=asset source=data.json type='text/json' asset=collection />"
      $('head').append link

      jom.load_assets()

      expect(jom.assets.length).toEqual 1

    it "should inject assets to the page", ->
      expect(jom.assets.length).toEqual 0

      link = "<link rel=asset source=data.json type='text/json' asset=collection />"
      $('head').append link

      jom.load_assets()
      expect(jom.assets[0].queued).not.toBeDefined()
      jom.inject_assets()
      expect(jom.assets[0].queued).toBe true

      expect(jom.assets.length).toEqual 1
      expect($('html>foot').length).toBe 1
      expect($('html>foot').children().length).toBe 1

  describe "component, ", ->
    it "should gather components", ->
      expect(jom.components.length).toEqual 0

      component = "<component template=profile collections=profile />"
      $('body').append component

      jom.load_components()

      expect(jom.components.length).toEqual 1

  describe "template, ", ->
    it "should gather templates", ->
      expect(jom.templates).toEqual []
      expect(jom.templates.length).toEqual 0

      link = "<link rel=asset source=template.html type='text/html' asset=template />"
      foot = $('foot>link[rel=import]')

      expect($('head>link[rel=asset]').length).toEqual 0

      $('head').append link
      expect($('head>link[rel=asset]').length).toEqual 1

      expect(foot.length).toEqual 0

      doc = document.implementation.createHTMLDocument("test")
      t = doc.createElement "template"
      doc.querySelector("head").appendChild t

      jom.load_assets()
      jom.inject_assets()

      $(foot.selector).get(0)["import"] = doc

      filter = $(foot.selector).filter (i,link)->
        link.import = doc
        link.import isnt null

      jom.load_templates()

      expect($(foot.selector).length).toEqual 1

  describe "collection, ", ->
    it "should gather collections", ->
      expect(jom.collections).toEqual []

      script = "<script source=data.json type='text/json' name=profile asset=collection />"
      $('foot').append script
      $('foot>script[source="data.json"]').get(0).data = []
      jom.load_collections()

      expect(jom.collections["profile"]).toBeDefined()

  describe "tasks, ", ->
    it "should cover tasks", ->
      asset = "<link rel='asset' source='test' type='text/json' asset=collection />"
      a = new Asset asset
      jom.assets.push a

      expect(jom.assets.length).toEqual 1

      jom.tasks()

  describe "assemble, ", ->
    xit "should assemble a component", ->
      c = "<component template=profile collections=profile />"

      expect($('body>component').length).toEqual 0
      $('body').append(c)
      expect($('body>component').length).toEqual 1

      $c = $ c

      t = "<template name=profile><div body></div></template>"
      template = new Template t

      data = [ name: "valtid" ]
      collection = new Collection "profile", data
      jom.collections.profile = collection
      jom.templates.profile = template
      jom.load_components()
      jom.load_collections()
      jom.load_templates()

      expect(jom.components.length).toEqual 1

      component = jom.components[0]

      component.define_template template
      expect(component.template).toBeDefined()
      expect(component.template).toBe template

      component.define_collection collection

      com = component
      if template and collection and collection.data?.length
        all = true
      else
        all = false

      jom.assemble_components()
      expect( all ).toBe true
      expect(component.collections).toBeDefined()
      expect(component.collections[collection.name]).toBe collection

      expect(component.collections[collection.name].data).toBeDefined()
      expect(component.collections[collection.name].data).toEqual data
      expect(collection).toBeDefined()
      expect(collection.data).toEqual data

      component.template.clone()
      expect(component.template.cloned).not.toEqual null
      expect(component.collections[collection.name].findByPath "[0].name").toEqual "valtid"
      expect(component.ready).toBe true

  describe "disabled, ", ->
    it "should be enabled", ->
      c = "<component template=profile collections=profile />"
      component = new Component c

      expect(component.enable()).toBe false

    it "should be enabled", ->
      c = "<component template=profile collections=profile />"
      component = new Component c

      expect(component.disable()).toBe true

  describe "watch_collections, ", ->
    beforeEach (done)->
      setTimeout ->
        done()
      , 1
    it "should not watch if it's already watched", ->
      data = [ name: "valtid" ]
      collection = new Collection "profile", data
      jom.collections.profile = collection
      # this is the flag to testing for duplicate observers

      c = "<component template=profile collections=profile />"

      expect($('body>component').length).toEqual 0
      $('body').append(c)
      jom.load_components()
      expect($('body>component').length).toEqual 1
      expect(jom.components.length).toEqual 1

      jom.watch_collections()

      component = jom.components[0]
      component.trigger = (changes, collections)->
        console.log changes, collections
        expect(jom.components.length).toEqual 1
        expect(collections.path).toBe "[0].name"
        expect(collections.value).toBe "Tom"

      collection.data[0].name = "Tom"
