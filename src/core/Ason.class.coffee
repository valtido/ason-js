ason = {} unless ason isnt undefined
Function::getter = (prop, get) ->
  Object.defineProperty @prototype, prop, {get, configurable: yes}

Function::setter = (prop, set) ->
  Object.defineProperty @prototype, prop, {set, configurable: yes}

Function::property = (prop, desc) ->
  Object.defineProperty @prototype, prop, desc

# configure enviroment if not defined...
ason.env = "dev" unless ason.env

class Ason
  constructor: ()->
    @app = {}
    @root = undefined

  app_loader: ->
    for app, key in $ 'app','body'
      get_key = $ app
        .attr 'key'
      @app[get_key] = new App app

new Ason()
