// Naming
// - suffix underscore: alias or ponyfill for builtin function
// - prefix underscore: our implementation

const clearTimeout_ = clearTimeout
const clearImmediate_ = typeof clearImmediate === 'function'
  ? clearImmediate
  : clearTimeout

const setTimeout0 = func => setTimeout(func, 0)
const setImmediate_ = typeof setImmediate === 'function'
  ? setImmediate
  : setTimeout0

const _setTimeout = (func, timeout, {
  tolerance = 0
} = {}) => {
  const start = Date.now()
  const set = timeout === 0
    ? setImmediate_
    : setTimeout0

  return set(() => {
    if (tolerance > 0 && Date.now() - start - timeout > tolerance) {
      return
    }

    func()
  })
}

const _setImmediate = (func, options) => _setTimeout(func, 0, options)

export {
  _setTimeout as setTimeout,
  clearTimeout_ as clearTimeout,
  _setImmediate as setImmediate,
  clearImmediate_ as clearImmediate
}

export function immediate (func, {
  tolerance = 0,
  maxWait = 0,
  leading = false
} = {}) {
  let last = 0

  return (...args) => {
    const start = Date.now()
    setTimeout(() => {
      const now = Date.now()

      // At the following situations, we will exec the func:
      // - tolerance <= 0: we allow arbitrary delays
      // - tolerance > 0 && now - start <= tolerance: delay is small enough
      // - leading === true && last === 0: we allow the first execution
      // - last > 0 && now - last > maxWait: no execution for too long
      if (
        (tolerance <= 0 || now - start <= tolerance)
        || leading === true && last === 0
        || maxWait > 0 && last > 0 && now - last > maxWait
      ) {
        last = now
        func.apply(this, args)
      }
    })
  }
}
