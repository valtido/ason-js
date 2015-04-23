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
  trigger: (changes, collection)->
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
                when "attr"
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

    $content
    .findAll('*')
    .not('script, style, link, [repeat]')
    .filter ->
      $(this).parents('[repeat]').length is 0
    .each (i, node)=>
      text = $(node).text()

      if $(node).children().length is 0 and regx.test(text) is true
        key      = text.match(regx)[1]
        path     = collection.join @path, key
        new_text = collection.findByPath $.trim path

        if new_text is undefined and jom.env is "production"
          new_text = ""
        $(node).text text.replace regx, new_text
        @handles.push node
        node.handle =
          type: "node"
          path : path
          full : collection.join collection.name, path

      for attr, key in node.attributes
        if regx.test attr.value
          # TODO: fix the attributes, and allow multiple access
          text     = attr.value
          key      =text.match(regx)[1]
          path     = collection.join @path, key
          new_text = collection.findByPath $.trim path

          if new_text is undefined and jom.env is "production"
            new_text = ""

          attr.value = text.replace regx, new_text
          @handles.push node
          node.handle =
            attr: attr
            type: "attr"
            path: path
            full: collection.join collection.name, path
      node
    $content
  handle_template_scripts: (content) ->
    escapeRegExp = (str) ->
      str.replace /[-\/\\^$*+?.()|[\]{}]/g, '\\$&'

    scripts = $(content).find 'script'

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
    event =
      type    : type
      path    : path
      callback: callback
    @events.push event

    return @


  repeat: (element, data = null)->
    data     = @data if data is null
    $element = $ element
    key      = $element.attr 'repeat'
    throw new Error "component: items attr missing" if key is undefined
    key    = key.match(regx)[1]
    repeat = $('<div repeated="true" />')
    path   = @collection.join @path, key
    data   = @collection.findByPath path

    for item, index in data
      clone = $element.clone()
      clone.attr "repeated", true
      clone.attr "repeat", null
      clone.attr 'repeat-index', index
      prefix = @collection.join key, "[#{index}]"
      x = clone[0].outerHTML.replace /(\${)([^\s{}]+)(})/g, "$1#{prefix}.$2$3"
      repeat.append x
    repeat
