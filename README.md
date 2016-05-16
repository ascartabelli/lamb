# Lamb, because it's docile like a lamb.

A lightweight, and docile, JavaScript (ES5) library to help embracing functional programming.

[![NPM version](https://img.shields.io/npm/v/lamb.svg)](https://www.npmjs.com/package/lamb) [![Build Status](https://img.shields.io/travis/ascartabelli/lamb/master.svg)](https://travis-ci.org/ascartabelli/lamb) [![Coveralls Status](https://img.shields.io/coveralls/ascartabelli/lamb/master.svg)](https://coveralls.io/github/ascartabelli/lamb)

## Documentation.

The API documentation is [here](https://ascartabelli.github.io/lamb/).

## Installation and basic usage.

Install it with `npm`:

```bash
npm install lamb
```

Require it in node.js:

```javascript
var _ = require("lamb");
```

It's useful to alias it to have a shorter symbol, like ```_```, as I did above and throughout the documentation: it's cleaner and the
```lamb``` object itself can be used as a placeholder argument in [partial application](https://ascartabelli.github.io/lamb/module-lamb.html#.partial).

In a browser, simply include the version you want from the `dist` folder:

```html
<script src="dist/lamb.js"></script>
```

or

```html
<script src="dist/lamb.min.js"></script>
```

You can find the source map for the minified file in the same folder.

Lamb it's also delivered on a CDN, courtesy of [npmcdn](https://npmcdn.com/):

```html
<script src="https://npmcdn.com/lamb/dist/lamb.min.js"></script>
```

The URL above will retrieve the latest version, but you can target a specific version too:

```html
<script src="https://npmcdn.com/lamb@0.26.0/dist/lamb.min.js"></script>
```

You can [try it right now](https://tonicdev.com/npm/lamb) in your browser, too.

## Semantic Versioning.

Lamb uses [semantic versioning](http://semver.org/) and please be aware that, as long as the major version is `0`, any
bump in the minor version could involve a breaking change in the API.
You can refer to the [changelog](#changelog) to see if your code is affected.

## Frequently self-asked questions.

- ***Is another JavaScript library really needed?***
  Don't know, really.
  The story here is that I like to write my own code and, time permitting, to even reinvent the wheel: it's part of my learning process.
  This library is only a means for me to gather some utilities I wrote, clean them up a bit and put them together with some new tools to make
  a documented, reusable package.

- ***Are your wheels rounder?***
  Not at all, but I do try my best to add better suspension; and you do realise that you're reading a guy talking to himself, don't you?

- ***Why ECMAScript 5?***
  Because this is simply me tidying up some old code, and will hopefully be my goodbye to ES5 before fully diving into the world of transpilers.

- ***What about ES4 environments?***
  In my make-believe world they don't exist, but in case I can be proven wrong you can load some shims / polyfills before my
  library. There's plenty of those in the [JavaScript Reference on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/),
  and there are many pre-made packages as well [out there](https://github.com/es-shims/es5-shim/).

- ***Are there plans for the future?***
  Absolutely yes: this isn't a complete work at all, only a first public release.
  I need better documentation and examples for starters, and I also want to add a bunch of other functions and concepts into the mix.

- ***Why "Lamb"?***
  See the main header: because it's docile like a lamb.

## <a name="changelog"></a> Changelog

- **v0.26.0 - *2016/05/16***
  - **Fully compatible with versions down to 0.25.x**
  - Added `rename`, `renameKeys` and `renameWith`

- **v0.25.1 - *2016/05/10***
  - **API change**: `enumerables`, `pairs`, `tear` and `values` now throw a TypeError if supplied with `null` or `undefined`
  - **API change**: `ownPairs`, `ownValues` and `tearOwn` now throw a TypeError only if supplied with `null` or `undefined` regardless of the ECMAScript engine you are using
  - Added `keys` as a shim of ES6’s `Object.keys`

- **v0.24.0 - *2016/05/05***
  - **API change**: `setPath` and `setPathIn` now treat non-enumerable properties encountered in a path as non-existent properties
  - Added `updatePath` and `updatePathIn`

- **v0.23.0 - *2016/04/27***
  - **API change**: `getPath` and `getPathIn` now support negative indexes
  - **API change**: The function returned by `getAt` now throw exceptions only if called with `null` or `undefined` and returns `undefined` for any other non-array-like object
  - Added `getIndex`, `setIndex` and `updateIndex`

- **v0.22.0 - *2016/04/19***
  - **Fully compatible with versions down to 0.21.x**
  - Added `updateIn`, `updateKey` and `updateAt`

- **v0.21.0 - *2016/04/13***
  - **API change**: `getPathIn` and `getPath` now return `undefined` for any non existent path, instead of throwing exceptions when an `undefined` value was a part of the path instead of being its target
  - **API change**: renamed `sequence` to `generate` to avoid confusion with other languages, concepts and libraries
  - Added `count`, `countBy`, `index`, `indexBy`

- **v0.20.0 - *2016/04/08***
  - **API change**: The `mergeOwn` function now converts `null` and `undefined` values to empty objects instead of throwing exceptions
  - Added `setPath` and `setPathIn`

- **v0.19.0 - *2016/04/05***
  - **API change**: renamed `getWithPath` to `getPathIn`
  - Added `getPath` and `reverse`

- **v0.18.0 - *2016/04/01***
  - **API change**: renamed `get` to `getIn`
  - Added `setIn` and `setKey`

- **v0.17.0 - *2016/03/29***
  - **Minor API change (shouldn't affect anyone):** changed integer conversions in `isIn`, `transpose` and currying functions
  - **API change**: `getAt` no longer accepts strings as indexes
  - Added `getArgAt` and  `setAt`

- **v0.16.0 - *2016/03/23***
  - **Fully compatible with versions down to 0.15.x**
  - Added `init`, `tail`, `getAt`, `head`, `last`

- **v0.15.3 - *2016/03/21***
  - **Fully compatible with versions down to 0.15.x**
  - Updated `generic` function and removed unused Function.prototype caching
  - Added specific tests for `generic`, `sorter` and `sorterDesc`
  - Minor improvements in documentation

- **v0.15.2 - *2016/03/17***
  - **Fully compatible with versions down to 0.15.x**
  - Added support for Travis CI and Coveralls
  - Updated README and fixed typo in documentation

- **v0.15.1 - *2016/03/08***
  - **Fully compatible with version 0.15.0**
  - Minor performance improvements

- **v0.15.0 - *2016/03/03***
  - **API change:** changed `insert` and `sorter`
  - Added `invokerOn`, `sort`, `sorterDesc` and `sortWith`

- **v0.14.0 - *2015/05/13***
  - **Fully compatible with versions down to 0.13.x**
  - Added `transpose`, `zip`, `zipWithIndex`

- **v0.13.0 - *2015/05/06***
  - **API change:** `difference`, `intersection` and `uniques` now use the "SameValueZero" comparison
  - Added `clamp`, `contains`, `isIn`, `isSVZ`

- **v0.12.0 - *2015/04/22***
  - **Fully compatible with versions down to 0.9.x**
  - Added `enumerables` and `pluckKey`
  - Added `mergeOwn`, `ownPairs`, `ownValues` and `tearOwn`

- **v0.11.0 - *2015/04/17***
  - **Fully compatible with versions down to 0.9.x**
  - The `union` function now can work with array-like objects
  - Added `flatMapWith`, `partition`, `partitionWith`

- **v0.10.0 - *2015/04/15***
  - **Fully compatible with version 0.9.x**
  - Added `merge` function
  - Added `binary` and `unary` as shortcuts for common use cases of `aritize`

- **v0.9.0 - *2015/04/10***
  - **API change:** dropped the boolean parameter in `flatten` and added `shallowFlatten`
  - **API change:** dropped the boolean parameter in `curry` and `curryable`, added `curryRight` and `curryableRight`
  - **API change:** renamed `typeOf` to `type` to avoid confusion with the operator
  - Added the `filterWith` function

- **v0.8.0 - *2015/04/03***
  - **API change:** the `values` function now picks from all enumerable properties, even inherited
  - **API change:** renamed `getFromPath` to `getWithPath`
  - Added `fromPairs`, `immutable`, `make`, `pairs`, `tear`

- **v0.7.0 - *2015/03/25***
  - **Fully compatible with previous 0.x versions**
  - Added the `group` and `groupBy` functions
  - Added the `find` and `findIndex` functions
  - Some long due performance improvements on `curry`, `curryable` and `partial`

- **v0.6.3 - *2015/03/20***
  - The documentation is now online
  - Minor fixes in doc comments

- **v0.6.2 - *2015/03/18***
  - First public release
