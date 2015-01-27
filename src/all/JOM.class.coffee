class JOM
  stack =
    templates : []
    components : []
    collections : []
  constructor: ->
    window["jom"] = @
    # @templates
    @tasks()
    @
  tasks: ->
    setTimeout =>
      stack.templates = new Templates()
      stack.collections = new Collections()
      stack.components = new Components()
      @tasks()
    , 1000
  @getter 'assets', ->
    links = $ 'link[rel="asset"]'
    all = links.filter(-> $(@).data('finalized') isnt true ).each (i, asset)->
      asset
    js_content   = ["text/javascript"]
    json_content = ["text/json","application/json"]
    css_content  = ["text/css"]
    html_content = ["text/html"]

    assets      = {}
    assets.all  = all
    assets.js   = all.filter(-> $(@).attr('type') in js_content)
    assets.css  = all.filter(-> $(@).attr('type') in css_content)
    assets.json = all.filter(-> $(@).attr('type') in json_content)
    assets.html = all.filter(-> $(@).attr('type') in html_content)
    assets


  @getter 'shadow',     -> new Shadow()
  @getter 'templates',  -> stack.templates
  @getter 'collections',-> stack.collections
  @getter 'components', -> stack.components
  @getter 'components_old', ->
    result = []
    new Components()

    $ 'component'
    .each (i,component)->
      result.push component

    return result

jom = JOM = new JOM()
