class Component
  constructor: ->
    all = $ 'component'
    all.each (i,n)=>
      @prepare(n)
  prepare: (element) ->
    el = $ element

  @getter 'list', ->
    $ 'component'
