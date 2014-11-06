class App
  constructor: ->
    app = ason.app
    throw new Error "App: app info is missing" unless app

    type = app.constructor.name
    switch type
      when "Array"
        # multi apps trigger
        for key, item of app
          @single item
      when "Object"
        # single app should trigger
        @single app
  single: (app) ->
    # prepare collections
    new Collection app.collections

new App()
