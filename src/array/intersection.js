import isIn from "./isIn";

/**
 * Returns an array of every unique item that is included in all two given arrays
 * or array-like objects.<br/>
 * Note that this function uses the ["SameValueZero" comparison]{@link module:lamb.areSVZ|areSVZ}.
 * @example
 * const a1 = [1, 2, 3, 4];
 * const a2 = [2, 5, 4, 2, 6];
 * const a3 = [5, 6, 7];
 *
 * _.intersection(a1, a2) // => [2, 4]
 * _.intersection(a2, a3) // => [5, 6]
 * _.intersection(a1, a3) // => []
 *
 * @memberof module:lamb
 * @category Array
 * @see {@link module:lamb.difference|difference}
 * @see {@link module:lamb.union|union}, {@link module:lamb.unionBy|unionBy}
 * @since 0.5.0
 * @param {ArrayLike} a
 * @param {ArrayLike} b
 * @returns {Array}
 */
function intersection (a, b) {
    var result = [];
    var lenA = a.length;

    if (lenA && b.length) {
        for (var i = 0; i < lenA; i++) {
            !isIn(result, a[i]) && isIn(b, a[i]) && result.push(a[i]);
        }
    }

    return result;
}

export default intersection;
