asset_stack = []
AssetManager = ->
  running = false
  context = document.head

  update_status = (element, message) ->
    el  = $ element
    if el.length
      asset_element = $(element).prop 'asset'
      el = el.add asset_element if asset_element
      el.attr 'status', message
  load = ->
    update_status this, "loaded"
  error = ->
    update_status this, "failed"
    source = $($(this).prop('asset')).attr 'source'
    throw new Error "Asset: Failed to load `#{source}`"
  process = ->
    return false if running is true
    running = true
    _html    = []
    _js      = []
    _css     = []
    _json    = []
    _schema  = []
    # before
    while asset_stack.length
      item = asset_stack[0]
      asset = item.asset
      switch item.type
        when "text/template"
          result = template item, asset
          _html.push asset: asset, element : result
        when "text/collection", "application/collection"
          result = collection item, asset
          _json.push asset: asset, element : result
        when "text/json", "application/json"
          result = json item, asset
          _json.push asset: asset, element : result
        when "text/html"
          result = html item, asset
          _html.push asset: asset, element : result
        when "text/javascript"
          result = js item, asset
          _js.push asset: asset, element : result
        when "text/stylesheet", "text/css"
          result = css item, asset
          _css.push asset: asset, element : result
        else
          throw new Error "Asset: failed to queue"
      $(result).prop 'asset', asset
      update_status item, 'init'
      result.onload = load
      result.onerror = error
      asset_stack.shift()
    include _css
    include _html
    include _js
    include _json
    # after
    unless context.onAssetLoad is undefined
      context.onAssetLoad.apply(context,[])
    ready()
    running = false
  ready = ->
    if (window.jom and window.jom.app is undefined) or document.body is null
      setTimeout ->
        ready()
      , 50
      return false
    $ 'body'
    .trigger 'assets_ready'

  image = (item, asset)->
    image = document.createElement "img"
    image.setAttribute 'src', source
    image
  html = (item, asset)->
    # link(rel="import" href="template.html")
    link = document.createElement "link"
    link.setAttribute 'href', item.source
    link.setAttribute 'rel', "import"
    link.setAttribute 'type', (item.type or 'text/javascript')
    link
  template = (item, asset)->
    name = $(asset).attr 'name'
    unless name
      throw new Error "Asset: template `name` attr required `#{item.source}`"
    # link(rel="import" href="template.html")
    link = document.createElement "link"
    link.setAttribute 'href', item.source
    link.setAttribute 'rel', "import"
    link.setAttribute 'type', (item.type or 'text/javascript')
    link
  json = (item, asset)->
    data = []
    collection = $(asset).attr "collection"

    unless collection && collection.length
      throw new Error "Asset: Collection ID is required"
    # script(src="example.js" type="text/javascript")
    script = document.createElement "script"

    xhr = $.getJSON item.source
    xhr.done (response)->
      unless response instanceof Array
        console?.warn? "Asset: `%o` should be an Array", response
      text = JSON.stringify response
      script.innerText = script.textContent = text
      script.json = response
    xhr.fail error

    script.setAttribute 'origin', item.source # only for reference
    script.setAttribute 'type', 'text/json'
    script
  collection = (item, asset)->
    data = []
    collection = $(asset).attr "name"

    unless collection && collection.length
      throw new Error "Asset: Collection `name` attr is required"
    # script(src="example.js" type="text/javascript")
    script = document.createElement "script"
    if item.source
      xhr = $.getJSON item.source
      xhr.done (response)->
        unless response instanceof Array
          console?.warn? "Asset: `%o` should be an Array", response
        text = JSON.stringify response
        script.innerText = script.textContent = text
        script.collection =
          name: collection
          data: response

      xhr.fail error
    else
      text = $(asset).text()
      script.innerText = script.textContent = text
      script.collection = response
    # only for reference, include origin
    script.setAttribute 'origin', item.source if item.source
    script.setAttribute 'type', 'text/collection'
    script.setAttribute 'name', collection
    script
  js = (item, asset)->
    # script(src="example.js" type="text/javascript")
    script = document.createElement "script"
    script.setAttribute 'src', item.source
    script.setAttribute 'type', (item.type or 'text/javascript')
    script
  css = (item, asset)->
    # link(href="template.html" type="text/css")
    style = document.createElement "link"
    style.setAttribute 'href', item.source
    style.setAttribute 'rel', 'stylesheet'
    style.setAttribute 'type', (item.type or 'text/css')
    style

  include = (result) ->
    for item in result
      target = item.asset.root or document.head
      target.appendChild item.element
  $('link[rel="asset"]').not('[status]').each (i, asset)->
    $asset = $(asset)
    type   = $asset.attr 'type'
    source = $asset.attr 'source'
    asset_stack.push
      source : source
      type   : type
      asset  : asset
  process()
  @
AssetManager()
$ ->
  AssetManager()
