import slice from "../core/slice";

/**
 * Builds an array without the first <code>n</code> elements of the given array or array-like object.
 * Note that, being this only a shortcut for a specific use case of {@link module:lamb.slice|slice},
 * <code>n</code> can be a negative number.
 * @example
 * var arr = [1, 2, 3, 4, 5];
 *
 * _.dropFrom(arr, 2) // => [3, 4, 5]
 * _.dropFrom(arr, -1) // => [5]
 * _.dropFrom(arr, -10) // => [1, 2, 3, 4, 5]
 *
 * @memberof module:lamb
 * @category Array
 * @see {@link module:lamb.drop|drop}
 * @see {@link module:lamb.takeFrom|takeFrom}, {@link module:lamb.take|take}
 * @see {@link module:lamb.takeWhile|takeWhile}, {@link module:lamb.dropWhile|dropWhile}
 * @see {@link module:lamb.takeLastWhile|takeLastWhile}, {@link module:lamb.dropLastWhile|dropLastWhile}
 * @since 0.51.0
 * @param {ArrayLike} arrayLike
 * @param {Number} n
 * @returns {Array}
 */
function dropFrom (arrayLike, n) {
    return slice(arrayLike, n, arrayLike.length);
}

export default dropFrom;
