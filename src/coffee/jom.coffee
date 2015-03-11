class JOM
  cache = {}
  stack = {}
  constructor: ->
    window["jom"] = @
    @clear_cache()
    @clear_stack()
    # @template
    @tasks()
    @
  tasks: ->
    setTimeout =>
      @run_template()
      @tasks()
    , 100
  resolve: (path)->
    # console.log "LOCO", location.href
    # return location.pathname+
    href = location.href || window.location.href
    pr   = href.replace(location.protocol+"//", "").replace(location.host, "")
    url  = pr
    first = path[0]
    second = path[1]
    result = ""

    switch first
      when "/"
        ""
        result = path if second isnt "/"
      when "."
        result = url.replace /([\/]?[^\/]+[\/]?)$/g, "/"+path
      else
        result = url.replace /([\/]?[^\/]+[\/]?)$/g, "/"+path
    return result
  get_stack: -> stack
  get_cache: -> cache
  clear_stack: ->
    stack.template   = {}
    stack.component  = {}
    stack.collection = {}

  clear_cache: ->
    cache.template   = {}
    cache.component  = {}
    cache.collection = {}

  add_collection: (name, data = {}, schema)->
    stack.collection[name] =
      name   : name
      data   : data
      schema : schema
  add_template: (template)->
    throw new Error "jom: template element is required" if template is undefined
    $template = $ template
    throw new Error "jom: template element is required" if $template.length is 0
    name = $template.attr 'name'
    throw new Error "jom: template name is required" if name is undefined
    stack.template[name] =
      name: name
      element: $template.get 0
  run_template: ->
    all = $ 'link[rel="import"]'
    all.each (i, n)->
      $n      = $ n
      url     = jom.resolve $n.attr "href"
      if cache.template[url] isnt undefined
        $tempalte = $($n.get(0).import).find('template')
        name      = $template.attr('name')
        add_template template
        throw new Error "jom: template name is missing" if name is undefined
        return false
      cache.template[url] = template

  @getter 'asset', ->
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


  @getter 'shadow',    -> new Shadow()
  @getter 'template',  -> stack.template
  @getter 'collection',-> stack.collection
  @getter 'component', -> stack.component

jom = JOM = new JOM()
