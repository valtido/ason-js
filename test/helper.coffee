mock =
  data : {}
  tree : {}


mock.data['login'] = $.getJSON "http://localhost:9000/examples/form/data/login.json"
mock.tree['login'] = $.getJSON "http://localhost:9000/examples/form/data/login.schema.json"


for key, item of mock.tree
  mock.tree["$schema"] ?= "http://json-schema.org/draft-04/schema#"

window['mock'] = mock
