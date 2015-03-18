
/**
 * Builds an array comprised of all values of the array-like object passing the <code>predicate</code> test.<br/>
 * It's a generic version of [Array.prototype.filter]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter}.
 * @example
 * var isLowerCase = function (s) { return s.toUpperCase() !== s; };
 *
 * _.filter(["Foo", "bar", "baZ"], isLowerCase) // => ["bar"]
 *
 * // the function will work with any array-like object
 * _.filter("fooBAR", isLowerCase) // => ["f", "o", "o"]
 *
 * @memberof module:lamb
 * @category Array
 * @function
 * @param {ArrayLike} arrayLike
 * @param {ListIteratorCallback} predicate
 * @param {Object} [predicateContext]
 * @returns {Array}
 */
var filter = generic(_arrayProto.filter);

/**
 * Executes the provided <code>iteratee</code> for each element of the given array-like object.<br/>
 * It's a generic version of [Array.prototype.forEach]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach}.
 * @example <caption>Adding a CSS class to all elements of a NodeList in a browser environment</caption>
 * var addClass = function (className) {
 *     return function (element) {
 *         element.classList.add(className);
 *     };
 * };
 * var paragraphs = document.querySelectorAll("#some-container p");
 *
 * _.forEach(paragraphs, addClass("main"));
 * // each "p" element in the container will have the "main" class now
 *
 * @memberof module:lamb
 * @category Array
 * @function
 * @param {ArrayLike} arrayLike
 * @param {ListIteratorCallback} iteratee
 * @param {Object} [iterateeContext]
 */
var forEach = generic(_arrayProto.forEach);

/**
 * Creates an array from the results of the provided <code>iteratee</code>.<br/>
 * It's a generic version of [Array.prototype.map]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map}.
 * @example
 * function getSquareRoots () {
 *     return _.map(arguments, Math.sqrt);
 * }
 *
 * getSquareRoots(4, 9, 16) // => [2, 3, 4]
 *
 * @memberof module:lamb
 * @category Array
 * @function
 * @param {ArrayLike} arrayLike
 * @param {ListIteratorCallback} iteratee
 * @param {Object} [iterateeContext]
 * @returns {Array}
 */
var map = generic(_arrayProto.map);

/**
 * Reduces (or folds) the values of an array-like object, starting from the first, to a new value using the provided <code>accumulator</code> function.<br/>
 * It's a generic version of [Array.prototype.reduce]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce}.
 * @example
 * _.reduce([1, 2, 3, 4], _.add) // => 10
 *
 * @memberof module:lamb
 * @category Array
 * @function
 * @param {ArrayLike} arrayLike
 * @param {AccumulatorCallback} accumulator
 * @param {*} [initialValue]
 * @returns {*}
 */
var reduce = generic(_arrayProto.reduce);

/**
 * Same as {@link module:lamb.reduce}, but starts the fold operation from the last element instead.<br/>
 * It's a generic version of [Array.prototype.reduceRight]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight}.
 * @memberof module:lamb
 * @category Array
 * @function
 * @param {ArrayLike} arrayLike
 * @param {AccumulatorCallback} accumulator
 * @param {*} [initialValue]
 * @returns {*}
 */
var reduceRight = generic(_arrayProto.reduceRight);

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
 * @param {Number} [end=arrayLike.length] - Zero-based index at which to end extraction. Extracts up to but not including end.
 * @returns {Array}
 */
var slice = generic(_arrayProto.slice);

lamb.filter = filter;
lamb.forEach = forEach;
lamb.map = map;
lamb.reduce = reduce;
lamb.reduceRight = reduceRight;
lamb.slice = slice;
