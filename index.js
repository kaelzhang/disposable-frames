const clearTimeout_native = clearTimeout
const clearImmediate_native = typeof clearImmediate === 'function'
  ? clearImmediate
  : clearTimeout

const setTimeout0 = func => setTimeout(func, 0)
const setImmediate_native = typeof setImmediate === 'function'
  ? setImmediate
  : setTimeout0

const disposable_setTimeout = (func, timeout, {
  tolerance = 0
} = {}) => {
  const start = Date.now()
  const set = timeout === 0
    ? setImmediate_native
    : setTimeout0

  return set(() => {
    if (tolerance > 0 && Date.now() - start - timeout > tolerance) {
      return
    }

    func()
  })
}

const disposable_setImmediate = (func, options) =>
  disposable_setTimeout(func, 0, options)

export {
  disposable_setTimeout as setTimeout,
  clearTimeout_native as clearTimeout,
  disposable_setImmediate as setImmediate,
  clearImmediate_native as clearImmediate
}

export const immediate = (func, {
  tolerance = 0,
  maxWait = 0,
  leading = false
} = {}) => {
  let last = 0

  return function wrapped (...args) {
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
