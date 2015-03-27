s = ""
describe "Shadow", ->
  beforeEach ->
    s = ""
    $('foot').html("")
    $('body').html("")
    $('head link[rel=asset]').remove()
    $('component').remove()

    jom.clear_cache()
    jom.clear_stack()

  it "Should exist", ->
    expect( Shadow ).toBeDefined()

  it "Should not throw errors", ->
    expect( -> s = new Shadow() ).not.toThrow()

  it "Should have properties defined", ->
    s = new Shadow()

    expect(s.root).toBeDefined()
    expect(s.body).toBeDefined()
    expect(s.host).toBeDefined()
    expect(s.traverseAncestry).toBeDefined()

  it "Should test traverseAncestry", ->
    window["sh"] = "valtid"
    s = "<script> window['sh'] = new Shadow();</script>"
    t = $ "<template>#{s}</template>"

    com = $('<component />').get(0)
    $(com).appendTo document.body

    com = wrap com if com.createShadowRoot is undefined
    shad = com.createShadowRoot()

    c = document.importNode t.get(0).content, true
    shad.appendChild c

    sh.root = com.shadowRoot
    sh.traverseAncestry(true)

    expect(sh.host.tagName.toLowerCase()).toBe "component"

  it "Should test traverseAncestry", ->
    window["sh"] = "valtid"
    s = "<script> window['sh'] = new Shadow();</script>"
    t = $ "<template>#{s}</template>"

    com = $('<component template=t collection=c />').get(0)
    $(com).appendTo document.body

    com = wrap com if com.createShadowRoot is undefined
    shad = com.createShadowRoot()

    c = document.importNode t.get(0).content, true
    shad.appendChild c

    sh.root = com.shadowRoot
    sh.traverseAncestry(false)

    expect(sh.host.tagName.toLowerCase()).toBe "component"
