class Observe
  constructor: (root, callback, curr=null, path = null)->
    curr = curr || root

    type_of_curr = curr.constructor.name
    if type_of_curr is "Array"
      for item, key in curr
        if typeof item is "object"
          path = "#{path}[#{key}]" if path
          path = "#{key}" unless path
          new Observe root, callback, item, path
          path = ""

    if type_of_curr is "Object"
      for key, item of curr
        # if item.constructor.name is "Object"
        if typeof item is "object"
          path = "#{path}.#{key}" if path
          path = "#{key}" unless path
          new Observe root, callback, item, path
          path = ""


    if curr.constructor.name is "Array"
      curr_path = path
      Array.observe curr, (changes) ->
        result = {}
        original = {}

        changes.forEach (change,i) ->
          path = "#{path}[#{change.index}]"

          # console.log change
          part =
            path: curr_path
            value : change.object
            # json : JSON.stringify(change.object)
          # if change.type is "add" and typeof part.value is "object"
          if change.addedCount > 0 and typeof part.value is "object"
            new Observe root, callback, part.value, part.path
          result[i] = part
          original[i] = change
        callback result, original
    if curr.constructor.name is "Object"
      Object.observe curr, (changes)->
        result = {}
        original = {}
        changes.forEach (change,i) ->
          curr_path = path
          path = "#{path}.#{change.name}" if path
          path = "#{change.name}" unless path

          part =
            path: path
            value : change.object[change.name]

          if change.type is "add" and typeof part.value is "object"
            new Observe root, callback, part.value, part.path
          result[i] = part
          original[i] = change
        callback result, original
person =
  age: 18
  name:
    birth:
      first:'Valtid'
      last: 'Caushi'
    current:
      first:'Lee'
      last: 'Mack'
  children:['Tom','Ben','Mike']
  mixed: ['Manchester','London',{"town":"barnet", "interests":['Museum','Library','Football']},'liverpool']


# exposed code
new Observe person, (changes,original)->
  console.log "I've changed, promise:", changes[0]


setTimeout ->
  person.age = 55;
, 100
setTimeout ->
  person.children.pop();
, 200
setTimeout ->
  person.children.push("Joe");
, 300
setTimeout ->
  person.children[2]="Kim";
, 400
setTimeout ->
  person.children.sort();
, 500
setTimeout ->
  person.name.birth.first = 'Valtido';
, 600
setTimeout ->
  person.name.birth.middle = 'Xhemil';
, 700
setTimeout ->
  person.hair =
    color : "brown"
, 800
setTimeout ->
  person.mixed[2].interests[2]='Music Festival'
, 900
setTimeout ->
  person.mixed[2].interests.push {alternatives: ['Music Festival',{"tv":'bbc'}]}
, 1000
setTimeout ->
  console.log 'Stimulate future changes: '
  person.mixed[2].interests[3].alternatives[1].tv="ITV"
  console.log "changed to :ITV"
, 1100
