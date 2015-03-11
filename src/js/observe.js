var Observe;

Observe = (function() {
  function Observe(root, callback, curr, path) {
    var base, item, key, new_path, type_of_curr, _i, _len;
    if (curr == null) {
      curr = null;
    }
    if (path == null) {
      path = null;
    }
    curr = curr || root;
    if (!root) {
      throw new Error("Observe: Object missing.");
    }
    if (typeof callback !== "function") {
      throw new Error("Observe: Callback should be a function.");
    }
    type_of_curr = curr.constructor.name;
    if (type_of_curr === "Array") {
      base = path;
      for (key = _i = 0, _len = curr.length; _i < _len; key = ++_i) {
        item = curr[key];
        if (typeof item === "object") {
          new_path = "" + (base || '') + "[" + key + "]";
          new Observe(root, callback, item, new_path);
          new_path = "";
        }
      }
    }
    if (type_of_curr === "Object") {
      base = path;
      for (key in curr) {
        item = curr[key];
        if (typeof item === "object") {
          if (base) {
            new_path = "" + base + "." + key;
          }
          if (!base) {
            new_path = "" + key;
          }
          new Observe(root, callback, item, new_path);
          new_path = "";
        }
      }
    }
    if (curr.constructor.name === "Array") {
      base = path;
      Array.observe(curr, function(changes) {
        var original, result;
        result = {};
        original = {};
        changes.forEach(function(change, i) {
          var index_or_name, is_add, part;
          index_or_name = change.index > -1 ? change.index : change.name;
          new_path = "" + (base || '') + "[" + index_or_name + "]";
          part = {
            path: new_path,
            value: change.object[change.index] || change.object[change.name] || change.object
          };
          is_add = change.addedCount > 0 || change.type === "add";
          if (typeof part.value === "object" && is_add) {
            new Observe(root, callback, part.value, part.path);
            new_path = "";
          }
          result[i] = part;
          return original[i] = change;
        });
        return callback(result, original);
      });
    } else if (curr.constructor.name === "Object") {
      base = path;
      Object.observe(curr, function(changes) {
        var original, result;
        result = {};
        original = {};
        changes.forEach(function(change, i) {
          var is_add, part;
          if (base) {
            new_path = "" + base + "." + change.name;
          }
          if (!base) {
            new_path = "" + change.name;
          }
          part = {
            path: new_path,
            value: change.object[change.name]
          };
          is_add = change.type === "add" || change.addedCount > 0;
          if (typeof part.value === "object" && is_add) {
            new Observe(root, callback, part.value, part.path);
            new_path = "";
          }
          result[i] = part;
          return original[i] = change;
        });
        return callback(result, original);
      });
    }
  }

  return Observe;

})();

//# sourceMappingURL=../map/observe.js.map
