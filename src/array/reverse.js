import _toArrayLength from "../privates/_toArrayLength";

/**
 * Reverses a copy of the given array-like object.
 * @example
 * const arr = [1, 2, 3];
 *
 * _.reverse(arr) // => [3, 2, 1];
 *
 * // `arr` still is [1, 2, 3]
 *
 * @memberof module:lamb
 * @category Array
 * @since 0.19.0
 * @param {ArrayLike} arrayLike
 * @returns {Array}
 */
function reverse (arrayLike) {
    var len = _toArrayLength(arrayLike.length);
    var result = Array(len);

    for (var i = 0, ofs = len - 1; i < len; i++) {
        result[i] = arrayLike[ofs - i];
    }

    return result;
}

export default reverse;
