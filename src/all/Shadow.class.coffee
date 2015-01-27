class Shadow
  constructor : ->
    @root = document.currentScript?.parentNode ||
            arguments.callee.caller.caller.arguments[0].target
    @traverseAncestry()
    @root
  traverseAncestry : ->
    if @root.parentNode
      @root = @root.parentNode
      @traverseAncestry()


  @property  "body", get : ->
    return $(@root).children().filter('[body]').get 0
  @property  "host",    get : -> @root.host



Object.defineProperty window, "Root",
  get: -> new Shadow()
