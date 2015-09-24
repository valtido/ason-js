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

Object.defineProperty window, "doc",
  get: ->
    args = arguments.callee.caller.arguments
    found = false
    timer = Date.now()
    i = -1
    while found is false
      i++
      if timer + 1000 < Date.now()
        throw new Error "doc: could not be found"
      arg = args[i] or {}

      if arg.callback isnt undefined
        args= arg.callback.arguments
      else if arg.target isnt undefined
        offset = arg.target
        while offset.parentNode isnt null
          offset = offset.parentNode
        component = offset.host.component
        result = component.document
        found = true
      else if arg.document isnt undefined
        result = arg.document
        found = true
      else
        if args.length is i
          caller = args.caller or args.callee.caller
          args = caller.arguments
          i = -1

    result
