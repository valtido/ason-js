###
Template class, keeps an instance of template information
Each template can only exist once
###
class Template
  ###
  Template constructor
  @param template [HTMLElement | String ]
  @return Template
  ###
  constructor: (template = null)->
    @original = template
    $template = $ template
    throw new Error "jom: template is required" if $template.length is 0

    @ready = false

    @name = $template.attr "name"
    @fontello = ($template.attr "fontello") || null
    throw new Error "jom: template name attr is required" if @name is undefined

    t = $template.get 0
    imgs = $(t.content).find 'img'
    imgs.attr 'source', imgs.attr 'src'
    imgs.attr 'src', null

    @element = document.importNode t.content, true
    # @element = template

    @body = $(@element).children "[body]"
    $template.get(0).template = true
    if @body is undefined or @body.length is 0
      throw new Error "jom: template body attr is required"

    @handlebars = []
    @repeaters = []

    for repeater, key in @element.querySelectorAll '[repeat]'
      index = @getIndex repeater
      repeater.guid = jom.guid

      @repeaters.push
        index: index
        node: repeater
        parent: repeater.parentNode

    @ready = true
    @

  getIndex: (node)->
    i = 0

    i++ while node = node.previousElementSibling

    i
