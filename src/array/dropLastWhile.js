import _takeOrDropWhile from "../privates/_takeOrDropWhile";

/**
 * Builds a function that drops the last elements satisfying a predicate
 * from an array or array-like object.
 * @example
 * var isEven = function (n) { return n % 2 === 0; };
 * var dropLastWhileIsEven = _.dropLastWhile(isEven);
 *
 * dropLastWhileIsEven([2, 4, 6, 8]) // => []
 * dropLastWhileIsEven([2, 4, 7, 8]) // => [2, 4, 7]
 *
 * @memberof module:lamb
 * @category Array
 * @function
 * @see {@link module:lamb.takeLastWhile|takeLastWhile}
 * @see {@link module:lamb.takeWhile|takeWhile}, {@link module:lamb.dropWhile|dropWhile}
 * @see {@link module:lamb.dropFrom|dropFrom}, {@link module:lamb.drop|drop}
 * @see {@link module:lamb.takeFrom|takeFrom}, {@link module:lamb.take|take}
 * @since 0.58.0
 * @param {ListIteratorCallback} predicate
 * @returns {Function}
 */
var dropLastWhile = _takeOrDropWhile(false, true);

export default dropLastWhile;
