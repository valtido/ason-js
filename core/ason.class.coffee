Function::getter = (prop, get) ->
  Object.defineProperty @prototype, prop, {get, configurable: yes}

Function::setter = (prop, set) ->
  Object.defineProperty @prototype, prop, {set, configurable: yes}

class Ason
  constructor: ()->
    @app = {}
    for app, key in $ 'app','body'
      get_key = $ app
        .attr 'key'
      @app[get_key] = new App app


ason = Ason
$ ->
  window["x"] = new Ason()

class Schema extends Ason
  constructor: (@selector)->
    @origin = @selector
    # @tree = new Tree

class Collection extends Ason
  @data = []
  constructor: (@selector)->
    # DOT seperated list
    @data unless @selector
    @selector = @selector.split(".")
    throw new Error "Collection: not found" if @data[@selector] isnt undefined
    @data[@selector]

class Human extends Ason
  constructor: (@selector)->    @selector
class Machine extends Ason
  constructor: (@selector)->    @selector
class Lang extends Ason
  constructor: (@selector="en")->    @selector

class App extends Ason
  constructor: (@selector)->
    @element     = $ @selector
    return @ if @element is 0
    @controllers = $.each $('controller', @element), (i, controller)->
      new Controller controller, @element
    @collection  = new Collection @element.attr("collection") || {}
    @schema      = new Schema @element.attr("schema") || {}
    @human       = new Human @element.attr("human") || {}
    @machine     = new Machine @element.attr("machine") || {}
    @lang        = new Lang @element.attr("lang") || 'en'

    @attach_events()

    return @
  change: (key,value) ->

  save: () ->
    @collection
  attach_events: ()->
    # div[key="remember"]
    $ 'body'
    .on 'save', 'app' , (event)=>
      console.log 'app saving'
      @save()
    .on 'change', 'app' , (event)->
      val  = $(this).data('value')
      key  = $(this).attr 'key'

    .on 'submit', 'form', (event)->
      event.preventDefault()
      $ this
      .parents 'app'
      .eq 0
      .trigger 'save'


class Controller extends Ason
  constructor: (@selector, @context = [])->
    @controller = $ @selector, @context || $ 'controller', @context
    return @controller
