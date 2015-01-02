class Component
  constructor: (selector) ->
    throw new Error "Component: reqires JOM." unless JOM
    component        = $ selector
    @$element        = component
    @element         = component.get 0
    @ns              = component.attr 'ns'
    @collection      = {}
    @collection_attr = component.attr('collection') || @ns
    @template_attr   = component.attr('template') || @ns

    throw new Error "Component: `ns` attr is required." unless @ns
    throw new Error "Component: `template` not found" unless JOM.Template[@ns]

    # set attributes
    component.attr
      'collection' : @collection_attr
      'template'   : @template_attr

    console?info? "Component: template set up"
    # check if component has already been set up before
    @template = JOM.Template[@ns]
    # @template_loader() unless JOM.Template[@ns]
    # @template = JOM.Template[@ns] if JOM.Template[@ns]
    console?info? "Component: loading collections"
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
          done()
          console?.info? "Component: collection promise done"
      , 500)

    done = =>
      @collection = JOM.val @collection_attr
      throw new Error "Component: no data found" unless @collection
      @create_shadow()
    wait()

  create_shadow: ->
    # create a shadow for component
    @shadow   = @element.createShadowRoot()
    # clone    = template.content.cloneNode(true)
    clone    = document.importNode @template.content, true
    @shadow.appendChild clone

    @doc = $(@shadow.children).findAll('[body]').get 0
    $(@shadow.children).findAll('link[rel="asset"]').each (i,asset)=>
      asset.root = @shadow
    @data_transform()
    new AssetManager(@doc)

  data_transform : ->
    # text handlers example: ${name.first}
    regx = "\\?\$\{(?:\w|\[|\]|\.|\"|\'|\n|)*\}"

    get_key_only = (str)->
      return str.slice 2, -1
    replacer = (match)=>
      key   = get_key_only match
      value = JOM.val "#{@collection_attr}.#{key}"
      if value isnt undefined
        return value
      else
        console?.warn? "Com: no data found. `%s` in %o",match, element.get 0
        if ason.env is "production" then return ""
        return match

    all_text   = $(@doc).find('*').filter ->
      return (new RegExp(regx,"g")).test $(this).text()

    nodes_only = all_text.filter(-> return $(this).children().length==0 )

    # text nodes
    text = nodes_only.each( (i, el)=>
      $el = $ el
      raw_text = $el.text()
      if new RegExp(regx,"g").test raw_text
        txt = raw_text.replace new RegExp(regx,"g"), replacer

        path        = @collection_attr
        jom         = el.jom or {}
        jom['text'] =
          path   : path
          value  : txt
          element: el

        el.jom = jom
        prop = JOM.val path, $(el).value()
        $el
        .text txt
    )

    # attributes handler// select all elements first
    all = $(@doc).findAll('*').each (i,el)=>
      $el = $ el
      attrs = el.attributes

      if attrs.length
        for attr, i in attrs
          name = attr.name
          value = attr.value
            .replace regx, replacer
          if regx.test attr.value
            jom  = el.jom || {attrs:{}}
            path = @collection_attr
            jom.attrs[name] =
              name    : name
              value   : value
              path    : path
              element : el

            JOM.val path, value

            # Object.defineProperty
            $el
            .attr name, value
            el.jom = jom
    @doc
