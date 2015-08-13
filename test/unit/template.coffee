t = ""
template = ""
describe "Template", ->
  beforeEach ->
    t = ""
    template = ""

  it "should exist", ->
    expect(Template).toBeDefined()

  it "should have properties", ->
    t = "<template name=user schemas='users'><div body></div></template>"
    template = new Template t

    expect(template.name).toBeDefined()
    expect(template.element).toBeDefined()
    # expect(template.content).toBeDefined()
    expect(template.body).toBeDefined()
    expect(template.schemas).toBeDefined()

  it "should throw error if no arguments", ->
    expect(-> template = new Template())
    .toThrow new Error "jom: template is required"

  it "should throw error if no name found", ->
    t = "<template></template>"

    expect(-> template = new Template t)
    .toThrow new Error "jom: template name attr is required"

  it "should throw error if no schema found", ->
    t = "<template name=profile><div body> My text </div> </template>"

    expect(-> template = new Template t)
    .toThrow new Error "jom: template schemas attr is required"

  it "should throw error if no body found", ->
    t = "<template name=profile> <div> My text </div> </template>"

    expect(-> template = new Template t)
    .toThrow new Error "jom: template body attr is required"

  it "should produce a clone of the template", ->
    t = "<template name=user schemas=users><div body></div></template>"
    template = new Template t

    template.clone()
    expect(template.cloned).toBeDefined()
    expect(template.cloned).not.toEqual null

  describe "template schemas,", ->
    it "should require the same amount of schemas", ->
      template = new Template '<template name=user schema=user></template>'
      expect(template.schemas_list.length).toBe 1

      template = new Template '<template name=user schema="user,comment"></template>'
      expect(template.schemas_list.length).toBe 2
