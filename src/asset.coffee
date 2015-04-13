# Base class for asset management
# This class is managed by JOM class, which calls different parts
# this class only keeps vital information about an asset
#
#
class Asset

  # @property [String] uses html name attribute or null if not present
  @name : null
  # @property [String] The url string of the source of asset
  @source : ""
  # @property [String] original link tag which was used to request asset
  @origin : ""
  # @property [Object] full `type/media; charset=utf-8`
  # @property [Object] part `type/media`
  # @property [Object] params `UTF-8`
  # @property [Object] type `UTF-8`
  # @property [Object] asset's, content type
  @content_type : {}
  # @property element [HTMLElement] the new element browser uses to load asset
  @element : {}

  # Construct a new Asset
  # @param asset [String, HTMLElement, jQueryElement]
  # @return [Class_Object] Asset, with it's attributes
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

  # creates an element to load the data,
  # @example <script src="..." type="text/javascript" />
  # @return [String] element returns an html element as a string
  create_element: ->
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
      when 'text/json'
        element = "<script  source='#{@source}'
                            type='#{part}'
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
