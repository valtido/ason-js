# @author Valtid Caushi
#
class Collection
  ###
    Collection class
  ###
  constructor: (@name, data)->
    ###
    => means expect data to be
    if typeof @data is "String", => ajax url
    if typeof @data is "Object", => an Object
    ###
    throw new Error "Collection: app name not found." unless @name
    throw new Error "Collection: data not found." unless data

    @Schema = {}
    @Lang = {}
    @Data = {}


    result = []
    type = data.constructor.name
    console?.info? "Collection: loading %c `%s`", "color: blue", data
    switch type
      when "Array"
        item = @srcArray name, data
      when "String"
        #simple is URL check
        unless /[\s]/.test data
          item = @srcURL name, data
        else
          item = @srcString name, data
        result.push item
      else
        throw new Error "Collection: unexpect type `#{type}`"
    result
  srcString: (@name, @src) ->
    throw new Error "Collection: ARGGGGGG, how do I treat this?"
  srcURL: (@name, @src) ->
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
      console?.info? "Collection: success %c `%s` \u2713", "color: green", src
      @observe(JOM.Collection[name])
    .fail ->
      throw new Error "Collection: Failed to load external data `#{src}` \u2718"
    .always ->
      console?.info? "Collection: finished `#{src}`"
  srcArray: (@name, @src=null)->
    console?.info? "Collection: success %c `%o`", "color: green", src
    JOM.Collection[name] = src
    JOM.Collection[name].ready = true
    console?.info? "Collection: finished `#{src}`"

  observe: (collection)->
    Observe collection, (changes) =>
      console?.info? "Col: changes..., %o", changes
      for key, change of changes
        change.name = @name
        console?.info? "Col: change..."

        element = $(shadow.document).find("[path='#{shadow.ns}#{change.path}']")
        # automatically change the text
        jom = element.get(0).jom
        element.text change.value if jom?.text? is true

        # automatically change the attributes
        if jom?.attrs?
          for key, attr of jom.attrs
            console.log key
            element.attr key, change.value

        $(element).trigger 'jom.change', change
        $(shadow.host).trigger 'change', change
        @
  val: (what, value=undefined)->
    @[what] = value unless value is undefined
    @[what]
