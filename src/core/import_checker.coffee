$ ->
  $('link[rel=import]').each (i,link)->
    template = link.import.querySelector("template")
    ns = $(template).attr 'ns'
    $(link).attr("template", ns ) if template isnt null
