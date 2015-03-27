class Collection
  env = jjv()
  constructor: (name, data=[], schema={})->
    if name is undefined or not name or typeof name isnt "string"
      throw new Error "jom: collection name is required"

    @name   = name
    @data   = []
    @schema = {}
    @attach_schema schema
    @attach_data data
    @errors = null

  attach_data: (data = [])->
    length = data.length || Object.keys(data).length
    if length
      if Array.isArray data
        for item in data
          @data.push item
      else
        @data.push data
    @data

  attach_schema: (schema = {})->
    @schema = schema

  errors_to_string: -> JSON.stringify @errors

  is_valid: ->
    env = jjv()
    length = Object.keys(@schema).length
    return true if length is 0

    # TODO: make further proper checks

    if @schema["$schema"] is undefined
      throw new Error "jom: $schema is missing"

    env.addSchema @name, @schema
    @errors = env.validate @name, @data

    return true if not @errors

    return false

  stich : (a,b ) ->
    stich = @stich
    b      = "#{b}"
    first  = b[0]
    result = if first is "[" then a + b else "#{a}.#{b}"

    if arguments.length > 2
      args = Array.prototype.splice.call arguments, 2
      arr = []

      arr.push result
      arr.push.apply arr, args

      result = @stich.apply @, arr


    return result

  findByPath : (path) ->
    regx   = /(\[)(\d+)(\])/g
    text   = path.replace regx, ".$2"
                .replace /^\.*/,""
    split  = text.split "."
    result = @data

    for item in split
      return result if result is undefined
      result = result[item]

    result
