# @author Valtid Caushi
#
class Collection
  ###
    Collection class
  ###
  constructor: (@app)->
    ###
    Reads the `ason.app.collections` object and tries to load all the data
    ###
    collections = @app.collections

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
  create : (@name, @src=null)->
    ###
    - @name name of the collection
    - @src the source of the file
    ###
    $.getJSON src
    .done (response)->
      JOM.Collection[name] = response
      $ "body"
      .trigger "collection:#{name}.ready", -> response
  get: (@name)->
    ###
    returns a collection by name
    ###
    JOM.Collection[name]
  single: (@name, @src)->
    debugger
