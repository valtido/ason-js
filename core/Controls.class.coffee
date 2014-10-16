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


  @getter "length", ->
    i = 0
    for k, item of @app
      i++
    # return result
    console.log i
    i
ason = Ason
$ ->
  window["x"] = new Ason()

class Schema extends Ason
  constructor: (@selector)->
    @origin = @selector
    # @tree = new Tree

class Collection extends Ason
  constructor: (@selector)->    @selector
class Human extends Ason
  constructor: (@selector)->    @selector
class Machine extends Ason
  constructor: (@selector)->    @selector
class Lang extends Ason
  constructor: (@selector="en")->    @selector

class App extends Ason
  constructor: (@selector)->
    @element     = $ @selector

    console.warn "App: no app found." unless @element.lenght is 0 and console?.warn?

    @controllers = $.each $('controller', @element), (i, controller)->
      new Controller controller, @element
    @schema      = new Schema @element.attr("schema") || {}
    @human       = new Human @element.attr("human") || {}
    @machine     = new Machine @element.attr("machine") || {}
    @lang        = new Lang @element.attr("lang") || 'en'


    return @


class Controller extends Ason
  constructor: (@selector, @context = [])->
    @controller = $ @selector, @context || $ 'controller', @context
    return @controller




  attach_events: ()->
    klass = @
    $ 'body'
    .on 'blur keyup', 'form [key]' , (event)->
      val  = $(this).val()
      key  = $(this).attr 'key'
      type = $(this).data 'controlDataType'

      val = new Number val if type == "number"
      val = new String val if type == "string"

      switch val.constructor.name.toLowerCase()
        when "string"
          $data[klass.form_key][key] = val
          $($(this).data('control')).trigger 'change'
        when "number"
          $data[klass.form_key][key] = val
          $($(this).data('control')).trigger 'change'

    .on 'submit', @selector, (event)->
      event.preventDefault()
      console.log klass.data()
      xjson = "xjson": klass.data()
      console.log JSON.stringify xjson
