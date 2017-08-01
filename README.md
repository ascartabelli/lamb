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
<script src="https://cdnjs.cloudflare.com/ajax/libs/lamb/0.54.0/lamb.min.js"></script>
```

```html
<script src="https://cdn.jsdelivr.net/lamb/0.54.0/lamb.min.js"></script>
```

```html
<script src="https://unpkg.com/lamb@0.54.0/dist/lamb.min.js"></script>
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

- **v0.54.0 - *2017/08/01***
  - Added `mapValues` and `mapValuesWith`
  - Added "@since" tags to doc comments
  - Added linting for tests

- **v0.53.1 - *2017/04/06***
  - **Fixed**: `hasKeyValue` was returning `true` for any existent property when searching for an `undefined` value
  - Updated object checking tests

- **v0.53.0 - *2017/03/30***
  - **API change**: unfilled placeholders in functions built with `asPartial` now assume an `undefined` value
  - **API change**: `range` now converts to number its parameters and will return an empty array if the specified range is invalid
  - **API change**: `difference` is now a binary function and returns a result without duplicates
  - Changed the name of the property holding the library's version
  - Added the possibility to use custom placeholders in partial application

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
