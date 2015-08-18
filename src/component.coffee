class Component
  disabled   = false
  regx  = /\${([^\s{}]+)}/
  regxG = /\${([^\s{}]+)}/g

  constructor: (component)->
    throw new Error "jom: component is required" if component is undefined

    $component = $ component
    $component.get(0).component = true

    template    = $component.attr "template"
    collections = $component.attr "collections"
    path        = $component.attr "path"
    throw new Error "jom: component template is required" if not template
    throw new Error "jom: component collections is required" if not collections

    # once it's done and ready it can skip doing anything on the engine
    @skip = false
    @attr       = template: template, collections: collections
    collections = collections.split /\s*,\s*/g
    @collections_list = collections

    @element = $component.get 0

    @element = wrap @element if not @element.createShadowRoot

    @hide()
    @ready = false

    @template     = null
    @collections  = []
    # FIXME remove path from component
    @path         = path || "[0]"

    @create_shadow()

    @root = @element.shadowRoot

    @handles = []
    @events  = []
    @scripts = []
    @scripts.status = "init"

    @init =
      template  : false
      collections: false

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

    @collections.push collection

    # TODO: improve to findByPath as path could be different
    # @data  = @collection.findByPath @path
    @collections

  watcher: (changes, collection)->
    throw new Error "what watcher!!!"
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
    if content instanceof ShadowRoot
      content = content.children
    collections = component.collections
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

        [collection, path] = key.split ':'
        collection = collections[collection]
        if collection is undefined
          throw new Error "component: `#{raw}` is wrong, start with collection."

        new_text   = collection.findByPath $.trim path

        if new_text is undefined
          if jom.env is "production"
            console.info new_text
            new_text = ""
          else
            throw new Error "Data: not found for `#{raw}` key."

        $(node).text text.replace regx, new_text
        node.handle =
          type: "node"
          path : path
          full : collection.join collection.name, path
        @handles.push node

      for attr, key in node.attributes
        if regx.test attr.name
          text = attr.name
          raw = text

          # TODO: fix the attributes, and allow multiple access
          try
            key      = text.match(regx)[1]
          catch e
            throw new Error "Component: wrong key on attr name #{text}"

          [collection, path] = key.split ':'

          collection = collections[collection]

          if collection is undefined
            throw new Error "component: `#{raw}` is wrong, start with collection."

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
          raw = text
          # TODO: fix the attributes, and allow multiple access
          rx = new RegExp regx.toString().slice(1, -1),'gi'
          result = text.match rx
          $(result).each (i, item)->
            try
              key      = item.match(regx)[1]
            catch e
              throw new Error "Component: wrong key on attr value #{text}"

            [collection, path] = key.split ':'

            if collection is undefined
              throw new Error "component: `#{raw}` is wrong, start with collection."

            collection = collections[collection]

            find_from_collection = collection.findByPath $.trim path

            if find_from_collection is undefined and jom.env is "production"
              text = text.replace regx, ""
            else
              text = text.replace regx, find_from_collection

          attr.value = text

          node.handle =
            attr: attr
            type: "attr_value"
            path: path
            full: collection.join collection.name, path
          @handles.push node
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
                shadow      = jom.shadow,
                body        = shadow.body,
                host        = shadow.host,
                root        = shadow.root,
                component   = host.component,
                collections = component.collections
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
    data     = [] if data is null
    $element = $ element
    key      = $element.attr 'repeat'
    raw      = key

    throw new Error "component: `repeat` attr missing" if key is undefined

    try
      key    = key.match(regx)[1]
    catch e
      throw new Error "Component: Wrong key `#{key}`"

    repeat = $([])

    [collection,path] = key.split ":"

    if collection is undefined
      throw new Error "component: `#{raw}` is wrong, start with collection."

    if path isnt undefined and path.length
      data = @collections[collection].findByPath path
    else
      data = @collections[collection].data

    throw new Error "component: data not found `#{path}`" if data is undefined

    if path is undefined
      path = ""

    for item, index in data
      clone = $element.clone()
      clone.attr "repeated", true
      clone.attr "repeat", null
      clone.attr 'repeat-index', index
      clone.get(0).style.display = ''
      prefix = @collections[collection].join path, "[#{index}]"
      prefix = "#{collection}:#{prefix}"

      x = clone[0].outerHTML.replace /(\${)([^\s{}]+)(})/g, "$1#{prefix}.$2$3"
      x = x.replace /(\{repeat\.index})/g, index
      x = x.replace /(\{repeat\.length})/g, data.length

      repeat = repeat.add(x)

    repeat

  reset_collection: (collections)->
    list = []
    comma = ""

    if collections instanceof Array is false
      throw new Error "component: reset expects an array"

    for collection in collections
      if collection instanceof Collection is false
        throw new Error "component: reset expects a collection"
      list.push collection.name
    # reset the collections
    @collections = collections
    @collections_list = list

    comma = list.join(',')
    $(@element).attr 'collections', comma
    # jom init is false, triggers rebuild
    delete @element.jinit
    debugger
