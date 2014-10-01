### Temp Data OBJ ###
$data =
  login :
    username: 'Valtid'
    password: 'abc123'
### Temp Data OBJ ###

class Form
  elements : {}
  form_data_key : ''
  constructor: (selector)->
    form = $(selector)
    elements = $('[key]',form)
    form_key = form.attr('key')
    @form_data_key = form_key

    return console.warn "Form init: already initialized once before" unless form.data('init') != true
    throw new Error "Form key: was not found." unless form_key
    throw new Error "Form key: found but incorrect" unless $data[@form_data_key]

    form.data 'init',true

    for element, key in elements
      key  = $(element).attr 'key'
      $(element).val $data[@form_data_key][key]

    @bind_events form
    @bind_events form
    return @ unless form.length

    form

  bind_events: (form) ->
    $ 'body'
    .on 'change save', '[key]' ,->
      val = $(this).val()
      key = $(this).attr('key')

      $(this).trigger 'error' unless key
    .on 'error', '[key]' ,->
      throw new Error "Controller error"

  get: ()->
    @data
