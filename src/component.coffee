class Component
  disabled   = false
  regx  = /\${([^\s{}]+)}/
  regxG = /\${([^\s{}]+)}/g

  constructor: (component)->
    throw new Error "jom: component is required" if component is undefined

    $component = $ component
    $component.get(0).component = true

    template   = $component.attr "template"
    collection = $component.attr "collection"
    path       = $component.attr "path"
    throw new Error "jom: component template is required" if not template
    throw new Error "jom: component collection is required" if not collection

    @attr    = template: template, collection: collection

    @element = $component.get 0

    @element = wrap @element if not @element.createShadowRoot

    @hide()
    @ready = false

    @template   = null
    @collection = null
    @path       = path || "[0]"
    @data = []

    @create_shadow()

    @root = @element.shadowRoot
    @template_ready   = false
    @collection_ready = false

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

  create_shadow : -> @element.createShadowRoot()

  define_template : (template)->
    if not template or template instanceof Template is false
      throw new Error "jom: template cant be added"

    @template = template

  define_collection : (collection)->
    if not collection or collection instanceof Collection is false
      throw new Error "jom: collection cant be added"

    @collection = collection
    # TODO: improve to findByPath as path could be different
    @data  = @collection.findByPath @path
    @collection

  watcher: (changes, collection)->
    if collection.name is @collection.name
      for key, change of changes
        if change.path.slice(0, @path.length) is @path
          $(@handles).each (i, handle)=>
            if handle.handle.path is change.path
              $(handle).trigger('change', change)
              partial = change.path.replace(@path,"").replace(/^\./,"")
              for event in @events
                if event.type is "change:before" and event.path is partial
                  event.callback.call @

              switch handle.handle.type
                when "attr_name"
                  $(handle).attr handle.handle.attr.name, ""
                when "attr_value"
                  $(handle).attr handle.handle.attr.name, change.value
                when "node"
                  $(handle).text change.value
                else
                  throw new Error "jom: unexpected handle type"

              for event in @events
                if event.type is "change" and event.path is partial
                  event.callback.call @
  handlebars: (content, component)->
    collection = component.collection
    $content = $ content
    # console.log content

    c = $content
    .findAll('*')
    .not('script, style, link, [repeat]')
    .filter ->
      $(this).parents('[repeat]').length is 0
    c.each (i, node)=>
      text = $(node).text()

      if $(node).children().length is 0 and regx.test(text) is true
        key      = text.match(regx)[1]
        path     = collection.join @path, key
        new_text = collection.findByPath $.trim path

        if new_text is undefined and jom.env is "production"
          new_text = ""
        $(node).text text.replace regx, new_text
        node.handle =
          type: "node"
          path : path
          full : collection.join collection.name, path
        @handles.push node

      for attr, key in node.attributes
        if regx.test attr.name
          text = attr.name
          # TODO: fix the attributes, and allow multiple access
          try
            key      = text.match(regx)[1]
          catch e
            throw new Error "Component: wrong key on attr name #{text}"

          path     = collection.join @path, key
          new_text = collection.findByPath $.trim path

          if new_text is undefined and jom.env is "production"
            new_text = ""

          name = text.replace regx, new_text
          $(node)
          .removeAttr attr.name
          .attr name, attr.value

          node.handle =
            attr: attr
            type: "attr_name"
            path: path
            full: collection.join collection.name, path
          @handles.push node

        if regx.test attr.value
          text = attr.value

          # TODO: fix the attributes, and allow multiple access
          try
            key      = text.match(regx)[1]
          catch e
            throw new Error "Component: wrong key on attr value #{text}"

          path     = collection.join @path, key
          new_text = collection.findByPath $.trim path

          if new_text is undefined and jom.env is "production"
            new_text = ""

          attr.value = text.replace regx, new_text

          node.handle =
            attr: attr
            type: "attr_value"
            path: path
            full: collection.join collection.name, path
          @handles.push node
      node
    $content

  handle_template_scripts: (content) ->
    @scripts.status = "waiting"
    escapeRegExp = (str) ->
      str.replace /[-\/\\^$*+?.()|[\]{}]/g, '\\$&'

    scripts = $(content).find 'script'

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
                data       = component.collection.findByPath(component.path)
                ;

                #{script.text}
                })()"""
      return script

  on: (type, path, callback)->
    types = type.split " "

    for type in types
      event =
        type    : type
        path    : path
        callback: callback
      @events.push event
    return @

  trigger: (type, params = {})->
    types = type.split " "

    for type in types
      for event in @events
        if type is event.type
          for handle in @handles
            if handle.handle.path.indexOf(event.path) isnt -1
              event.callback.call handle, event, params
    return @
  repeat: (element, data = null)->
    data     = @data if data is null
    $element = $ element
    key      = $element.attr 'repeat'
    throw new Error "component: items attr missing" if key is undefined
    try
      key    = key.match(regx)[1]
    catch e
      throw new Error "Component: Wrong key `#{key}`"
    repeat = $([])
    path   = @collection.join @path, key
    data   = @collection.findByPath path
    throw new Error "component: data not found `#{path}`" if data is undefined
    for item, index in data
      clone = $element.clone()
      clone.attr "repeated", true
      clone.attr "repeat", null
      clone.attr 'repeat-index', index
      prefix = @collection.join key, "[#{index}]"
      x = clone[0].outerHTML.replace /(\${)([^\s{}]+)(})/g, "$1#{prefix}.$2$3"
      x = x.replace /(\{repeat\.index})/g, index
      x = x.replace /(\{repeat\.length})/g, data.length
      repeat = repeat.add(x)
    repeat
