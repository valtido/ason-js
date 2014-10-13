class App
  contructor: (selector)->
    element = $ selector
    config element
    conf = element.config

  config : (apps) ->
    $.each apps, (i,app)->
      app = $(app)
      config = app.attr 'config'
      if typeof config is "string"
        $.getJSON config
        .done (res)->
          app.attr 'config', res
        .fail ->
          # todo: proper errors
          alert('Could not get file')
