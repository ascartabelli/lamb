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
`lamb` object itself can be used as a placeholder argument in [partial application](https://ascartabelli.github.io/lamb/module-lamb.html#.partial).

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

Lamb it's also delivered on a CDN, courtesy of [npmcdn](https://npmcdn.com/):

```html
<script src="https://npmcdn.com/lamb/dist/lamb.min.js"></script>
```

The URL above will retrieve the latest version, but you can target a specific one:

```html
<script src="https://npmcdn.com/lamb@0.34.1/dist/lamb.min.js"></script>
```

You can [try it right now](https://tonicdev.com/npm/lamb) in your browser, too.

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
  See the main header: because it's docile like a lamb.

## <a name="recent_changes"></a> Recent changes

- **v0.34.0 - *2016/07/19***
  - **API change**: `filter`, `forEach`, `map`, `reduce` and `reduceRight` aren’t array generics anymore and have been replaced with performant custom implementations as JS engines didn’t get any better. Unlike native methods, these custom implementations won’t skip unassigned or deleted indexes in arrays.
  - Overall performance improvements (other than the ones caused by the aforementioned custom implementations) and some code clean-up

- **v0.33.0 - *2016/07/08***
  - **API change**: `sortedInsert` now accepts array-like objects
  - Completed "fifth round" of test updating

- **v0.32.0 - *2016/07/01***
  - **API change**: `take` and `takeN` now convert `undefined` values passed as `n` to Number (zero) before calling `slice`
  - **API change**: `tapArgs`, `updateAt` and `updateIndex` are now more strict about their function parameter as “falsy” values failed to throw an exception before
  - **API change**: curry functions now let empty calls consume the arity
  - Completed “fourth round" of test updating

- **v0.31.0 - *2016/06/24***
  - **API change**: all path functions and object setters now throw a TypeError `nil` values received as `source`, other values will be converted to Object
  - **API change**: `setPath`, `setPathIn` now convert to string the `path` parameter
  - **API change**: the “set” and “update” path functions now give priority to existing object keys over array indexes, like the “get” path functions
  - Completed “third round" of test updating

- **v0.30.0 - *2016/06/21***
  - **API change**: `aritize` now adds `undefined` arguments if the desired arity is greater than the amount of received parameters
  - **API change**: `apply` and `applyArgs` now treat non-array-like values for the `args` parameter as empty arrays
  - **API change**: `allOf`, `anyOf`, `apply`, `applyArgs`, `aritize`, `binary` and `unary` now keep the functions' context
  - Completed “second round" of test updating
