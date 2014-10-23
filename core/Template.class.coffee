class Template
  constructor: ->
    $.each $('template'), (i,template) =>
      element = $(template)
      key = element.attr 'key'
      throw new Error "Template: key attribute is required." unless key
