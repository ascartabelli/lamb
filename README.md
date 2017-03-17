# Lamb, because it's docile like a lamb.

A lightweight, and docile, JavaScript (ES5) library to help embracing functional programming.

[![NPM version](https://img.shields.io/npm/v/lamb.svg)](https://www.npmjs.com/package/lamb) [![Build Status](https://img.shields.io/travis/ascartabelli/lamb/master.svg)](https://travis-ci.org/ascartabelli/lamb) [![Coveralls Status](https://img.shields.io/coveralls/ascartabelli/lamb/master.svg)](https://coveralls.io/github/ascartabelli/lamb)

![Lamb logo](https://ascartabelli.github.io/lamb/images/logo_600x130.png "Lamb, because it's docile like a lamb")

## Documentation.

The API documentation is [here](https://ascartabelli.github.io/lamb/module-lamb.html).

## Installation and basic usage.

Install it with `npm`:

```bash
npm install lamb
```

Require it in node.js:

```javascript
var _ = require("lamb");
```

It's useful to alias it to have a shorter symbol, like `_`, as I did above and throughout the documentation: it's cleaner and the
`lamb` object itself can be used as a placeholder argument in [partial application](https://ascartabelli.github.io/lamb/module-lamb.html#partial).

In a browser, simply include the version you want from the `dist` folder:

```html
<script src="dist/lamb.js"></script>
```

or

```html
<script src="dist/lamb.min.js"></script>
```

Doing so a `lamb` variable will be created in the global object.
The source map for the minified file is in the same `dist` folder.

Lamb it's also delivered on a CDN, courtesy of [cdnjs](https://cdnjs.com/), [jsDelivr](https://www.jsdelivr.com/) and [unpkg](https://unpkg.com/):

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/lamb/0.52.0/lamb.min.js"></script>
```

```html
<script src="https://cdn.jsdelivr.net/lamb/0.52.0/lamb.min.js"></script>
```

```html
<script src="https://unpkg.com/lamb@0.52.0/dist/lamb.min.js"></script>
```

Please note that Lamb is served by jsDelivr since version 0.42.0.

You can [try it right now](https://runkit.com/npm/lamb) in your browser, too.

## Semantic Versioning.

Lamb uses [semantic versioning](http://semver.org/) and please be aware that, as long as the major version is `0`, any
bump in the minor version could involve a breaking change in the API.
You can check the [recent](#recent_changes) or the [full](https://ascartabelli.github.io/lamb/changelog.html) changelog to see if your code is affected.

## Frequently self-asked questions.

- ***Is another JavaScript library really needed?***
  Don't know, really.
  The story here is that I like to write my own code and, time permitting, to even reinvent the wheel: it's part of my learning process.
  This library is only a means for me to gather some utilities I wrote, clean them up a bit and put them together with some new tools to make
  a documented, reusable package.

- ***Are your wheels rounder?***
  Not at all, but I do try my best to add better suspension; and you do realise that you're reading a guy talking to himself, don't you?

- ***Why you say "to help embracing functional programming"? Is it for beginners?***
  No, it's a utility library for everyone; beginners included, though.
  Lamb embraces functional concepts and encourages users to take advantage of them, but without forcing anyone to change his style.
  Experienced functional programmers will feel immediately at home, and beginners will discover that the library is able to adapt to them while their knowledge grows.

- ***Why ECMAScript 5?***
  Because this is simply me tidying up some old code, and will hopefully be my goodbye to ES5 before fully diving into the world of transpilers.

- ***What about ES4 environments?***
  In my make-believe world they don't exist, but in case I can be proven wrong you can load some shims / polyfills before my
  library. There's plenty of those in the [JavaScript Reference on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/),
  and there are many pre-made packages as well [out there](https://github.com/es-shims/es5-shim/).

- ***Are there plans for the future?***
  Absolutely yes: this isn't a complete work at all, only a first public release.
  I need better documentation and examples for starters, and I also want to add a bunch of other functions and concepts into the mix.

- ***I really like Lamb's logo: are you the designer?***
  I like it a lot too and, no, it isn't my doing: the author is a very talented designer who never signs his works by choice and doesn't want to be credited for it.
  Other than being eternally grateful, the least I can do is offer my services as a middleman and put you in touch if you need his craft.

- ***Why "Lamb"?***
  See the main header: because it's docile like a lamb. Lamb adapts to you without needing you to adapt.

## <a name="recent_changes"></a> Recent changes
You can also check the [full changelog](https://ascartabelli.github.io/lamb/changelog.html).

- **v0.52.0 - *2017/03/17***
  - **API change**: `partial` is no longer variadic and accepts a function and an array of arguments instead
  - **API change**: `getArgAt` and all array accessors now convert their index parameter to integer
  - **API change**: reverted change made in v0.50.0 about `compose` and `pipe`: now they return again the `identity` function if called without arguments
  - **API change**: `merge` and `mergeOwn` now throw for `nil` values and convert to object everything else as before
  - **API change**: `intersection` now return an empty array if called without parameters
  - **Fixed**: `transpose` and `zip` now correctly throw when `nil` values, preceded by empty array-likes, are encountered
  - Added `partialRight`
  - `difference` and `intersection` are now correctly documented to work with array-like objects
  - Updated test and moved shared variables to an external file

- **v0.51.0 - *2017/02/20***
  - **API change**: removed the `iteratee` parameter from `uniques`
  - **API change**: removed `fromIndex` parameter from `contains` and `isIn`
  - **API change**: `tapArgs` isn't variadic anymore and accepts an array of "tappers" as the second parameter
  - **API change**: renamed `drop` and `take` to `dropFrom` and `takeFrom`
  - **API change**: renamed `dropN` and `takeN` to `drop` and `take`
  - **API change**: the `falseFn` parameter of `condition` is no longer optional
  - Added `case` to quickly build cases for `adapter`
  - Added `unionBy` and `uniquesBy`

- **v0.50.0 - *2017/02/08***
  - **API change**: renamed `is` to `areSame` and `isSVZ` to `areSVZ`. The old names are now used for curried version of those functions
  - **API change**: removed `isNot`
  - **API change**: renamed `isGT`, `isGTE`, `isLT` and `isLTE` to `gt`, `gte`, `lt`, `lte`. The old names are now used for right curried versions of these functions.
  - **API change**: `compose` and `pipe` now build a function throwing an exception if they are called without arguments
  - **API change**: renamed `add` to `sum`. `add` is now used as a curried version of `sum`.
  - Added `deduct` as a right curried version of `subtract`
  - Added `multiplyBy` as a curried version of `multiply`
  - Added `divideBy` as a right curried version of `divide`
  - Added optimized currying for functions with arity 2 and 3
  - Performance improvement for `compose` and `pipe`

- **v0.49.0 - *2017/01/24***
  - **API change**: removed optional context parameter in every function that was using it
  - **API change**: `aritize` now will simply convert its `arity` parameter to integer, instead of giving it a special meaning when is `undefined`
  - **Fixed**: `skip` and `skipKeys` now convert to string every value in the `blacklist`
  - **Fixed**: `hasKeyValue` now correctly returns `false` when searching for an `undefined` value in a non-existent property
  - **Fixed**: `pathExists`, `pathExistsIn` and `hasPathValue` will no longer see valid paths when a negative array index is out of bounds
  - Minor performance improvements for `pick`, `pickIf`, `skip` and `skipIf`
  - Added tests with sparse arrays where needed and updated existing ones with misleading texts / specs
  - Tidied up test code a bit by grouping some common variables
  - Updated tests for `hasPathValue` and "pick" and "skip" functions
  - Updated tests of `updatePath` to check negative array indexes that are out of bounds
  - Updated dev dependencies

- **v0.48.0 - *2017/01/10***
  - **API change**: `slice` isn't a generic anymore to ensure that dense arrays are returned and has no optional parameters
  - **Fixed**: `pull` and `pullFrom` now consider `nil`s received as the `values` parameter as empty arrays
  - Added `sliceAt`
  - All array functions always return dense arrays now
  - Updated tests
