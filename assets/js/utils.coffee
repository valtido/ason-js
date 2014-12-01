unless $.fn.findAll?
  $.fn.findAll = (selector) ->
    return this.find(selector).add(this.filter(selector))
unless $.fn.value?
  $.fn.value = (val, text=false)->
    if val
      $(this).data('value',arguments[0])
      if text is true
        txt = $.trim val
        $(this).text txt
      $(this).trigger 'jom.change'
      return $(this)

    return $(this).data 'value'
