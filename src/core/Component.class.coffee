class Component
  constructor: (selector) ->
    throw new Error "Component: reqires JOM." unless JOM
    component        = $ selector
    @$element        = component
    @element         = component.get 0
    @current_element = @element
    @ns              = component.attr 'ns'
    @repeat          = component.attr("repeat") isnt undefined
    @collection      = {}
    @collection_attr = component.attr('collection') || @ns
    @template_attr   = component.attr('template') || @ns

    throw new Error "Component: `ns` attr is required." unless @ns
    throw new Error "Component: `template` not found" unless JOM.Template[@ns]

    # set attributes
    component.attr
      'collection' : @collection_attr
      'template'   : @template_attr

    # check if component has already been set up before
    @template = JOM.Template[@ns]
    # @template_loader() unless JOM.Template[@ns]
    # @template = JOM.Template[@ns] if JOM.Template[@ns]
    @collection_loader()


    JOM.Component[@ns] = @
    @
  collection_loader : ()->
    times = 0
    wait = =>
      setTimeout( =>
        throw new Error "Component: collection timeout" if times > 15
        if JOM.Collection[@ns]?.ready isnt true
          wait()
          times++
        else
          console.log "done"
          done()

      , 500)

    done = =>
      collection = Prop @collection_attr, JOM.Collection
      @collection = collection

      throw new Error "Component: no data found" unless collection

      # repeat, clones itself and re constructs a new component
      is_array    = @collection.constructor.name is "Array"
      is_repeated = @repeat isnt false


      if is_array is true and is_repeated is false
        before = @collection_attr
        @collection = [@collection[0]]
        @$element.attr "collection", "#{@collection_attr}[0]"

        # @shadow() # constructs a single instance not a repeater
        console?.warn? "Component: collection `#{before}`, should be repeated"
      @repeater()
    wait()
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
  repeater: ->
    # generate clones if it's an array
    tmp      = $ '<component />'
    for collection, key in @collection
      path = "#{@collection_attr}[#{key}]"
      clone = tmp.clone()
      clone.attr
        'repeated'   : 'yes'
        'ns'         : @ns
        'collection' : path
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
        console?.warn? "Component: no data found. `%s` in %o",match, element.get 0
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
