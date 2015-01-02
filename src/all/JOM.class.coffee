class JOM
  collections = new Collections()
  components = new Component()
  constructor: ->
    @templates
    @
  tasks: ->
    setTimeout =>
      @templates
      @tasks()
    , 10
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
  @getter 'templates', ->
    importers = $ "link[rel=import]"
    templates = $ "template"
    importers.each (i, importer)->
      template = $ 'template', importer.import
      template = template.filter(->$(@).prop('filtered') isnt true)
      template.prop 'filtered', true
      templates = templates.add template if template.length

    templates.filter(-> $(@).prop('finalized') isnt true ).each (i, template)->
      $(template).prop 'finalized', true
    templates.prependTo document.head
  @getter 'collections', ->
    collections


  @getter 'components', ->
    components


jom = JOM = new JOM()
