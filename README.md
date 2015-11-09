[![License][LicenseIMGURL]][LicenseURL] [![NPM version][NPMIMGURL]][NPMURL] [![Dependency Status](https://gemnasium.com/valtido/jom.svg)](https://gemnasium.com/valtido/jom) [![Build Status](https://travis-ci.org/valtido/jom.svg?branch=master)](https://travis-ci.org/valtido/jom)
==
[NPMIMGURL]:                https://img.shields.io/npm/v/minify.svg?style=flat
[NPMURL]:                   //npmjs.org/package/minify
[LicenseIMGURL]:            https://img.shields.io/badge/license-MIT-317BF9.svg?style=flat
[LicenseURL]:               https://tldrlegal.com/license/mit-license "MIT License"
[Eradication of Forms]:     http://wp.me/p2HjHX-5x "Eradication of Forms"
[Asset Manager]:            http://wp.me/p2HjHX-5J "Asset Manager"
[data structure]:           http://wp.me/p2HjHX-5J "Data Structure"

JOM (JSON Object Model)
==
Why jom? it just sounds good.

Objective:
==
This is an experimental front-end tool, which will help speed up dev work-flow by
achieving the following:

- [x] Automation of collection/data binding (JSON data)
- [x] Automation of template binding
- [x] JavaScript and CSS Encapsulation (as much as possible)
- [x] Modularizing and breaking down front-end to components
- [x] Maintain data structures (optional JSON schema )
- [x] Eradicating the use of forms in front-end [Eradication of Forms]
- [x] Better Asset Manager (also read more...) [Asset Manager]
- [ ] Communicate with the server with the same data structure [data structure]

**Note**: Asset Manager helps to keep a consistent way to load assets on to the page

By creating modules, they can be reused through out the website, this helps
to organise your files better as well as share the component with others.

A good example would be a date-picker, color-picker, or tabs and many more UI
tools you can think of.
TODO:
==
- [ ] Complete full Documentation
- [ ] Communicate with the server with the same data structure [data structure]
- [ ] Remove jQuery references and dependency
- [ ] Improve on Unit Tests

Dependencies:
==
- jQuery: http://jquery.com/ (for the time being)
- Web Components: https://github.com/webcomponents/webcomponentsjs (for legacy browsers)


Downloading:
==
Will add later

Getting started:
==

```jade
//- index.jade
head
  //- Load JOM itself
  script(type="text/javascript" src="jom.min.js")

  //- load assets (order is not relevent)
  link(rel="asset" source="data.json" type="text/html" asset="template")
  link(rel="asset" source="data.json" type="text/json" asset="collection" name="my_collection" schema="[optional]" )
body
  //- use the new component
  component(template="my_template" collection="my_collection" path="[0]")
```
```jade
//- template.jade
template(name="my_template")
  style.
    div[body]{background: white; padding: 20px;}
    span{padding-right: 20px;display: inline-block; width: 100px;}
    div{margin-bottom: 10px;}
  div(body)
    h1 View
    div
      span Firstname:
      span ${name.first}
    div
      span Lastname:
      span ${name.last}
    div
      span Location
      span ${location}
    br
    hr
    br
    h1 Edit
    div
      span Change name:
      input.first(type="text" value="${name.first}")
      input.last(type="text" value="${name.last}")
    div
      span Location:
      input.location(type="text" value="${location}")
  script.
    $(body)
    .on('change keyup',".location", function(event){
      doc.location = $(this).val()
    })
    .on('change keyup',".first", function(event){
      doc.name.first = $(this).val()
    })
    .on('change keyup',".last", function(event){
      doc.name.last = $(this).val()
    })
    ;

```

```json
//- data.json
[
  {
    "name":{
      "first"    : "Valtid",
      "last"     : "Caushi"
    },
    "location" : "London"
  },
  {
    "name":{
      "first"    : "John",
      "last"     : "Doe"
    },
    "location" : "New York"
  }
]
```

#Assets
Assets are HTML LINK tags, which will not load anything until jom is loaded.

Assets are really smart they load when they are needed, groupped by their type and load the most important parts first.

## Tag:

`<link />`
###Examples:
`link(rel="asset" source="data.json" type="text/json" asset="collection" name="my_collection" schema="my_schema" )`
`link(rel="asset" source="data.html" type="text/html" asset="template")`
`link(rel="asset" source="schema.json" type="text/json" asset="template" name="my_schema")`
## Attributes:
A list of attributes to use for the asset
###rel="asset"    (required, always)
This attribute allows JOM to treat this as a JOM Asset and leave others to be treated as they are. This is useful, because we only allow users to opt in to use this method of asset management, instead of forcing users to use it.
###source="..."   (required)
This is the source attribute which accepts a file name to fetch from the server.
###type="..."    (required)
This allows you to add the mime-type of the data loaded.
###asset="..."   (required) 
Type of asset you wish to load
`collection, schema, template(s), image`
This list is most likely to expand in the future and make other assets available on per request bases when they are needed to allow our work to focus on other areas.

###name="..."   (optional)
A unique name to associate with this asset, so it can be used later on when needed as a reference.

##Asset Specific Attributes:
This types of attributes are optional and specific to a type of asset, as some assets may need extra information such as collections may also require a schema to validate data but other assets this may not be useful at all.

If use on other assets it will just simply be a redundent attribute but it will not disrupt anything at all.
###schema="..."     (collections)
This attribute is a reference to another asset `name="schemaName"` if found it will bind a schema with a collection, same schema can be used with multiple collections but it is not wise to do so as why would you need the same/similar data on two different palces but each to their own :).


