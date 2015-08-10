class JOM
  observer= {}
  constructor: ->
    window["jom"] = @
    $('html').append('<foot/>')
    @templates   = []
    @collections = []
    @components  = []
    @assets      = []
    @schemas     = []

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
      @load_schemas
      @inject_assets()
      @assemble_components()
      @watch_collections()
      @tasks()
    , 100

  inject_assets: ()->
    $.each @assets, (i, asset)->
      if asset.queued? isnt true
        asset.queued = true
        foot = $ 'html>foot'
        if asset.content_type.part is "text/json"
          $.getJSON(asset.source)
          .done (response)->
            foot.find("script[source='#{asset.source}']").get(0).data = response
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

    $('head link[rel="asset"]')
    # .add imported
    .each (i, asset)=>
      exists = $ @assets
              .filter =>
                this.source is $(asset).attr "source"

      if "asset" of asset is false and exists.length is 0
        asset.asset = true
        @assets.push new Asset asset

  load_schemas: ()->
    $('foot script[asset=schema]')
    .each (i, schema) =>
      if "schema" of schema is false
        schema.schema = true
        @schemas.push schema.json || {}
  load_components: ()->
    $('component')
    .each (i, component) =>
      if "component" of component is false
        component.component = true
        c = new Component component
        @components.push c
        component.component = c

  load_templates: ()->
    $("foot link[rel=import][asset=template]")
    .filter (i,link)->
      link.import isnt null
    .each (i, link) =>
      template = link.import.querySelector "template"
      if "template" of template is false and link.import isnt undefined
        template.template = true
        name = $(template).attr 'name'
        @templates[name] = new Template template

  load_collections: ()->
    $("foot script[type='text/json'][asset=collection]")
    .each (i, collection) =>
      if "collection" of collection is false and collection.data isnt undefined
        collection.collection = true
        name = $(collection).attr "name"
        data = collection.data
        @collections[name] = new Collection name, data

  assemble_components: ->
    $.each @components, (i, component)=>
      if  component.ready isnt true and component.scripts.status is "init"
        template    = jom.templates[component.attr.template]

        collections_available = true
        if component.collections_list.length is 0
          collections_available false
        for c in component.collections_list
          if jom.collections[c] is undefined then collections_available = false

        # if template and collections are available do this once
        if  template isnt undefined and
            collections_available is true

          component.define_template template

          for c in component.collections_list
            component.define_collection jom.collections[c]

          component.template.clone()

          @repeater component

          component.hide()
          component.root.appendChild $('<div>Loading...</div>').get 0

          component.handlebars component.template.cloned, component

          # clean up loading
          $(component.root.children).remove()

          component.handle_template_scripts component.template.cloned

          component.root.appendChild component.template.cloned
          @image_source_change component

          @wait_for_scripts component

  wait_for_scripts  : (component)->
    if component.scripts.status is "done"
      component.show()
      component.ready = true
      component.trigger 'ready'
    else
      setTimeout =>
        all_done = true
        scripts = $('script[src]', component.root)
        $(scripts).each (i, script)->
          all_done = false if script.has_loaded? isnt true

        component.scripts.status = "done" if all_done is true

        @wait_for_scripts component
      , 10
  image_source_change : (component)->
    $('[body] img', component.root)
    .not('[repeat] img')
    .each (i, image)->
      $image = $ image
      $image.attr 'src', $image.attr "source"
  repeater: (component, context = null)->
    $ '[body] [repeat]', context or component.template.cloned
    .each (i, repeater)->
      repeater = $ repeater
      items = component.repeat repeater
      items.insertAfter repeater
      repeater.hide()
  watch_collections: ->
    for key, collection of @collections
      if collection.observing is false
        collection.observing = true
        new Observe collection.data, (changes)=>
          for key, change of changes
            $.each @components, (i, component)=>
              $(component.root).find('[repeated]').remove()
              $(component.root).find('[repeat]').show()
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
