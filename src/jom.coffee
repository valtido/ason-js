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
    $.each @assets, (i, asset)->
      if asset.queued? isnt true
        asset.queued = true
        foot = $ 'html>foot'
        if asset.content_type.part is "text/json"
          $.getJSON(asset.source)
          .done (response)->
            foot.find("script[source='#{asset.source}']").get(0).data = response
          .error (err)->
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
      if "jinit" of schema is false and schema.data isnt undefined
        schema.jinit = true
        s = schema.data || {}
        name = $(schema).attr 'name'
        obj = new Schema name, s
        @schemas.push obj
  load_components: ()->
    $('component')
    .each (i, component) =>
      if "jinit" of component is false
        component.jinit = true
        c = new Component component
        @components.push c
        component.component = c

  load_templates: ()->
    $("foot link[rel=import][asset=template]")
    .filter (i,link)->
      link.import isnt null
    .each (i, link) =>
      template = link.import.querySelector "template"
      if template and "jinit" of template is false and link.import isnt undefined
        template.jinit = true
        name = $(template).attr 'name'
        @templates.push new Template template

  load_collections: ()->
    $("foot script[type='text/json'][asset=collection]")
    .each (i, collection) =>
      if "jinit" of collection is false and collection.data isnt undefined
        collection.jinit = true
        name = $(collection).attr "name"
        data = collection.data
        @collections.push new Collection name, data

  assemble_components: ->
    timeout = 60 * 1000

    if jom.env isnt "production" then timeout = 10 * 1000

    $.each @components, (i, component)=>
      if component.skip is true
        return true
      if component.ready is true
        component.skip = true
        component.template.hide_loader(component.root)
        return true

      if "timer" of component is false
        component.timer = new Date()

      if  new Date() - component.timer > timeout
        throw new Error "jom: Component `#{component.name}` timedout"

      template = jom.templates.get component.attr.template
      # build template

      if component.init.template is false and template
        component.init.template = true
        # clean up loading
        # $(component.root.children).remove()
        # create a new instance of template so original remains un touched
        template = new Template template.original
        template.show_loader()
        component.define_template template
        component.handle_template_scripts template.element
        component.template.component = component
        component.root.appendChild template.element
        template.element = component.root

      if template and template.ready is false
        component.template.load_schemas()

      # build collection
      if component.init.collections is false
        collections_available = true

        if component.collections_list.length is 0
          collections_available = false

        for c in component.collections_list
          if jom.collections.get(c) is null then collections_available = false

      if component.init.collections is false and collections_available is true
        component.init.collections = true

        # if template and collections are available do this once
        for c in component.collections_list
          component.define_collection(jom.collections.get(c))

      # when both template and collections are ready
      if  component.init.template is true and
          component.init.collections is true and
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
        new Observe collection, collection.data, (changes)=>
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
                  change, component.data, component.collection
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
