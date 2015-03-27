t = ""
template = ""
describe "Template", ->
  beforeEach ->
    t = ""
    template = ""
    jom.clear_cache()
    jom.clear_stack()

  it "should exist", ->
    expect(Template).toBeDefined()

  it "should have properties", ->
    t = "<template name=user><div body></div></template>"
    template = new Template t

    expect(template.name).toBeDefined()
    expect(template.element).toBeDefined()
    # expect(template.content).toBeDefined()
    expect(template.body).toBeDefined()

  it "should throw error if no arguments", ->
    expect(-> template = new Template())
    .toThrow new Error "jom: template is required"

  it "should throw error if no name found", ->
    t = "<template></template>"

    expect(-> template = new Template t)
    .toThrow new Error "jom: template name attr is required"


  it "should throw error if no body found", ->
    t = "<template name=profile> <div> My text </div> </template>"

    expect(-> template = new Template t)
    .toThrow new Error "jom: template body attr is required"
