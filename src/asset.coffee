class Asset
  constructor : (asset)->
    $asset   = $ asset
    @rel     = $asset.attr "rel"
    throw new Error "jom: rel=asset is required" if @rel is undefined
    @name    = ($asset.attr "name") or null
    @source  = $asset.attr "source"
    @origin  = $asset.clone()

    type    = $asset.attr "type"
    throw new Error "jom: asset type is required" if type is undefined
    split  = type.split(";")
    part   = $.trim(split[0])
    params = $.trim(split[1]) || null

    @content_type =
      full   : type
      part   : part
      type   : part.split("/")[0]
      media  : part.split("/")[1]
      params : params

    $asset.get(0).asset = true
    @element = @create_element()

    @
  # create_element: (asset)->
  create_element: (asset)->
    part = @content_type.part

    switch part
      when 'text/template'
        element = "<link    rel=import
                            href='#{@source}'
                            type='text/template'
                            />"
      when 'text/css'
        element = "<link    href='#{@source}'
                            rel='stylesheet'
                            type='text/css'
                            />"
      when 'text/javascript'
        element = "<script  src='#{@source}'
                            type='text/javascript'
                            async=true
                            />"
      when 'text/json', "text/collection"
        element = "<script  src='#{@source}'
                            type='text/json'
                            async='true'
                            name='#{@name}'
                            />"
      when "text/plain"
        element = "<script  type='#{part}'
                            async='true'
                            />"
      else
        element = null
        console?.warn? "media: ", part
        throw new Error "jom: asset media `#{@content_type.full}` type
                              is not valid"

    return element
