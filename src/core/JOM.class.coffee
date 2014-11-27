###
# Json Object Model

 required: Schema Tree && Machine Data && ~Human Data (~ optional)
 @tree is schema, describes how data should be structured (hierarchically)
 @human are data to display to user,
   e.g: a list of data from a drop down.
   animal = ['dog','cat','horse','mouse']
 @machine are data, which machine can manipulate
   this usually indicates the current state of type of pets of a user
   animal = ['cat']

the above would yield a dropdown: (jade style, convert to html if you wish)
Jade Lang: convert to HTML using:  http://html2jade.org/

```
select
  option(value="dog")
  option(value="cat" selected="selected")
  option(value="horse")
  option(value="mouse")
```
###

# the component `<select>` should know how to handle machine, and human data
# and make logical decisions to display and indicate to user which `options`
# are available, and those which are already selected.

class JOM
  constructor: ()->
    # @Data       = {}
    # @Schema     = {}
    @Collection = {}
    @Component  = {}
    @Template  = {}

    return @

  val: (path, value)->
    collection = window.JOM.Collection
    get_jom_path     = Prop path, @Collection
    is_path_defined  = get_jom_path isnt undefined
    is_value_defined = value isnt undefined
    throw new Error "JOM: `#{path}` is `#{get_jom_path}` in JOM.Collection" unless path and is_path_defined
    Prop path, collection unless is_value_defined

    #all good now, do change collection values, from path
    Prop path, collection, value

JOM = new JOM()
