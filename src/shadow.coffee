class Shadow
  constructor : ->
    @root = document.currentScript?.parentNode or
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
