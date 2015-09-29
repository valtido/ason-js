
# Base class for collections, Collection's behaviour is
# controlled by JOM and only keeps record of itself

class Collection
  # @property [String] Name of the collection from name attr
  @name : ""
  # @property [Array] An array of document for the collection
  @document : []
  # @property [Object] a JSON Schema object describing document
  @schema : {}
  # @property [Object] reported JSON Schema errors when validated is triggered
  @errors : []
  # @property [Boolean] indicates whether the collection observes changes
  @observing : false

  # Constructs a new collection
  # @param [String] name name of collection
  # @option document [Array] document document to attach to collection
  # @option schema [Object] schema JSON Schema to attach to collection
  # @note see json-schema.org for JSON Schema
  constructor: (name, document=[], schema)->
    if name is undefined or not name or typeof name isnt "string" or name is "null"
      throw new Error "jom: collection name is required"
    @ready = false
    @name   = name
    @errors = []
    @document   = []
    @schema = {}
    @attach_schema schema
    @attach_document document

    @observing = false

  meta : ->
    return {id: jom.uuid}
  # Attaches document to the collection instance
  # @param [Array, Object] document document to attach
  # @option document [Array] document if array, push each element
  # @option document [Object] document if object, push the object
  add : (obj)->
    is_valid = @is_valid obj
    if is_valid
      if obj.meta is undefined
        Object.defineProperty obj, "meta",
          enumerable: false
          writable: false
          value: @meta()
      @document.push obj
    else
      @errors.push "Cannot add the document, is not valid. #{obj.toString()}"

    @is_valid()

    obj

  del : (id = null)->
    index = null
    for doc, i in @document
      if doc.meta.id is id
        index = i
    if index isnt null
      @document.splice index, 1

    @is_valid()

  add_part : (newObj, path)->
    if path is undefined or not path
      throw new Error "Collection: path is required"
    obj = @findByPath path
    if obj.meta is undefined
      Object.defineProperty newObj, "meta",
        enumerable: false
        writable: false
        value: @meta()
    obj.push newObj
    @is_valid()
    obj

  attach_document: (document = [])->
    length = document.length || Object.keys(document).length
    if length
      if Array.isArray document
        for item in document
          @add item
      else
        @add document

    @is_valid()
    @document

  # Attaches a JSON Schema to the collection instance
  # @note see json-schema.org for JSON Schema
  # @param [Object] schema JSON Schema Object to attach to collection
  attach_schema: (schema)->
    if schema isnt undefined and schema['$schema'] is undefined
      schema['$schema'] = 'http://json-schema.org/draft-04/schema#'
    @schema = schema
    @is_valid()
    @schema

  # returns errors to a string format if any
  # @return [String] A string of errors, using `JSON.stringify`
  errors_to_string: -> JSON.stringify @errors

  # check to see if the schema is valid
  # @note if no schema provided, it will return true
  # @note it uses jjv to do the Schema validation
  # @note jjv see https://github.com/acornejo/jjv
  # @return [Boolean] returns true or false if the schema is valid
  schema_valid: -> @schema.is_valid()

  is_valid: (doc = null)->
    validator = isMyJsonValid
    @errors = []

    if @schema is undefined
      return false

    documentValidator = validator @schema.tree, verbose: true

    if doc isnt null
      documentValidator doc
      if documentValidator.errors and documentValidator.errors.length
        @errors = documentValidator.errors
    else
      for doc in @document
        documentValidator doc
        if documentValidator.errors and documentValidator.errors.length
          @errors.push documentValidator.errors

    if @errors.length
      console?.error? "Collection: ", @name, @errors

    if @errors.length
      return false
    else
      return true

    return true if @schema is undefined

    if document isnt null and document.toString() isnt "[object Object]"
      @errors.push "collection: document is wrong"
      return false

    # TODO: make further proper checks

    if @schema["$schema"] is undefined
      throw new Error "jom: $schema is missing"

    env.addSchema @name, @schema
    document = document or @document
    @errors = env.validate @name, document

    return true if not @errors

    return false

  # joines two or more paths together
  # @example join two paths
  #   var c = new Collection("my_coll").join("path","name"); // "path.name"
  # @example join three paths
  #   var c = new Collection("my_coll").join("path","name","[0]"); // "path.name[0]"
  # @param [String] a first string to join
  # @param [String] b second string to join
  # @return [String] A string of a JSON PATH
  join : (a, b) ->
    join = @join
    if b.length is 0 and a.length is 0
      return ""
    if not b and a
      return a
    b      = "#{b}"
    first  = b[0]
    result = if first is "[" then a + b else "#{a}.#{b}"

    if arguments.length > 2
      args = Array.prototype.splice.call arguments, 2
      arr = []

      arr.push result
      arr.push.apply arr, args

      result = @join.apply @, arr


    return result


  # Does a deep search and returns the object if found or else `undefined`
  # @param [String] path a JSON path to search for
  # @example Find name of a person
  #  new Collection("person",{name: "valtid"}).findByPath("[0].name");//"valtid"
  # @return [mixed] returns different types of `undefined` if nothing found
  findByPath : (path) ->
    regx   = /(\[)(\d+)(\])/g
    text   = path.replace regx, ".$2"
                .replace /^\.*/,""
    split  = text.split "."
    result = @document

    for item in split
      return result if result is undefined
      result = result[item]

    result

  changeByPath : (path, value) ->
    regx   = /(\[)(\d+)(\])/g
    text   = path.replace regx, ".$2"
                .replace /^\.*/,""
    split  = text.split "."
    result = @document

    for item, key in split
      return result if result is undefined
      if key is (split.length-1)
        result[item] = value
        @is_valid()
        result = result[item]
      else
        result = result[item]

    result

  empty: ->
    @document = []
