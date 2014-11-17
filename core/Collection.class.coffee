class Observe
  constructor: (root, callback, curr=null, path = null)->
    curr = curr or root

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
          new_path = "#{base or ''}[#{change.index or change.name}]"
          # console.log change
          part =
            path: new_path
            value : change.object[change.index] or change.object[change.name] or change.object
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
class Collection
  get: (name)->
    JOM.Collection[name]

  constructor: (name=null)->
    app = ason.app
    collections = app.collections

    throw new Error "Collection: no collections found." unless collections


    result = []
    type = collections.constructor.name
    switch type
      when "Object"
        for key, collection of collections
          item = @single key, collection
          result.push item

      when "String"
        item = @single collections, "#{collections}.json"
        result.push item
      else
        throw new Error "Collection: unexpect type `#{type}`"
    result

  single: (name, src)->


    $.getJSON src
    .done (response)->
      JOM.Collection[name] = response
      $ "body"
      .trigger "collection:#{name}.ready", -> response


Observe JOM.Collection, (changes) ->
  for key, change of changes
    element = $(shadow.content).findAll("[path='#{change.path}']")
    jom = element.data 'jom'
    element.text change.value if jom?.text? is true
    # debugger
    $(element).trigger 'jom.change', change.value
