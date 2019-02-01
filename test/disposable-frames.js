import test from 'ava'
import {debuglog} from 'util'
import {
  setImmediate,
  clearImmediate,
  immediate
} from '../index'

const log = debuglog('disposable-frames')

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
  log('%s ends at %s, takes %sms, result %s',
    label, end - begin, end - start, s)
  return end - start
}

let SAFE_TOLERANCE
let BAD_TOLERANCE

test.before.cb(t => {
  resetBegin('before')
  // also use setTimeout to calculate time
  setTimeout(() => {
    const cost = heavy()
    SAFE_TOLERANCE = 10 * cost
    BAD_TOLERANCE = cost / 2
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

test.serial.cb('3. clearImmediate', t => {
  let i = 0
  const timer = setImmediate(() => {
    i = 1
  })
  clearImmediate(timer)

  setTimeout(() => {
    t.is(i, 0)
    t.end()
  }, 10)
})

test.serial.cb('4. immediate, basic and with call', t => {
  resetBegin(4)
  let s = 0

  const wrapper = immediate(function w () {
    logTime(`wrapped >> ${this.n} <<`)
    s ++

    heavy()
  }, {
    tolerance: BAD_TOLERANCE
  })

  const wrapped = n => wrapper.call({
    n
  })

  wrapped(1)
  wrapped(2)
  wrapped(3)

  setTimeout(() => wrapped(4), SAFE_TOLERANCE)
  setTimeout(() => wrapped(5), SAFE_TOLERANCE * 2)

  setTimeout(() => {
    logTime('before assertion')
    t.is(s, 3)
    t.end()
  }, SAFE_TOLERANCE * 3)
})
