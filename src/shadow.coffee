class Shadow
  constructor : ->
    parent = document.currentScript?.parentNode
    if parent instanceof ShadowRoot is true
      sh = parent
    else
      if parent
        sh = wrap(parent)?.shadowRoot
      else
        sh = jom.components[jom.components.length-1].element.shadowRoot

    @root = sh or
            arguments.callee?.caller?.caller?.arguments[0]?.target or
            null
    @traverseAncestry()
    @root
  traverseAncestry : (parent) ->
    if @root?.parentNode or parent
      @root = @root.parentNode or parent
      @traverseAncestry(@root.parentNode)


  @getter "body", -> ($(@root).children().filter('[body]').get 0) or null
  @getter "host", -> @root?.host or null



Object.defineProperty window, "Root",
  get: -> new Shadow()
