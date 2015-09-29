Function::getter = (prop, get) ->
  Object.defineProperty @prototype, prop, {
    get, configurable: yes,enumerable: false
  }

Function::setter = (prop, set) ->
  Object.defineProperty @prototype, prop, {
    set, configurable: yes, enumerable: false
  }

Function::property = (prop, desc) ->
  Object.defineProperty @prototype, prop, desc
