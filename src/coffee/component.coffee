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

    @template_url    = el.attr 'template'
    path             = el.attr 'collection'
    throw new Error "jom: template is required" if @template_url is undefined
    throw new Error "jom: collection is required" if path is undefined
    split            = path.split(':')
    @collection_name = split[0]
    @collection_path = split.slice(1).join(':')
    return @
  ready: (callback)->
    setTimeout =>
      template   = jom.templates.find_by_url(@template_url)
      collection = jom.collections.model(@collection_name)
      @data      = collection.findByPath @collection_path

      unless template and collection.data?.length > 0 and @element
        @ready.call @, callback
      else
        @template = template.cloneNode(true)
        body      = document.createElement('div')
        body.setAttribute 'body',""
        children = @template.content.children
        $(children).appendTo body
        @template.content.appendChild body
        @collection = collection

        @transform()

        @element.template   = @template
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
      path = get_key_only raw_text

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

        if jom?.env is "production" then return ""
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
    string    += ""
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
