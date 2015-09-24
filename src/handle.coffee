class Handle
  @component = null
  @node      = null
  @full      = null
  @path      = null
  @key       = null
  regx  = /\${([^\s{}]+)}/
  constructor: (@component, @node, @key, @type)->
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
      throw new Error "handle: wrong type given"

    path = @key.match(regx)[1]
    @path = @component.collection.join @component.path, path

    if @node.constructor.name is "Attr"
      @attr = @node
      @node = @node.ownerElement

    @full = "#{@component.collection.name}:#{@path}"
    @value = @component.collection.findByPath @path
    @


  @setter "value", (value)->
    val = @component.collection.findByPath @path

    if val is undefined
      value = ""
    else
      sType = @component.collection.schema.findByPath @path
      sType = sType?.type or undefined
      if sType isnt undefined
        sType = sType.charAt(0).toUpperCase() + sType.slice 1

      type = sType or val.constructor.name
      value = (new window[type](value)).valueOf();


    switch @type
      when 'node'
        @node.textContent = value
      when 'attr_value'
        @attr.value = value
        @node.value = value

    @component.collection.changeByPath @path, value
    value
  @getter "value", ->
    value = @component.collection.findByPath @path

    if value is undefined
      schema = @component.collection.schema.findByPath @path
      default_value = schema.default if schema isnt undefined
      if default_value isnt undefined
        value = default_value
    value
  @getter "collection", ->
    @component.collection
