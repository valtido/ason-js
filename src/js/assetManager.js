var AssetManager;

AssetManager = (function() {
  var asset_stack, context, running;

  running = false;

  context = document.head;

  asset_stack = [];

  function AssetManager() {
    $('link[rel="asset"]').not('[status]').each(function(i, asset) {
      var $asset, source, type;
      $asset = $(asset);
      type = $asset.attr('type');
      source = $asset.attr('source');
      return asset_stack.push({
        source: source,
        type: type,
        asset: asset
      });
    });
    this.process();
    this;
  }

  AssetManager.prototype.update_status = function(element, message) {
    var asset_element, el;
    el = $(element);
    if (el.length) {
      asset_element = $(element).prop('asset');
      if (asset_element) {
        el = el.add(asset_element);
      }
      return el.attr('status', message);
    }
  };

  AssetManager.prototype.load = function() {
    return this.update_status(this, "loaded");
  };

  AssetManager.prototype.error = function() {
    var source;
    this.update_status(this, "failed");
    source = $($(this).prop('asset')).attr('source');
    throw new Error("Asset: Failed to load `" + source + "`");
  };

  AssetManager.prototype.process = function() {
    var asset, item, result, _css, _html, _js, _json, _schema;
    _html = [];
    _js = [];
    _css = [];
    _json = [];
    _schema = [];
    while (asset_stack.length) {
      item = asset_stack[0];
      asset = item.asset;
      switch (item.type) {
        case "text/template":
          result = template(item, asset);
          _html.push({
            asset: asset,
            element: result
          });
          break;
        case "text/collection":
        case "application/collection":
          result = collection(item, asset);
          _json.push({
            asset: asset,
            element: result
          });
          break;
        case "text/json":
        case "application/json":
          result = json(item, asset);
          _json.push({
            asset: asset,
            element: result
          });
          break;
        case "text/html":
          result = html(item, asset);
          _html.push({
            asset: asset,
            element: result
          });
          break;
        case "text/javascript":
          result = js(item, asset);
          _js.push({
            asset: asset,
            element: result
          });
          break;
        case "text/stylesheet":
        case "text/css":
          result = css(item, asset);
          _css.push({
            asset: asset,
            element: result
          });
          break;
        default:
          throw new Error("Asset: failed to queue");
      }
      $(result).prop('asset', asset);
      this.update_status(item, 'init');
      result.onload = load;
      result.onerror = error;
      asset_stack.shift();
    }
    this.include(_css);
    this.include(_html);
    this.include(_js);
    this.include(_json);
    if (context.onAssetLoad !== void 0) {
      context.onAssetLoad.apply(context, []);
    }
    this.ready();
    return this;
  };

  AssetManager.prototype.ready = function() {
    if ((window.jom && window.jom.app === void 0) || document.body === null) {
      setTimeout(function() {
        return ready();
      }, 50);
      return false;
    }
    return $('body').trigger('assets_ready');
  };

  AssetManager.prototype.image = function(item, asset) {
    var image;
    image = document.createElement("img");
    image.setAttribute('src', source);
    return image;
  };

  AssetManager.prototype.html = function(item, asset) {
    var link;
    link = document.createElement("link");
    link.setAttribute('href', item.source);
    link.setAttribute('rel', "import");
    link.setAttribute('type', item.type || 'text/javascript');
    return link;
  };

  AssetManager.prototype.template = function(item, asset) {
    var link, name;
    name = $(asset).attr('name');
    if (!name) {
      throw new Error("Asset: template `name` attr required `" + item.source + "`");
    }
    link = document.createElement("link");
    link.setAttribute('href', item.source);
    link.setAttribute('rel', "import");
    link.setAttribute('type', item.type || 'text/javascript');
    return link;
  };

  AssetManager.prototype.json = function(item, asset) {
    var collection, data, script, xhr;
    data = [];
    collection = $(asset).attr("collection");
    if (!(collection && collection.length)) {
      throw new Error("Asset: Collection ID is required");
    }
    script = document.createElement("script");
    xhr = $.getJSON(item.source);
    xhr.done(function(response) {
      var text;
      if (!(response instanceof Array)) {
        if (typeof console !== "undefined" && console !== null) {
          if (typeof console.warn === "function") {
            console.warn("Asset: `%o` should be an Array", response);
          }
        }
      }
      text = JSON.stringify(response);
      script.innerText = script.textContent = text;
      return script.json = response;
    });
    xhr.fail(error);
    script.setAttribute('origin', item.source);
    script.setAttribute('type', 'text/json');
    return script;
  };

  AssetManager.prototype.collection = function(item, asset) {
    var collection, data, script, text, xhr;
    data = [];
    collection = $(asset).attr("name");
    if (!(collection && collection.length)) {
      throw new Error("Asset: Collection `name` attr is required");
    }
    script = document.createElement("script");
    if (item.source) {
      xhr = $.getJSON(item.source);
      xhr.done(function(response) {
        var text;
        if (!(response instanceof Array)) {
          if (typeof console !== "undefined" && console !== null) {
            if (typeof console.warn === "function") {
              console.warn("Asset: `%o` should be an Array", response);
            }
          }
        }
        text = JSON.stringify(response);
        script.innerText = script.textContent = text;
        return script.collection = {
          name: collection,
          data: response
        };
      });
      xhr.fail(error);
    } else {
      text = $(asset).text();
      script.innerText = script.textContent = text;
      script.collection = response;
    }
    if (item.source) {
      script.setAttribute('origin', item.source);
    }
    script.setAttribute('type', 'text/collection');
    script.setAttribute('name', collection);
    return script;
  };

  AssetManager.prototype.js = function(item, asset) {
    var script;
    script = document.createElement("script");
    script.setAttribute('src', item.source);
    script.setAttribute('type', item.type || 'text/javascript');
    return script;
  };

  AssetManager.prototype.css = function(item, asset) {
    var style;
    style = document.createElement("link");
    style.setAttribute('href', item.source);
    style.setAttribute('rel', 'stylesheet');
    style.setAttribute('type', item.type || 'text/css');
    return style;
  };

  AssetManager.prototype.include = function(result) {
    var item, target, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = result.length; _i < _len; _i++) {
      item = result[_i];
      target = item.asset.root || document.head;
      _results.push(target.appendChild(item.element));
    }
    return _results;
  };

  return AssetManager;

})();

//# sourceMappingURL=../map/assetManager.js.map
