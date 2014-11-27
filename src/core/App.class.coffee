class App
  collection_handler = (app, collections) ->
    for name, collection of collections
      app.collections = new Collection ("#{name}").toLowerCase(), collection
  constructor: (app) ->
    throw new Error "App: app `#{app}` not found" unless app
    throw new Error "App: ns `#{app}` not found" unless app.ns
    @ns    = app.ns
    @title = app.title or @ns
    @description = app.description or ""

    # prepare collections
    collection_handler @, app.collections

    app

$ ->
  apps = ason.app or []
  apps = [apps] if apps.constructor.name.toLowerCase() is "object"
  for app in apps
    new App app

  apps
