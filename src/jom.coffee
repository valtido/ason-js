class JOM
  observer= {}
  constructor: ->
    self = window["jom"] = @
    $('html').append('<foot/>')
    @templates   = []
    @collections = []
    @components  = []
    @assets      = []
    @schemas     = []
    @schemas_core = {"id":"http://json-schema.org/draft-04/schema#","$schema":"http://json-schema.org/draft-04/schema#","description":"Core schema meta-schema","definitions":{"schemaArray":{"type":"array","minItems":1,"items":{"$ref":"#"}},"positiveInteger":{"type":"integer","minimum":0},"positiveIntegerDefault0":{"allOf":[{"$ref":"#/definitions/positiveInteger"},{"default":0}]},"simpleTypes":{"enum":["array","boolean","integer","null","number","object","string"]},"stringArray":{"type":"array","items":{"type":"string"},"minItems":1,"uniqueItems":true}},"type":"object","properties":{"id":{"type":"string","format":"uri"},"$schema":{"type":"string","format":"uri"},"title":{"type":"string"},"description":{"type":"string"},"default":{},"multipleOf":{"type":"number","minimum":0,"exclusiveMinimum":true},"maximum":{"type":"number"},"exclusiveMaximum":{"type":"boolean","default":false},"minimum":{"type":"number"},"exclusiveMinimum":{"type":"boolean","default":false},"maxLength":{"$ref":"#/definitions/positiveInteger"},"minLength":{"$ref":"#/definitions/positiveIntegerDefault0"},"pattern":{"type":"string","format":"regex"},"additionalItems":{"anyOf":[{"type":"boolean"},{"$ref":"#"}],"default":{}},"items":{"anyOf":[{"$ref":"#"},{"$ref":"#/definitions/schemaArray"}],"default":{}},"maxItems":{"$ref":"#/definitions/positiveInteger"},"minItems":{"$ref":"#/definitions/positiveIntegerDefault0"},"uniqueItems":{"type":"boolean","default":false},"maxProperties":{"$ref":"#/definitions/positiveInteger"},"minProperties":{"$ref":"#/definitions/positiveIntegerDefault0"},"required":{"$ref":"#/definitions/stringArray"},"additionalProperties":{"anyOf":[{"type":"boolean"},{"$ref":"#"}],"default":{}},"definitions":{"type":"object","additionalProperties":{"$ref":"#"},"default":{}},"properties":{"type":"object","additionalProperties":{"$ref":"#"},"default":{}},"patternProperties":{"type":"object","additionalProperties":{"$ref":"#"},"default":{}},"dependencies":{"type":"object","additionalProperties":{"anyOf":[{"$ref":"#"},{"$ref":"#/definitions/stringArray"}]}},"enum":{"type":"array","minItems":1,"uniqueItems":true},"type":{"anyOf":[{"$ref":"#/definitions/simpleTypes"},{"type":"array","items":{"$ref":"#/definitions/simpleTypes"},"minItems":1,"uniqueItems":true}]},"allOf":{"$ref":"#/definitions/schemaArray"},"anyOf":{"$ref":"#/definitions/schemaArray"},"oneOf":{"$ref":"#/definitions/schemaArray"},"not":{"$ref":"#"}},"dependencies":{"exclusiveMaximum":["maximum"],"exclusiveMinimum":["minimum"]},"default":{}}
    @schemas.core = @schemas_core
    @timeout = 60 * 1000

    @collections.get = (name) -> self.get 'collection', name
    @templates.get   = (name) -> self.get 'template', name
    @schemas.get     = (name) -> self.get 'schema', name
    @components.get  = (name) -> self.get 'component', name
    @assets.get      = (name) -> self.get 'asset', name
    # @template
    @tasks()
    @env = "production"
    @app =
      title: "JOM is Awesome"
    @
  tasks: ->
    setTimeout =>
      @load_assets()
      @load_components()
      @load_templates()
      @load_collections()
      @load_schemas()
      @inject_assets()
      @assemble_components()
      @watch_collections()
      @tasks()
    , 100
  get: (what, name = false) ->
    # collection, by name: e.g: what = 'collection' , name = 'user'
    # what is the arr list below only
    # the name is the name to look for, e.g: collection.name, template.name
    arr = ['collection','template', 'asset', 'schema']
    if !what in arr then throw new Error "jom: cannot get anything naughty."
    if name is false then return @[what+"s"]
    for item, key in @[what + "s"]
      if name is item.name
        return @[what+ "s"][key]

    return null

  inject_assets: ()->
    # gets each asset and injects it to the foot tag (same level as body tag)
    # this way the assets will load the old fashioned way, also load json
    # with ajax as there is no way to get it any other way, then reference the
    # response object in element.data = {...}
    $.each @assets, (i, asset)->
      if asset.queued? isnt true
        asset.queued = true
        foot = $ 'html>foot'
        if asset.content_type.part is "text/json"
          $.getJSON(asset.source)
          .done (response)->
            foot.find("script[source='#{asset.source}']")
            .get(0).response = response
          .fail (xhr, status, err)->
            console?.info? status, err
            throw new Error 'Faild: to load a json asset'
        foot.append asset.element
  load_assets: ()->
    # imported =  $.map $("foot link[rel=import]"), (link, i)->
    #   if link.import isnt null
    #     template = $(link.import).find("template").get(0)
    #     links = $(template.content).find "link[rel=asset]"
    #     .filter (i,link)->
    #       "asset" of link is false
    #
    #     return links

    $('link[rel="asset"]')
    # .add imported
    .each (i, asset)=>
      exists = $ @assets
              .filter =>
                this.source is $(asset).attr "source"

      if "jinit" of asset is false and exists.length is 0
        asset.jinit = true
        @assets.push new Asset asset

  load_schemas: ()->
    $('foot script[asset=schema]')
    .each (i, schema) =>
      if "jinit" of schema is false and schema.response isnt undefined
        schema.jinit = true
        s            = schema.response || {}
        name         = $(schema).attr 'name'
        obj          = new Schema name, s
        @schemas.push obj
  load_components: ()->
    $('component')
    .each (i, component) =>
      if "jinit" of component is false
        component.jinit = true
        c               = new Component component
        @components.push c
        component.component = c

  load_templates: ()->
    $("foot link[rel=import][asset=template]")
    .filter (i,link)->
      link.import isnt null
    .each (i, link) =>
      templates = link.import.querySelectorAll "template"
      $(templates).each (j, template) =>
        if template and "jinit" of template is false and link.import isnt undefined
          template.jinit = true
          name           = $(template).attr 'name'
          @templates.push new Template template

  load_collections: ()->
    $("foot script[type='text/json'][asset=collection]")
    .each (i, collection) =>
      schema_attr = $(collection).attr('schema')
      schema = false
      if schema_attr isnt undefined
        schema = jom.schemas.get schema_attr
      if "jinit" of collection is false and
         collection.response isnt undefined and
         schema

        collection.jinit = true
        name             = $(collection).attr "name"
        response         = collection.response
        @collections.push new Collection name, response, schema

  assemble_components: ->
    $.each @components, (i, component)=>
      if component.skip is true
        return true
      if component.ready is true
        component.skip = true
        component.template.hide_loader(component.root)
        return true

      if "timer" of component is false
        component.timer = new Date()

      if  new Date() - component.timer > @timeout
        component.trigger 'timeout'
        component.trigger 'error', 'timeout'
        throw new Error "jom: Component `#{component.name}` timedout"

      template = jom.templates.get component.prop.template

      # build template
      if component.template is null and template and component.collection
        # clean up loading
        # $(component.root.children).remove()
        # create a new instance of template so original remains un touched
        template = new Template template.original
        component.define_template template
        template.show_loader()
        component.define_template template
        component.handle_template_scripts template.element
        component.template.component = component
        component.root.appendChild template.element
        template.element = component.root

      # build collection
      collection = jom.collections.get component.prop.collection
      if component.collection is null and collection
        component.define_collection collection

      # when both template and collection are ready
      if  component.template isnt null and
          component.collection isnt null and
          component.template.ready is true and
          @scripts_loaded(component) is true
        @repeater component
        component.handlebars component.root.children, component

        @image_source_change component
        component.show()
        component.ready = true
        component.trigger 'ready'

  scripts_loaded  : (component)->
    all_done = true
    scripts = $ component.root
              .add component.root.children
              .findAll 'script[src]'
    $ scripts
    .each (i, script)->
      all_done = false if script.has_loaded? isnt true

    all_done

  image_source_change : (component)->
    $ component.root
    .add component.root.children
    .findAll '[body] img'
    .not '[repeat] img'
    .each (i, image)->
      $image = $ image
      $image.attr 'src', $image.attr "source"
  repeater: (component, context = null)->
    if context instanceof ShadowRoot
      context = context.children
    context = context or $(component.template.element.children).findAll '[body]'
    $ '[repeat]', context
    .each (i, repeater)->
      repeater = $ repeater
      items = component.repeat repeater
      items.insertAfter repeater
      repeater.hide()
  watch_collections: ->
    for key, collection of @collections
      if collection.observing is false
        collection.observing = true
        new Observe collection, collection.document, (changes)=>
          for key, change of changes
            $.each @components, (i, component)=>
              if change.collection.name in component.collections_list
                $(component.root).add(component.root.children)
                .findAll('[repeated]').remove()

                $(component.root).add(component.root.children)
                .findAll('[repeat]').show()

                @repeater component, component.root

                component.handlebars component.root, component

                @image_source_change component

                $(component.root.host).trigger "change", [
                  change, component.collections
                ]

                $(component.root).find('[repeat]').hide()

                component.trigger "change", change

  resolve: (path)->
    # return location.pathname+
    href   = location.href
    pr     = href.replace(location.protocol+"//", "").replace(location.host, "")
    url    = pr
    first  = path[0]
    second = path[1]
    result = ""

    switch first
      when "/"
        result = path if second isnt "/"
      else
        result = url.replace /([\/]?[^\/]+[\/]?)$/g, "/"+path
    return result

  @getter 'shadow', -> new Shadow()

jom = JOM = new JOM()
