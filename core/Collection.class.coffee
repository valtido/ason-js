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
      Observe response, (changes) ->
        console.log changes
      $ "body"
      .trigger "collection:#{name}.ready", -> response
