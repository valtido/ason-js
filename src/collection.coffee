# Base class for collections, Collection's behaviour is
# controlled by JOM and only keeps record of itself

class Collection
  # @property [String] Name of the collection from name attr
  @name = ""
  # @property [Array] An array of data for the collection
  @data = []
  # @property [Object] a JSON Schema object describing data
  @schema = {}
  # @property [Object] reported JSON Schema errors when validated is triggered
  @errors = null
  # @property [Boolean] indicates whether the collection observes changes
  @observing = false

  env = jjv()

  # Constructs a new collection
  # @param [String] name name of collection
  # @option data [Array] data data to attach to collection
  # @option schema [Object] schema JSON Schema to attach to collection
  constructor: (name, data=[], schema={})->
    if name is undefined or not name or typeof name isnt "string"
      throw new Error "jom: collection name is required"

    @name   = name
    @data   = []
    @schema = {}
    @attach_schema schema
    @attach_data data
    @errors = null
    @observing = false

  # Attaches data to the collection instance
  # @param [Array, Object] data data to attach
  # @option data [Array] data if array, push each element
  # @option data [Object] data if object, push the object
  attach_data: (data = [])->
    length = data.length || Object.keys(data).length
    if length
      if Array.isArray data
        for item in data
          @data.push item
      else
        @data.push data
    @data

  # Attaches a JSON Schema to the collection instance
  # @note see json-schema.org for JSON Schema
  # @param [Object] schema JSON Schema Object to attach to collection
  attach_schema: (schema = {})->
    @schema = schema

  # returns errors to a string format if any
  # @return [String] A string of errors, using `JSON.stringify`
  errors_to_string: -> JSON.stringify @errors

  # check to see if the schema is valid
  # @note if no schema provided, it will return true
  # @note it uses jjv to do the Schema validation
  # @note jjv see https://github.com/acornejo/jjv
  # @return [Boolean] returns true or false if the schema is valid
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

  # stiches two or more paths together
  # @example Stich two paths
  #   var c = new Collection("my_coll").stich("path","name"); // "path.name"
  # @example Stich three paths
  #   var c = new Collection("my_coll").stich("path","name","[0]"); // "path.name[0]"
  # @param [String] a first string to stich
  # @param [String] b second string to stich
  # @return [String] A string of a JSON PATH
  stich : (a, b) ->
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


  # Does a deep search and returns the object if found or else `undefined`
  # @param [String] path a JSON path to search for
  # @example Find name of a person
  #   new Collection("person",{name: "valtid"}).findByPath("[0].name");//"valtid"
  # @return [mixed] returns different types of `undefined` if nothing found
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
