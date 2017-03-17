
// alias used as a placeholder argument for partial application
var _ = lamb;

// prototype shortcuts
var _objectProto = Object.prototype;
var _stringProto = String.prototype;

// constants
var MAX_ARRAY_LENGTH = 4294967295;

/**
 * Builds a function that returns a constant value.
 * It's actually the simplest form of the K combinator or Kestrel.
 * @example
 * var truth = _.always(true);
 *
 * truth() // => true
 * truth(false) // => true
 * truth(1, 2) // => true
 *
 * // the value being returned is actually the
 * // very same value passed to the function
 * var foo = {bar: "baz"};
 * var alwaysFoo = _.always(foo);
 *
 * alwaysFoo() === foo // => true
 *
 * @memberof module:lamb
 * @category Function
 * @see [SKI combinator calculus]{@link https://en.wikipedia.org/wiki/SKI_combinator_calculus}
 * @param {*} value
 * @returns {Function}
 */
function always (value) {
    return function () {
        return value;
    };
}

/**
 * Returns a function that is the composition of the functions given as parameters.
 * Each function consumes the result of the function that follows.
 * @example
 * var sayHi = function (name) { return "Hi, " + name; };
 * var capitalize = function (s) {
 *     return s[0].toUpperCase() + s.substr(1).toLowerCase();
 * };
 * var fixNameAndSayHi = _.compose(sayHi, capitalize);
 *
 * sayHi("bOb") // => "Hi, bOb"
 * fixNameAndSayHi("bOb") // "Hi, Bob"
 *
 * var users = [{name: "fred"}, {name: "bOb"}];
 * var sayHiToUser = _.compose(fixNameAndSayHi, _.getKey("name"));
 *
 * _.map(users, sayHiToUser) // ["Hi, Fred", "Hi, Bob"]
 *
 * @memberof module:lamb
 * @category Function
 * @see {@link module:lamb.pipe|pipe}
 * @param {...Function} fn
 * @returns {Function}
 */
function compose () {
    var functions = arguments;
    var len = functions.length;

    return len ? function () {
        var idx = len - 1;
        var result = functions[idx].apply(this, arguments);

        while (idx--) {
            result = functions[idx].call(this, result);
        }

        return result;
    } : identity;
}

/**
 * Creates generic functions out of methods.
 * @author A very little change on a great idea by [Irakli Gozalishvili]{@link https://github.com/Gozala/}.
 * Thanks for this *beautiful* one-liner (never liked your "unbind" naming choice, though).
 * @memberof module:lamb
 * @category Function
 * @function
 * @example
 * var join = _.generic(Array.prototype.join);
 *
 * join([1, 2, 3, 4, 5], "-") // => "1-2-3-4-5"
 *
 * // the function will work with any array-like object
 * join("hello", "-") // => "h-e-l-l-o"
 *
 * @param {Function} method
 * @returns {Function}
 */
var generic = Function.bind.bind(Function.call);

/**
 * The I combinator. Any value passed to the function is simply returned as it is.
 * @example
 * var foo = {bar: "baz"};
 *
 * _.identity(foo) === foo // true
 *
 * @memberof module:lamb
 * @category Function
 * @see [SKI combinator calculus]{@link https://en.wikipedia.org/wiki/SKI_combinator_calculus}
 * @param {*} value
 * @returns {*} The value passed as parameter.
 */
function identity (value) {
    return value;
}

/**
 * Builds a partially applied function. The <code>lamb</code> object itself can be used
 * as a placeholder argument and it's useful to alias it with a short symbol such as <code>_</code>.
 * @example
 * var users = [
 *     {id: 1, name: "John", active: true, confirmedMail: true},
 *     {id: 2, name: "Jane", active: true, confirmedMail: false},
 *     {id: 3, name: "Mario", active: false, confirmedMail: false}
 * ];
 * var isKeyTrue = _.partial(_.hasKeyValue, [_, true]);
 * var isActive = isKeyTrue("active");
 * var hasConfirmedMail = isKeyTrue("confirmedMail");
 *
 * _.map(users, isActive) // => [true, true, false]
 * _.map(users, hasConfirmedMail) // => [true, false, false]
 *
 * @memberof module:lamb
 * @category Function
 * @see {@link module:lamb.partialRight|partialRight}
 * @see {@link module:lamb.asPartial|asPartial}
 * @see {@link module:lamb.curry|curry}, {@link module:lamb.curryRight|curryRight}
 * @see {@link module:lamb.curryable|curryable}, {@link module:lamb.curryableRight|curryableRight}
 * @param {Function} fn
 * @param {Array} args
 * @returns {Function}
 */
function partial (fn, args) {
    return function () {
        if (!Array.isArray(args)) {
            return fn.apply(this, arguments);
        }

        var lastIdx = 0;
        var newArgs = [];
        var argsLen = args.length;

        for (var i = 0, boundArg; i < argsLen; i++) {
            boundArg = args[i];
            newArgs[i] = boundArg === _ ? arguments[lastIdx++] : boundArg;
        }

        for (var len = arguments.length; lastIdx < len; lastIdx++) {
            newArgs[i++] = arguments[lastIdx];
        }

        return fn.apply(this, newArgs);
    };
}

/**
 * Like {@link module:lamb.partial|partial} will build a partially applied function and
 * it will accept placeholders.<br/>
 * The difference is that the bound arguments will be appended to the ones received by
 * the resulting function.
 * @example
 * <caption>Explaining the difference with <code>partial</code>:</caption>
 * var f1 = _.partial(_.list, ["a", "b", "c"]);
 * var f2 = _.partialRight(_.list, ["a", "b", "c"]);
 *
 * f1("d", "e") // => ["a", "b", "c", "d", "e"]
 * f2("d", "e") // => ["d", "e", "a", "b", "c"]
 *
 * @example
 * <caption>Explaining placeholder substitutions:</caption>
 * var f1 = _.partial(_.list, ["a", _, _, "d"]);
 * var f2 = _.partialRight(_.list, ["a", _, _, "d"]);
 *
 * f1("b", "c", "e") // => ["a", "b", "c", "d", "e"]
 * f2("b", "c", "e") // => ["b", "a", "c", "e", "d"]
 *
 * @memberof module:lamb
 * @category Function
 * @see {@link module:lamb.partial|partial}
 * @see {@link module:lamb.asPartial|asPartial}
 * @see {@link module:lamb.curry|curry}, {@link module:lamb.curryRight|curryRight}
 * @see {@link module:lamb.curryable|curryable}, {@link module:lamb.curryableRight|curryableRight}
 * @param {Function} fn
 * @param {Array} args
 * @returns {Function}
 */
function partialRight (fn, args) {
    return function () {
        if (!Array.isArray(args)) {
            return fn.apply(this, arguments);
        }

        var lastIdx = arguments.length - 1;
        var argsLen = args.length;
        var boundArgs = Array(argsLen);
        var newArgs = [];

        for (var i = argsLen - 1, boundArg; i > -1; i--) {
            boundArg = args[i];
            boundArgs[i] = boundArg === _ ? arguments[lastIdx--] : boundArg;
        }

        for (i = 0; i <= lastIdx; i++) {
            newArgs[i] = arguments[i];
        }

        for (var j = 0; j < argsLen; j++) {
            newArgs[i++] = boundArgs[j];
        }

        return fn.apply(this, newArgs);
    };
}

lamb.always = always;
lamb.compose = compose;
lamb.generic = generic;
lamb.identity = identity;
lamb.partial = partial;
lamb.partialRight = partialRight;
