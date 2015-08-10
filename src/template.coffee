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
    $template = $ template
    throw new Error "jom: template is required" if $template.length is 0


    @name = $template.attr "name"
    throw new Error "jom: template name attr is required" if @name is undefined

    t = $template.get 0

    @element = document.importNode t.content, true
    # @element = template

    @body = $(@element).children "[body]"
    $template.get(0).template = true
    if @body is undefined or @body.length is 0
      throw new Error "jom: template body attr is required"

    @schema = $(@element).children 'link[rel=asset][asset=schema]'

    if @schema.length is 0
      throw new Error "jom: template schema(s) are required"

    @cloned = null

    @

  clone: ->
    @cloned = @element.cloneNode true
