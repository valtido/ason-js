class Template
  constructor: (@link)->
    @el = $ link
    num = @el.length

    throw new Error "Component: `length` is > 1" if num > 1

  ready: (callback)->
    setTimeout =>
      @template = $ 'template', @link.import
      unless @template.length isnt 0
        @ready.call @, callback
      else
        @link["template"] = @template
        @url = @el.attr 'href'
        @element = @template.get(0)
        @element.url = @url if @element
        callback.apply @, [@template.get(0)]
    , 100
class Templates
  stack = []
  element_to_template = (all_plain_elements) ->
    all_plain_elements.each (i, n)->
      n.template = true
      template = new Template n
      template.ready (element)->
        stack.push element
  constructor: ->
    all = $ 'link[rel="import"]'

    all.each (i,n) -> #remove duplicate templates# as precaucion
      href = $(n).attr('href')
      length = $("link[rel='import'][href='#{href}']").length
      if length > 1
        $(n).remove()

    plain = all.filter    -> not ("template" of @)
    existing = all.filter -> ("template" of @)

    element_to_template.call @, plain if plain.length > 0

  list: -> stack
  find_by_url: (url)->
    for item in stack
      return item if item.url is url and url isnt undefined
