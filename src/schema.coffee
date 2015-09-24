class Schema
  constructor: (name, obj, description = null)->

    @name = name
    throw new Error "Schema: name is not defined" if !@name or @name is "null"

    @description = description
    @tree  = obj
    @errors = []
    @is_valid()

    @

  findByPath : (path)->

    regx   = /(\[)(\d+)(\])/g
    text   = path.replace regx, ".$2"
                .replace /^\.*/,""
    text = text.replace /^\d+\.{1}/, ""
    split  = text.split "."
    result = @tree.properties

    for item in split
      return result if result is undefined
      if item.type is "array"
        result = item.items.properties[item]
      else if item.type is "object"
        result = item.properties[item]
      else
        result = result[item]

    result
  is_valid : ->
    validator = isMyJsonValid
    errors = []
    core = jom.schemas_core
    # we need core first please
    if core is undefined
      @errors.push 'There was a problem with'
      return false

    schemaValidator = validator core, verbose: true
    schemaValidator @tree

    if errors.length or schemaValidator.errors
      console?.error? 'schema: ', @name, schemaValidator.errors

    if schemaValidator.errors && schemaValidator.errors.length
      @errors = schemaValidator.errors
      return false
    else
      return true
    return false
