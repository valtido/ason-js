# Credit to: # https://github.com/chaijs/pathval/blob/master/index.js

class Prop
  constructor: (path, obj, value = null)->
    return @set path, obj, value if value
    return @get path, obj unless value
  set: (path, obj, val) ->
    parsed = @parse path
    return @setPathValue parsed, val, obj

  get: (path, obj)->
    parsed = @parse path
    return @getPathValue parsed, obj
  parse : (path) ->
    str = "#{path}".replace /\[/g, '.['
    parts = str.match /(\\\.|[^.]+?)+/g
    re = /\[(\d+)\]$/
    ret = []
    mArr = null

    for part, i in parts
      mArr = re.exec part
      s = if mArr then { i: parseFloat(mArr[1]) } else { p: part }
      ret.push s

    ret

  getPathValue: (parsed, obj) ->
    tmp = obj
    l = parsed.length
    for part, i in parsed
      if tmp
        if @defined part.p then tmp = tmp[part.p]
        else if @defined part.i then tmp = tmp[part.i]
        if i is l - 1 then res = tmp
      else
        res = undefined
    return res;

  setPathValue: (parsed, val, obj) ->
    tmp = obj
    i = 0
    l = parsed.length

    while i < l
      part = parsed[i];

      if @defined tmp and i is l - 1
        x = if @defined part.p then part.p else part.i
        tmp[x] = val
      else if @defined tmp
        if @defined part.p and tmp[part.p]
          tmp = tmp[part.p]
        else if @defined part.i and tmp[part.i]
          tmp = tmp[part.i]
        else
          next = parsed[i + 1]
          x = if @defined part.p then part.p else part.i
          y = if @defined next.p then {} else []
          tmp[x] = y
          tmp = tmp[x]

      else
        if i == l - 1 then tmp = val
        else if @defined part.p then tmp = {}
        else if @defined part.i then tmp = []

      i++
  defined:(val) ->
    return not (not val and "undefined" is typeof val)
