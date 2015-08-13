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
    throw new Error "jom: template name attr is required" if @name is undefined

    t = $template.get 0

    @element = document.importNode t.content, true
    # @element = template

    @body = $(@element).children "[body]"
    $template.get(0).template = true
    if @body is undefined or @body.length is 0
      throw new Error "jom: template body attr is required"

    @schemas = []
    schemas  = $.trim $template.attr 'schemas'
    schemas  = schemas.split ','

    for schema, key in schemas
      schemas[key] = $.trim schema

    @schemas_list = schemas
    schemas       = schemas.join ','
    @schemas_attr = schemas

    @schemas_ready = false

    @cloned = null
    @show_loader()
    @load_schemas()

    @

  load_schemas: ->
    if @schemas_ready is true
      @ready = true
      @hide_loader()
    else
      setTimeout =>
        @schemas_ready = true

        if @schemas_list.length is 0 then @schemas_ready = false

        for schema in @schemas_list
          if jom.schemas.get(schema) is null
            @schemas_ready = false

        if @schemas_ready is true
          for schema in @schemas_list
            @schemas.push jom.schemas.get schema

        @load_schemas()
      , 10

  show_loader: ->
    loader = $('<div class="temporary_loader"><i class="icon-loader animate-spin"></i></div>')

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

    $('.temporary_loader', @element).remove()

    $(@element).append(loader)
  hide_loader: ->
    if @component isnt undefined
      $('.temporary_loader', @component.root).remove()

  define_schema: (schema)->
    if not schema or schema instanceof Schema is false
      throw new Error "jom: template schemas attr is required"

    @schemas.push schema
