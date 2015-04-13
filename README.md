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
- [ ] Documentation
- [ ] Communicate with the server with the same data structure [data structure]

Dependencies:
==
- jQuery: http://jquery.com/
- Web Components: https://github.com/webcomponents/webcomponentsjs
- jjv : https://github.com/acornejo/jjv (optional unless json schema is used)

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
    link(rel="asset" source="data.json" type="text/template" name="my_template")
    link(rel="asset" source="data.json" type="text/json" name="my_collection")
  body
    //- use the new component
    component(template="my_template" collection="my_collection" path="[0]")




  //- /template.jade
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
        data.location = $(this).val()
      })
      .on('change keyup',".first", function(event){
        data.name.first = $(this).val()
      })
      .on('change keyup',".last", function(event){
        data.name.last = $(this).val()
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
