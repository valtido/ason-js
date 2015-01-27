class Component
  constructor: (@element)->
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
      front              = "(function (shadow, body, host, root, collection){"
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
                     collection = host.component.collection
                     data       = host.component.data
                    ]
                  )"""
      return script

  data_transform: ->
    # text handlers example: ${name.first}
    # regx = '\\?\$\{(?:\w|\[|\]|\.|\"|\'|\n|)*\}'
    regx = '\\$\\{(?:\\w|\\[|\\]|\\.|\\"|\\\'|\\n)*\}'
    test = (str)-> (new RegExp regx).test str
    element = []

    get_key_only = (str)->
      return str.slice 2, -1

    replacer = (match)=>
      key   = get_key_only match
      element.jsonpath = "#{@collection_name}.#{key}"
      path = "#{@collection_path}.#{key}"
      # todo: fix the data points `[0]` below
      value = jom.collections.findByPath path, @collection.data

      if value isnt undefined
        return value
      else
        args = ["Component: no data found. `%s` in %o",match, element.get 0]
        console?.warn?.apply console, args

        if ason && ason.env is "production" then return ""
        return match

    all_text   = $(@content).findAll('*').filter ->
      return test $(this).text()

    nodes_only = all_text.filter(-> return $(this).children().length==0 )

    text = nodes_only.each( (i, el)->
      element = el
      $el = $ el
      raw_text = $el.text()
      if test raw_text
        txt = raw_text.replace new RegExp(regx,"g"), replacer
        $el.text txt
    )
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
