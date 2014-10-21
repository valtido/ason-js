class Component
  constructor: ->
    $.each $('component'), (i,component) =>
      element = $(component)
      return element if element.component?.init isnt undefined
      element.component = {}
      element.component.init = true
      key = element.attr 'key'
      throw new Error "Component: key attribute is required." unless key

      # Get from template
      template_tag = $("template[key='#{key}']")
      
      console.log template_tag

$ ->
  new Component()
