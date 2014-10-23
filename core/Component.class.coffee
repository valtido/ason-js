class Component
  constructor: ->
    $.each $('component'), (i,component) =>
      $element = $ component
      element = $element.get 0
      return element if element.component?.init?
      element.component = {}
      element.component.init = true

      # required
      collection = $element.attr 'collection'
      ns = $element.attr 'ns'
      throw new Error "Component: ns attribute is required." unless ns
      throw new Error "Component: collection attribute is required." unless collection
      element.component.ns = ns

      # grab data from JOM.collection
      data = new Prop collection, JOM.collection
      throw new Error "Component: collection not found" unless data
      element.component.data = data
      # Get from template
      $template_tag = $ "template[ns='#{ns}']"
      template_tag = $template_tag.get 0
      element.component.template =
        tag : template_tag
        ns: ns
      throw new Error "Component: template not found" unless $template_tag.length is 1
      shadow = element.createShadowRoot()
      clone = template_tag.content.cloneNode true

      # will find #{...} whether in text or in attribute and replace it with
      # corresponding dataset found on collections, if found
      clone = @data_transform data, clone

      $(shadow).append clone
  data_transform : ( data, clone)->
    # text handlers
    regx = /#{[\w|\[|\]|\.|"|']*}*/g
    replacer = (match)->
      key = match.slice 2, -1
      value = new Prop().get key, data
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


$ ->
  new Component()
