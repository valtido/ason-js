describe "Form", ->
  it "should have a key='' attribute", ->
    expect($('form').attr('key')).toBe 'login_form'
    browser.get '/'
