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

class Component
  constructor: ->
    all = $ 'component'
    all.each (i,n)=>
      @prepare(n)
  prepare: (element) ->
    el = $ element

  @getter 'list', ->
    $ 'component'

class JOM
  collections = new Collections()
  components = new Component()
  constructor: ->
    @templates
    @
  tasks: ->
    setTimeout =>
      @templates
      @tasks()
    , 10
  @getter 'assets', ->
    links = $ 'link[rel="asset"]'
    all = links.filter(-> $(@).data('finalized') isnt true ).each (i, asset)->
      asset
    js_content   = ["text/javascript"]
    json_content = ["text/json","application/json"]
    css_content  = ["text/css"]
    html_content = ["text/html"]

    assets      = {}
    assets.all  = all
    assets.js   = all.filter(-> $(@).attr('type') in js_content)
    assets.css  = all.filter(-> $(@).attr('type') in css_content)
    assets.json = all.filter(-> $(@).attr('type') in json_content)
    assets.html = all.filter(-> $(@).attr('type') in html_content)
    assets
  @getter 'templates', ->
    importers = $ "link[rel=import]"
    templates = $ "template"
    importers.each (i, importer)->
      template = $ 'template', importer.import
      template = template.filter(->$(@).prop('filtered') isnt true)
      template.prop 'filtered', true
      templates = templates.add template if template.length

    templates.filter(-> $(@).prop('finalized') isnt true ).each (i, template)->
      $(template).prop 'finalized', true
    templates.prependTo document.head
  @getter 'collections', ->
    collections


  @getter 'components', ->
    components


jom = JOM = new JOM()

# Observe collection, (changes) =>
#   for key, change of changes
#     change.name

class Observe
  constructor: (root, callback, curr=null, path = null)->
    curr = curr or root
    throw new Error "Observe: Object missing." if not root
    if typeof callback isnt "function"
      throw new Error "Observe: Callback should be a function."
    type_of_curr = curr.constructor.name
    if type_of_curr is "Array"
      base = path
      for item, key in curr
        if typeof item is "object"
          new_path = "#{base or ''}[#{key}]"
          new Observe root, callback, item, new_path
          new_path = ""

    if type_of_curr is "Object"
      base = path
      for key, item of curr
        # if item.constructor.name is "Object"
        if typeof item is "object"
          new_path = "#{base}.#{key}" if base
          new_path = "#{key}" unless base
          new Observe root, callback, item, new_path
          new_path = ""


    if curr.constructor.name is "Array"
      base = path
      Array.observe curr, (changes) ->
        result = {}
        original = {}

        changes.forEach (change,i) ->
          index_or_name = if change.index>-1 then change.index else change.name
          new_path = "#{base or ''}[#{index_or_name}]"
          # console.log change
          part =
            path: new_path
            value : change.object[change.index] or
                    change.object[change.name] or
                    change.object
            # json : JSON.stringify(change.object)
          # if change.type is "add" and typeof part.value is "object"

          is_add = change.addedCount > 0 or change.type is "add"
          if typeof part.value is "object" and is_add
            new Observe root, callback, part.value, part.path
            new_path = ""
          result[i] = part
          original[i] = change
        callback result, original
    else if curr.constructor.name is "Object"
      base = path
      Object.observe curr, (changes)->
        result = {}
        original = {}

        changes.forEach (change,i) ->
          new_path = "#{base}.#{change.name}" if base
          new_path = "#{change.name}" unless base

          part =
            path: new_path
            value : change.object[change.name]

          is_add = change.type is "add" or change.addedCount > 0
          if typeof part.value is "object" and is_add
            new Observe root, callback, part.value, part.path
            new_path = ""
          result[i] = part
          original[i] = change
        callback result, original

class Template
  constructor: ->
    
