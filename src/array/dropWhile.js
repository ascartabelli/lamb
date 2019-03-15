import _takeOrDropWhile from "../privates/_takeOrDropWhile";

/**
 * Builds a function that drops the first elements satisfying a predicate
 * from an array or array-like object.
 * @example
 * var isEven = function (n) { return n % 2 === 0; };
 * var dropWhileIsEven = _.dropWhile(isEven);
 *
 * dropWhileIsEven([2, 4, 6, 8]) // => []
 * dropWhileIsEven([2, 4, 7, 8]) // => [7, 8]
 *
 * @memberof module:lamb
 * @category Array
 * @function
 * @see {@link module:lamb.takeWhile|takeWhile}
 * @see {@link module:lamb.takeLastWhile|takeLastWhile}, {@link module:lamb.dropLastWhile|dropLastWhile}
 * @see {@link module:lamb.dropFrom|dropFrom}, {@link module:lamb.drop|drop}
 * @see {@link module:lamb.takeFrom|takeFrom}, {@link module:lamb.take|take}
 * @since 0.5.0
 * @param {ListIteratorCallback} predicate
 * @returns {Function}
 */
var dropWhile = _takeOrDropWhile(false, false);

export default dropWhile;
