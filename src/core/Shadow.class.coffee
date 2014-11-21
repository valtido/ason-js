class Shadow
  constructor : ->
    @root = document.currentScript?.parentNode ||
            arguments.callee.caller.caller.arguments[0].target
    @traverseAncestry()
    @ns       = $(@host).attr('ns')
    @root
  traverseAncestry : ->
    if @root.parentNode
      @root = @root.parentNode
      @traverseAncestry()


  @property  "document", get : -> $(@root).children().filter('[document]')
  @property  "host",    get : -> @root.host
  @property  "instances", get : ->
    @elements = $(document).find("component[ns='#{@ns}']")
    @shadows = for element, i in @elements
      element.shadowRoot
    @contents = for shadowRoot, i of @shadows
      shadowRoot.childNodes or shadowRoot.children
    return @elements



Object.defineProperty window, "Root",
  get: -> new Shadow()
