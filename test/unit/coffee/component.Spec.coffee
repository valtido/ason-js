component = {}
describe "components", ->
  beforeEach ()->
    component = {}

  it "should exists", ->
    expect(Component).toBeDefined()

  it "should have properties defined", ->
    cc3 = ''
    # console.log component.constructor
    c1 = $ "<component />"
    c2 = $ "<component template='template_name' />"
    c3 = $ "<component template='template_name' collection='collection_name'/>"
    expect(-> cc1 = new Component c1)
    .toThrow new Error "jom: template is required"
    expect(-> cc2 = new Component c2)
    .toThrow new Error "jom: collection is required"
    expect(-> cc3 = new Component c3)
    .not.toThrow new Error "jom: collection is required"

    expect(cc3.transform).toBeDefined()
