link = ""
describe "jom: ", ->
  beforeEach ->
    $('foot').html("")
    $('body').html("")
    $('head link[rel=asset]').remove()

    jom.clear_cache()
    jom.clear_stack()

    $('component').remove()

  it "should be defined", ->
    expect(jom).toBeDefined()

  it "Key features to be present", ->
    sh = jom.shadow
    expect(sh).toBeDefined()
    expect(window.Root).toBeDefined()

    expect(jom.get_stack).toBeDefined()
    expect(jom.get_cache).toBeDefined()
    expect(jom.clear_cache).toBeDefined()
    expect(jom.clear_stack).toBeDefined()

    expect(jom.component).toBeDefined()
    expect(jom.template).toBeDefined()
    expect(jom.collection).toBeDefined()
    expect(jom.asset).toBeDefined()

    expect(jom.load_assets).toBeDefined()
    expect(jom.load_templates).toBeDefined()
    expect(jom.load_components).toBeDefined()
    expect(jom.load_collections).toBeDefined()

    expect(jom.inject_assets).toBeDefined()
    expect(jom.assemble_components).toBeDefined()

    expect(jom.tasks).toBeDefined()
    expect(jom.resolve).toBeDefined()

  it "path resolver", ->
    expect(jom.resolve "/location").toBe "/location"
  it "path resolve default", ->
    expect(jom.resolve "location").toBe "/location"

  it "clear cache", ->
    jom.clear_cache()
    expect(jom.get_cache()).toEqual
      asset      : []
      template   : {}
      collection : {}
      component  : []

  it "clear stack", ->
    jom.clear_stack()
    expect(jom.get_stack()).toEqual
      asset      : []
      template   : {}
      collection : {}
      component  : []

  describe "assets, ", ->

    it "should push new assets", ->
      expect(jom.asset.length).toEqual 0

      link = "<link rel=asset source=data.json type='text/json' />"
      $('head').append link

      jom.load_assets()

      expect(jom.asset.length).toEqual 1

    it "should inject assets to the page", ->
      jom.clear_cache()
      jom.clear_stack()
      expect(jom.asset.length).toEqual 0

      link = "<link rel=asset source=data.json type='text/json' />"
      $('head').append link

      jom.load_assets()
      expect(jom.asset[0].queued).not.toBeDefined()
      jom.inject_assets()
      expect(jom.asset[0].queued).toBe true

      expect(jom.asset.length).toEqual 1
      expect($('html>foot').length).toBe 1
      expect($('html>foot').children().length).toBe 1

  describe "component, ", ->
    it "should gather components", ->
      expect(jom.component.length).toEqual 0

      component = "<component template=profile collection=profile />"
      $('body').append component

      jom.load_components()

      expect(jom.component.length).toEqual 1

  describe "template, ", ->
    it "should gather templates", ->
      expect(jom.template).toEqual {}
      expect(Object.keys(jom.template).length).toEqual 0

      link = "<link rel=asset source=template.html type='text/template' />"
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
      expect(jom.collection).toEqual {}

      script = "<script source=data.json type='text/json' name=profile />"
      $('foot').append script
      $('foot>script[source="data.json"]').get(0).data = []
      jom.load_collections()

      expect(jom.collection["profile"]).toBeDefined()

  describe "tasks, ", ->
    beforeEach (done)->
      setTimeout ->
        done()
      , 200
    it "should cover tasks", ->
      asset = "<link rel='asset' source='test' type='text/json' />"
      a = new Asset asset
      jom.asset.push a

      expect(jom.asset.length).toEqual 1

      jom.tasks()

  describe "assemble, ", ->
    beforeEach ->
      setTimeout ->
        done()
      , 100
    it "should assemble a component", ->
      c = "<component template=profile collection=profile />"

      expect($('body>component').length).toEqual 0
      $('body').append(c)
      expect($('body>component').length).toEqual 1

      $c = $ c

      t = "<template name=profile><div body></div></template>"
      template = new Template t

      data = [ name: "valtid" ]
      collection = new Collection "profile", data
      jom.collection.profile = collection
      jom.template.profile = template
      jom.load_components()
      jom.load_collections()
      jom.load_templates()

      expect(jom.component.length).toEqual 1

      component = jom.component[0]

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
      expect(component.collection).toBeDefined()
      expect(component.collection).toBe collection

      expect(component.collection.data).toBeDefined()
      expect(component.collection.data).toEqual data
      expect(collection).toBeDefined()
      expect(collection.data).toEqual data

      component.template.clone()
      expect(component.template.cloned).not.toEqual null
      expect(component.collection.findByPath "[0].name").toEqual "valtid"
      expect(component.ready).toBe true
