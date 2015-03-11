class Collection
  env = jjv()
  constructor: (name, data=[], schema={})->
    if name is undefined or typeof name isnt "string"
      throw new Error "jom: collection name is required"

    @name   = name
    @data   = []
    @schema = {}
    @attach_schema schema
    @attach_data data

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
  is_valid: ->
    env = jjv()
    length = Object.keys(@schema).length
    return true if length is 0

    # TODO: make further proper checks

    if @schema["$schema"] is undefined
      throw new Error "jom: $schema is missing"
      return false

    env.addSchema @name, @schema
    errors = env.validate @name, @data

    return true if not errors
    console.debug "jom: validation_error ", errors
    return false
