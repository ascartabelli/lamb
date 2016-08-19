/**
 * Applies the passed function to the given argument list.
 * @example
 * _.apply(_.add, [3, 4]) // => 7
 *
 * @memberof module:lamb
 * @category Function
 * @param {Function} fn
 * @param {ArrayLike} args
 * @returns {*}
 */
function apply (fn, args) {
    return fn.apply(this, Object(args));
}

/**
 * A curried version of {@link module:lamb.apply|apply}. Expects an array-like object to use as arguments
 * and builds a function waiting for the target of the application.
 * @example
 * var data = [3, 4];
 * var applyDataTo = _.applyArgs(data);
 *
 * applyDataTo(_.add) // => 7
 * applyDataTo(_.multiply) // => 12
 *
 * @memberof module:lamb
 * @category Function
 * @param {ArrayLike} args
 * @returns {Function}
 */
function applyArgs (args) {
    return function (fn) {
        return fn.apply(this, Object(args));
    };
}

/**
 * Builds a function that passes only the specified amount of arguments to the given function.<br/>
 * As {@link module:lamb.slice|slice} is used to extract the arguments, you can also
 * pass a negative arity.<br/>
 * See also {@link module:lamb.binary|binary} and {@link module:lamb.unary|unary} for common use
 * cases shortcuts.
 * @example
 * function maxArgument () {
 *     return Math.max.apply(null, arguments);
 * }
 *
 * maxArgument(10, 11, 45, 99) // => 99
 * _.aritize(maxArgument, 2)(10, 11, 45, 99) // => 11
 *
 * @example <caption>Using a negative arity:</caption>
 * _.aritize(maxArgument, -1)(10, 11, 45, 99) // => 45
 *
 * @memberof module:lamb
 * @category Function
 * @param {Function} fn
 * @param {Number} arity
 * @returns {Function}
 */
function aritize (fn, arity) {
    return function () {
        var args = slice(list.apply(null, arguments), 0, arity);
        var argsLen = args.length;
        var n = Math.floor(arity);

        if (n > 0 && argsLen < n) {
            args = args.concat(Array(n - argsLen));
        }

        return fn.apply(this, args);
    };
}

/**
 * Decorates the received function so that it can be called with
 * placeholders to build a partial application of it.<br/>
 * The difference with {@link module:lamb.partial|partial} is that, as long as
 * you call the generated function with placeholders, another partial application
 * of the original function will be built.<br/>
 * The final application will happen when one of the generated functions is
 * invoked without placeholders, using the parameters collected so far. <br/>
 * This function comes in handy when you need to build different specialized
 * functions starting from a basic one, but it's also useful when dealing with
 * optional parameters as you can decide to apply the function even if its arity
 * hasn't been entirely consumed.
 * @example <caption>Explaining the function's behaviour:</caption>
 * var f = _.asPartial(function (a, b, c) {
 *     return a + b + c;
 * });
 *
 * f(4, 3, 2) // => 9
 * f(4, _, 2)(3) // => 9
 * f(_, 3, _)(4, _)(2) // => 9
 *
 * @example <caption>Exploiting optional parameters: </caption>
 * var f = _.asPartial(function (a, b, c) {
 *     return a + b + (c || 0);
 * });
 *
 * var addFive = f(5, _);
 * addFive(2) // => 7
 *
 * var addNine = addFive(4, _);
 * addNine(11) // => 20
 *
 * @memberof module:lamb
 * @category Function
 * @see {@link module:lamb.partial|partial}
 * @see {@link module:lamb.curry|curry}, {@link module:lamb.curryRight|curryRight}
 * @see {@link module:lamb.curryable|curryable}, {@link module:lamb.curryableRight|curryableRight}
 * @param {Function} fn
 * @returns {Function}
 */
function asPartial (fn) {
    return _asPartial(fn, []);
}

/**
 * Builds a function that passes only two arguments to the given function.<br/>
 * It's simply a shortcut for a common use case of {@link module:lamb.aritize|aritize},
 * exposed for convenience.<br/>
 * See also {@link module:lamb.unary|unary}.
 * @example
 * _.list(1, 2, 3, 4, 5) // => [1, 2, 3, 4, 5]
 * _.binary(_.list)(1, 2, 3, 4, 5) // => [1, 2]
 *
 * @memberof module:lamb
 * @category Function
 * @param {Function} fn
 * @returns {Function}
 */
function binary (fn) {
    return function (a, b) {
        return fn.call(this, a, b);
    };
}

/**
 * Accepts a series of functions and builds a new function. The functions in the series
 * will then be applied, in order, with the values received by the function built with
 * <code>collect</code>.<br/>
 * The collected results will be returned in an array.
 * @example
 * var user = {
 *     id: "jdoe",
 *     name: "John",
 *     surname: "Doe",
 *     scores: [2, 4, 7]
 * };
 * var getIDAndLastScore = _.collect(_.getKey("id"), _.getPath("scores.-1"));
 *
 * getIDAndLastScore(user) // => ["jdoe", 7]
 *
 * @example
 * var minAndMax = _.collect(Math.min, Math.max);
 *
 * minAndMax(3, 1, -2, 5, 4, -1) // => [-2, 5]
 *
 * @memberof module:lamb
 * @category Function
 * @param {...Function} fn
 * @returns {Function}
 */
function collect () {
    var functions = list.apply(null, arguments);

    return function () {
        return map(functions, applyArgs(arguments));
    };
}

/**
 * Transforms the evaluation of the given function in the evaluation of a sequence of functions
 * expecting only one argument. Each function of the sequence is a partial application of the
 * original one, which will be applied when the specified (or derived) arity is consumed.<br/>
 * Currying will start from the leftmost argument: use {@link module:lamb.curryRight|curryRight}
 * for right currying.
 * @example
 * var multiplyBy = _.curry(_.multiply);
 * var multiplyBy10 = multiplyBy(10);
 *
 * multiplyBy10(5) // => 50
 * multiplyBy10(2) // => 20
 *
 * @memberof module:lamb
 * @category Function
 * @see {@link module:lamb.curryRight|curryRight}
 * @see {@link module:lamb.curryable|curryable}, {@link module:lamb.curryableRight|curryableRight}
 * @see {@link module:lamb.partial|partial}, {@link module:lamb.asPartial|asPartial}
 * @param {Function} fn
 * @param {Number} [arity=fn.length]
 * @returns {Function}
 */
function curry (fn, arity) {
    return _curry(fn, arity, false);
}

/**
 * Builds an auto-curried function. The resulting function can be called multiple times with
 * any number of arguments, and the original function will be applied only when the specified
 * (or derived) arity is consumed.<br/>
 * Currying will start from the leftmost argument: use {@link module:lamb.curryableRight|curryableRight}
 * for right currying.
 * @example
 * var collectFourElements = _.curryable(_.list, 4);
 *
 * collectFourElements(2)(3)(4)(5) // => [2, 3, 4, 5]
 * collectFourElements(2)(3, 4)(5) // => [2, 3, 4, 5]
 * collectFourElements(2, 3, 4, 5) // => [2, 3, 4, 5]
 * collectFourElements(2, 3)(4, 5) // => [2, 3, 4, 5]
 *
 * @memberof module:lamb
 * @category Function
 * @see {@link module:lamb.curryableRight|curryableRight}
 * @see {@link module:lamb.curry|curry}, {@link module:lamb.curryRight|curryRight}
 * @see {@link module:lamb.partial|partial}, {@link module:lamb.asPartial|asPartial}
 * @param {Function} fn
 * @param {Number} [arity=fn.length]
 * @returns {Function}
 */
function curryable (fn, arity) {
    return _curry(fn, arity, false, true);
}

/**
 * Same as {@link module:lamb.curryable|curryable}, but currying starts from the rightmost argument.
 * @example
 * var collectFourElements = _.curryableRight(_.list, 4);
 *
 * collectFourElements(2)(3)(4)(5) // => [5, 4, 3, 2]
 * collectFourElements(2)(3, 4)(5) // => [5, 4, 3, 2]
 * collectFourElements(2, 3, 4, 5) // => [5, 4, 3, 2]
 * collectFourElements(2, 3)(4, 5) // => [5, 4, 3, 2]
 *
 * @memberof module:lamb
 * @category Function
 * @see {@link module:lamb.curryable|curryable}
 * @see {@link module:lamb.curry|curry}, {@link module:lamb.curryRight|curryRight}
 * @see {@link module:lamb.partial|partial}, {@link module:lamb.asPartial|asPartial}
 * @param {Function} fn
 * @param {Number} [arity=fn.length]
 * @returns {Function}
 */
function curryableRight (fn, arity) {
    return _curry(fn, arity, true, true);
}

/**
 * Same as {@link module:lamb.curry|curry}, but currying starts from the rightmost argument.
 * @example
 * var divideBy = _.curryRight(_.divide);
 * var halve = divideBy(2);
 * halve(3) // => 1.5
 * halve(3, 7) // => 1.5
 *
 * @memberof module:lamb
 * @category Function
 * @see {@link module:lamb.curry|curry}
 * @see {@link module:lamb.curryable|curryable}, {@link module:lamb.curryableRight|curryableRight}
 * @see {@link module:lamb.partial|partial}, {@link module:lamb.asPartial|asPartial}
 * @param {Function} fn
 * @param {Number} [arity=fn.length]
 * @returns {Function}
 */
function curryRight (fn, arity) {
    return _curry(fn, arity, true);
}

/**
 * Returns a function that will execute the given function only if it stops being called for the
 * specified timespan.<br/>
 * See also {@link module:lamb.throttle|throttle} for a different behaviour where the first call
 * happens immediately.
 * @example <caption>A common use case of <code>debounce</code> in a browser environment</caption>
 * var updateLayout = function () {
 *     // some heavy DOM operations here
 * };
 *
 * window.addEventListener("resize", _.debounce(updateLayout, 200), false);
 *
 * // The resize event is fired repeteadly until the user stops resizing the
 * // window, while the `updateLayout` function is called only once: 200 ms
 * // after he stopped.
 *
 * @memberof module:lamb
 * @category Function
 * @param {Function} fn
 * @param {Number} timespan - Expressed in milliseconds
 * @returns {Function}
 */
function debounce (fn, timespan) {
    var timeoutID;

    return function () {
        var args = arguments;
        var debounced = function () {
            timeoutID = null;
            fn.apply(this, args);
        }.bind(this);

        clearTimeout(timeoutID);
        timeoutID = setTimeout(debounced, timespan);
    };
}

/**
 * Returns a function that applies its arguments to the original function in reverse order.
 * @example
 * _.list(1, 2, 3) // => [1, 2, 3]
 * _.flip(_.list)(1, 2, 3) // => [3, 2, 1]
 *
 * @memberof module:lamb
 * @category Function
 * @param {Function} fn
 * @returns {Function}
 */
function flip (fn) {
    return function () {
        var args = list.apply(null, arguments).reverse();

        return fn.apply(this, args);
    };
}

/**
 * Builds a function that returns the argument received at the given index.<br/>
 * As with {@link module:lamb.getAt|getAt} negative indexes are allowed.<br/>
 * The resulting function will return <code>undefined</code> if no arguments are
 * passed or if the index is out of bounds.
 * @example
 * var getFirstArg = getArgAt(0);
 * var getLastArg = getArgAt(-1);
 *
 * getFirstArg(1, 2, 3) // => 1
 * getLastArg(1, 2, 3) // => 3
 *
 * getArgAt()(1, 2, 3) // => undefined
 * getArgAt(6)(1, 2, 3) // => undefined
 * getArgAt(1)() // => undefined
 *
 * @memberof module:lamb
 * @category Function
 * @param {Number} idx
 * @returns {Function}
 */
function getArgAt (idx) {
    return function () {
        return arguments[_getNaturalIndex({length: arguments.length}, idx)];
    };
}

/**
 * Builds a function that will invoke the given method name on any received object and return
 * the result. If no method with such name is found the function will return <code>undefined</code>.
 * Along with the method name it's possible to supply some arguments that will be bound to the
 * method call.<br/>
 * Further arguments can also be passed when the function is actually called, and they will be
 * concatenated to the bound ones.<br/>
 * If different objects share a method name it's possible to build polymorphic functions as you
 * can see in the example below.<br/>
 * {@link module:lamb.condition|Condition} can be used to wrap <code>invoker</code> to avoid this
 * behaviour by adding a predicate, while {@link module:lamb.adapter|adapter} can build more complex
 * polymorphic functions without the need of homonymy.<br/>
 * Returning <code>undefined</code> or checking for such value is meant to favor composition and
 * interoperability between the aforementioned functions: for a more standard behaviour see also
 * {@link module:lamb.generic|generic}.
 * See also {@link module:lamb.invokerOn|invokerOn}.
 * @example <caption>Basic polymorphism with <code>invoker</code></caption>
 * var polySlice = _.invoker("slice");
 *
 * polySlice([1, 2, 3, 4, 5], 1, 3) // => [2, 3]
 * polySlice("Hello world", 1, 3) // => "el"
 *
 * @example <caption>With bound arguments</caption>
 * var substrFrom2 = _.invoker("substr", 2);
 * substrFrom2("Hello world") // => "llo world"
 * substrFrom2("Hello world", 5) // => "llo w"
 *
 * @memberof module:lamb
 * @category Function
 * @param {String} methodName
 * @param {...*} [boundArg]
 * @returns {Function}
 */
function invoker (methodName) {
    return partial(_invoker, _argsTail.apply(null, arguments), methodName);
}

/**
 * Accepts an object and builds a function expecting a method name, and optionally arguments,
 * to call on such object.
 * Like {@link module:lamb.invoker|invoker}, if no method with the given name is found the
 * function will return <code>undefined</code>.
 * @example
 * var isEven = function (n) { return n % 2 === 0; };
 * var arr = [1, 2, 3, 4, 5];
 * var invokerOnArr = _.invokerOn(arr);
 *
 * invokerOnArr("filter", isEven) // => [2, 4]
 * invokerOnArr("slice", 1, 3) // => [2, 3]
 *
 * @memberof module:lamb
 * @category Function
 * @see {@link module:lamb.invoker|invoker}
 * @param {Object} target
 * @returns {Function}
 */
function invokerOn (target) {
    return partial(_invoker, [], _, target);
}

/**
 * Builds a function that allows to map over the received arguments before applying them
 * to the original one.
 * @example
 * var sumArray = _.reduceWith(_.add);
 * var sum = _.compose(sumArray, _.list);
 *
 * sum(1, 2, 3, 4, 5) // => 15
 *
 * var square = _.partial(Math.pow, _, 2);
 * var sumSquares = _.mapArgs(sum, square);
 *
 * sumSquares(1, 2, 3, 4, 5) // => 55
 *
 * @memberof module:lamb
 * @category Function
 * @param {Function} fn
 * @param {ListIteratorCallback} mapper
 * @returns {Function}
 */
function mapArgs (fn, mapper) {
    return compose(partial(apply, fn), mapWith(mapper), list);
}

/**
 * Creates a pipeline of functions, where each function consumes the result of the previous one.<br/>
 * See also {@link module:lamb.compose|compose}.
 * @example
 * var square = _.partial(Math.pow, _, 2);
 * var getMaxAndSquare = _.pipe(Math.max, square);
 *
 * getMaxAndSquare(3, 5) // => 25
 *
 * @memberof module:lamb
 * @category Function
 * @function
 * @param {...Function} fn
 * @returns {Function}
 */
var pipe = flip(compose);

/**
 * Builds a function that allows to "tap" into the arguments of the original one.
 * This allows to extract simple values from complex ones, transform arguments or simply intercept them.
 * If a "tapper" isn't found the argument is passed as it is.
 * @example
 * var someObject = {count: 5};
 * var someArrayData = [2, 3, 123, 5, 6, 7, 54, 65, 76, 0];
 * var getDataAmount = _.tapArgs(_.add, _.getKey("count"), _.getKey("length"));
 *
 * getDataAmount(someObject, someArrayData); // => 15
 *
 * @memberof module:lamb
 * @category Function
 * @param {Function} fn
 * @param {...?Function} [tapper]
 * @returns {Function}
 */
function tapArgs (fn) {
    var tappers = _argsTail.apply(null, arguments);

    return function () {
        var len = arguments.length;
        var tappersLen = tappers.length;
        var args = [];

        for (var i = 0; i < len; i++) {
            args.push(i < tappersLen ? tappers[i](arguments[i]) : arguments[i]);
        }

        return fn.apply(this, args);
    };
}

/**
 * Returns a function that will invoke the passed function at most once in the given timespan.<br/>
 * The first call in this case happens as soon as the function is invoked; see also
 * {@link module:lamb.debounce|debounce} for a different behaviour where the first call is delayed.
 * @example
 * var log = _.throttle(console.log.bind(console), 5000);
 *
 * log("Hi"); // console logs "Hi"
 * log("Hi again"); // nothing happens
 * // after five seconds
 * log("Hello world"); // console logs "Hello world"
 *
 * @memberof module:lamb
 * @category Function
 * @param {Function} fn
 * @param {Number} timespan - Expressed in milliseconds.
 * @returns {Function}
 */
function throttle (fn, timespan) {
    var result;
    var lastCall = 0;

    return function () {
        var now = Date.now();

        if (now - lastCall >= timespan) {
            lastCall = now;
            result = fn.apply(this, arguments);
        }

        return result;
    };
}

/**
 * Builds a function that passes only one argument to the given function.<br/>
 * It's simply a shortcut for a common use case of {@link module:lamb.aritize|aritize},
 * exposed for convenience.<br/>
 * See also {@link module:lamb.binary|binary}.
 * @example
 * var weights = ["2 Kg", "10 Kg", "1 Kg", "7 Kg"];
 *
 * weights.map(_.unary(parseInt)) // => [2, 10, 1, 7]
 *
 * @memberof module:lamb
 * @category Function
 * @param {Function} fn
 * @returns {Function}
 */
function unary (fn) {
    return function (a) {
        return fn.call(this, a);
    };
}

/**
 * Wraps the function <code>fn</code> inside a <code>wrapper</code> function.<br/>
 * This allows to conditionally execute <code>fn</code>, to tamper with its arguments
 * or return value and to run code before and after its execution.<br/>
 * Being this nothing more than a "{@link module:lamb.flip|flipped}"
 * [partial application]{@link module:lamb.partial}, you can also easily build new
 * functions from existent ones.
 * @example
 * var arrayMax = _.wrap(Math.max, _.apply);
 *
 * arrayMax([4, 5, 2, 6, 1]) // => 6
 *
 * @memberof module:lamb
 * @category Function
 * @function
 * @param {Function} fn
 * @param {Function} wrapper
 * @returns {Function}
 */
var wrap = binary(flip(partial));

lamb.apply = apply;
lamb.applyArgs = applyArgs;
lamb.aritize = aritize;
lamb.asPartial = asPartial;
lamb.binary = binary;
lamb.collect = collect;
lamb.curry = curry;
lamb.curryRight = curryRight;
lamb.curryable = curryable;
lamb.curryableRight = curryableRight;
lamb.debounce = debounce;
lamb.flip = flip;
lamb.getArgAt = getArgAt;
lamb.invoker = invoker;
lamb.invokerOn = invokerOn;
lamb.mapArgs = mapArgs;
lamb.pipe = pipe;
lamb.tapArgs = tapArgs;
lamb.throttle = throttle;
lamb.unary = unary;
lamb.wrap = wrap;
