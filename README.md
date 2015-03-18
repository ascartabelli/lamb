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

In a browser, simply include the version you want from the `dist` folder:

```html
<script src="dist/lamb.js"></script>
```

or

```html
<script src="dist/lamb.min.js"></script>
```

You can find the source map for the minified file in the same folder.

## Documentation

For the time being just run: 

```bash 
npm run docs
```

The documentation will be generated in a `docs` folder with the default JSDoc template.  
Soon I'll write (or find) a suitable template and create some "gh-pages".

## Semantic Versioning

Lamb uses [semantic versioning](http://semver.org/) and please be aware that, as long as the major version is `0`, any
bump in the minor version could involve some breaking changes in the API.  
In any case a changelog will be added here starting from the next release.

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
  library. There's plenty of those in the [Javascript Reference on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/), 
  and there are many pre-made packages as well [out there](https://github.com/es-shims/es5-shim/).
  
- ***Are there plans for the future?***  
  Absolutely yes: this isn't a complete work at all, only a first public release.  
  I need better documentation and examples for starters, and I also want to add a bunch of other functions and concepts into the mix.
  
- ***Why "Lamb"?***  
  See the main header: because it's docile like a lamb.
  