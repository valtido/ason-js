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

    @element = document.importNode t.content, true
    # @element = template

    @body = $(@element).children "[body]"
    $template.get(0).template = true
    if @body is undefined or @body.length is 0
      throw new Error "jom: template body attr is required"

    @cloned = null
    @errors = []
    @show_loader()
    @ready = true
    @

  show_loader: ->
    loader = $('<div class="temporary_loader"><i class="icon-loader animate-spin"></i>Loading...</div>')

    css =
      position          : "absolute"
      top               : 0
      left              : 0
      bottom            : 0
      right             : 0
      "text-align"      : "center"
      display           : "block"
      "background-color": "#fff"
    loader.css css

    loader.children 'i'
    .css position: 'absolute', top: "50%"

    $(@element).add(@element.children).findAll('.temporary_loader').remove()

    if @fontello then loader.children('i').addClass @fontello

    $(@element).append(loader)

  hide_loader: (content)->
    $(content).add(content.children).findAll('.temporary_loader').remove()
