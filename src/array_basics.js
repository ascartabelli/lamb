/**
 * Builds an array comprised of all values of the array-like object passing the <code>predicate</code>
 * test.<br/>
 * Since version <code>0.34.0</code> this function is no longer a generic version of
 * [Array.prototype.filter]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter}
 * for performance reasons.<br/>
 * Note that unlike the native array method this function doesn't skip unassigned or deleted indexes.
 * @example
 * var isLowerCase = function (s) { return s.toLowerCase() === s; };
 *
 * _.filter(["Foo", "bar", "baZ"], isLowerCase) // => ["bar"]
 *
 * // the function will work with any array-like object
 * _.filter("fooBAR", isLowerCase) // => ["f", "o", "o"]
 *
 * @memberof module:lamb
 * @category Array
 * @see {@link module:lamb.filterWith|filterWith}
 * @param {ArrayLike} arrayLike
 * @param {ListIteratorCallback} predicate
 * @param {Object} [predicateContext]
 * @returns {Array}
 */
function filter (arrayLike, predicate, predicateContext) {
    var len = arrayLike.length;
    var result = [];

    if (arguments.length === 3) {
        predicate = predicate.bind(predicateContext);
    }

    for (var i = 0; i < len; i++) {
        predicate(arrayLike[i], i, arrayLike) && result.push(arrayLike[i]);
    }

    return result;
}

/**
 * Returns a partial application of {@link module:lamb.filter|filter} that uses the given predicate and
 * the optional context to build a function expecting the array-like object to act upon.
 * @example
 * var isLowerCase = function (s) { return s.toLowerCase() === s; };
 * var getLowerCaseEntries = _.filterWith(isLowerCase);
 *
 * getLowerCaseEntries(["Foo", "bar", "baZ"]) // => ["bar"]
 *
 * // array-like objects can be used as well
 * getLowerCaseEntries("fooBAR") // => ["f", "o", "o"]
 *
 * @memberof module:lamb
 * @category Array
 * @function
 * @see {@link module:lamb.filter|filter}
 * @param {ListIteratorCallback} predicate
 * @param {Object} [predicateContext]
 * @returns {Function}
 */
var filterWith = _partialWithIteratee(filter);

/**
 * Executes the provided <code>iteratee</code> for each element of the given array-like object.<br/>
 * Since version <code>0.34.0</code> this function is no longer a generic version of
 * [Array.prototype.forEach]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach}
 * for performance reasons.<br/>
 * Note that unlike the native array method this function doesn't skip unassigned or deleted indexes.
 * @example <caption>Adding a CSS class to all elements of a NodeList in a browser environment</caption>
 * var addClass = _.curry(function (className, element) {
 *     element.classList.add(className);
 * });
 * var paragraphs = document.querySelectorAll("#some-container p");
 *
 * _.forEach(paragraphs, addClass("main"));
 * // each "p" element in the container will have the "main" class now
 *
 * @memberof module:lamb
 * @category Array
 * @param {ArrayLike} arrayLike
 * @param {ListIteratorCallback} iteratee
 * @param {Object} [iterateeContext]
 * @returns {Undefined}
 */
function forEach (arrayLike, iteratee, iterateeContext) {
    if (arguments.length === 3) {
        iteratee = iteratee.bind(iterateeContext);
    }

    for (var i = 0, len = arrayLike.length >>> 0; i < len; i++) {
        iteratee(arrayLike[i], i, arrayLike);
    }
}

/**
 * Builds a new array by applying the iteratee function to each element of the
 * received array-like object.<br/>
 * Since version <code>0.34.0</code> this function is no longer a generic version of
 * [Array.prototype.map]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map}
 * for performance reasons.<br/>
 * Note that unlike the native array method this function doesn't skip unassigned or deleted indexes.
 * @example
 * _.map(["Joe", "Mario", "Jane"], _.invoker("toUpperCase")) // => ["JOE", "MARIO", "JANE"]
 *
 * _.map([4, 9, 16], Math.sqrt); // => [2, 3, 4]
 *
 * @memberof module:lamb
 * @category Array
 * @see {@link module:lamb.mapWith|mapWith}
 * @param {ArrayLike} arrayLike
 * @param {ListIteratorCallback} iteratee
 * @param {Object} [iterateeContext]
 * @returns {Array}
 */
function map (arrayLike, iteratee, iterateeContext) {
    var len = arrayLike.length >>> 0;
    var result = Array(len);

    if (arguments.length === 3) {
        iteratee = iteratee.bind(iterateeContext);
    }

    for (var i = 0; i < len; i++) {
        result[i] = iteratee(arrayLike[i], i, arrayLike);
    }

    return result;
}

/**
 * Builds a partial application of {@link module:lamb.map|map} using the given iteratee and the
 * optional context. The resulting function expects the array-like object to act upon.
 * @example
 * var square = function (n) { return n * n; };
 * var getSquares = _.mapWith(square);
 *
 * getSquares([1, 2, 3, 4, 5]) // => [1, 4, 9, 16, 25]
 *
 * @memberof module:lamb
 * @category Array
 * @function
 * @see {@link module:lamb.map|map}
 * @param {ListIteratorCallback} iteratee
 * @param {Object} [iterateeContext]
 * @returns {function}
 */
var mapWith = _partialWithIteratee(map);

/**
 * Reduces (or folds) the values of an array-like object, starting from the first, to a new
 * value using the provided <code>accumulator</code> function.<br/>
 * Since version <code>0.34.0</code> this function is no longer a generic version of
 * [Array.prototype.reduce]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce}
 * for performance reasons.<br/>
 * Note that unlike the native array method this function doesn't skip unassigned or deleted indexes.
 * @example
 * _.reduce([1, 2, 3, 4], _.add) // => 10
 *
 * @memberof module:lamb
 * @category Array
 * @function
 * @see {@link module:lamb.reduceRight|reduceRight}
 * @see {@link module:lamb.reduceWith|reduceWith}, {@link module:lamb.reduceRightWith|reduceRightWith}
 * @param {ArrayLike} arrayLike
 * @param {AccumulatorCallback} accumulator
 * @param {*} [initialValue]
 * @returns {*}
 */
var reduce = _makeReducer(1);

/**
 * Same as {@link module:lamb.reduce|reduce}, but starts the fold operation from the last
 * element instead.<br/>
 * Since version <code>0.34.0</code> this function is no longer a generic version of
 * [Array.prototype.reduceRight]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight}
 * for performance reasons.<br/>
 * Note that unlike the native array method this function doesn't skip unassigned or deleted indexes.
 * @memberof module:lamb
 * @category Array
 * @function
 * @see {@link module:lamb.reduce|reduce}
 * @see {@link module:lamb.reduceWith|reduceWith}, {@link module:lamb.reduceRightWith|reduceRightWith}
 * @param {ArrayLike} arrayLike
 * @param {AccumulatorCallback} accumulator
 * @param {*} [initialValue]
 * @returns {*}
 */
var reduceRight = _makeReducer(-1);

/**
 * A partial application of {@link module:lamb.reduce|reduceRight} that uses the
 * provided <code>accumulator</code> and the optional <code>initialValue</code> to
 * build a function expecting the array-like object to act upon.
 * @example
 * var arr = [1, 2, 3, 4, 5];
 *
 * _.reduceRightWith(_.add)(arr) // => 15
 * _.reduceRightWith(_.subtract)(arr) // => -5
 * _.reduceRightWith(_.subtract, 0)(arr) // => -15
 *
 * @memberof module:lamb
 * @category Array
 * @function
 * @see {@link module:lamb.reduceWith|reduceWith}
 * @see {@link module:lamb.reduce|reduce}, {@link module:lamb.reduce|reduceRight}
 * @param {AccumulatorCallback} accumulator
 * @param {*} [initialValue]
 * @returns {Function}
 */
var reduceRightWith = _partialWithIteratee(reduceRight);

/**
 * A partial application of {@link module:lamb.reduce|reduce} that uses the
 * provided <code>accumulator</code> and the optional <code>initialValue</code> to
 * build a function expecting the array-like object to act upon.
 * @example
 * var arr = [1, 2, 3, 4, 5];
 *
 * _.reduceWith(_.add)(arr) // => 15
 * _.reduceWith(_.subtract)(arr) // => -13
 * _.reduceWith(_.subtract, 0)(arr) // => -15
 *
 * @memberof module:lamb
 * @category Array
 * @function
 * @see {@link module:lamb.reduceRightWith|reduceRightWith}
 * @see {@link module:lamb.reduce|reduce}, {@link module:lamb.reduce|reduceRight}
 * @param {AccumulatorCallback} accumulator
 * @param {*} [initialValue]
 * @returns {Function}
 */
var reduceWith = _partialWithIteratee(reduce);

/**
 * Builds an array by extracting a portion of an array-like object.<br/>
 * It's a generic version of [Array.prototype.slice]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice}.
 * @example
 * _.slice(["foo", "bar", "baz"], 0, 2) // => ["foo", "bar"]
 *
 * @memberof module:lamb
 * @category Array
 * @function
 * @param {ArrayLike} arrayLike - Any array like object.
 * @param {Number} [start=0] - Zero-based index at which to begin extraction.
 * @param {Number} [end=arrayLike.length] - Zero-based index at which to end extraction.
 * Extracts up to but not including end.
 * @returns {Array}
 */
var slice = generic(_arrayProto.slice);

lamb.filter = filter;
lamb.filterWith = filterWith;
lamb.forEach = forEach;
lamb.map = map;
lamb.mapWith = mapWith;
lamb.reduce = reduce;
lamb.reduceRight = reduceRight;
lamb.reduceRightWith = reduceRightWith;
lamb.reduceWith = reduceWith;
lamb.slice = slice;
