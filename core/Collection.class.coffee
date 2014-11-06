class Observe
  constructor: (root, callback, curr=null, path = null)->
    curr = curr || root

    type_of_curr = curr.constructor.name
    base = path
    if type_of_curr is "Array"
      for item, key in curr
        if typeof item is "object"
          path = "#{base}[#{key}]" if base
          path = "#{key}" unless base
          new Observe root, callback, item, path
          path = ""

    if type_of_curr is "Object"
      for key, item of curr
        # if item.constructor.name is "Object"
        if typeof item is "object"
          path = "#{base}.#{key}" if base
          path = "#{key}" unless base
          new Observe root, callback, item, path
          path = ""


    if curr.constructor.name is "Array"
      curr_path = path
      Array.observe curr, (changes) ->
        result = {}
        original = {}
        base = path
        changes.forEach (change,i) ->
          path = "#{base}[#{change.index}]"

          # console.log change
          part =
            path: curr_path
            value : change.object
            # json : JSON.stringify(change.object)
          # if change.type is "add" and typeof part.value is "object"
          if change.addedCount > 0 and typeof part.value is "object"
            new Observe root, callback, part.value, part.path
          result[i] = part
          original[i] = change
        callback result, original
    if curr.constructor.name is "Object"
      base = "#{path}"
      Object.observe curr, (changes)->
        result = {}
        original = {}

        changes.forEach (change,i) ->
          curr_path = path
          path = "#{base}.#{change.name}" if base
          path = "#{change.name}" unless base

          part =
            path: path
            value : change.object[change.name]

          if change.type is "add" and typeof part.value is "object"
            new Observe root, callback, part.value, part.path
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
  console.log changes 
