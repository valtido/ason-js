Function::getter = (prop, get) ->
  Object.defineProperty @prototype, prop, {get, configurable: yes}

Function::setter = (prop, set) ->
  Object.defineProperty @prototype, prop, {set, configurable: yes}

class xapp
  constructor: ()->
    @data = {}
    form = $ 'form'; new Form form if form.length
  @getter "length", ->
    i = 0
    for k, item of @data
      i++
    # return result
    console.log i
    i
x = ->
  new xapp.apply arguments


class Xtype extends xapp
  element : []
  form_key: ''
  constructor: (@selector, @value)->
    @element = $ selector
    @type    = @element.attr 'xtype' || "input"

    @form    = @element.parents 'form'
    throw new Error "Xtype: Form not found." unless @form.length

    @form_key = @form.attr 'key'
    throw new Error "Xtype: Form key was not found" unless @form_key

    if @type is "input"
      @changeVal @element, @value
      @element.data 'control', @input
      @element.data 'controlDataType', typeof @value

  changeVal: (element,value)->
    @element.val @value if @element.attr 'key'

class Control extends xapp
  constructor: (selector)->
    element = $ selector

    @form    = element.parents 'form'
    throw new Error "Control: Form not found." unless @form.length

    throw new Error "Control: form key was not found" unless @form.form_key

    control_key = element.attr 'key'

    if control_key
      value = $data[form_key][control_key]
      xtype = new Xtype selector, value

class Schema extends xapp
  constructor: (@data, @tree) ->
    throw new Error "Schema: Data is missing" unless @data
    throw new Error "Schema: Schema strucutre is missing" unless @tree
    @valid @data, @tree
    @

  @getter "valid", (@data, @tree) ->
    tv4.validateMultiple(@data, @tree)

class String_convert_to extends xapp
  constructor : (@data, @to) ->
    switch @to.toLowerCase()
      when "string" then result  = @data
      when "number" then result  = new Number @data
      when "boolean" then result = new Boolean @data
      when "array" then result   = new Array @data
      when "symbol" then result  = new Symbol @data
    # return
    result
class Data extends xapp
  constructor: (@data)->
    # check for data type and try to convert to an object.
    switch typeof @data
      when "string"
        result = @string_to_object()
      when "object"
        result = @data
      else
        throw new Error "Data: only `String, Object` allowed"
    # return result
    result

  string_to_object: ()->
    @data = @data.trim()
    if @data[0] is "{" and @data[@data.length] is "}"
      return @data = JSON.parse @data


class Form extends xapp
  constructor: (@selector)->
    throw new Error "Form: Selector misrohrewhsing" unless @selector
    form = $ selector
    throw new Error "Form: No form found" if form.length is 0

    form = $ selector
    @form = form

    # multiple forms, new instances
    if form.length > 1
      $.each form, (i, item) -> new Form item
      return @

    # check for Schema
    data = new Data form.attr('data')
    @Schema = new Schema data, form.attr 'Schema'

    throw new Error "Form: $data object not found" unless xapp.data


    @form_key = ''
    @controls = []

    @attach_events()
    @form_key = $(form).attr 'key'
    data = $data[@form_key]

    throw new Error "Form: form key was not found" unless @form_key
    throw new Error "Form: data was not found" unless data

    form.find '[key]'
    .each (key, item)=>
      @controls.push new Control item
    form


  serialize: ()->
  serialize_array: ()->
  data: ()->
    throw new Error "Form: could not get data, key not found." unless @form_key
    data = {}
    data[@form_key] = $data[@form_key]
    data

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
