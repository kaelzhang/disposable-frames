export const setImmediate = (func, {
  tolerance = 0
} = {}) => {
  const start = Date.now()
  console.log(start)
  return setTimeout(() => {console.log(start, Date.now(), Date.now() - start)
    if (tolerance > 0 && Date.now() - start > tolerance) {
      return
    }

    func()
  }, 0)
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
