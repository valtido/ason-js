link = ""
describe "jom: ", ->
  beforeEach ->
    $('foot').html("")
    $('body').html("")
    $('head link[rel=asset]').remove()

    jom.clear_cache()
    jom.clear_stack()

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

      link = "<link rel=import href=template.html type='text/template' />"
      link = "<link rel=asset source=template.html type='text/template' />"
      $('foot').append link

      jom.load_templates()

      expect(Object.keys(jom.template).length).toEqual 1

  describe "collection, ", ->
    it "should gather collections", ->
      expect(jom.collection).toEqual {}

      script = "<script src=data.json type='text/json' name=profile />"
      $('foot').append script

      jom.load_collections()

      expect(jom.collection["profile"]).toBeDefined()
