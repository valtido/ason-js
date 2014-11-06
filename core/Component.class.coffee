class Component
  constructor: (selector, @repeated = false, @index = 0) ->
    throw new Error "Component: reqires JOM." unless JOM
    component        = $ selector
    @element         = component.get 0
    @ns              = component.attr 'ns'
    @repeat          = component.attr("repeat") isnt undefined
    @collection      = {}
    @collection_attr = component.attr('collection') || @ns

    throw new Error "Component: `ns` attr is required." unless @ns
    throw new Error "Component: `collection` attr is required." unless @collection_attr

    @collection_loader()

    # check if component has already been set up before

    @template_loader() unless JOM.Template[@ns]

    JOM.Component[@ns] = @
    @
  collection_loader : ()->
    $ 'body'
    .on "collection:#{@ns}.ready", (event, response)=>
      collection = response()
      @collection = collection

      throw new Error "Component: collection data not found" unless collection

      # repeat, clones itself and re constructs a new component
      is_array    = @collection.constructor.name is "Array"
      is_repeated = @repeat isnt false
      return @repeater() if is_array and is_repeated

  shadow: ->
    # create a shadow for component
    shadow    = @current_element.createShadowRoot()
    cloneNode = @template.content.cloneNode true
    clone     = document.importNode cloneNode, true
    @current_element = cloneNode
    @data_transform()
    shadow.appendChild cloneNode
  template_loader: ->
    importer  = $ "link[template='#{@ns}']"
    throw new Error "Component: Template not imported" if importer.length isnt 1
    importer = $(importer).get 0

    $template  = $ 'template', importer.import
    throw new Error "Component: template not found" if $template is undefined

    template = $template.get 0

    # import template once
    clone = document.importNode template.content, true
    @template         = template
    JOM.Template[@ns] = template

    @template
  repeater: ->
    # generate clones if it's an array
    reversed = @collection.reverse()
    tmp      = $ '<component />'
    for collection, key in reversed
      path = "#{@collection_attr}[#{key}]"
      clone = tmp.clone()
      clone.attr 'ns', @ns
      clone.attr 'collection', path
      clone.insertAfter @element
      @current_collection = Prop path, JOM.Collection
      @current_element = clone.get 0
      @shadow()
    @element.remove()

  data_transform : ->
    that = @
    # text handlers
    regx = /#{[\w|\[|\]|\.|"|']*}*/g
    replacer = (match)->
      key = match.slice 2, -1
      value = Prop key, that.current_collection
      if value isnt undefined
        return value
      else
        console?.warn? "Component: Collection data not found. `%s` in %o",match, @current_element
        return match
    all_text = $(@current_element.children).children().findAll ":contains(\#{)"
    nodes_only = all_text.filter(-> return $(this).children().length==0 )
    text = nodes_only.each(->
      txt = $(this)
      .text()
      .replace regx, replacer
      $(this).text(txt)
    )

    # attributes handler
    all = $(@current_element.children).findAll('*').each (i,el)->
      attrs = el.attributes
      for attr, i in attrs
        name = attr.name
        value = attr.value
          .replace regx, replacer
        $(el).attr name, value
    @current_element

unless $.fn.findAll?
  $.fn.findAll = (selector) ->
      return this.find(selector).add(this.filter(selector));

$ ->
  $('component').each (i, element)->
    new Component element
    this
