asset = ""
a = ""
describe "Asset", ->
  beforeEach ->
    asset = ""
    a = ""
  it "should exist", ->
    asset = "<link rel='asset' source='test' type='text/plain' />"
    a = new Asset asset
    expect(a).toBeDefined()

  it "should have properties", ->
    asset = "<link rel='asset' source='test' type='text/plain' />"
    a = new Asset asset
    expect(a.rel).toBeDefined()
    expect(a.name).toBeDefined()
    expect(a.source).toBeDefined()
    expect(a.origin).toBeDefined()

    expect(a.content_type).toBeDefined()
    expect(a.content_type.full).toBeDefined()
    expect(a.content_type.part).toBeDefined()
    expect(a.content_type.type).toBeDefined()
    expect(a.content_type.media).toBeDefined()
    expect(a.content_type.params).toBeDefined()

    expect(a.element).toBeDefined()
    expect(a.create_element).toBeDefined()

  it "should throw error if type if not defined", ->
    asset = "<link source='test' />"

    expect(->a = new Asset asset)
    .toThrow new Error "jom: rel=asset is required"

  it "should throw error if type if not defined", ->
    asset = "<link rel='asset' source='test' />"

    expect(->a = new Asset asset)
    .toThrow new Error "jom: asset type is required"

  it "should throw error if type if not valid", ->
    asset = "<link rel='asset' source='test' type='not/good' />"

    expect(->a = new Asset asset)
    .toThrow new Error "jom: asset media `not/good` type is not valid"

  it "should accept content type params", ->
    asset = "<link rel='asset' source='test' type='text/css; charset=utf-8' />"
    a = new Asset asset
    expect(a.name).toBe null
    expect(a.rel).toBe "asset"
    expect(a.source).toBe "test"
    expect(a.origin.length).toBe 1

    expect(a.content_type.full).toBe "text/css; charset=utf-8"
    expect(a.content_type.part).toBe "text/css"
    expect(a.content_type.type).toBe "text"
    expect(a.content_type.media).toBe "css"
    expect(a.content_type.params).toBe "charset=utf-8"

  it "should accept css", ->
    asset = "<link rel='asset' source='test' type='text/css' />"
    a = new Asset asset
    expect(a.name).toBe null
    expect(a.rel).toBe "asset"
    expect(a.source).toBe "test"
    expect(a.origin.length).toBe 1

    expect(a.content_type.full).toBe "text/css"
    expect(a.content_type.part).toBe "text/css"
    expect(a.content_type.type).toBe "text"
    expect(a.content_type.media).toBe "css"
    expect(a.content_type.params).toBe null

  it "should accept template", ->
    asset = "<link rel='asset' source='test' type='text/template' />"
    a = new Asset asset
    expect(a.name).toBe null
    expect(a.rel).toBe "asset"
    expect(a.source).toBe "test"
    expect(a.origin.length).toBe 1

    expect(a.content_type.full).toBe "text/template"
    expect(a.content_type.part).toBe "text/template"
    expect(a.content_type.type).toBe "text"
    expect(a.content_type.media).toBe "template"
    expect(a.content_type.params).toBe null

  it "should accept javascript", ->
    asset = "<link rel='asset' source='test' type='text/javascript' />"
    a = new Asset asset
    expect(a.name).toBe null
    expect(a.rel).toBe "asset"
    expect(a.source).toBe "test"
    expect(a.origin.length).toBe 1

    expect(a.content_type.full).toBe "text/javascript"
    expect(a.content_type.part).toBe "text/javascript"
    expect(a.content_type.type).toBe "text"
    expect(a.content_type.media).toBe "javascript"
    expect(a.content_type.params).toBe null

  it "should accept json", ->
    asset = "<link rel='asset' source='test' type='text/json' />"
    a = new Asset asset
    expect(a.name).toBe null
    expect(a.rel).toBe "asset"
    expect(a.source).toBe "test"
    expect(a.origin.length).toBe 1

    expect(a.content_type.full).toBe "text/json"
    expect(a.content_type.part).toBe "text/json"
    expect(a.content_type.type).toBe "text"
    expect(a.content_type.media).toBe "json"
    expect(a.content_type.params).toBe null

  it "should accept collection", ->
    asset = "<link rel='asset' source='test' type='text/collection' />"
    a = new Asset asset
    expect(a.name).toBe null
    expect(a.rel).toBe "asset"
    expect(a.source).toBe "test"
    expect(a.origin.length).toBe 1

    expect(a.content_type.full).toBe "text/collection"
    expect(a.content_type.part).toBe "text/collection"
    expect(a.content_type.type).toBe "text"
    expect(a.content_type.media).toBe "collection"
    expect(a.content_type.params).toBe null
