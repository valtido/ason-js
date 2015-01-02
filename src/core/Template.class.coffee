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
      @template = $template.get 0
      @ns = $template.attr 'ns'

      throw new Error "Template: `ns` attr is required." unless @ns

      # import template once
      @handle_template_scripts()
      clone             = document.importNode @template.content, true
      JOM.Template[@ns] = @template

      console?.info? "templates: loading %c `%s`", "color: blue", @ns

      @template

  handle_template_scripts: ->
    escapeRegExp = (str) ->
      str.replace /[-\/\\^$*+?.()|[\]{}]/g, '\\$&'

    scripts = @template.content.querySelectorAll('script')
    $(scripts).not('[src]').each (i,script)->
      front              = "(function (shadow, body, host, root, document){"
      reg                = new RegExp("^#{escapeRegExp(front)}")
      is_script_prepared = reg.test(script.text.trim())

      # unless is_script_prepared
      script.text = """#{front}
                  #{script.text}
                  }).apply(
                    (shadow = Root) && shadow.body,
                    [shadow = Root,
                     shadow.body,
                     shadow.host,
                     shadow.root,
                     shadow.root]
                  )"""
      return script

new Template "template"
