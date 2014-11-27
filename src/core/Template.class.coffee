class Template extends JOM
  constructor: (selector)->
    console?.info? "templates:"
    @$element = $ selector
    @element = @$element.get 0

    switch @$element.length
      when 0
        @load()
      when 1
        true
      else
        # anything else

    throw new Error "Template: `ns` attr is required." unless @ns
    @

  load: ->
    importers  = $ "link[rel=import]"
    importers.each (i, importer) =>
      $template  = $ 'template', importer.import
      throw new Error "Template: template not found" if $template is undefined
      template = $template.get 0
      @ns = $template.attr 'ns'

      throw new Error "Template: `ns` attr is required." unless @ns

      # import template once
      clone             = document.importNode template.content, true
      @template         = template
      JOM.Template[@ns] = template

      console?.info? "templates: loading %c `%s`", "color: blue", @ns

      @template



new Template "template"
