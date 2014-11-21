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
          item = @create key, collection
          result.push item

      when "String"
        item = @create collections, "#{collections}.json"
        result.push item
      else
        throw new Error "Collection: unexpect type `#{type}`"
    result
  create : (@name, @src=null)->
    ###
    - @name name of the collection
    - @src the source of the file
    ###
    JOM.Collection[name] = {}
    Object.defineProperty(JOM.Collection[name],'ready',{value: false})
    $.getJSON src
    .done (response)=>
      JOM.Collection[name] = response
      JOM.Collection[name].ready = true

  observe: (collection)->
    Observe collection, (changes) ->
      for key, change of changes
        change.name = shadow.ns
        element = $(shadow.document).find("[path='#{shadow.ns}#{change.path}']")

        # automatically change the text
        jom = element.data 'jom'
        element.text change.value if jom?.text? is true

        # automatically change the attributes
        if jom?.attrs?
          for key, attr of jom.attrs
            element.attr key, change.value

        $(element).trigger 'jom.change', change.value
        $(shadow.host).trigger 'change', change
        @
  get: (@name)->
    ###
    returns a collection by name
    ###
    JOM.Collection[name]
  single: (@name, @src)->
    debugger
