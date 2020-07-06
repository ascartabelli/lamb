import _toArrayLength from "../privates/_toArrayLength";

/**
 * Builds a new array by applying the iteratee function to each element of the
 * received array-like object.<br/>
 * Note that unlike the native array method this function doesn't skip unassigned or deleted indexes.
 * @example
 * _.map(["Joe", "Mario", "Jane"], _.invoke("toUpperCase")) // => ["JOE", "MARIO", "JANE"]
 *
 * _.map([4, 9, 16], Math.sqrt); // => [2, 3, 4]
 *
 * @memberof module:lamb
 * @category Array
 * @see {@link module:lamb.mapWith|mapWith}
 * @see {@link module:lamb.flatMap|flatMap}, {@link module:lamb.flatMapWith|flatMapWith}
 * @since 0.1.0
 * @param {ArrayLike} arrayLike
 * @param {ListIteratorCallback} iteratee
 * @returns {Array}
 */
function map (arrayLike, iteratee) {
    var len = _toArrayLength(arrayLike.length);
    var result = Array(len);

    for (var i = 0; i < len; i++) {
        result[i] = iteratee(arrayLike[i], i, arrayLike);
    }

    return result;
}

export default map;
