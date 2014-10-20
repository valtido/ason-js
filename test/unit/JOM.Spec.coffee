describe "JOM", ->
  it "should be defined", ->
    console.log "Spec JOM"
    expect(JOM).toBeDefined()

  it "Schema should be present", ->
    expect(JOM.Schema).toBeDefined()
    # expect(JSON.stringify JOM.Schema).not.toBe(JSON.stringify {})
  it "Data should be present", ->
    expect(JOM.Data).toBeDefined()
    # expect(JSON.stringify JOM.Data).not.toBe(JSON.stringify {})
