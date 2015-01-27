Function::getter = (prop, get) ->
  Object.defineProperty @prototype, prop, {
    get, configurable: yes,enumerable: false
  }

Function::setter = (prop, set) ->
  Object.defineProperty @prototype, prop, {
    set, configurable: yes, enumerable: false
  }

Function::property = (prop, desc) ->
  Object.defineProperty @prototype, prop, desc

unless $.fn.findAll?
  $.fn.findAll = (selector) ->
    return this.find(selector).add(this.filter(selector))
unless $.fn.value?
  $.fn.value = (val, text=false)->
    console.log "go back to value change how it works"
    # debugger
    if val
      $(this).data('value',arguments[0])
      if text is true
        txt = $.trim val
        $(this).text txt
      $(this).trigger 'jom.change'
      return $(this)

    return $(this).data 'value'
