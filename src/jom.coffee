class JOM
  observer= {}
  cache = {}
  stack = {}
  constructor: ->
    window["jom"] = @
    $('html').append('<foot/>')
    @clear_cache()
    @clear_stack()
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
      @inject_assets()
      @assemble_components()
      @watch_collections()
      @tasks()
    , 100

  inject_assets: ()->
    $.each stack.asset, (i, asset)->
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
    .each (i, asset)->
      exists = $ stack.asset
      .filter ->
        this.source is $(asset).attr "source"
      if "asset" of asset is false and exists.length is 0
        asset.asset = true
        stack.asset.push new Asset asset

  load_components: ()->
    $('component')
    .each (i, component)->
      if "component" of component is false
        component.component = true
        c = new Component component
        stack.component.push c
        component.component = c

  load_templates: ()->
    $("foot link[rel=import]")
    .filter (i,link)->
      link.import isnt null
    .each (i, link)->
      template = link.import.querySelector "template"
      if "template" of template is false and link.import isnt undefined
        template.template = true
        name = $(template).attr 'name'
        stack.template[name] = new Template template

  load_collections: ()->
    $("foot script[type='text/json']")
    .each (i, collection)->
      if "collection" of collection is false and collection.data isnt undefined
        collection.collection = true
        name = $(collection).attr "name"
        data = collection.data
        stack.collection[name] = new Collection name, data

  assemble_components: ->
    $.each stack.component, (i, component)=>
      if  component.ready isnt true
        template   = jom.template[component.attr.template]
        collection = jom.collection[component.attr.collection]
        if template isnt undefined and
           collection isnt undefined and
           collection.data?.length

          component.define_template template
          component.define_collection collection
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
          component.show()
          component.ready = true
  image_source_change : (component)->
    $('[body] img', component.root).each (i, image)->
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
    for key, collection of stack.collection
      if collection.observing is false
        collection.observing = true
        new Observe collection.data, (changes)=>
          $.each stack.component, (i, component)=>
            $(component.root).find('[repeated]').remove()
            $(component.root).find('[repeat]').show()
            @repeater component, component.root
            component.handlebars component.root, component
            @image_source_change component
            $(component.root).find('[repeat]').hide()
            component.trigger changes, collection

  resolve: (path)->
    # console.log "LOCO", location.href
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
  get_stack: -> stack
  get_cache: -> cache
  clear_stack: ->
    stack.template   = {}
    stack.collection = {}
    stack.component  = []
    stack.asset      = []

  clear_cache: ->
    cache.template   = {}
    cache.collection = {}
    cache.component  = []
    cache.asset      = []

  @getter 'asset',      -> stack.asset
  @getter 'shadow',     -> new Shadow()
  @getter 'template',   -> stack.template
  @getter 'component',  -> stack.component
  @getter 'collection', -> stack.collection

jom = JOM = new JOM()
