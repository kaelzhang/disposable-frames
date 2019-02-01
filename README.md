[![Build Status](https://travis-ci.org/kaelzhang/disposable-frames.svg?branch=master)](https://travis-ci.org/kaelzhang/disposable-frames)
[![Coverage](https://codecov.io/gh/kaelzhang/disposable-frames/branch/master/graph/badge.svg)](https://codecov.io/gh/kaelzhang/disposable-frames)
<!-- optional appveyor tst
[![Windows Build Status](https://ci.appveyor.com/api/projects/status/github/kaelzhang/disposable-frames?branch=master&svg=true)](https://ci.appveyor.com/project/kaelzhang/disposable-frames)
-->
<!-- optional npm version
[![NPM version](https://badge.fury.io/js/disposable-frames.svg)](http://badge.fury.io/js/disposable-frames)
-->
<!-- optional npm downloads
[![npm module downloads per month](http://img.shields.io/npm/dm/disposable-frames.svg)](https://www.npmjs.org/package/disposable-frames)
-->
<!-- optional dependency status
[![Dependency Status](https://david-dm.org/kaelzhang/disposable-frames.svg)](https://david-dm.org/kaelzhang/disposable-frames)
-->

# disposable-frames

Disposable frame scheduler which abandons frames if CPU is high or the I/O event loop is blocking. `disposable-frames` is useful for web pages with heavy DOM manipulation.

`disposable-frames` detects the usage of CPU approximately by monitoring the hehavior of `setTimeout(func, 0)`.

## Install

```sh
$ npm i disposable-frames
```

## Usage

```js
import {
  setImmediate,
  immediate
} from 'disposable-frames'
```

## setImmediate(func: Function, options: Object): number | Immediate

- **func** `Function` The function to call as `setTimeout(func, 0)`
- **options.tolerance** `?number=0` The miniseconds within which since the `setImmediate` called that the `func` is allowed to execute. If `options.tolerance` is `0`, the default value, it indicates there is no restriction, which is silly because it is the only reason for this package to exist.
- Returns
  - [`Immediate`](https://nodejs.org/dist/latest-v11.x/docs/api/timers.html#timers_class_immediate) on node
  - `number` the timer id on browsers

Schedules the "immediate" execution of the `func` if the schedule doesn't take too long.

If we schedule a function `foo` with `options.tolerance` as `50`(ms), and in the real world, the I/O event loops take too long to respond, which causes that the `setImmediate` callback is supposed to be scheduled after 100ms from the beginning. And then the execution of `foo` will be abandoned according to `options.tolerance`.

```js
setImmediate(func, {
  tolerance: 10
})
```

## immediate(func: Function, options: Object): Function

- **func** `Function` The function to call as `setTimeout(func, 0)`
- **options** `?Object`
  - **tolerance** `?number=0`
  - **maxWait** `?number=0` The maximum time `func` is allowed to be abandoned before it's invoked. In the other words, after every `maxWait` time, one execution of `func` is allowed despite of the limitation of `tolerance`. If `maxWait` is 0, the feature is disabled.
  - **leading** `boolean=false` If `true`, the first execution is always allowed.

Wrap the `func` as a new function which schedules `func` as well as `setImmediate` does every time the wrapper function invokes.

```js
const wrapped = immediate(func, {
  maxWait: 500,
  tolerance: 50
})
```

Suppose that it takes precisely 100ms for `func` to execute every time then:

```js
wrapped()                   // will execute
wrapped()                   // disposed
wrapped()                   // disposed
setTimeout(wrapped, 200)    // will execute
```

## License

MIT
