import _getNumConsecutiveHits from "../privates/_getNumConsecutiveHits";
import slice from "../core/slice";

/**
 * Builds a function that drops the first <code>n</code> elements satisfying a predicate
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
 * @see {@link module:lamb.takeWhile|takeWhile}
 * @see {@link module:lamb.dropFrom|dropFrom}, {@link module:lamb.drop|drop}
 * @see {@link module:lamb.takeFrom|takeFrom}, {@link module:lamb.take|take}
 * @since 0.5.0
 * @param {ListIteratorCallback} predicate
 * @returns {Function}
 */
function dropWhile (predicate) {
    return function (arrayLike) {
        return slice(arrayLike, _getNumConsecutiveHits(arrayLike, predicate), arrayLike.length);
    };
}

export default dropWhile;
