# Json Object Model

# required: Schema Tree && Machine Data && ~Human Data (~ optional)
# @tree is schema, describes how data should be structured (hierarchically)
# @human are data to display to user,
#   e.g: a list of data from a drop down.
#   animal = ['dog','cat','horse','mouse']
# @machine are data, which machine can manipulate
#   this usually indicates the current state of type of pets of a user
#   animal = ['cat']

# the above would yield a dropdown: (jade style, convert to html if you wish)
### Jade Lang: convert to HTML using:  http://html2jade.org/
select
  option(value="dog")
  option(value="cat" selected="selected")
  option(value="horse")
  option(value="mouse")
###

# the component `<select>` should know how to handle machine, and human data
# and make logical decisions to display and indicate to user which `options`
# are available, and those which are already selected.

class JOM
  constructor: ()->
    @Schema     = {}
    @Data       = {}
    @Collection = {}
    @Component  = {}
    @Template   = {}

    @collections()
    return @

  collections: ->
    Observe @Collection, (changes) ->
      for key, change of changes
        element = $(shadow.document).find("[path='#{change.path}']")

        # automatically change the text
        jom = element.data 'jom'
        element.text change.value if jom?.text? is true

        # automatically change the attributes
        if jom?.attrs?
          for key, attr of jom.attrs
            element.attr key, change.value

        $(element).trigger 'jom.change', change.value
        $(shadow.host).trigger 'change', change.value
        @


JOM = new JOM()
