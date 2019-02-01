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

Disposable frame scheduler which abandons

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

setImmediate(func, {
  tolerance: 10
})
```

```js
const wrapped = immediate(func, {
  maxWait: 500,
  tolerance: 50
})
```

## setImmediate(func: Function, options: Object)

## License

MIT
