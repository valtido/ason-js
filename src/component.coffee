class Component
  disabled   = false
  regx  = /\${([^\s{}]+)}/
  regxG = /\${([^\s{}]+)}/g

  constructor: (component)->
    throw new Error "jom: component is required" if component is undefined

    $component = $ component
    $component.children().empty();

    template    = $component.attr "template"
    collection = $component.attr "collection"

    throw new Error "jom: component template is required" if not template
    throw new Error "jom: component collection is required" if not collection

    # once it's done and ready it can skip doing anything on the engine
    @skip = false
    @attr       = template: template, collection: collection

    [collection, path] = @attr.collection.split ':'
    @path = path or ""
    @element = $component.get 0

    @element = wrap @element if not @element.createShadowRoot

    @prop = template: template, collection: collection, path : path

    @hide()
    @reset = false
    @ready = false

    @template     = null
    @collection  = null
    @document  = null

    @create_shadow()

    @root = @element.shadowRoot

    @handles = []
    @events  = []
    @scripts = []
    @scripts.status = "init"

    @


  hide : ->
    $root = $ @root
    $root.find("")
  show : ->

  enable  : -> disabled = false
  disable : -> disabled = true
  destroy : ->

  create_shadow : ->
    if @element.shadowRoot is null
      @element.createShadowRoot()
    else
      $(@element.shadowRoot.children).remove()

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



  handlebars: (content, component)->
    if content instanceof ShadowRoot
      content = content.children
    $content = $ content

    c = $content
    .findAll('*')
    .not('script, style, link, [repeat]')
    .filter ->
      $(this).parents('[repeat]').length is 0
    c.each (i, node)=>
      text = $(node).text()

      if $(node).children().length is 0 and regx.test(text) is true
        raw  = text
        key  = text.match(regx)[1]

        path = @collection.join @path, key
        if @collection is undefined
          throw new Error "component: `#{raw}` is wrong, start with collection."

        new_text   = @collection.findByPath $.trim path

        if new_text is undefined
          if jom.env is "production"
            new_text = ""
          else
            throw new Error "Data: not found for `#{raw}` key."
        value = text.replace regx, new_text
        $(node).text value
        handle =
          collection: @collection
          element: node
          value: value
          type: "node"
          path : path
          full : @collection.join @collection.name, path
        @handles.push handle

      for attr, key in node.attributes
        if regx.test attr.name
          throw new Error "component: attr name should not be a handlebar"
          text = attr.name
          raw = text

          # TODO: fix the attributes, and allow multiple access
          try
            key      = text.match(regx)[1]
          catch e
            throw new Error "Component: wrong key on attr name #{text}"

          path = @collection.join @path, key


          if @collection is undefined
            throw new Error "component: `#{raw}` is wrong, start with collection."

          new_text = @collection.findByPath $.trim path

          if new_text is undefined and jom.env is "production"
            new_text = ""

          name = text.replace regx, new_text

          $(node)
          .removeAttr attr.name
          .attr name, attr.value
          new_attr = node.attributes[name]
          attr = new_attr

          handle =
            collection: @collection
            element: node
            attr: new_attr
            value: name
            type: "attr_name"
            path: path
            full: @collection.join @collection.name, path
          @handles.push handle

        if regx.test attr.value
          text = attr.value
          raw = text
          # TODO: fix the attributes, and allow multiple access
          rx = new RegExp regx.toString().slice(1, -1),'gi'
          result = text.match rx
          $(result).each (i, item)=>
            try
              key      = item.match(regx)[1]
            catch e
              throw new Error "Component: wrong key on attr value #{text}"

            path = @collection.join @path, key

            if @collection is undefined
              throw new Error "component: `#{raw}` is wrong, start with collection."


            find_from_collection = @collection.findByPath $.trim path

            if find_from_collection is undefined and jom.env is "production"
              text = text.replace regx, ""
            else
              text = text.replace regx, find_from_collection

          attr.value = text

          handle =
            collection: @collection
            element: node
            attr: attr
            value: text
            type: "attr_value"
            path: path
            full: @collection.join @collection.name, path
          @handles.push handle
      node
    $content

  handle_template_scripts: (content) ->
    escapeRegExp = (str) ->
      str.replace /[-\/\\^$*+?.()|[\]{}]/g, '\\$&'

    scripts = $(content).add(content.children).findAll 'script'

    $(scripts).filter('[src]').each (i, script)->
      script.onload = -> script.has_loaded = true

    $(scripts).not('[src]').eq(0).each (i,script)->
      front = ""
      reg                = new RegExp("^#{escapeRegExp(front)}")
      is_script_prepared = reg.test(script.text)

      # unless is_script_prepared
      script.text = """(function(){
                var
                shadow     = jom.shadow,
                body       = shadow.body,
                host       = shadow.host,
                root       = shadow.root,
                component  = host.component,
                collection = component.collection,
                doc        = component.document
                ;
                component.on('ready', function(){ doc = component.document })

                #{script.text}
                })()"""
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
            event.callback.call handle, event, params
          for handle in @handles
            part = !!~ handle.path.indexOf event.path
            if handle.path and part
              event.callback.call handle, event, params

    return @
  repeat: (element, data = null)->
    data     = [] if data is null
    $element = $ element
    key      = $element.attr 'repeat'
    raw      = key

    throw new Error "component: `repeat` attr missing" if key is undefined
    if key.length
      try
        key    = key.match(regx)[1]
      catch e
        throw new Error "Component: Wrong key `#{key}`"

    repeat = $([])

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
      data = @collection.document

    throw new Error "component: document data not found `#{path}`" if data is undefined

    if path is undefined
      path = ""

    for item, index in data
      clone = $element.clone()
      clone.attr "repeated", true
      clone.attr "repeat", null
      clone.attr 'repeat-index', index
      clone.get(0).style.display = ''
      prefix = @collection.join path, "[#{index}]"

      x = clone[0].outerHTML.replace /(\${)([^\s{}]+)(})/g, "$1#{prefix}.$2$3"
      x = x.replace /(\{repeat\.index})/g, index
      x = x.replace /(\{repeat\.length})/g, data.length

      repeat = repeat.add(x)

    repeat
  collection_changed: ()->
    @attr.collection = $(@element).attr 'collection'
    [collection, path] = @attr.collection.split ':'
    @path = path or ""
    @prop.collection = collection
    @prop.path = path
    col = jom.collections.get collection
    @ready = false
    @reset_collection col

  reset_collection: (collection)->
    if collection instanceof Collection is false
      throw new Error "component: reset expects a collection"
    # reset the collections
    @collection = collection

    @reset = true
