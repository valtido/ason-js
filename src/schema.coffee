class Schema
  constructor: (name, obj, description = null)->

    @name = name
    throw new Error "Schema: name is not defined" if !@name

    @description = description
    @tree  = obj
