#
#  Tested against Chromium build with Object.observe and acts EXACTLY the same,
#  though Chromium build is MUCH faster
#
#  Trying to stay as close to the spec as possible,
#  this is a work in progress, feel free to comment/update
#
#  Specification:
#    http://wiki.ecmascript.org/doku.php?id=harmony:observe
#
#  Built using parts of:
#    https://github.com/tvcutsem/harmony-reflect/blob/master/examples/observer.js
#
#  Limits so far;
#    Built using polling... Will update again with polling/getter&setters to make things better at some point
#
#TODO:
#  Add support for Object.prototype.watch -> https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/watch
#
unless Object.observe
  ((extend, global) ->
    "use strict"
    isCallable = ((toString) ->
      s = toString.call(toString)
      u = typeof u
      (if typeof global.alert is "object" then isCallable = (f) ->
        s is toString.call(f) or (!!f and typeof f.toString is u and typeof f.valueOf is u and /^\s*\bfunction\b/.test("" + f))
       else isCallable = (f) ->
        s is toString.call(f)
      )
    )(extend::toString)

    # isNode & isElement from http://stackoverflow.com/questions/384286/javascript-isdom-how-do-you-check-if-a-javascript-object-is-a-dom-object
    #Returns true if it is a DOM node
    isNode = isNode = (o) ->
      (if typeof Node is "object" then o instanceof Node else o and typeof o is "object" and typeof o.nodeType is "number" and typeof o.nodeName is "string")


    #Returns true if it is a DOM element
    isElement = isElement = (o) ->
      #DOM2
      (if typeof HTMLElement is "object" then o instanceof HTMLElement else o and typeof o is "object" and o isnt null and o.nodeType is 1 and typeof o.nodeName is "string")

    _isImmediateSupported = (->
      !!global.setImmediate
    )()
    _doCheckCallback = (->
      if _isImmediateSupported
        _doCheckCallback = (f) ->
          setImmediate f
      else
        _doCheckCallback = (f) ->
          setTimeout f, 10
    )()
    _clearCheckCallback = (->
      if _isImmediateSupported
        _clearCheckCallback = (id) ->
          clearImmediate id
      else
        _clearCheckCallback = (id) ->
          clearTimeout id
    )()
    isNumeric = isNumeric = (n) ->
      not isNaN(parseFloat(n)) and isFinite(n)

    sameValue = sameValue = (x, y) ->
      return x isnt 0 or 1 / x is 1 / y  if x is y
      x isnt x and y isnt y

    isAccessorDescriptor = isAccessorDescriptor = (desc) ->
      return false  if typeof (desc) is "undefined"
      "get" of desc or "set" of desc

    isDataDescriptor = isDataDescriptor = (desc) ->
      return false  if typeof (desc) is "undefined"
      "value" of desc or "writable" of desc

    validateArguments = validateArguments = (O, callback, accept) ->

      # Throw Error
      throw new TypeError("Object.observeObject called on non-object")  if typeof (O) isnt "object"

      # Throw Error
      throw new TypeError("Object.observeObject: Expecting function")  if isCallable(callback) is false

      # Throw Error
      throw new TypeError("Object.observeObject: Expecting unfrozen function")  if Object.isFrozen(callback) is true
      throw new TypeError("Object.observeObject: Expecting acceptList in the form of an array")  unless Array.isArray(accept)  if accept isnt `undefined`

    Observer = (Observer = ->
      wraped = []
      Observer = Observer = (O, callback, accept) ->
        validateArguments O, callback, accept
        accept = [ "add", "update", "delete", "reconfigure", "setPrototype", "preventExtensions" ]  unless accept
        Object.getNotifier(O).addListener callback, accept
        if wraped.indexOf(O) is -1
          wraped.push O
        else
          Object.getNotifier(O)._checkPropertyListing()

      Observer::deliverChangeRecords = Observer_deliverChangeRecords = (O) ->
        Object.getNotifier(O).deliverChangeRecords()

      wraped.lastScanned = 0
      f = (f = (wrapped) ->
        _f = ->
          i = 0
          l = wrapped.length
          startTime = new Date()
          takingTooLong = false
          i = wrapped.lastScanned
          while (i < l) and (not takingTooLong)
            if _indexes.indexOf(wrapped[i]) > -1
              Object.getNotifier(wrapped[i])._checkPropertyListing()
              takingTooLong = ((new Date()) - startTime) > 100 # make sure we don't take more than 100 milliseconds to scan all objects
            else
              wrapped.splice i, 1
              i--
              l--
            i++
          wrapped.lastScanned = (if i < l then i else 0) # reset wrapped so we can make sure that we pick things back up
          _doCheckCallback _f
      )(wraped)
      _doCheckCallback f
      Observer
    )()
    Notifier = Notifier = (watching) ->
      _listeners = []
      _acceptLists = []
      _updates = []
      _updater = false
      properties = []
      values = []
      self = this
      Object.defineProperty self, "_watching",
        enumerable: true
        get: ((watched) ->
          ->
            watched
        )(watching)

      wrapProperty = wrapProperty = (object, prop) ->
        propType = typeof (object[prop])
        descriptor = Object.getOwnPropertyDescriptor(object, prop)
        return false  if (prop is "getNotifier") or isAccessorDescriptor(descriptor) or (not descriptor.enumerable)
        if (object instanceof Array) and isNumeric(prop)
          idx = properties.length
          properties[idx] = prop
          values[idx] = object[prop]
          return true
        ((idx, prop) ->
          getter = ->
            values[getter.info.idx]
          setter = (value) ->
            unless sameValue(values[setter.info.idx], value)
              Object.getNotifier(object).queueUpdate object, prop, "update", values[setter.info.idx]
              values[setter.info.idx] = value
          properties[idx] = prop
          values[idx] = object[prop]
          getter.info = setter.info = idx: idx
          Object.defineProperty object, prop,
            get: getter
            set: setter

        ) properties.length, prop
        true

      self._checkPropertyListing = _checkPropertyListing = (dontQueueUpdates) ->
        object = self._watching
        keys = Object.keys(object)
        i = 0
        l = keys.length
        newKeys = []
        oldKeys = properties.slice(0)
        updates = []
        prop = undefined
        queueUpdates = not dontQueueUpdates
        propType = undefined
        value = undefined
        idx = undefined
        aLength = undefined
        aLength = self._oldLength  if object instanceof Array #object.length;
        #aLength = object.length;
        i = 0
        while i < l
          prop = keys[i]
          value = object[prop]
          propType = typeof (value)
          if (idx = properties.indexOf(prop)) is -1
            self.queueUpdate object, prop, "add", null, object[prop]  if wrapProperty(object, prop) and queueUpdates
          else
            if (object instanceof Array) or (isNumeric(prop))
              if values[idx] isnt value
                self.queueUpdate object, prop, "update", values[idx], value  if queueUpdates
                values[idx] = value
            oldKeys.splice oldKeys.indexOf(prop), 1
          i++
        if object instanceof Array and object.length isnt aLength
          self.queueUpdate object, "length", "update", aLength, object  if queueUpdates
          self._oldLength = object.length
        if queueUpdates
          l = oldKeys.length
          i = 0
          while i < l
            idx = properties.indexOf(oldKeys[i])
            self.queueUpdate object, oldKeys[i], "delete", values[idx]
            properties.splice idx, 1
            values.splice idx, 1
            i = idx

            while i < properties.length
              continue  unless properties[i] of object
              getter = Object.getOwnPropertyDescriptor(object, properties[i]).get
              continue  unless getter
              info = getter.info
              info.idx = i
              i++
            i++

      self.addListener = Notifier_addListener = (callback, accept) ->
        idx = _listeners.indexOf(callback)
        if idx is -1
          _listeners.push callback
          _acceptLists.push accept
        else
          _acceptLists[idx] = accept

      self.removeListener = Notifier_removeListener = (callback) ->
        idx = _listeners.indexOf(callback)
        if idx > -1
          _listeners.splice idx, 1
          _acceptLists.splice idx, 1

      self.listeners = Notifier_listeners = ->
        _listeners

      self.queueUpdate = Notifier_queueUpdate = (what, prop, type, was) ->
        @queueUpdates [
          type: type
          object: what
          name: prop
          oldValue: was
         ]

      self.queueUpdates = Notifier_queueUpdates = (updates) ->
        self = this
        i = 0
        l = updates.length or 0
        update = undefined
        i = 0
        while i < l
          update = updates[i]
          _updates.push update
          i++
        _clearCheckCallback _updater  if _updater
        _updater = _doCheckCallback(->
          _updater = false
          self.deliverChangeRecords()
        )

      self.deliverChangeRecords = Notifier_deliverChangeRecords = ->
        i = 0
        l = _listeners.length
        retval = undefined

        #keepRunning = true, removed as it seems the actual implementation doesn't do this
        # In response to BUG #5
        i = 0
        while i < l
          if _listeners[i]
            currentUpdates = undefined
            if _acceptLists[i]
              currentUpdates = []
              j = 0
              updatesLength = _updates.length

              while j < updatesLength
                currentUpdates.push _updates[j]  if _acceptLists[i].indexOf(_updates[j].type) isnt -1
                j++
            else
              currentUpdates = _updates
            if currentUpdates.length
              if _listeners[i] is console.log
                console.log currentUpdates
              else
                _listeners[i] currentUpdates
          i++
        _updates = []

      self.notify = Notifier_notify = (changeRecord) ->
        throw new TypeError("Invalid changeRecord with non-string 'type' property")  if typeof changeRecord isnt "object" or typeof changeRecord.type isnt "string"
        changeRecord.object = watching
        self.queueUpdates [ changeRecord ]

      self._checkPropertyListing true

    _notifiers = []
    _indexes = []
    extend.getNotifier = Object_getNotifier = (O) ->
      idx = _indexes.indexOf(O)
      notifier = (if idx > -1 then _notifiers[idx] else false)
      unless notifier
        idx = _indexes.length
        _indexes[idx] = O
        notifier = _notifiers[idx] = new Notifier(O)
      notifier

    extend.observe = Object_observe = (O, callback, accept) ->

      # For Bug 4, can't observe DOM elements tested against canry implementation and matches
      new Observer(O, callback, accept)  unless isElement(O)

    extend.unobserve = Object_unobserve = (O, callback) ->
      validateArguments O, callback
      idx = _indexes.indexOf(O)
      notifier = (if idx > -1 then _notifiers[idx] else false)
      return  unless notifier
      notifier.removeListener callback
      if notifier.listeners().length is 0
        _indexes.splice idx, 1
        _notifiers.splice idx, 1
  ) Object, this

Array.observe = Object.observe if Array.observe is undefined
