class Schema
  constructor: (name, obj, description = null)->

    @name = name
    throw new Error "Schema: name is not defined" if !@name

    @description = description
    @tree  = obj
    @errors = []
    @is_valid()

    @

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
