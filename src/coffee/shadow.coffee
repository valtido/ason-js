class Shadow
  constructor : ->
    @root = document.currentScript?.parentNode ||
            arguments.callee?.caller?.caller?.arguments[0]?.target
    @traverseAncestry()
    @root
  traverseAncestry : ->
    if @root?.parentNode
      @root = @root.parentNode
      @traverseAncestry()


  @getter "body", -> $(@root).children().filter('[body]').get 0
  @getter "host", -> @root.host



Object.defineProperty window, "Root",
  get: -> new Shadow()
