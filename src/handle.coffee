class Handle
  @component = null
  @node      = null
  @full      = null
  @path      = null
  @key       = null
  regx  = /\${([^\s{}]+)}/

  constructor: (@component, @node, @key, @type, @attr)->
    allowed_types = ['node','attr_value', 'attr_name']

    if @component instanceof Component is false
      throw new Error "handle: needs a component"
    if not @node
      throw new Error "handle: needs a node"
    if not @key
      throw new Error "handle: needs a key"
    if not @type
      throw new Error "handle: type should be one of `#{allowed_types.toString()}`"

    if @type not in allowed_types
      throw new Error "handle: wrong node type given"

    @observing = false
    path = @key.match(regx)[1]
    @path = @component.collection.join @component.path, path

    @attr = @attr
    @node = @node

    @full   = "#{@component.collection.name}:#{@path}"
    @schema = @component.collection.schema

    @prop = @schema.findByPath @path
    value = @component.collection.findByPath @path
    if @prop is undefined
      @prop = type : null
      type = value.constructor.name
      @prop.type = type

    @default  = @prop.default

    dataType = @prop.type
    @dataType = dataType.charAt(0).toUpperCase() + dataType.slice 1
    throw new Error "handle: cannot find dataType of `#{@path}`" if @dataType is undefined

    @ready = false
    @value = value
    @dom = @value
    @ready = true
    @node.handle = @
    @

  stringify: (value)->
    toString = String value

    switch toString
      when 'null', 'undefined'
        toString = ""
    toString
  sync: ->
    # return true
    if @dom isnt @stringify @value
      value = @dom
      switch @dataType
        when 'Boolean'
          value = String(value).toLowerCase() is "true"
        when 'Number'
          value = Number value
      @value = value

  @setter "value", (value)->
    if @ready is true then @component.collection.changeByPath @path, value
    @dom = value

    value
  @getter "value", ->
    value = @component.collection.findByPath @path
    value = @default if value is undefined
    value
  @setter "dom", (value)->
    value = @stringify value
    switch @type
      when 'node'
        @node.textContent = value
      when 'attr_value'
        @attr.value = value
        @node.value = value if @node.value isnt undefined and @node.formTarget isnt undefined
        # @attr[@attr.name] ?= value
    @stringify value
  @getter "dom", ->
    switch @type
      when 'node'
        value = @node.textContent
      when 'attr_value'
        value = @node.getAttribute @attr.name
        value = @node.value if @node.value isnt undefined and @node.formTarget isnt undefined

    value = @default if value is undefined
    value

  @getter "collection", ->
    @component.collection
