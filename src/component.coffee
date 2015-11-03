document.createElement "component"
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
    @element = wrap @element

    @prop = template: template, collection: collection, path : path

    @create_shadow()
    @root = @element.shadowRoot
    @hide()

    @scripts = []
    @scripts.status = "init"
    @ready = false
    @


  show : ->
    loader = @root.querySelector '.temporary_loader'
    loader?.remove()
    @
  hide : ->
    loader = $('<div class="temporary_loader">Loading...</div>')
    loader = document.createElement 'div'
    icon =  document.createElement 'i'
    text = document.createTextNode "Loading..."
    loader.id = "temporary_loader"
    loader.className = "temporary_loader"
    icon.className = "icon-loader animate-spin"

    loader.style.position            = "absolute"
    loader.style.top                 = 0
    loader.style.left                = 0
    loader.style.bottom              = 0
    loader.style.right               = 0
    loader.style.display             = "block"
    loader.style["text-align"]       = "center"
    loader.style["background-color"] = "#fff"
    loader.style["z-index"]          = "9999"

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
    element = wrap(@element)

    if element.shadowRoot is null
      element.createShadowRoot()

    @element.shadowRoot = element.shadowRoot
    @element = element

    element.shadowRoot

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
          handle = new Handle @, node, text, 'attr_name', attr
          @handles.push handle

        if regx.test attr.value
          text = attr.value
          handle = new Handle @, node, text, 'attr_value', attr
          @handles.push handle
      node
    all

  handle_template_scripts: ->
    escapeRegExp = (str) ->
      str.replace /[-\/\\^$*+?.()|[\]{}]/g, '\\$&'
    scripts = @template.element.querySelectorAll 'script'

    for script in scripts
      script.component = @
      if script.src
        script.onload = -> script.has_loaded = true
      else
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
    @

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
  swapScript : (script) ->
    if script.nodeName.toUpperCase() isnt 'SCRIPT'
      throw new Error('swapScript requires script')
    clone = document.createElement('script')
    clone.appendChild document.createTextNode(script.textContent)
    script.parentNode.insertBefore clone, script
    script.parentNode.removeChild script
    @
  trigger: (type, params = {})->
    types = type.split " "

    for type in types
      for event in @events
        if type is event.type
          if event.path is null
            event.target = @root
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
      if img.getAttribute('src') isnt img.attributes.source.value
        img.setAttribute "src", img.attributes.source.value
  render: ->
    originalHeight = @element.style.height
    originalPosition = @element.style.position
    el = window.getComputedStyle @element, null
    height = el.height
    @element.style.height = height
    @element.style.position = 'relative'
    style = null

    child = @root.firstChild
    while child
      sibling = null

      if child.id isnt "temporary_loader"
        sibling = child.nextSibling
        child.remove()
      child = sibling or child.nextSibling

    template = new Template @template.original
    @define_template template
    @hide()


    @handle_template_scripts()
    clone = @template.element.cloneNode true
    for script in clone.querySelectorAll 'script'
      @swapScript script
    @root.appendChild clone

    @repeat()
    @handlebars()
    @image_source_change()
    @element.style.height = originalHeight
    @element.style.position = originalPosition
    @show()

    debugger
  repeat: ->
    last = null

    for repeater, repeater_key in @root.querySelectorAll '[repeat]'
      key  = repeater.attributes.repeat.value
      raw  = key

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

      nextSibling = repeater.nextSibling
      for item, index in data
        clone = repeater.cloneNode true
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

        repeater.parentNode.insertBefore x, nextSibling
        nextSibling = x.nextSibling

      repeater.remove()




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
