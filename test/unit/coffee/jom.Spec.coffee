describe "jom", ->
  it "should be defined", ->
    expect(jom).toBeDefined()


  it "Key features to be present", ->
    expect(jom.get_stack).toBeDefined()
    expect(jom.get_cache).toBeDefined()
    expect(jom.clear_cache).toBeDefined()
    expect(jom.clear_stack).toBeDefined()
    expect(jom.run_template).toBeDefined()
    expect(jom.component).toBeDefined()
    expect(jom.template).toBeDefined()
    expect(jom.collection).toBeDefined()
    expect(jom.asset).toBeDefined()
    sh = jom.shadow
    expect(sh).toBeDefined()
    # expect(sh.body).toBeDefined()
    # expect(sh.traverseAncestry).toBeDefined()
    # expect(sh.host).toBeDefined()
    expect(window.Root).toBeDefined()
    expect(jom.tasks).toBeDefined()
    expect(jom.resolve).toBeDefined()

  it "template as an object", ->
    expect(jom.template).toEqual {}

  it "jom path resolver", ->
    expect(jom.resolve "/location").toBe "/location"

  it "jom clear cache", ->
    jom.clear_cache()
    expect(jom.get_cache()).toEqual
      template   : {}
      component  : {}
      collection : {}

  it "jom clear stack", ->
    jom.clear_stack()
    expect(jom.get_stack()).toEqual
      template   : {}
      component  : {}
      collection : {}

  it "jom add template", ->
    expect(jom.template).toEqual {}
    expect(Object.keys(jom.template).length).toEqual 0

    name = "profile"
    template = "<template name=profile><div>Test</div></template>"
    jom.add_template template

    outter = $(template).get(0).outerHTML

    expect(Object.keys(jom.template).length).toEqual 1
    expect(jom.template["profile"].name).toEqual "profile"
    expect(jom.template["profile"].element.outerHTML).toBe outter
