class Component
  constructor: (selector, @repeated = false, @index = 0) ->
    throw new Error "Component: reqires JOM." unless JOM
    component        = $ selector
    @element         = component.get 0
    @current_element = @element
    @ns              = component.attr 'ns'
    @repeat          = component.attr("repeat") isnt undefined
    @collection      = {}
    @collection_attr = component.attr('collection') || @ns

    throw new Error "Component: `ns` attr is required." unless @ns
    throw new Error "Component: `collection` attr is required." unless @collection_attr
    component.attr 'collection', @collection_attr
    @collection_loader()

    # check if component has already been set up before
    @template_loader() unless JOM.Template[@ns]

    JOM.Component[@ns] = @
    @
  collection_loader : ()->
    $ 'body'
    .on "collection:#{@ns}.ready", (event, response)=>
      collection  = response()
      @collection = collection

      throw new Error "Component: collection data not found" unless collection

      # repeat, clones itself and re constructs a new component
      is_array    = @collection.constructor.name is "Array"
      is_repeated = @repeat isnt false

      if is_array is true and is_repeated is false
        @collection      = @collection.shift()
        @current_collection = @collection
        before           = @collection_attr
        @collection_attr = "#{@collection_attr}[0]"
        $(@element).attr 'collection', @collection_attr
        @shadow()
        # @shadow() # constructs a single instance not a repeater
        console?.warn? "Component: collection `#{before}`, should be repeated"
        return @
      return @repeater() if is_array and is_repeated

  shadow: ->
    # create a shadow for component
    shadow   = @current_element.createShadowRoot()
    template = @template
    # clone    = template.content.cloneNode(true)
    $(template.content.childNodes).findAll('script').each (i,n)->
      unless /^shadow = Root/.test(n.text)
        n.text = "shadow = Root\n" + n.text
      n
    clone    = document.importNode template.content, true
    shadow.appendChild clone
    @current_element = shadow
    @data_transform()
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
    tmp      = $ '<component />'
    for collection, key in @collection
      path = "#{@collection_attr}[#{key}]"
      clone = tmp.clone()
      clone.attr 'ns', @ns
      clone.attr 'collection', path
      clone.insertBefore @element
      @current_collection = Prop path, JOM.Collection

      @current_element = clone.get 0
      @shadow()
    @element.remove()

  data_transform : ->
    that      = @
    element   = null
    path_type = null
    # text handlers
    regx = /#{[\w|\[|\]|\.|"|']*}*/g
    replacer = (match)->
      key = match.slice 2, -1
      value = Prop key, that.current_collection
      element.attr 'prop', key
      collection = $(shadow.host).attr 'collection'
      path       = "#{collection}.#{key}"
      element.attr 'path', path
      if value isnt undefined
        return value
      else
        console?.warn? "Component: Collection data not found. `%s` in %o",match, @current_element
        if ason.env is "production"
          return ""
        return match

    all_text = $(@current_element.children).findAll ":contains(\#{)"
    nodes_only = all_text.filter(-> return $(this).children().length==0 )

    # text nodes
    text = nodes_only.each( (i, el)->
      element = $ el
      if regx.test element.text()
        txt = element
        .text()
        .replace regx, replacer

        path = element.attr 'path'
        jom = element.data('jom') or {}
        jom['text'] = true

        element
        .text txt
        .data 'jom', jom

        prop = Prop path,
                    JOM.Collection,
                    $(el).value()

    )

    # attributes handler
    all = $(@current_element.children).findAll('*').each (i,el)->
      element = $ el
      attrs = el.attributes
      for attr, i in attrs
        name = attr.name
        value = attr.value
          .replace regx, replacer
        if regx.test attr.value
          jom = element.data('jom') || {attrs:{}}
          jom['attrs'][name] = value

          element
          .attr name, value
          .data 'jom', jom
    @current_element

unless $.fn.findAll?
  $.fn.findAll = (selector) ->
    return this.find(selector).add(this.filter(selector))
unless $.fn.value?
  $.fn.value = (val, text=false)->
    if val
      $(this).data('value',arguments[0])
      if text is true
        txt = $.trim val
        $(this).text txt
      $(this).trigger 'jom.change'
      return $(this)

    return $(this).data 'value'

$ ->

  $('component').each (i, element)->
    new Component element
    this
