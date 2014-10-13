class xapp
  constructor: ()->
    form = $ 'form'; new Form form if form.length

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

class Form extends xapp
  constructor: (@selector)->
    throw new Error "Form: $data object not found" unless $data
    throw new Error "Form: Selector missing" unless @selector

    forms = $ selector
    @form_key = ''
    @controls = []

    if forms.length is 1
      @attach_events()
      form = forms
      @form_key = $(form).attr 'key'
      data = $data[@form_key]

      throw new Error "Form: form key was not found" unless @form_key
      throw new Error "Form: data was not found" unless data

      form.find '[key]'
      .each (key, item)=>
        @controls.push new Control item
    else
      $.each forms, (i, form) ->
        new Form form
    forms


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
