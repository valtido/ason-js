component = {}
describe "components:: ", ->
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
    expect(component.events).toBeDefined()

    expect(component.ready).toBeDefined()

    expect(component.hide).toBeDefined()
    expect(component.show).toBeDefined()

    expect(component.enable).toBeDefined()
    expect(component.disable).toBeDefined()
    expect(component.destroy).toBeDefined()

    expect(component.create_shadow).toBeDefined()

    expect(component.define_template).toBeDefined()
    expect(component.define_collection).toBeDefined()

    expect(component.attr).toEqual template:"profile", collection:"profile"

    expect(component.root).not.toEqual null
    expect(component.element.shadowRoot).not.toEqual null

    expect(component.handlebars).toBeDefined()
    expect(component.handle_template_scripts).toBeDefined()
    expect(component.trigger).toBeDefined()

    expect(component.on).toBeDefined()

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
      (function(){
                var
                shadow     = jom.shadow,
                body       = shadow.body,
                host       = shadow.host,
                root       = shadow.root,
                component  = host.component,
                collection = component.collection,
                data       = component.collection.findByPath(component.path)
                ;
       var a = 1;
      })()
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

      component.define_collection collection

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

      new_content = component.handlebars content, component
      expected_content = "I will test some thing even if it has an array Rocky"

      new_content      = $.trim($(new_content).text()).replace /[\s]+/g, " "
      expected_content = $.trim(expected_content).replace /[\s]+/g, " "

      expect(component.handles.length).toEqual 2
      expect(new_content).toEqual expected_content

    it "should replace handles attributes with data", ->
      data =
        handlebar:
          and:
            path: "thing"
        dog: ["Rocky"]
      collection = new Collection "profile", data

      c = "<component template=profile collection=profile />"
      component = new Component c
      component.define_collection collection

      content = """
      <div>
        <div>I will test</div>
        <div>some
          <span>${handlebar.and.path}</span>
          even if it has an array
          <span value="${dog[0]}"></span>
        </div>
      </div>
      """
      new_content = component.handlebars content, component
      expected_content = "I will test some thing even if it has an array"


      new_content      = $.trim($(new_content).text()).replace /[\s]+/g, " "
      expected_content = $.trim(expected_content).replace /[\s]+/g, " "

      expect(component.handles.length).toEqual 2
      expect(new_content).toEqual expected_content

  describe "defines; ",->
    it "should define a template", ->
      c = "<component template=profile collection=profile />"
      component = new Component c

      t = "<template name=user><div body></div></template>"
      template = new Template t

      component.define_template template

      expect(component.template).toBe template

    it "should throw an error when defining a template", ->
      c = "<component template=profile collection=profile />"
      component = new Component c

      t = "<template name=user><div body></div></template>"

      expect(-> component.define_template t)
      .toThrow new Error "jom: template cant be added"

    it "should define a collection", ->
      c = "<component template=profile collection=profile />"
      component = new Component c

      data = [ name: "valtid" ]
      collection = new Collection "profile", data

      component.define_collection collection

      expect(component.collection).toBe collection

    it "should throw an error when defining a collection", ->
      c = "<component template=profile collection=profile />"
      component = new Component c

      collection = [ name: "valtid" ]

      expect(-> component.define_collection collection)
      .toThrow new Error "jom: collection cant be added"

  describe "shadowRoot; ",->
    it "should wrap if shadowRoot is not native", ->
      c = "<component template=profile collection=profile />"
      $c = $ c
      x = $c.get(0)

      expect(x.createShadowRoot).toBeDefined()

      component = new Component x
      expect(x.createShadowRoot).toBeDefined()

  describe "trigger; ",->
    it "should trigger changes",->
      t = "<template name=user><div body>${name}</div></template>"
      template = new Template t

      data = [ name: "valtid" ]
      collection = new Collection "profile", data

      jom.collection.profile = collection
      jom.template.profile = template

      c = "<component template=profile collection=profile />"
      component = new Component c
      component.define_collection collection
      component.define_template template
      template.clone()
      component.handlebars template.cloned, component

      changes =[
        path: "[0].name"
        value: "Valtid Caushi"
      ]

      trigger = component.trigger changes, collection

      expect(trigger.length).toEqual 1

  it "should trigger changes cover attributes",->
    t = "<template name=user><div body><span value='${name}'/></div></template>"
    template = new Template t

    data = [ name: "valtid" ]
    collection = new Collection "profile", data

    jom.collection.profile = collection
    jom.template.profile = template

    c = "<component template=profile collection=profile />"
    component = new Component c
    component.define_collection collection
    component.define_template template
    template.clone()
    component.handlebars template.cloned, component

    changes =[
      path: "[0].name"
      value: "Valtid Caushi"
    ]

    trigger = component.trigger changes, collection

    expect(trigger.length).toEqual 1


  it "should trigger changes and throw errors",->
    t = "<template name=user><div body><span value='${name}'/></div></template>"
    template = new Template t

    data = [ name: "valtid" ]
    collection = new Collection "profile", data

    jom.collection.profile = collection
    jom.template.profile = template

    c = "<component template=profile collection=profile />"
    component = new Component c
    component.define_collection collection
    component.define_template template
    template.clone()
    component.handlebars template.cloned, component
    component.handles[0].handle.type = "__fake__"

    changes =[
      path: "[0].name"
      value: "Valtid Caushi"
    ]

    expect(-> component.trigger changes, collection)
    .toThrow new Error "jom: unexpected handle type"


  describe "on event; ", ->
    it "should push events to the queue", ->
      c = "<component template=profile collection=profile />"
      component = new Component c

      expect(component.events.length).toEqual 0

      component.on "change", "name", ->

      expect(component.events.length).toEqual 1
      expect(component.events[0].path).toEqual "name"
      expect(component.events[0].type).toEqual "change"

  describe "trigger event; ", ->
    xit "should trigger all events that match path and type", ->
      output = false
      c = "<component template=profile collection=profile />"
      component = new Component c

      data = [ name: "valtid" ]
      collection = new Collection "profile", data

      component.define_collection collection

      expect(component.events.length).toEqual 0

      component.on "change", "name", ->
        output = true
        console.log "test: true"
        expect(output).toEqual true

      expect(component.events.length).toEqual 1
      expect(component.events[0].path).toEqual "name"
      expect(component.events[0].type).toEqual "change"

      expect(output).toEqual false

      changes =[
        path: "[0].name"
        value: "Valtid Caushi"
      ]

      trigger = component.trigger changes, collection

      expect(output).toEqual true

  describe "repeat; ", ->
    iit "should repeat the same thing over and over", ->
      c = "<component template=profile collection=profile />"
      component = new Component c

      repeater = """
        <div repeat="${names}">
          <div name="${name}"></div>
        </div>
      """
      data = [
        {names: [
            {name: "Valtid"},
            {name: "John"}
          ]
        }
      ]
      out = component.repeat repeater, data

      expected = """
      <div repeat="${names}">
        <div name="${names[0].name}"></div>
        <div name="${names[1].name}"></div>
      </div>
      """

      # expect(out).toEqual expected
      expect(out.children().length).toEqual 2
      console.debug out.children()
