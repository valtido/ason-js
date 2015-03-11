describe "Other things", ->
  it "should cover helper get/set stuff", ->
    expect(Function.setter).toBeDefined()
    expect(typeof Function.setter).toBe "function"
    expect(Function.getter).toBeDefined()
    expect(Function.property).toBeDefined()

  it "should cover jQuery stuff", ->
    expect($.fn.findAll).toBeDefined()
    expect($("*").findAll("*")).toBeDefined()
    expect($("div").value).toBeDefined()
    expect($("div").value("a")).toBeDefined()
