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

    @create_shadow()

    @root = @element.shadowRoot
    @template_ready   = false
    @collection_ready = false

    @handles = []


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



  handlebars: (content, collection)->
    $content = $ content
    # console.log content
    nodes = $content
            .findAll('*').not('script, style, link')
            .each (i, node)=>
              text = $(node).text()

              if $(node).children().length is 0 and regx.test(text) is true
                key      = text.match(regx)[1]
                path     = collection.stich @path, key
                new_text = collection.findByPath $.trim path

                if new_text is undefined and jom.env is "production"
                  new_text = ""
                $(node).text text.replace regx, new_text
                @handles.push node
                node.handle =
                  type: "node"
                  path : path
                  full : collection.stich collection.name, path

              for attr, key in node.attributes
                if regx.test attr.value
                  # TODO: fix the attributes, and allow multiple access
                  text     = attr.value
                  key      =text.match(regx)[1]
                  path     = collection.stich @path, key
                  new_text = collection.findByPath $.trim path

                  if new_text is undefined and jom.env is "production"
                    new_text = ""

                  attr.value = text.replace regx, new_text
                  @handles.push node
                  node.handle =
                    attr: attr
                    type: "attr"
                    path: path
                    full: collection.stich collection.name, path
              node
    $content
  handle_template_scripts: (content) ->
    escapeRegExp = (str) ->
      str.replace /[-\/\\^$*+?.()|[\]{}]/g, '\\$&'

    scripts = $(content).find 'script'

    $(scripts).not('[src]').eq(0).each (i,script)->
      front = "(function(shadow,body, host, root, component, collection, data){"
      reg                = new RegExp("^#{escapeRegExp(front)}")
      is_script_prepared = reg.test(script.text)

      # unless is_script_prepared
      script.text = """#{front}
                #{script.text}
                }).apply(
                  (shadow = jom.shadow) && shadow.body,
                  [
                   shadow     = shadow,
                   body       = shadow.body,
                   host       = shadow.host,
                   root       = shadow.root,
                   component  = host.component,
                   collection = component.collection,
                   data       = component.collection.findByPath(component.path)
                  ]
                )"""
      return script
