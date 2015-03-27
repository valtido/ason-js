component = {}
describe "components", ->
  beforeEach ()->
    component = {}
    $('foot').html("")
    $('body').html("")
    $('head link[rel=asset]').remove()
    $('component').remove()
    jom.clear_stack()
    jom.clear_cache()

  it "should exists", ->
    expect(Component).toBeDefined()

  it "should have properties defined", ->
    c = "<component template=profile collection=profile />"
    component = new Component c

    expect(component.attr).toBeDefined()
    expect(component.template).toBeDefined()
    expect(component.collection).toBeDefined()
    expect(component.path).toBeDefined()
    expect(component.element).toBeDefined()

    expect(component.ready).toBeDefined()

    expect(component.hide).toBeDefined()
    expect(component.show).toBeDefined()

    expect(component.enable).toBeDefined()
    expect(component.disable).toBeDefined()
    expect(component.destroy).toBeDefined()

    expect(component.create_shadow).toBeDefined()

    expect(component.define_template).toBeDefined()
    expect(component.define_collection).toBeDefined()

    expect(component.attr).toEqual template:"profile",collection:"profile"

    expect(component.root).not.toEqual null
    expect(component.element.shadowRoot).not.toEqual null

    expect(component.handlebars).toBeDefined()
    expect(component.handle_template_scripts).toBeDefined()

  describe "required properties",->

    it "should fail no arguments", ->
      expect(-> component = new Component())
      .toThrow new Error "jom: component is required"

    it "should fail no template", ->
      c = "<component />"

      expect(-> new Component c)
      .toThrow new Error "jom: component template is required"

    it "should fail no collection", ->
      c = "<component template=profile />"

      expect(-> component = new Component c)
      .toThrow new Error "jom: component collection is required"

    it "should pass and set component to element", ->
      c = "<component template=profile collection=profile />"
      component = new Component c

      expect(component.element.component).toBe true

  describe "handle_template_scripts; ",->
    it "should wrap script tags, for encapsulatation",->
      c = "<component template=profile collection=profile />"
      component = new Component c

      content = """
                  <div>
                    <div>Test</div>
                    <script> var a = 1; </script>
                  </div>
                """

      new_content = component.handle_template_scripts content

      expected_content = """
      (function(shadow,body, host, root, component, collection, data){
       var a = 1;
      }).apply(
        (shadow = jom.shadow) && shadow.body,
        [
         shadow     = shadow,
         body       = shadow.body,
         host       = shadow.host,
         root       = shadow.root,
         component  = host.component,
         collection = component.collection,
         data       = component.data
        ]
      )
      """
      new_content      = $.trim($(new_content).text()).replace /[\s]+/g, " "
      expected_content = $.trim(expected_content).replace /[\s]+/g, " "

      expect(new_content).toEqual expected_content

  describe "handlebars; ",->
    it "should replace handles with data", ->
      data =
        handlebar:
          and:
            path: "thing"
        dog: ["Rocky"]
      collection = new Collection "profile", data

      c = "<component template=profile collection=profile />"
      component = new Component c

      content = """
      <div>
        <div>I will test</div>
        <div>some
          <span>${handlebar.and.path}</span>
          even if it has an array
          <span>${dog[0]}</span>
        </div>
      </div>
      """
      new_content = component.handlebars content, collection
      expected_content = "I will test some thing even if it has an array Rocky"


      new_content      = $.trim($(new_content).text()).replace /[\s]+/g, " "
      expected_content = $.trim(expected_content).replace /[\s]+/g, " "

      expect(component.handles.length).toEqual 2
      expect(new_content).toEqual expected_content
