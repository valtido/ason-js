describe "Other things", ->
  it "should cover helper get/set stuff", ->
    expect(Function.setter).toBeDefined()
    expect(Function.getter).toBeDefined()
    expect(Function.property).toBeDefined()

    class XFAKE
      constructor: (@firstName, @lastName) ->
      @getter "length",-> 1
      @getter "add",-> 5
      @setter "add", (value)-> @value = 5
      @property "fullname",
        get: ->  "#{@firstName} #{@lastName}"
        set: (name) -> [@firstName, @lastName] = name.split ' '

    fake = new XFAKE("Valtid", "Caushi")

    expect(fake.length).toBe 1
    fake.add = 10
    expect(fake.value).toBe 5
    expect(fake.firstName).toBe "Valtid"
    expect(fake.lastName).toBe "Caushi"

  it "should cover jQuery stuff", ->
    expect($.fn.findAll).toBeDefined()
    expect($("*").findAll("*")).toBeDefined()
    expect($("div").value).toBeDefined()
    expect($("div").value("a")).toBeDefined()
    expect($("div").value("a",true)).toBeDefined()
    expect($("div").value("a",false)).toBeDefined()
    expect($("div").value("a","woof")).toBeDefined()
    expect($("div").value()).not.toBeDefined()
