import _getNumConsecutiveHits from "../privates/_getNumConsecutiveHits";
import slice from "../core/slice";

/**
 * Builds a function that takes the first <code>n</code> elements satisfying a predicate from
 * an array or array-like object.
 * @example
 * var isEven = function (n) { return n % 2 === 0; };
 * var takeWhileIsEven = _.takeWhile(isEven);
 *
 * takeWhileIsEven([1, 2, 4, 6, 8]) // => []
 * takeWhileIsEven([2, 4, 7, 8]) // => [2, 4]
 *
 * @memberof module:lamb
 * @category Array
 * @see {@link module:lamb.dropWhile|dropWhile}
 * @see {@link module:lamb.takeFrom|takeFrom}, {@link module:lamb.take|take}
 * @see {@link module:lamb.dropFrom|dropFrom}, {@link module:lamb.drop|drop}
 * @since 0.5.0
 * @param {ListIteratorCallback} predicate
 * @returns {Function}
 */
function takeWhile (predicate) {
    return function (arrayLike) {
        return slice(arrayLike, 0, _getNumConsecutiveHits(arrayLike, predicate));
    };
}

export default takeWhile;
