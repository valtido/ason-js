class Collection
  changeStack = []
  saveStack = []
  autoSaveValue: false
  doSave = ->
    for item in changeStack
      # todo: proper ajax
      $.ajax
      .done (response)->
        item.call item, "success"
      .fail ->
        item.call item, "error"
  constructor: (@name, @data=[], options = {})->
    @autoSave = options.autoSave  if options.autoSave
    @name = name
    @data = data
    # todo: schema
    @schema = {}
    Observe @data, (changes)->
      for item in changeStack
        item.call item, changes
      if @autoSave is true
        doSave()
    , null, name
    @

  @getter 'length', (value) ->
    @data.length
  @getter 'autoSave', (value) ->
    @autoSaveValue
  @setter 'autoSave', (value) ->
    if typeof value isnt "boolean"
      throw new Error "Collection: autoSave should be a `boolean` value"
    if value is true
      @save()
  find: (where, callback)->
    result = _.where @data, where
    err = false
    callback.call @, err, result if callback
    return result
  findByPath: (path)->

  change: (callback)->
    changeStack.push callback
  save: (callback)->
    saveStack.push callback
    throw new Error "should save now!!!!"
class Collections
  stack = {}
  @getter 'collections', ->
    Object.keys stack
  insert = (collection, data, options={}) ->
    result = new Collection collection, data, options
    stack[collection] = result
  constructor: ->
    @collections
  model : (collection, data = [], options={}) ->
    if arguments.length is 0
      return stack
    if arguments.length is 1
      return stack[collection]
    if arguments.length is 2
      if _.isArray(data) is true
        return stack[collection] = insert collection, data, options
    return stack

  byPath : (path) ->
    regx   = /(\[)(\d+)(\])/g
    text   = path.replace regx, ".$2"
    split  = text.split "."
    result = @
    for item in split
      result = result[item] or undefined
    result
