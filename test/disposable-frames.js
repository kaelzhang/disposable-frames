const test = require('ava')
const log = require('util').debuglog('disposable-frames')
const {
  setImmediate,
  immediate
} = require('..')

let counter = 0

let begin

const resetBegin = message => {
  log('%s: reset begin', message)
  begin = Date.now()
}

const logTime = message => {
  log('%s: time %s', message, Date.now() - begin)
}

const heavy = () => {
  const label = `heavy ${counter ++}`
  const start = Date.now()
  log('%s starts at %s', label, start - begin)
  let i = 100000000
  let s = 0
  while (i --) {
    s += i
  }
  const end = Date.now()
  log('%s ends at %s, takes %sms', label, end - begin, end - start)
  return end - start
}

let SAFE_TOLERANCE

test.before.cb(t => {
  resetBegin('before')
  // also use setTimeout to calculate time
  setTimeout(() => {
    const cost = heavy()
    SAFE_TOLERANCE = 10 * cost
    log('SAFE_TOLERANCE: %s', SAFE_TOLERANCE)
    t.end()
  }, 0)
})

test.serial.cb('1. setImmediate: longer than tolerance', t => {
  resetBegin(1)
  let i = 0

  setImmediate(() => {
    heavy()
    i ++
  }, {
    tolerance: SAFE_TOLERANCE
  })

  setImmediate(() => {
    i += 10
  }, {
    tolerance: 1
  })

  setTimeout(() => {
    t.is(i, 1)
    t.end()
  }, 0)
})

test.serial.cb('2. setImmediate: more', t => {
  resetBegin(2)
  let i = 0

  setImmediate(() => {
    heavy()
    i ++
  }, {
    tolerance: SAFE_TOLERANCE
  })

  setImmediate(() => {
    heavy()
    i += 10
  }, {
    tolerance: SAFE_TOLERANCE * 2
  })

  setTimeout(() => {
    t.is(i, 11)
    t.end()
  }, 0)
})

test.serial.cb('3. immediate', t => {
  resetBegin(3)
  let s = 0
  let inner_counter = 0

  const delays = [
    0,                    // ok
    SAFE_TOLERANCE,       // ok
    0,       // skipped
    SAFE_TOLERANCE,       // skipped
    SAFE_TOLERANCE * 2,   // ok
    SAFE_TOLERANCE * 2,   // skipped
  ]

  const wrapped = immediate(() => {
    const i = inner_counter ++
    logTime(`wrapped ${i}`)
    heavy()
    s ++

    if (inner_counter < delays.length) {
      run()
    }
  }, {
    tolerance: SAFE_TOLERANCE
  })

  function run () {
    setTimeout(wrapped, delays[inner_counter])
  }

  run()

  setTimeout(() => {
    t.is(s, 3)
    t.end()
  }, SAFE_TOLERANCE * 3)
})
