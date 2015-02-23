Function::getter = (prop, get) ->
  Object.defineProperty @prototype, prop, {
    get, configurable: yes,enumerable: false
  }

Function::setter = (prop, set) ->
  Object.defineProperty @prototype, prop, {
    set, configurable: yes, enumerable: false
  }

Function::property = (prop, desc) ->
  Object.defineProperty @prototype, prop, desc

unless $.fn.findAll?
  $.fn.findAll = (selector) ->
    return this.find(selector).add(this.filter(selector))
unless $.fn.value?
  $.fn.value = (val, text=false)->
    console.log "go back to value change how it works"
    # debugger
    if val
      $(this).data('value',arguments[0])
      if text is true
        txt = $.trim val
        $(this).text txt
      $(this).trigger 'jom.change'
      return $(this)

    return $(this).data 'value'

asset_stack = []
AssetManager = ->
  running = false
  context = document.head

  update_status = (element, message) ->
    el  = $ element
    if el.length
      asset_element = $(element).prop 'asset'
      el = el.add asset_element if asset_element
      el.attr 'status', message
  load = ->
    update_status this, "loaded"
  error = ->
    update_status this, "failed"
    source = $($(this).prop('asset')).attr 'source'
    throw new Error "Asset: Failed to load `#{source}`"
  process = ->
    return false if running is true
    running = true
    _html    = []
    _js      = []
    _css     = []
    _json    = []
    _schema  = []
    # before
    while asset_stack.length
      item = asset_stack[0]
      asset = item.asset
      switch item.type
        when "text/template"
          result = template item, asset
          _html.push asset: asset, element : result
        when "text/collection", "application/collection"
          result = collection item, asset
          _json.push asset: asset, element : result
        when "text/json", "application/json"
          result = json item, asset
          _json.push asset: asset, element : result
        when "text/html"
          result = html item, asset
          _html.push asset: asset, element : result
        when "text/javascript"
          result = js item, asset
          _js.push asset: asset, element : result
        when "text/stylesheet", "text/css"
          result = css item, asset
          _css.push asset: asset, element : result
        else
          throw new Error "Asset: failed to queue"
      $(result).prop 'asset', asset
      update_status item, 'init'
      result.onload = load
      result.onerror = error
      asset_stack.shift()
    include _css
    include _html
    include _js
    include _json
    # after
    unless context.onAssetLoad is undefined
      context.onAssetLoad.apply(context,[])
    ready()
    running = false
  ready = ->
    if (window.ason and window.ason.app is undefined) or document.body is null
      setTimeout ->
        ready()
      , 50
      return false
    $ 'body'
    .trigger 'assets_ready'

  image = (item, asset)->
    image = document.createElement "img"
    image.setAttribute 'src', source
    image
  html = (item, asset)->
    # link(rel="import" href="template.html")
    link = document.createElement "link"
    link.setAttribute 'href', item.source
    link.setAttribute 'rel', "import"
    link.setAttribute 'type', (item.type or 'text/javascript')
    link
  template = (item, asset)->
    name = $(asset).attr 'name'
    unless name
      throw new Error "Asset: template `name` attr required `#{item.source}`"
    # link(rel="import" href="template.html")
    link = document.createElement "link"
    link.setAttribute 'href', item.source
    link.setAttribute 'rel', "import"
    link.setAttribute 'type', (item.type or 'text/javascript')
    link
  json = (item, asset)->
    data = []
    collection = $(asset).attr "collection"

    unless collection && collection.length
      throw new Error "Asset: Collection ID is required"
    # script(src="example.js" type="text/javascript")
    script = document.createElement "script"

    xhr = $.getJSON item.source
    xhr.done (response)->
      unless response instanceof Array
        console?.warn? "Asset: `%o` should be an Array", response
      text = JSON.stringify response
      script.innerText = script.textContent = text
      script.json = response
    xhr.fail error

    script.setAttribute 'origin', item.source # only for reference
    script.setAttribute 'type', 'text/json'
    script
  collection = (item, asset)->
    data = []
    collection = $(asset).attr "name"

    unless collection && collection.length
      throw new Error "Asset: Collection `name` attr is required"
    # script(src="example.js" type="text/javascript")
    script = document.createElement "script"
    if item.source
      xhr = $.getJSON item.source
      xhr.done (response)->
        unless response instanceof Array
          console?.warn? "Asset: `%o` should be an Array", response
        text = JSON.stringify response
        script.innerText = script.textContent = text
        script.collection =
          name: collection
          data: response

      xhr.fail error
    else
      text = $(asset).text()
      script.innerText = script.textContent = text
      script.collection = response
    # only for reference, include origin
    script.setAttribute 'origin', item.source if item.source
    script.setAttribute 'type', 'text/collection'
    script.setAttribute 'name', collection
    script
  js = (item, asset)->
    # script(src="example.js" type="text/javascript")
    script = document.createElement "script"
    script.setAttribute 'src', item.source
    script.setAttribute 'type', (item.type or 'text/javascript')
    script
  css = (item, asset)->
    # link(href="template.html" type="text/css")
    style = document.createElement "link"
    style.setAttribute 'href', item.source
    style.setAttribute 'rel', 'stylesheet'
    style.setAttribute 'type', (item.type or 'text/css')
    style

  include = (result) ->
    for item in result
      target = item.asset.root or document.head
      target.appendChild item.element
  $('link[rel="asset"]').not('[status]').each (i, asset)->
    $asset = $(asset)
    type   = $asset.attr 'type'
    source = $asset.attr 'source'
    asset_stack.push
      source : source
      type   : type
      asset  : asset
  process()
  @
AssetManager()
$ ->
  AssetManager()

class Shadow
  constructor : ->
    @root = document.currentScript?.parentNode ||
            arguments.callee.caller.caller.arguments[0].target
    @traverseAncestry()
    @root
  traverseAncestry : ->
    if @root.parentNode
      @root = @root.parentNode
      @traverseAncestry()


  @property  "body", get : ->
    return $(@root).children().filter('[body]').get 0
  @property  "host",    get : -> @root.host



Object.defineProperty window, "Root",
  get: -> new Shadow()

class Collection
  changeStack = []
  saveStack = []
  autoSaveValue: false
  doSave = ->
    for item in changeStack
      # todo: proper ajax
      $.ajax
      .done (response)->
        item.call item, "success"
      .fail ->
        item.call item, "error"
  constructor: (@element, options = {})->
    $el = $ @element
    @el = $el.get 0

    @autoSave = options.autoSave if options.autoSave
    @name = $el.attr "name"
    @data = []
  ready: (callback)->
    setTimeout =>
      collection = @el.collection
      unless collection and collection.name and collection.data
        @ready.call @, callback
      else
        @data = @el.collection.data
        # todo: schema
        @schema = {}
        callback.apply @, [@data, @name, changeStack, @autoSave, @doSave]
    , 100

  @getter 'length', (value)   -> @data.length
  @getter 'autoSave', (value) -> @autoSaveValue
  @setter 'autoSave', (value) ->
    if typeof value isnt "boolean"
      throw new Error "Collection: autoSave should be a `boolean` value"
    if value is true
      @save()
  find: (where = {}, callback)->
    result = _.where @data, where
    err = false
    callback.call @, err, result if callback
    return result
  findByPath: (path, data)->
    jom.collections.findByPath path, @data
  on: (type, path, callback)->
    switch type
      when "change"
        @change.call @, callback
      when "save"
        @save.call @, callback
      else
        throw new Error "Collection: Event not found `#{type}`"
    @

  change: (callback)-> changeStack.push callback
  save: (callback)->
    saveStack.push callback
    throw new Error "should save now!!!!"

class Collections
  stack = {}
  @getter 'collections', ->
    Object.keys stack

  element_to_collection= (all_plain_elements)->
    all_plain_elements.each (i,n)->
      n.collection = true
      collection = new Collection n
      collection.ready (data, name, changeStack, autoSave, doSave)->
        stack[name] = collection

  constructor: ->
    all = $ 'script[type="text/collection"]'

    plain = all.filter    -> not ("collection" of @)
    existing = all.filter -> ("collection" of @)

    element_to_collection.call @, plain if plain.length > 0

  list: -> stack
  model : (collection, data = [], options={}) ->
    if arguments.length is 0
      return stack
    if arguments.length is 1
      if stack[collection]
        return stack[collection]
      else
        return new Collection()
    return stack

  findByPath : -> @byPath.apply @, arguments
  byPath : (path, data) ->
    regx   = /(\[)(\d+)(\])/g
    text   = path.replace regx, ".$2"
                .replace /^\.*/,""
    split  = text.split "."
    if data then result = data
    else result = stack
    for item in split
      return result if result is undefined
      result = result[item]

    result

class Component
  regx = "\\${([^{}]+)}"
  test = (str)-> (new RegExp regx, "g").test str
  replacer = ->
  get_key_only = (str)->
    r = str.match (new RegExp(regx))
    return r[0].slice 2, -1

  constructor: (@element)->
    @elements = {}
    unless @element
      return @
    @element["component"] = @
    el = $ element
    num = el.length

    throw new Error "Component: `length` is > 1" if num > 1

    @template_url = el.attr 'template'
    path = el.attr 'collection'
    split = path.split(':')
    @collection_name = split[0]
    @collection_path = split.slice(1).join(':')
    return @
  ready: (callback)->
    setTimeout =>
      template   = jom.templates.find_by_url(@template_url)
      collection = jom.collections.model(@collection_name)
      @data = collection.findByPath @collection_path

      unless template and collection.data?.length > 0 and @element
        @ready.call @, callback
      else
        @template = template.cloneNode(true)
        body = document.createElement('div')
        body.setAttribute 'body',""
        children = @template.content.children
        $(children).appendTo body
        @template.content.appendChild body
        @collection = collection

        @transform()

        @element.template = @template
        @element.collection = @collection

        callback.apply @, [@element]
    , 100
  transform: ->
    # create a shadow for component
    @shadow   = @element.createShadowRoot()
    # clone    = template.content.cloneNode(true)
    @handle_template_scripts()

    content    = document.importNode @template.content, true
    @shadow.appendChild content
    @content = @shadow.querySelector('[body]')
    @data_transform()

  handle_template_scripts: ->
    escapeRegExp = (str) ->
      str.replace /[-\/\\^$*+?.()|[\]{}]/g, '\\$&'

    scripts = @template.content.querySelectorAll('script')
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
                     data       = component.data
                    ]
                  )"""
      return script

  bind: (type, element, path)->
    @elements[path] = [] if @elements[path] is undefined
    switch type
      when "node"
        obj =
          type     : type
          element  : element
          callback : (value)->
            h = $(element).text value
            .trigger "change.text", value
            .parents("[body]").get(0)
            .parentNode.host
            $(h).trigger "change", value
      when "attribute", "attr"
        attribute = arguments[3]
        obj =
          type      : type
          element   : element
          attribute : attribute
          callback  : (value) ->
            h = $(element).attr attribute, value
            .trigger "change.attr.#{attribute}", value
            .parents("[body]").get(0)
            .parentNode.host
            $(h).trigger "change", value
      else
        throw new Error "Component: Data not bound"

    @elements[path].push obj

  bind_attribute : (attr, element)->
    if test attr.value
      txt  = attr.value.replace new RegExp(regx, "gmi"), replacer
      path = get_key_only attr.value
      $(element).attr attr.name, txt
      @bind "attr", element, path, attr.name

  bind_node : (element)->
    $el      = $ element
    raw_text = $el.text()
    if test raw_text
      txt  = raw_text.replace new RegExp(regx,"gmi"), replacer
      path  = get_key_only raw_text

      $el.text txt
      @bind "node", element, path

  data_transform: ->
    element = []
    content = $(@content)
    self    = @

    replacer = (match)=>
      key              = get_key_only match
      element.jsonpath = "#{@collection_name}.#{key}"
      path             = "#{@collection_path}.#{key}"
      # todo: fix the data points `[0]` below
      value = jom.collections.findByPath path, @collection.data

      if value isnt undefined
        return value
      else
        args = ["Component: no data found. `%s` in %o",match, element]
        console?.warn?.apply console, args

        if ason?.env is "production" then return ""
        return match

    nodes = content
            .findAll('*').not('script, style')
            .each ->
              if $(this).children().length is 0 and test $(this).text()
                self.bind_node @

              for attr, key in @attributes
                if test attr.value
                  self.bind_attribute attr, this


    Observe @data, (changes)=>
      path = ""

      for key, change of changes
        path =  change.path
        @elements[path].forEach (item, index) ->
          item.callback change.value

  occurrences = (string, subString, allowOverlapping = true) ->
    string += ""
    subString += ""
    return string.length + 1  if subString.length <= 0
    n    = 0
    pos  = 0
    step = (if (allowOverlapping) then (1) else (subString.length))
    loop
      pos = string.indexOf(subString, pos)
      if pos >= 0
        n++
        pos += step
      else
        break
    n

class Components
  stack = []
  element_to_component= (all_plain_elements)->
    all_plain_elements.each (i,n)->
      component = new Component n
      component.ready (element)->
        stack.push element
  constructor: ->
    all = $ 'component'

    plain = all.filter    -> not ("component" of @)
    existing = all.filter -> ("component" of @)

    element_to_component.call @, plain if plain.length > 0

  list: -> stack

  find_by_name: (name)->
    stack[name]

# Observe collection, (changes) =>
#   for key, change of changes
#     change.name

class Observe
  constructor: (root, callback, curr=null, path = null)->
    curr = curr or root
    throw new Error "Observe: Object missing." if not root
    if typeof callback isnt "function"
      throw new Error "Observe: Callback should be a function."
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
            value : change.object[change.index] or
                    change.object[change.name] or
                    change.object
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

class Template
  constructor: (@link)->
    @el = $ link
    num = @el.length

    throw new Error "Component: `length` is > 1" if num > 1

  ready: (callback)->
    setTimeout =>
      @template = $ 'template', @link.import
      unless @template.length isnt 0
        @ready.call @, callback
      else
        @link["template"] = @template
        @url = @el.attr 'href'
        @element = @template.get(0)
        @element.url = @url if @element
        callback.apply @, [@template.get(0)]
    , 100
class Templates
  stack = []
  element_to_template = (all_plain_elements) ->
    all_plain_elements.each (i, n)->
      n.template = true
      template = new Template n
      template.ready (element)->
        stack.push element
  constructor: ->
    all = $ 'link[rel="import"]'

    all.each (i,n) -> #remove duplicate templates# as precaucion
      href = $(n).attr('href')
      length = $("link[rel='import'][href='#{href}']").length
      if length > 1
        $(n).remove()

    plain = all.filter    -> not ("template" of @)
    existing = all.filter -> ("template" of @)

    element_to_template.call @, plain if plain.length > 0

  list: -> stack
  find_by_url: (url)->
    for item in stack
      return item if item.url is url and url isnt undefined

class JOM
  stack =
    templates : []
    components : []
    collections : []
  constructor: ->
    window["jom"] = @
    # @templates
    @tasks()
    @
  tasks: ->
    setTimeout =>
      stack.templates = new Templates()
      stack.collections = new Collections()
      stack.components = new Components()
      @tasks()
    , 1000
  @getter 'assets', ->
    links = $ 'link[rel="asset"]'
    all = links.filter(-> $(@).data('finalized') isnt true ).each (i, asset)->
      asset
    js_content   = ["text/javascript"]
    json_content = ["text/json","application/json"]
    css_content  = ["text/css"]
    html_content = ["text/html"]

    assets      = {}
    assets.all  = all
    assets.js   = all.filter(-> $(@).attr('type') in js_content)
    assets.css  = all.filter(-> $(@).attr('type') in css_content)
    assets.json = all.filter(-> $(@).attr('type') in json_content)
    assets.html = all.filter(-> $(@).attr('type') in html_content)
    assets


  @getter 'shadow',     -> new Shadow()
  @getter 'templates',  -> stack.templates
  @getter 'collections',-> stack.collections
  @getter 'components', -> stack.components
  @getter 'components_old', ->
    result = []
    new Components()

    $ 'component'
    .each (i,component)->
      result.push component

    return result

jom = JOM = new JOM()
