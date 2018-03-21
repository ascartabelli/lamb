/**
 * Accepts a series of functions and builds a function that applies the received
 * arguments to each one and returns the first non-<code>undefined</code> value.<br/>
 * Meant to work in synergy with {@link module:lamb.case|case} and
 * {@link module:lamb.invoker|invoker}, can be useful as a strategy pattern for functions,
 * to mimic conditional logic or pattern matching, and also to build polymorphic functions.
 * @example
 * var isEven = function (n) { return n % 2 === 0; };
 * var filterString = _.compose(_.invoker("join", ""), _.filter);
 * var filterAdapter = _.adapter(
 *     _.invoker("filter"),
 *     _.case(_.isType("String"), filterString)
 * );
 *
 * filterAdapter([1, 2, 3, 4, 5, 6], isEven) // => [2, 4, 6]
 * filterAdapter("123456", isEven) // => "246"
 * filterAdapter({}, isEven) // => undefined
 *
 * // by its nature is composable
 * var filterWithDefault = _.adapter(filterAdapter, _.always("Not implemented"));
 *
 * filterWithDefault([1, 2, 3, 4, 5, 6], isEven) // => [2, 4, 6]
 * filterWithDefault("123456", isEven) // => "246"
 * filterWithDefault({}, isEven) // => "Not implemented"
 *
 * @memberof module:lamb
 * @category Logic
 * @see {@link module:lamb.case|case}
 * @see {@link module:lamb.invoker|invoker}
 * @since 0.6.0
 * @param {...Function} fn
 * @returns {Function}
 */
function adapter () {
    var functions = list.apply(null, arguments);

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
 * Accepts a series of predicates and builds a new one that returns true if they are all satisfied
 * by the same arguments. The functions in the series will be applied one at a time until a
 * <code>false</code> value is produced, which is returned immediately.
 * @example
 * var isEven = function (n) { return n % 2 === 0; };
 * var isPositiveEven = _.allOf(isEven, _.isGT(0));
 *
 * isPositiveEven(-2) // => false
 * isPositiveEven(11) // => false
 * isPositiveEven(6) // => true
 *
 * @memberof module:lamb
 * @category Logic
 * @see {@link module:lamb.anyOf|anyOf}
 * @since 0.1.0
 * @param {...Function} predicate
 * @returns {Function}
 */
function allOf () {
    var predicates = list.apply(null, arguments);

    return function () {
        for (var i = 0, len = predicates.length; i < len; i++) {
            if (!predicates[i].apply(this, arguments)) {
                return false;
            }
        }

        return true;
    };
}

/**
 * Accepts a series of predicates and builds a new one that returns true if at least one of them is
 * satisfied by the received arguments. The functions in the series will be applied one at a time
 * until a <code>true</code> value is produced, which is returned immediately.
 * @example
 * var users = [
 *     {id: 1, name: "John", group: "guest"},
 *     {id: 2, name: "Jane", group: "root"},
 *     {id: 3, name: "Mario", group: "admin"}
 * ];
 * var isInGroup = _.partial(_.hasKeyValue, ["group"]);
 * var isSuperUser = _.anyOf(isInGroup("admin"), isInGroup("root"));
 *
 * isSuperUser(users[0]) // => false
 * isSuperUser(users[1]) // => true
 * isSuperUser(users[2]) // => true
 *
 * @memberof module:lamb
 * @category Logic
 * @see {@link module:lamb.allOf|allOf}
 * @since 0.1.0
 * @param {...Function} predicate
 * @returns {Function}
 */
function anyOf () {
    var predicates = list.apply(null, arguments);

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
 * Verifies that the two supplied values are the same value using the "SameValue" comparison.<br/>
 * Note that this doesn't behave as the strict equality operator, but rather as a shim of ES6's
 * [Object.is]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is}.
 * Differences are that <code>0</code> and <code>-0</code> aren't the same value and, finally,
 * <code>NaN</code> is equal to itself.<br/>
 * See also {@link module:lamb.is|is} for a curried version building a predicate and
 * {@link module:lamb.areSVZ|areSVZ} and {@link module:lamb.isSVZ|isSVZ} to perform a "SameValueZero"
 * comparison.
 * @example
 * var testObject = {};
 *
 * _.areSame({}, testObject) // => false
 * _.areSame(testObject, testObject) // => true
 * _.areSame("foo", "foo") // => true
 * _.areSame(0, -0) // => false
 * _.areSame(0 / 0, NaN) // => true
 *
 * @memberof module:lamb
 * @category Logic
 * @see {@link module:lamb.is|is}
 * @see {@link module:lamb.areSVZ|areSVZ}, {@link module:lamb.isSVZ|isSVZ}
 * @see [SameValue comparison]{@link https://www.ecma-international.org/ecma-262/7.0/#sec-samevalue}
 * @see [SameValueZero comparison]{@link https://www.ecma-international.org/ecma-262/7.0/#sec-samevaluezero}
 * @since 0.50.0
 * @param {*} a
 * @param {*} b
 * @returns {Boolean}
 */
function areSame (a, b) {
    return a === 0 && b === 0 ? 1 / a === 1 / b : areSVZ(a, b);
}

/**
 * Verifies that the two supplied values are the same value using the "SameValueZero" comparison.<br/>
 * With this comparison <code>NaN</code> is equal to itself, but <code>0</code> and <code>-0</code> are
 * considered the same value.<br/>
 * See also {@link module:lamb.isSVZ|isSVZ} for a curried version building a predicate and
 * {@link module:lamb.areSame|areSame} and {@link module:lamb.is|is} to perform a "SameValue" comparison.
 * @example
 * var testObject = {};
 *
 * _.areSVZ({}, testObject) // => false
 * _.areSVZ(testObject, testObject) // => true
 * _.areSVZ("foo", "foo") // => true
 * _.areSVZ(0, -0) // => true
 * _.areSVZ(0 / 0, NaN) // => true
 *
 * @memberof module:lamb
 * @category Logic
 * @see {@link module:lamb.isSVZ|isSVZ}
 * @see {@link module:lamb.areSame|areSame}, {@link module:lamb.is|is}
 * @see [SameValue comparison]{@link https://www.ecma-international.org/ecma-262/7.0/#sec-samevalue}
 * @see [SameValueZero comparison]{@link https://www.ecma-international.org/ecma-262/7.0/#sec-samevaluezero}
 * @since 0.50.0
 * @param {*} a
 * @param {*} b
 * @returns {Boolean}
 */
function areSVZ (a, b) {
    return a !== a ? b !== b : a === b; // eslint-disable-line no-self-compare
}

/**
 * Builds a case for {@link module:lamb.adapter|adapter}.<br/>
 * The function will apply the received arguments to <code>fn</code> if the predicate is satisfied
 * with the same arguments, otherwise will return <code>undefined</code>.<br/>
 * See also {@link module:lamb.condition|condition} to build a condition with two branching functions
 * and {@link module:lamb.unless|unless} and {@link module:lamb.when|when} where one of the branches
 * is the identity function.
 * @example
 * var halveIfNumber = _.case(_.isType("Number"), _.divideBy(2));
 *
 * halveIfNumber(2) // => 1
 * halveIfNumber("2") // => undefined
 *
 * @alias module:lamb.case
 * @category Logic
 * @see {@link module:lamb.adapter|adapter}
 * @see {@link module:lamb.condition|condition}
 * @see {@link module:lamb.unless|unless}
 * @see {@link module:lamb.when|when}
 * @since 0.51.0
 * @param {Function} predicate
 * @param {Function} fn
 * @returns {Function}
 */
function case_ (predicate, fn) {
    return function () {
        return predicate.apply(this, arguments) ? fn.apply(this, arguments) : void 0;
    };
}

/**
 * Builds a function that will apply the received arguments to <code>trueFn</code>,
 * if the predicate is satisfied with the same arguments, or to <code>falseFn</code> otherwise.<br/>
 * Although you can use other <code>condition</code>s as <code>trueFn</code> or <code>falseFn</code>,
 * it's probably better to use {@link module:lamb.adapter|adapter} to build more complex behaviours.<br/>
 * See also {@link module:lamb.unless|unless} and {@link module:lamb.when|when} as they are
 * shortcuts to common use cases.
 * @example
 * var isEven = function (n) { return n % 2 === 0};
 * var halveEvenAndDoubleOdd = _.condition(isEven, _.divideBy(2), _.multiplyBy(2));
 *
 * halveEvenAndDoubleOdd(5) // => 10
 * halveEvenAndDoubleOdd(6) // => 3
 *
 * @memberof module:lamb
 * @category Logic
 * @see {@link module:lamb.unless|unless}
 * @see {@link module:lamb.when|when}
 * @see {@link module:lamb.adapter|adapter}
 * @see {@link module:lamb.case|case}
 * @since 0.2.0
 * @param {Function} predicate
 * @param {Function} trueFn
 * @param {Function} falseFn
 * @returns {Function}
 */
function condition (predicate, trueFn, falseFn) {
    return function () {
        return (predicate.apply(this, arguments) ? trueFn : falseFn).apply(this, arguments);
    };
}

/**
 * Verifies that the first given value is greater than the second.<br/>
 * Wraps the native <code>&gt;</code> operator within a function.
 * @example
 * var pastDate = new Date(2010, 2, 12);
 * var today = new Date();
 *
 * _.gt(today, pastDate) // => true
 * _.gt(pastDate, today) // => false
 * _.gt(3, 4) // => false
 * _.gt(3, 3) // => false
 * _.gt(3, 2) // => true
 * _.gt(0, -0) // => false
 * _.gt(-0, 0) // => false
 * _.gt("a", "A") // => true
 * _.gt("b", "a") // => true
 *
 * @memberof module:lamb
 * @category Logic
 * @see {@link module:lamb.gte|gte}
 * @see {@link module:lamb.lt|lt}, {@link module:lamb.lte|lte}
 * @see {@link module:lamb.isGT|isGT}, {@link module:lamb.isGTE|isGTE}
 * @see {@link module:lamb.isLT|isLT}, {@link module:lamb.isLTE|isLTE}
 * @since 0.50.0
 * @param {Number|String|Date|Boolean} a
 * @param {Number|String|Date|Boolean} b
 * @returns {Boolean}
 */
function gt (a, b) {
    return a > b;
}

/**
 * Verifies that the first given value is greater than or equal to the second.
 * Regarding equality, beware that this is simply a wrapper for the native
 * <code>&gt;=</code> operator, so <code>-0 === 0</code>.
 * @example
 * _.gte(3, 4) // => false
 * _.gte(3, 3) // => true
 * _.gte(3, 2) // => true
 * _.gte(0, -0) // => true
 * _.gte(-0, 0) // => true
 *
 * @memberof module:lamb
 * @category Logic
 * @see {@link module:lamb.gt|gt}
 * @see {@link module:lamb.lt|lt}, {@link module:lamb.lte|lte}
 * @see {@link module:lamb.isGT|isGT}, {@link module:lamb.isGTE|isGTE}
 * @see {@link module:lamb.isLT|isLT}, {@link module:lamb.isLTE|isLTE}
 * @since 0.50.0
 * @param {Number|String|Date|Boolean} a
 * @param {Number|String|Date|Boolean} b
 * @returns {Boolean}
 */
function gte (a, b) {
    return a >= b;
}

/**
 * A curried version of {@link module:lamb.areSame|areSame}.<br/>
 * Accepts a value and builds a predicate that checks whether the value
 * and the one received by the predicate are the same using the "SameValue"
 * comparison.<br/>
 * See also {@link module:lamb.areSVZ|areSVZ} and {@link module:lamb.isSVZ|isSVZ}
 * to perform a "SameValueZero" comparison.
 * @example
 * var john = {name: "John", surname: "Doe"};
 * var isJohn = _.is(john);
 * var isNegativeZero = _.is(-0);
 * var isReallyNaN = _.is(NaN);
 *
 * isJohn(john) // => true
 * isJohn({name: "John", surname: "Doe"}) // => false
 *
 * isNegativeZero(0) // => false
 * isNegativeZero(-0) // => true
 *
 * isNaN(NaN) // => true
 * isNaN("foo") // => true
 *
 * isReallyNaN(NaN) // => true
 * isReallyNaN("foo") // => false
 *
 * @memberof module:lamb
 * @category Logic
 * @function
 * @see {@link module:lamb.areSame|areSame}
 * @see {@link module:lamb.areSVZ|areSVZ}, {@link module:lamb.isSVZ|isSVZ}
 * @see [SameValue comparison]{@link https://www.ecma-international.org/ecma-262/7.0/#sec-samevalue}
 * @see [SameValueZero comparison]{@link https://www.ecma-international.org/ecma-262/7.0/#sec-samevaluezero}
 * @since 0.1.0
 * @param {*} value
 * @returns {Function}
 */
var is = _curry2(areSame);

/**
 * A right curried version of {@link module:lamb.gt|gt}.<br/>
 * Accepts a value and builds a predicate that checks whether the value
 * is greater than the one received by the predicate.
 * @example
 * var isGreaterThan5 = _.isGT(5);
 *
 * isGreaterThan5(3) // => false
 * isGreaterThan5(5) // => false
 * isGreaterThan5(7) // => true
 *
 * @memberof module:lamb
 * @category Logic
 * @function
 * @see {@link module:lamb.isGTE|isGTE}
 * @see {@link module:lamb.isLT|isLT}, {@link module:lamb.isLTE|isLTE}
 * @see {@link module:lamb.gt|gt}, {@link module:lamb.gte|gte}
 * @see {@link module:lamb.lt|lt}, {@link module:lamb.lte|lte}
 * @since 0.1.0
 * @param {Number|String|Date|Boolean} value
 * @returns {Function}
 */
var isGT = _curry2(gt, true);

/**
 * A right curried version of {@link module:lamb.gte|gte}.<br/>
 * Accepts a value and builds a predicate that checks whether the value
 * is greater than or equal to the one received by the predicate.
 * @example
 * var isPositiveOrZero = _.isGTE(0);
 *
 * isPositiveOrZero(-3) // => false
 * isPositiveOrZero(-0) // => true
 * isPositiveOrZero(0) // => true
 * isPositiveOrZero(5) // => true
 *
 * @memberof module:lamb
 * @category Logic
 * @function
 * @see {@link module:lamb.isGT|isGT}
 * @see {@link module:lamb.isLT|isLT}, {@link module:lamb.isLTE|isLTE}
 * @see {@link module:lamb.gt|gt}, {@link module:lamb.gte|gte}
 * @see {@link module:lamb.lt|lt}, {@link module:lamb.lte|lte}
 * @since 0.1.0
 * @param {Number|String|Date|Boolean} value
 * @returns {Function}
 */
var isGTE = _curry2(gte, true);

/**
 * A right curried version of {@link module:lamb.lt|lt}.<br/>
 * Accepts a value and builds a predicate that checks whether the value
 * is less than the one received by the predicate.
 * @example
 * var isLessThan5 = _.isLT(5);
 *
 * isLessThan5(7) // => false
 * isLessThan5(5) // => false
 * isLessThan5(3) // => true
 *
 * @memberof module:lamb
 * @category Logic
 * @function
 * @see {@link module:lamb.isLTE|isLTE}
 * @see {@link module:lamb.isGT|isGT}, {@link module:lamb.isGTE|isGTE}
 * @see {@link module:lamb.lt|lt}, {@link module:lamb.lte|lte}
 * @see {@link module:lamb.gt|gt}, {@link module:lamb.gte|gte}
 * @since 0.1.0
 * @param {Number|String|Date|Boolean} value
 * @returns {Function}
 */
var isLT = _curry2(lt, true);

/**
 * A right curried version of {@link module:lamb.lte|lte}.<br/>
 * Accepts a value and builds a predicate that checks whether the value
 * is less than or equal to the one received by the predicate.
 * @example
 * var isNegativeOrZero = _.isLTE(0);
 *
 * isNegativeOrZero(5) // => false
 * isNegativeOrZero(-0) // => true
 * isNegativeOrZero(0) // => true
 * isNegativeOrZero(-3) // => true
 *
 * @memberof module:lamb
 * @category Logic
 * @function
 * @see {@link module:lamb.isLT|isLT}
 * @see {@link module:lamb.isGT|isGT}, {@link module:lamb.isGTE|isGTE}
 * @see {@link module:lamb.lt|lt}, {@link module:lamb.lte|lte}
 * @see {@link module:lamb.gt|gt}, {@link module:lamb.gte|gte}
 * @since 0.1.0
 * @param {Number|String|Date|Boolean} value
 * @returns {Function}
 */
var isLTE = _curry2(lte, true);

/**
 * A curried version of {@link module:lamb.areSVZ|areSVZ}.<br/>
 * Accepts a value and builds a predicate that checks whether the value
 * and the one received by the predicate are the same using the "SameValueZero"
 * comparison.<br/>
 * See also {@link module:lamb.areSame|areSame} and {@link module:lamb.is|is}
 * to perform a "SameValue" comparison.
 * @example
 * var john = {name: "John", surname: "Doe"};
 * var isJohn = _.isSVZ(john);
 * var isZero = _.isSVZ(0);
 * var isReallyNaN = _.isSVZ(NaN);
 *
 * isJohn(john) // => true
 * isJohn({name: "John", surname: "Doe"}) // => false
 *
 * isZero(0) // => true
 * isZero(-0) // => true
 *
 * isNaN(NaN) // => true
 * isNaN("foo") // => true
 *
 * isReallyNaN(NaN) // => true
 * isReallyNaN("foo") // => false
 *
 * @memberof module:lamb
 * @category Logic
 * @function
 * @see {@link module:lamb.areSVZ|areSVZ}
 * @see {@link module:lamb.areSame|areSame}, {@link module:lamb.is|is}
 * @see [SameValue comparison]{@link https://www.ecma-international.org/ecma-262/7.0/#sec-samevalue}
 * @see [SameValueZero comparison]{@link https://www.ecma-international.org/ecma-262/7.0/#sec-samevaluezero}
 * @since 0.1.0
 * @param {*} value
 * @returns {Function}
 */
var isSVZ = _curry2(areSVZ);

/**
 * Verifies that the first given value is less than the second.<br/>
 * Wraps the native <code>&lt;</code> operator within a function.
 * @example
 * var pastDate = new Date(2010, 2, 12);
 * var today = new Date();
 *
 * _.lt(today, pastDate) // => false
 * _.lt(pastDate, today) // => true
 * _.lt(3, 4) // => true
 * _.lt(3, 3) // => false
 * _.lt(3, 2) // => false
 * _.lt(0, -0) // => false
 * _.lt(-0, 0) // => false
 * _.lt("a", "A") // => false
 * _.lt("a", "b") // => true
 *
 * @memberof module:lamb
 * @category Logic
 * @see {@link module:lamb.lte|lte}
 * @see {@link module:lamb.gt|gt}, {@link module:lamb.gte|gte}
 * @see {@link module:lamb.isLT|isLT}, {@link module:lamb.isLTE|isLTE}
 * @see {@link module:lamb.isGT|isGT}, {@link module:lamb.isGTE|isGTE}
 * @since 0.50.0
 * @param {Number|String|Date|Boolean} a
 * @param {Number|String|Date|Boolean} b
 * @returns {Boolean}
 */
function lt (a, b) {
    return a < b;
}

/**
 * Verifies that the first given value is less than or equal to the second.
 * Regarding equality, beware that this is simply a wrapper for the native
 * <code>&lt;=</code> operator, so <code>-0 === 0</code>.
 * @example
 * _.lte(3, 4) // => true
 * _.lte(3, 3) // => true
 * _.lte(3, 2) // => false
 * _.lte(0, -0) // => true
 * _.lte(-0, 0) // => true
 *
 * @memberof module:lamb
 * @category Logic
 * @see {@link module:lamb.lt|lt}
 * @see {@link module:lamb.gt|gt}, {@link module:lamb.gte|gte}
 * @see {@link module:lamb.isLT|isLT}, {@link module:lamb.isLTE|isLTE}
 * @see {@link module:lamb.isGT|isGT}, {@link module:lamb.isGTE|isGTE}
 * @since 0.50.0
 * @param {Number|String|Date|Boolean} a
 * @param {Number|String|Date|Boolean} b
 * @returns {Boolean}
 */
function lte (a, b) {
    return a <= b;
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
 * @since 0.1.0
 * @param {Function} predicate
 * @returns {Function}
 */
function not (predicate) {
    return function () {
        return !predicate.apply(this, arguments);
    };
}

/**
 * Builds a unary function that will check its argument against the given predicate.
 * If the predicate isn't satisfied, the provided <code>fn</code> function will be
 * applied to the same value. The received argument is returned as it is otherwise.<br/>
 * See {@link module:lamb.when|when} for the opposite behaviour.<br/>
 * It's a shortcut for a common use case of {@link module:lamb.condition|condition},
 * where its <code>trueFn</code> parameter is the [identity function]{@link module:lamb.identity}.
 * @example
 * var isEven = function (n) { return n % 2 === 0};
 * var halveUnlessIsEven = _.unless(isEven, _.divideBy(2));
 *
 * halveUnlessIsEven(5) // => 2.5
 * halveUnlessIsEven(6) // => 6
 *
 * @memberof module:lamb
 * @category Logic
 * @see {@link module:lamb.condition|condition}
 * @see {@link module:lamb.when|when}
 * @see {@link module:lamb.adapter|adapter}
 * @see {@link module:lamb.case|case}
 * @since 0.42.0
 * @param {Function} predicate
 * @param {Function} fn
 * @returns {Function}
 */
function unless (predicate, fn) {
    return function (value) {
        return predicate.call(this, value) ? value : fn.call(this, value);
    };
}

/**
 * Builds a unary function that will check its argument against the given predicate.
 * If the predicate is satisfied, the provided <code>fn</code> function will be
 * applied to the same value. The received argument is returned as it is otherwise.<br/>
 * See {@link module:lamb.unless|unless} for the opposite behaviour.<br/>
 * It's a shortcut for a common use case of {@link module:lamb.condition|condition},
 * where its <code>falseFn</code> parameter is the [identity function]{@link module:lamb.identity}.
 * @example
 * var isEven = function (n) { return n % 2 === 0; };
 * var halveIfEven = _.when(isEven, _.divideBy(2));
 *
 * halveIfEven(5) // => 5
 * halveIfEven(6) // => 3
 *
 * @memberof module:lamb
 * @category Logic
 * @see {@link module:lamb.condition|condition}
 * @see {@link module:lamb.unless|unless}
 * @see {@link module:lamb.adapter|adapter}
 * @see {@link module:lamb.case|case}
 * @since 0.42.0
 * @param {Function} predicate
 * @param {Function} fn
 * @returns {Function}
 */
function when (predicate, fn) {
    return function (value) {
        return predicate.call(this, value) ? fn.call(this, value) : value;
    };
}

lamb.adapter = adapter;
lamb.allOf = allOf;
lamb.anyOf = anyOf;
lamb.areSame = areSame;
lamb.areSVZ = areSVZ;
lamb.case = case_;
lamb.condition = condition;
lamb.gt = gt;
lamb.gte = gte;
lamb.is = is;
lamb.isGT = isGT;
lamb.isGTE = isGTE;
lamb.isLT = isLT;
lamb.isLTE = isLTE;
lamb.isSVZ = isSVZ;
lamb.lt = lt;
lamb.lte = lte;
lamb.not = not;
lamb.unless = unless;
lamb.when = when;
