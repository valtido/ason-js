class App
  component_handler = ->
    $('component').each (i, element)->
      new Component element
      this

  collection_handler = (app, collections) ->
    unless Collection isnt undefined
      setTimeout @collection_handler, 50
      return false

    for name, collection of collections
      app.collections = new Collection ("#{name}").toLowerCase(), collection
  constructor: (app) ->
    throw new Error "App: app `#{app}` not found" unless app
    throw new Error "App: ns `#{app}` not found" unless app.ns
    @ns    = app.ns
    @title = app.title or @ns
    @description = app.description or ""

    # prepare collections
    collection_handler @, app.collections
    component_handler @
    app

$ ->
  apps = ason.app or []
  apps = [apps] if apps.constructor.name.toLowerCase() is "object"
  for app in apps
    new App app

  apps

ason = {} unless ason isnt undefined
Function::getter = (prop, get) ->
  Object.defineProperty @prototype, prop, {get, configurable: yes}

Function::setter = (prop, set) ->
  Object.defineProperty @prototype, prop, {set, configurable: yes}

Function::property = (prop, desc) ->
  Object.defineProperty @prototype, prop, desc

# configure enviroment if not defined...
ason.env = "dev" unless ason.env

class Ason
  constructor: ()->
    @app = {}
    @root = undefined

  app_loader: ->
    for app, key in $ 'app','body'
      get_key = $ app
        .attr 'key'
      @app[get_key] = new App app

new Ason()

ason = {} unless ason isnt undefined
stack = []

class Asset
  constructor: (@src, @type, asset)->
    throw new Error "Asset: src `#{@src}` is missing." unless @src
    throw new Error "Asset: type `#{@type}` is missing." unless @type

    stack.push
      src : src
      type: type
      asset: asset
    # man.add src, type
load = ->
  console.log "load"
  debugger
running = false
AssetManager = ->
  context = arguments[0] or document.head
  @process = ->
    return false if running is true
    running = true
    html    = []
    js      = []
    css     = []
    # before
    while stack.length
      item = stack[0]
      item.load = false
      switch item.type
        when "text/html"
          html.push asset: item.asset, element : @html item.src, item.type
        when "text/javascript"
          js.push asset: item.asset, element : @js item.src, item.type
        when "text/stylesheet", "text/css"
          css.push asset: item.asset, element : @css item.src, item.type
        else
          throw new Error "Asset: failed to queue"
      stack.shift()
    @include css
    @include html
    @include js
    # after
    unless context.onAssetLoad is undefined
      context.onAssetLoad.apply(context,[])
    running = false
  @queue = ->
    stack
  @html = (src, type)->
    # link(rel="import" href="template.html")
    link = document.createElement "link"
    link.setAttribute 'href', src
    link.setAttribute 'rel', "import"
    link.setAttribute 'type', (type or 'text/javascript')
    link
  @js = (src, type)->

    script = document.createElement "script"
    script.setAttribute 'src', src
    # script.onload = load
    script.setAttribute 'type', (type or 'text/javascript')
    script
  @css = (src, type)->
    style = document.createElement "link"
    style.setAttribute 'href', src
    style.setAttribute 'rel', 'stylesheet'
    style.setAttribute 'type', (type or 'text/css')
    style
  @include = (result) ->
    for item in result
      target = item.asset.root or document.head
      target.appendChild item.element
  $('link[rel="asset"]',arguments[0]).not('[loaded]').each (i, asset)->
    $asset = $(asset)
    type    = $asset.attr 'type'
    src     = $asset.attr 'source'
    $asset.attr "loaded", 'true'
    new Asset src, type, asset
  @process()
  @

new AssetManager()

# @author Valtid Caushi
#
class Collection
  ###
    Collection class
  ###
  constructor: (@name, data)->
    ###
    => means expect data to be
    if typeof @data is "String", => ajax url
    if typeof @data is "Object", => an Object
    ###
    throw new Error "Collection: app name not found." unless @name
    throw new Error "Collection: data not found." unless data

    @Schema = {}
    @Lang = {}
    @Data = {}


    result = []
    type = data.constructor.name
    console?.info? "Collection: loading %c `%s`", "color: blue", data
    switch type
      when "Array"
        item = @srcArray name, data
      when "String"
        #simple is URL check
        unless /[\s]/.test data
          item = @srcURL name, data
        else
          item = @srcString name, data
        result.push item
      else
        throw new Error "Collection: unexpect type `#{type}`"
    result
  srcString: (@name, @src) ->
    throw new Error "Collection: ARGGGGGG, how do I treat this?"
  srcURL: (@name, @src) ->
    ###
    - @name name of the collection
    - @src the source of the file
    ###

    JOM.Collection[name] = {}
    Object.defineProperty(JOM.Collection[name],'ready',{value: false})
    $.getJSON src
    .done (response)=>
      JOM.Collection[name] = response
      JOM.Collection[name].ready = true
      console?.info? "Collection: success %c `%s` \u2713", "color: green", src
      @observe(JOM.Collection[name])
    .fail ->
      throw new Error "Collection: Failed to load external data `#{src}` \u2718"
    .always ->
      console?.info? "Collection: finished `#{src}`"
  srcArray: (@name, @src=null)->
    console?.info? "Collection: success %c `%o`", "color: green", src
    JOM.Collection[name] = src
    JOM.Collection[name].ready = true
    console?.info? "Collection: finished `#{src}`"

  observe: (collection)->
    Observe collection, (changes) =>
      console?.info? "Col: changes..., %o", changes
      for key, change of changes
        change.name = @name
        console?.info? "Col: change..."

        element = $(shadow.document).find("[path='#{shadow.ns}#{change.path}']")
        # automatically change the text
        jom = element.get(0).jom
        element.text change.value if jom?.text? is true

        # automatically change the attributes
        if jom?.attrs?
          for key, attr of jom.attrs
            console.log key
            element.attr key, change.value

        $(element).trigger 'jom.change', change
        $(shadow.host).trigger 'change', change
        @
  val: (what, value=undefined)->
    @[what] = value unless value is undefined
    @[what]

class Component
  constructor: (selector) ->
    throw new Error "Component: reqires JOM." unless JOM
    component        = $ selector
    @$element        = component
    @element         = component.get 0
    @ns              = component.attr 'ns'
    @collection      = {}
    @collection_attr = component.attr('collection') || @ns
    @template_attr   = component.attr('template') || @ns

    throw new Error "Component: `ns` attr is required." unless @ns
    throw new Error "Component: `template` not found" unless JOM.Template[@ns]

    # set attributes
    component.attr
      'collection' : @collection_attr
      'template'   : @template_attr

    console?info? "Component: template set up"
    # check if component has already been set up before
    @template = JOM.Template[@ns]
    # @template_loader() unless JOM.Template[@ns]
    # @template = JOM.Template[@ns] if JOM.Template[@ns]
    console?info? "Component: loading collections"
    @collection_loader()


    JOM.Component[@ns] = @
    @
  collection_loader : ()->
    times = 0
    wait = =>
      setTimeout( =>
        throw new Error "Component: collection timeout" if times > 15
        if JOM.Collection[@ns]?.ready isnt true
          wait()
          times++
        else
          done()
          console?.info? "Component: collection promise done"
      , 500)

    done = =>
      @collection = JOM.val @collection_attr
      throw new Error "Component: no data found" unless @collection
      @create_shadow()
    wait()

  create_shadow: ->
    # create a shadow for component
    @shadow   = @element.createShadowRoot()
    # clone    = template.content.cloneNode(true)
    clone    = document.importNode @template.content, true
    @shadow.appendChild clone

    @doc = $(@shadow.children).findAll('[body]').get 0
    $(@shadow.children).findAll('link[rel="asset"]').each (i,asset)=>
      asset.root = @shadow
    @data_transform()
    new AssetManager(@doc)

  data_transform : ->
    # text handlers example: ${name.first}
    regx = "\\?\$\{(?:\w|\[|\]|\.|\"|\'|\n|)*\}"

    get_key_only = (str)->
      return str.slice 2, -1
    replacer = (match)=>
      key   = get_key_only match
      value = JOM.val "#{@collection_attr}.#{key}"
      if value isnt undefined
        return value
      else
        console?.warn? "Com: no data found. `%s` in %o",match, element.get 0
        if ason.env is "production" then return ""
        return match

    all_text   = $(@doc).find('*').filter( -> return new RegExp(regx,"g").test $(this).text() )
    nodes_only = all_text.filter(-> return $(this).children().length==0 )

    # text nodes
    text = nodes_only.each( (i, el)=>
      $el = $ el
      raw_text = $el.text()
      if new RegExp(regx,"g").test raw_text
        txt = raw_text.replace new RegExp(regx,"g"), replacer

        path        = @collection_attr
        jom         = el.jom or {}
        jom['text'] =
          path   : path
          value  : txt
          element: el

        el.jom = jom
        prop = JOM.val path, $(el).value()
        $el
        .text txt
    )

    # attributes handler// select all elements first
    all = $(@doc).findAll('*').each (i,el)=>
      $el = $ el
      attrs = el.attributes

      if attrs.length
        for attr, i in attrs
          name = attr.name
          value = attr.value
            .replace regx, replacer
          if regx.test attr.value
            jom  = el.jom || {attrs:{}}
            path = @collection_attr
            jom.attrs[name] =
              name    : name
              value   : value
              path    : path
              element : el

            JOM.val path, value

            # Object.defineProperty
            $el
            .attr name, value
            el.jom = jom
    @doc

###
# Json Object Model

 required: Schema Tree && Machine Data && ~Human Data (~ optional)
 @tree is schema, describes how data should be structured (hierarchically)
 @human are data to display to user,
   e.g: a list of data from a drop down.
   animal = ['dog','cat','horse','mouse']
 @machine are data, which machine can manipulate
   this usually indicates the current state of type of pets of a user
   animal = ['cat']

the above would yield a dropdown: (jade style, convert to html if you wish)
Jade Lang: convert to HTML using:  http://html2jade.org/

```
select
  option(value="dog")
  option(value="cat" selected="selected")
  option(value="horse")
  option(value="mouse")
```
###

# the component `<select>` should know how to handle machine, and human data
# and make logical decisions to display and indicate to user which `options`
# are available, and those which are already selected.

class JOM
  constructor: ()->
    # @Data       = {}
    # @Schema     = {}
    @Collection = {}
    @Component  = {}
    @Template  = {}

    return @

  val: (path, value)->
    collection = window.JOM.Collection
    get_jom_path     = Prop path, @Collection
    is_path_defined  = get_jom_path isnt undefined
    is_value_defined = value isnt undefined
    throw new Error "JOM: `#{path}` is `#{get_jom_path}` in JOM.Collection" unless path and is_path_defined
    Prop path, collection unless is_value_defined

    #all good now, do change collection values, from path
    Prop path, collection, value

JOM = new JOM()

class Observe
  constructor: (root, callback, curr=null, path = null)->
    curr = curr or root
    throw new Error "Observe: Object missing." if not root
    throw new Error "Observe: Callback should be a function." if typeof callback isnt "function"
    type_of_curr = curr.constructor.name
    if type_of_curr is "Array"
      base = path
      for item, key in curr
        if typeof item is "object"
          new_path = "#{base or ''}[#{key}]"
          new Observe root, callback, item, new_path
          new_path = ""

    if type_of_curr is "Object"
      base = path
      for key, item of curr
        # if item.constructor.name is "Object"
        if typeof item is "object"
          new_path = "#{base}.#{key}" if base
          new_path = "#{key}" unless base
          new Observe root, callback, item, new_path
          new_path = ""


    if curr.constructor.name is "Array"
      base = path
      Array.observe curr, (changes) ->
        result = {}
        original = {}

        changes.forEach (change,i) ->
          index_or_name = if change.index>-1 then change.index else change.name
          new_path = "#{base or ''}[#{index_or_name}]"
          # console.log change
          part =
            path: new_path
            value : change.object[change.index] or change.object[change.name] or change.object
            # json : JSON.stringify(change.object)
          # if change.type is "add" and typeof part.value is "object"

          is_add = change.addedCount > 0 or change.type is "add"
          if typeof part.value is "object" and is_add
            new Observe root, callback, part.value, part.path
            new_path = ""
          result[i] = part
          original[i] = change
        callback result, original
    else if curr.constructor.name is "Object"
      base = path
      Object.observe curr, (changes)->
        result = {}
        original = {}

        changes.forEach (change,i) ->
          new_path = "#{base}.#{change.name}" if base
          new_path = "#{change.name}" unless base

          part =
            path: new_path
            value : change.object[change.name]

          is_add = change.type is "add" or change.addedCount > 0
          if typeof part.value is "object" and is_add
            new Observe root, callback, part.value, part.path
            new_path = ""
          result[i] = part
          original[i] = change
        callback result, original

# Credit to: # https://github.com/chaijs/pathval/blob/master/index.js
(->
  Prop = (path, obj, value = null)->
      return set path, obj, value if value
      return get path, obj unless value
  set = (path, obj, val) ->
    parsed = parse(path)
    setPathValue parsed, val, obj
    val
  get = (path, obj)->
    parsed = parse(path)
    getPathValue parsed, obj
  parse = (path) ->
    str = "#{path}".replace /\[/g, '.['
    parts = str.match /(\\\.|[^.]+?)+/g
    re = /\[(\d+)\]$/
    ret = []
    mArr = null

    for part, i in parts
      mArr = re.exec part
      s = if mArr then { i: parseFloat(mArr[1]) } else { p: part }
      ret.push s

    ret

  getPathValue = (parsed, obj) ->
    tmp = obj
    res = undefined
    i = 0
    l = parsed.length

    while i < l
      part = parsed[i]
      if tmp
        if defined(part.p)
          tmp = tmp[part.p]
        else tmp = tmp[part.i]  if defined(part.i)
        res = tmp  if i is (l - 1)
      else
        res = undefined
      i++
    res

  setPathValue = (parsed, val, obj) ->
    tmp = obj
    i = 0
    l = parsed.length
    part = undefined
    while i < l
      part = parsed[i]
      if defined(tmp) and i is (l - 1)
        x = (if defined(part.p) then part.p else part.i)
        tmp[x] = val
      else if defined(tmp)
        if defined(part.p) and tmp[part.p]
          tmp = tmp[part.p]
        else if defined(part.i) and tmp[part.i]
          tmp = tmp[part.i]
        else
          next = parsed[i + 1]
          x = (if defined(part.p) then part.p else part.i)
          y = (if defined(next.p) then {} else [])
          tmp[x] = y
          tmp = tmp[x]
      else
        if i is (l - 1)
          tmp = val
        else if defined(part.p)
          tmp = {}
        else tmp = []  if defined(part.i)
      i++
    tmp
  defined = (val) ->
    not (not val and "undefined" is typeof val)
  window['Prop'] = Prop
)(this)

class Shadow
  constructor : ->
    @root = document.currentScript?.parentNode ||
            arguments.callee.caller.caller.arguments[0].target
    @traverseAncestry()
    @ns       = $(@host).attr('ns')
    @root
  traverseAncestry : ->
    if @root.parentNode
      @root = @root.parentNode
      @traverseAncestry()


  @property  "body", get : ->
    doc = $(@root).children().filter('[body]')
    unless doc?.length
      doc = $(@root).children().wrapAll('<div body />').parent().get 0
    doc.get 0
  @property  "host",    get : -> @root.host
  @property  "instances", get : ->
    @elements = $(document).find("component[ns='#{@ns}']")
    @shadows = for element, i in @elements
      element.shadowRoot
    @contents = for shadowRoot, i of @shadows
      shadowRoot.childNodes or shadowRoot.children
    return @elements



Object.defineProperty window, "Root",
  get: -> new Shadow()

class Template extends JOM
  constructor: (selector)->
    console?.info? "templates:"
    @$element = $ selector
    @element = @$element.get 0

    switch @$element.length
      when 0
        @load()
      when 1
        true
      else
        # anything else

    throw new Error "Template: `ns` attr is required." unless @ns
    @

  load: ->
    importers  = $ "link[rel=import]"
    importers.each (i, importer) =>
      $template  = $ 'template', importer.import
      throw new Error "Template: template not found" if $template is undefined
      @template = $template.get 0
      @ns = $template.attr 'ns'

      throw new Error "Template: `ns` attr is required." unless @ns

      # import template once
      @handle_template_scripts()
      clone             = document.importNode @template.content, true
      JOM.Template[@ns] = @template

      console?.info? "templates: loading %c `%s`", "color: blue", @ns

      @template

  handle_template_scripts: ->
    escapeRegExp = (str) ->
      str.replace /[-\/\\^$*+?.()|[\]{}]/g, '\\$&'

    scripts = @template.content.querySelectorAll('script')
    $(scripts).not('[src]').each (i,script)->
      front              = "(function (shadow, body, host, root, document){"
      reg                = new RegExp("^#{escapeRegExp(front)}")
      is_script_prepared = reg.test(script.text.trim())

      # unless is_script_prepared
      script.text = """#{front}
                  #{script.text}
                  }).apply(
                    (shadow = Root) && shadow.body,
                    [shadow = Root,
                     shadow.body,
                     shadow.host,
                     shadow.root,
                     shadow.root]
                  )"""
      return script

new Template "template"

$ ->
  $('link[rel=import]').each (i,link)->
    template = link.import.querySelector("template")
    ns = $(template).attr 'ns'
    $(link).attr("template", ns ) if template isnt null

console.log 'Express will go here.'


pkg = require('../package.json')
