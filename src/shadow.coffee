class Shadow
  constructor : ->
    @root = document.currentScript?.parentNode or
            arguments.callee?.caller?.caller?.arguments[0]?.target or
            null
    @traverseAncestry()
    @root
  traverseAncestry : ->
    if @root?.parentNode
      @root = @root.parentNode
      @traverseAncestry()


  @getter "body", -> ($(@root).children().filter('[body]').get 0) or null
  @getter "host", -> @root?.host or null



Object.defineProperty window, "Root",
  get: -> new Shadow()
