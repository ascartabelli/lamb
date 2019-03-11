import _curry2 from "../privates/_curry2";
import findLastIndex from "./findLastIndex";

/**
 * A curried version of {@link module:lamb.findLastIndex|findLastIndex} that uses the given predicate
 * to build a function expecting the array-like object to search.
 * @example
 * var isEven = function (n) { return n % 2 === 0; };
 * var findLastEvenIdx = _.findLastIndexWhere(isEven);
 *
 * findLastEvenIdx([1, 3, 4, 5, 6, 7]) // => 4
 * findLastEvenIdx([1, 3, 5, 7]) // => -1
 *
 * @memberof module:lamb
 * @category Array
 * @function
 * @see {@link module:lamb.findLastIndex|findLastIndex}
 * @see {@link module:lamb.findLast|findLast}, {@link module:lamb.findLastWhere|findLastWhere}
 * @see {@link module:lamb.findIndex|findIndex}, {@link module:lamb.findIndexWhere|findIndexWhere}
 * @see {@link module:lamb.find|find}, {@link module:lamb.findWhere|findWhere}
 * @since 0.58.0
 * @param {ListIteratorCallback} predicate
 * @returns {Function}
 */
var findLastIndexWhere = _curry2(findLastIndex, true);

export default findLastIndexWhere;
