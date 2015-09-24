class Component
  disabled   = false
  regx  = /\${([^\s{}]+)}/
  regxG = /\${([^\s{}]+)}/g

  @element = null
  @attr = {}
  @prop = {}
  @ready = false

  @collection = null
  @template = null
  @document  = null
  @handles = []
  @events  = []
  @scripts = []
  @root = null
  @path = null
  @active = false

  constructor: (component)->
    @uid = jom.guid
    @element = null
    @attr = {}
    @prop = {}
    @ready = false

    @collection = null
    @template = null
    @document  = null
    @handles = []
    @events  = []
    @scripts = []
    @root = null
    @path = null
    @active = false
    throw new Error "jom: component is required" if component is undefined

    $component = $ component
    $component.children().empty();

    template    = $component.attr "template"
    collection = $component.attr "collection"

    throw new Error "jom: component template is required" if not template
    throw new Error "jom: component collection is required" if not collection

    # once it's done and ready it can skip doing anything on the engine

    @attr       = template: template, collection: collection

    [collection, path] = @attr.collection.split ':'
    @path = path or ""
    @element = $component.get 0

    @element = wrap @element if not @element.createShadowRoot

    @prop = template: template, collection: collection, path : path


    @create_shadow()
    @root = @element.shadowRoot
    @hide()


    repeaters = @root.querySelectorAll '[repeat]'

    @scripts = []
    @scripts.status = "init"
    @ready = false
    @


  show : ->
    loader = @root.querySelector '.temporary_loader'
    loader?.remove()
  hide : ->
    loader = $('<div class="temporary_loader">Loading...</div>')
    loader = document.createElement 'div'
    icon =  document.createElement 'i'
    text = document.createTextNode "Loading..."
    loader.className = "temporary_loader"
    icon.className = "icon-loader animate-spin"

    loader.style.position           = "absolute"
    loader.style.top                = 0
    loader.style.left               = 0
    loader.style.bottom             = 0
    loader.style.right              = 0
    loader.style.display            = "block"
    loader.style["text-align"]       = "center"
    loader.style["background-color"] = "#fff"

    loader.appendChild icon
    loader.appendChild text

    icon.style.top= "50%"
    icon.style.position = 'absolute'

    @root.querySelector('.temporary_loader')?.remove()

    @root.appendChild loader

  enable  : -> @active = false
  disable : -> @active = true
  destroy : ->

  create_shadow : ->
    if @element.shadowRoot is null
      @element.createShadowRoot()
    else
      children = @element.shadowRoot.childNodes
      children[0].remove() while children.length if children.length

    @element.shadowRoot

  define_template : (template)->
    if not template or template instanceof Template is false
      throw new Error "jom: template cant be added"

    @template = template

  define_collection : (collection)->
    if not collection or collection instanceof Collection is false
      throw new Error "jom: collection cant be added"

    @collection = collection

    # TODO: improve to findByPath as path could be different
    # @data  = @collection.findByPath @path
    @collection



  handlebars: ->
    list = ['script', 'link', 'style']
    all = @root.querySelectorAll '*'

    for node, i in all
      name = node.nodeName.toLowerCase()
      continue if name in list
      text = node.textContent

      if node.children.length is 0 and regx.test(text) is true
        handle = new Handle @, node, text, 'node'
        @handles.push handle

      for attr, key in node.attributes
        if regx.test attr.name
          throw new Error "component: attr name should not be a handlebar"
          text = attr.value
          handle = new Handle @, attr, text, 'attr_name'
          @handles.push handle

        if regx.test attr.value
          text = attr.value
          handle = new Handle @, attr, text, 'attr_value'
          @handles.push handle
      node
    all

  handle_template_scripts: (content) ->
    escapeRegExp = (str) ->
      str.replace /[-\/\\^$*+?.()|[\]{}]/g, '\\$&'

    scripts = $(content).add(content.children).findAll 'script'

    $(scripts).filter('[src]').each (i, script)->
      script.onload = -> script.has_loaded = true

    $(scripts).not('[src]').eq(0).each (i,script)=>
      front = ""
      reg                = new RegExp("^#{escapeRegExp(front)}")
      is_script_prepared = reg.test(script.text)

      # unless is_script_prepared
      script.text = """ /* template: #{@template.name} */
      var shadow = jom.shadow;
      new (function(){
                var
                body       = shadow.body,
                host       = shadow.host,
                root       = shadow.root,
                component  = host.component;

                #{script.text}

                })(shadow.host)"""
      return script

  on: (type, path, callback)->
    types = type.split " "
    if arguments.length is 2
      callback = path
      path     = null

    for type in types
      event          = {}
      event.type     = type
      event.callback = callback
      event.path     = path
      @events.push event
    return @

  trigger: (type, params = {})->
    types = type.split " "

    for type in types
      for event in @events
        if type is event.type
          if event.path is null
            event.callback.call handle, event, params, @
          for handle in @handles
            part = !!~ handle.path.indexOf event.path
            if handle.path and part
              event.target = handle.node
              event.callback.call handle, event, params, @

    return @

  image_source_change : ->
    imgs = @root.querySelectorAll '[body] img'
    for img, key in imgs
      img.setAttribute "src", img.attributes.source.value

  repeat: ->
    last = null

    for repeater, repeater_key in @template.repeaters
      key  = repeater.node.attributes.repeat.value
      raw  = key
      repeats = @root.querySelectorAll '[repeated]'
      for item, repeats_key in repeats
        if item.repeatGUID is repeater.node.guid
            repeater.parent.replaceChild repeater.node, item
            removeable = item
            while removeable.nextSibling
              if removeable.repeatGUID isnt undefined and removeable.repeatGUID is repeater.node.guid
                removeable = removeable.nextSibling
                removeable.remove()

      throw new Error "component: `repeat` attr missing" if key is undefined
      if key.length
        try
          key    = key.match(regx)[1]
        catch e
          throw new Error "Component: Wrong key `#{key}`"

      path = key

      if @collection is undefined
        throw new Error "component: `#{raw}` is wrong, start with collection."

      if path isnt undefined and path.length
        if @path
          data = @collection.findByPath @collection.join @path, path
        else
          data = @collection.findByPath path
      else if @path.length > 0
        data = @collection.findByPath @path
      else
        data = @document || []

      throw new Error "component: document data not found `#{path}`" if data is undefined

      if path is undefined
        path = ""

      repeated = document.createDocumentFragment()

      for item, index in data
        clone = repeater.node.cloneNode true
        clone.setAttribute "repeated", "true"
        clone.setAttribute 'repeat-index', index
        clone.removeAttribute "repeat"
        clone.style.display = ''
        prefix = @collection.join path, "[#{index}]"

        x = clone.outerHTML.replace /(\${)([^\s{}]+)(})/g, "$1#{prefix}.$2$3"
        x = x.replace /(\{repeat\.index})/g, index
        x = x.replace /(\{repeat\.length})/g, data.length
        y = document.createElement 'div'
        y.innerHTML = x
        x = y.childNodes[0]
        x.repeatGUID = repeater.node.guid

        repeated.appendChild x

      repeater.parent.replaceChild repeated, repeater.node




    @
  collection_changed: ()->
    @attr.collection = $(@element).attr 'collection'
    [collection, path] = @attr.collection.split ':'
    @path = path or ""
    @prop.collection = collection
    @prop.path = path
    col = jom.collections.get collection
    @handles = []
    if col instanceof Collection is false
      throw new Error "component: reset expects a collection"
    @document = col.findByPath(@path) or col.document
    # reset the collections
    @collection = col
