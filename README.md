# Lamb, because it's docile like a lamb.

A lightweight, and docile, JavaScript (ES5) library to help embracing functional programming.

## Installation and basic usage.

Install it with `npm`:  

```bash
npm install lamb
```

Require it in node.js:

```javascript
var lamb = require("lamb");
```

It's useful to alias it to have a shorter symbol, like ```_```, as I did throughout the documentation: it's cleaner and the 
```lamb``` object itself can be used as a placeholder argument in [partial application](https://ascartabelli.github.io/lamb/module-lamb.html#.partial).

```javascript
var _ = require("lamb");
```

In a browser, simply include the version you want from the `dist` folder:

```html
<script src="dist/lamb.js"></script>
```

or

```html
<script src="dist/lamb.min.js"></script>
```

You can find the source map for the minified file in the same folder.

## Documentation.

A first version of the API documentation is [now online](https://ascartabelli.github.io/lamb/).

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
