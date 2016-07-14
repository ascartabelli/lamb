
/**
 * Accepts a series of functions and builds a function that applies the received arguments to each one and
 * returns the first non-<code>undefined</code> value.<br/>
 * Meant to work in sinergy with {@link module:lamb.condition|condition} and {@link module:lamb.invoker|invoker},
 * can be useful as a strategy pattern for functions, to mimic conditional logic and also to build polymorphic functions.
 * @example
 * var isEven = function (n) { return n % 2 === 0; };
 * var filterString = _.compose(_.invoker("join", ""), _.filter);
 * var filterAdapter = _.adapter(
 *     _.invoker("filter"),
 *     _.condition(_.isType("String"), filterString)
 * );
 *
 * filterAdapter([1, 2, 3, 4, 5, 6], isEven)) // => [2, 4, 6]
 * filterAdapter("123456", isEven)) // => "246"
 * filterAdapter({}, isEven)) // => undefined
 *
 * // obviously it's composable
 * var filterWithDefault = _.adapter(filterAdapter, _.always("Not implemented"));
 *
 * filterWithDefault([1, 2, 3, 4, 5, 6], isEven)) // => [2, 4, 6]
 * filterWithDefault("123456", isEven)) // => "246"
 * filterWithDefault({}, isEven)) // => "Not implemented"
 *
 * @memberof module:lamb
 * @category Logic
 * @param {...Function} fn
 * @returns {Function}
 */
function adapter () {
    var functions = slice(arguments);

    return function () {
        var len = functions.length;
        var result;

        for (var i = 0; i < len; i++) {
            result = functions[i].apply(this, arguments);

            if (!isUndefined(result)) {
                break;
            }
        }

        return result;
    };
}

/**
 * Builds a predicate that returns true if all the given predicates are satisfied.
 * The arguments passed to the resulting function are applied to every predicate unless one of them returns false.
 * @example
 * var isEven = function (n) { return n % 2 === 0; };
 * var isPositive = function (n) { return n > 0; };
 * var isPositiveEven = _.allOf(isEven, isPositive);
 *
 * isPositiveEven(-2) // => false
 * isPositiveEven(11) // => false
 * isPositiveEven(6) // => true
 *
 * @memberof module:lamb
 * @category Logic
 * @see {@link module:lamb.anyOf|anyOf}
 * @param {...Function} predicate
 * @returns {Function}
 */
function allOf () {
    var predicates = slice(arguments);

    return function () {
        for (var i = 0, len = predicates.length; i < len; i++) {
            if(!predicates[i].apply(this, arguments)) {
                return false;
            }
        }

        return true;
    };
}

/**
 * Builds a predicate that returns true if at least one of the given predicates is satisfied.
 * The arguments passed to the resulting function are applied to every predicate until one of them returns true.
 * @example
 * // Lamb's "isNil" is actually implemented like this
 * var isNil = _.anyOf(_.isNull, _.isUndefined);
 *
 * isNil(NaN) // => false
 * isNil({}) // => false
 * isNil(null) // => true
 * isNil(void 0) // => true
 * isNil() // => true
 *
 * @memberof module:lamb
 * @category Logic
 * @see {@link module:lamb.allOf|allOf}
 * @param {...Function} predicate
 * @returns {Function}
 */
function anyOf () {
    var predicates = slice(arguments);

    return function () {
        for (var i = 0, len = predicates.length; i < len; i++) {
            if (predicates[i].apply(this, arguments)) {
                return true;
            }
        }

        return false;
    };
}

/**
 * Builds a function that will apply the received arguments to <code>trueFn</code>, if the predicate is satisfied with
 * the same arguments, or to <code>falseFn</code> otherwise.<br/>
 * If <code>falseFn</code> isn't provided and the predicate isn't satisfied the function will return <code>undefined</code>.<br/>
 * Although you can use other <code>condition</code>s as <code>trueFn</code> or <code>falseFn</code>, it's probably better to
 * use {@link module:lamb.adapter|adapter} to build more complex behaviours.
 * @example
 * var isEven = function (n) { return n % 2 === 0};
 * var halve = function (n) { return n / 2; };
 * var halveIfEven = _.condition(isEven, halve, _.identity);
 *
 * halveIfEven(5) // => 5
 * halveIfEven(6) // => 3
 *
 * @memberof module:lamb
 * @category Logic
 * @see {@link module:lamb.invoker|invoker}
 * @param {Function} predicate
 * @param {Function} trueFn
 * @param {Function} [falseFn]
 * @returns {Function}
 */
function condition (predicate, trueFn, falseFn) {
    return function () {
        var applyArgsTo = applyArgs(arguments);
        return applyArgsTo(predicate) ? applyArgsTo(trueFn) : falseFn ? applyArgsTo(falseFn) : void 0;
    };
}

/**
 * Verifies that the two supplied values are the same value using the "SameValue" comparison.<br/>
 * Note that this doesn't behave as the strict equality operator, but rather as a shim of ES6's
 * [Object.is]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is}.
 * Differences are that <code>0</code> and <code>-0</code> aren't the same value and, finally, <code>NaN</code> is equal to itself.<br/>
 * See also {@link module:lamb.isSVZ|isSVZ} which performs the check using the "SameValueZero" comparison.
 * @example
 * var testObject = {};
 *
 * _.is({}, testObject) // => false
 * _.is(testObject, testObject) // => true
 * _.is("foo", "foo") // => true
 * _.is(0, -0) // => false
 * _.is(0 / 0, NaN) // => true
 *
 * @memberof module:lamb
 * @category Logic
 * @see [SameValue comparison]{@link https://people.mozilla.org/~jorendorff/es6-draft.html#sec-samevalue}
 * @see [SameValueZero comparison]{@link https://people.mozilla.org/~jorendorff/es6-draft.html#sec-samevaluezero}
 * @param {*} a
 * @param {*} b
 * @returns {Boolean}
 */
function is (a, b) {
    return a === 0 && b === 0 ? 1 / a === 1 / b : isSVZ(a, b);
}

/**
 * Verifies that the first given value is greater than the second.
 * @example
 * var pastDate = new Date(2010, 2, 12);
 * var today = new Date();
 *
 * _.isGT(today, pastDate) // true
 * _.isGT(pastDate, today) // false
 * _.isGT(3, 4) // false
 * _.isGT(3, 3) // false
 * _.isGT(3, 2) // true
 * _.isGT(0, -0) // false
 * _.isGT(-0, 0) // false
 * _.isGT("a", "A") // true
 * _.isGT("b", "a") // true
 *
 * @memberof module:lamb
 * @category Logic
 * @param {Number|String|Date|Boolean} a
 * @param {Number|String|Date|Boolean} b
 * @returns {Boolean}
 */
function isGT (a, b) {
    return a > b;
}

/**
 * Verifies that the first given value is greater than or equal to the second.
 * Regarding equality, beware that this is simply a wrapper for the native operator, so <code>-0 === 0</code>.
 * @example
 * _.isGTE(3, 4) // false
 * _.isGTE(3, 3) // true
 * _.isGTE(3, 2) // true
 * _.isGTE(0, -0) // true
 * _.isGTE(-0, 0) // true
 *
 * @memberof module:lamb
 * @category Logic
 * @param {Number|String|Date|Boolean} a
 * @param {Number|String|Date|Boolean} b
 * @returns {Boolean}
 */
function isGTE (a, b) {
    return a >= b;
}

/**
 * Verifies that the first given value is less than the second.
 * @example
 * var pastDate = new Date(2010, 2, 12);
 * var today = new Date();
 *
 * _.isLT(today, pastDate) // false
 * _.isLT(pastDate, today) // true
 * _.isLT(3, 4) // true
 * _.isLT(3, 3) // false
 * _.isLT(3, 2) // false
 * _.isLT(0, -0) // false
 * _.isLT(-0, 0) // false
 * _.isLT("a", "A") // false
 * _.isLT("a", "b") // true
 *
 * @memberof module:lamb
 * @category Logic
 * @param {Number|String|Date|Boolean} a
 * @param {Number|String|Date|Boolean} b
 * @returns {Boolean}
 */
function isLT (a, b) {
    return a < b;
}

/**
 * Verifies that the first given value is less than or equal to the second.
 * Regarding equality, beware that this is simply a wrapper for the native operator, so <code>-0 === 0</code>.
 * @example
 * _.isLTE(3, 4) // true
 * _.isLTE(3, 3) // true
 * _.isLTE(3, 2) // false
 * _.isLTE(0, -0) // true
 * _.isLTE(-0, 0) // true
 *
 * @memberof module:lamb
 * @category Logic
 * @param {Number|String|Date|Boolean} a
 * @param {Number|String|Date|Boolean} b
 * @returns {Boolean}
 */
function isLTE (a, b) {
    return a <= b;
}

/**
 * A simple negation of {@link module:lamb.is|is}, exposed for convenience.
 * @example
 * _.isNot("foo", "foo") // => false
 * _.isNot(0, -0) // => true
 *
 * @memberof module:lamb
 * @category Logic
 * @function
 * @param {*} valueA
 * @param {*} valueB
 * @returns {Boolean}
 */
var isNot = not(is);

/**
 * Verifies that the two supplied values are the same value using the "SameValueZero" comparison.<br/>
 * With this comparison <code>NaN</code> is equal to itself, but <code>0</code> and <code>-0</code> are
 * considered the same value too.<br/>
 * See also {@link module:lamb.is|is} to perform a "SameValue" comparison.
 * @example
 * var testObject = {};
 *
 * _.isSVZ({}, testObject) // => false
 * _.isSVZ(testObject, testObject) // => true
 * _.isSVZ("foo", "foo") // => true
 * _.isSVZ(0, -0) // => true
 * _.isSVZ(0 / 0, NaN) // => true
 *
 * @memberof module:lamb
 * @category Logic
 * @see [SameValue comparison]{@link https://people.mozilla.org/~jorendorff/es6-draft.html#sec-samevalue}
 * @see [SameValueZero comparison]{@link https://people.mozilla.org/~jorendorff/es6-draft.html#sec-samevaluezero}
 * @param {*} a
 * @param {*} b
 * @returns {Boolean}
 */
function isSVZ (a, b) {
    return a !== a ? b !== b : a === b;
}

/**
 * Returns a predicate that negates the given one.
 * @example
 * var isEven = function (n) { return n % 2 === 0; };
 * var isOdd = _.not(isEven);
 *
 * isOdd(5) // => true
 * isOdd(4) // => false
 *
 * @memberof module:lamb
 * @category Logic
 * @param {Function} predicate
 * @returns {Function}
 */
function not (predicate) {
    return function () {
        return !predicate.apply(this, arguments);
    };
}

lamb.adapter = adapter;
lamb.allOf = allOf;
lamb.anyOf = anyOf;
lamb.condition = condition;
lamb.is = is;
lamb.isGT = isGT;
lamb.isGTE = isGTE;
lamb.isLT = isLT;
lamb.isLTE = isLTE;
lamb.isNot = isNot;
lamb.isSVZ = isSVZ;
lamb.not = not;
