class Component
  repeat: (selector, collections)->
    # generate clones if it's an array
    $element        = $ selector
    ns              = $element.attr 'ns'
    collection_attr = $element.attr 'collection'
    collections.reverse()
    for collection, key in collections
      console.log collection, key
      component      = $ '<component />'
      component.attr 'ns', ns
      component.attr 'collection', "#{collection_attr}[#{key}]"
      component.insertAfter $element
      new Component component
    $element.remove()
  constructor: (selector) ->
    components = if $(selector).length then $ selector else $ 'component'
    components = components.filter =>
      @component is undefined
    if components.length > 1
      return $.each components, (i,component) ->
        return new Component component
    if components.length is 1
      component       = components
      $element        = $ component
      element         = $element.get 0
      collection_attr = $element.attr 'collection'
      # get from JOM using path
      collection      = Prop collection_attr, JOM.collection
      template        = $element.attr 'ns'

      throw new Error "Component: `ns` attr is required." unless template
      throw new Error "Component: `collection` attr is required." unless collection_attr isnt undefined

      console.log collection
      return @repeat component, collection if collection.constructor.name is "Array"

      return element if element.component?.init?
      element.component = {}
      element.component.init = true
      element.component.ns = template
      element.component.collection_attr = collection_attr

      throw new Error "Component: collection data not found" unless collection
      element.component.collection = collection
      # Get from template
      $template_tag = $ "template[ns='#{template}']"
      template_tag = $template_tag.get 0
      element.component.template =
        tag : template_tag
        ns  : template
      throw new Error "Component: template not found" unless $template_tag.length is 1
      shadow = element.createShadowRoot()
      clone  = template_tag.content.cloneNode true

      # will find #{...} whether in text or in attribute and replace it with
      # corresponding dataset found on collections, if found
      clone = @data_transform collection, clone
      document.importNode template_tag.content, true
      $(shadow).append clone
  data_transform : ( data, clone)->
    # text handlers
    regx = /#{[\w|\[|\]|\.|"|']*}*/g
    replacer = (match)->
      key = match.slice 2, -1
      value = Prop key, data
      if value isnt undefined
        return value
      else
        console?.warn? "Component: Collection data not found. `%s` in %o",match, clone
        return match
    all_text = $(clone.children).findAll ":contains(\#{)"
    nodes_only = all_text.filter(-> return $(this).children().length==0 )
    text = nodes_only.each(->
      txt = $(this)
      .text()
      .replace regx, replacer
      $(this).text(txt)
    )

    # attributes handler
    all = $(clone.children).findAll('*').each (i,el)->
      attrs = el.attributes
      for attr, i in attrs
        name = attr.name
        value = attr.value
          .replace regx, replacer
        $(el).attr name, value
    clone

unless $.fn.findAll?
  $.fn.findAll = (selector) ->
      return this.find(selector).add(this.filter(selector));

x= ''

$ ->
  $ 'body'
  .on 'click', ->
    c = $ '<component collection="user[1]" ns="profile" />'
    $ '.xx'
    .prepend c
  x = new Component()
