/**
 * Gets the number of consecutive elements satisfying a predicate in an array-like object.
 * @private
 * @param {ArrayLike} arrayLike
 * @param {ListIteratorCallback} predicate
 * @returns {Number}
 */
function _getNumConsecutiveHits (arrayLike, predicate) {
    var idx = 0;
    var len = arrayLike.length;

    while (idx < len && predicate(arrayLike[idx], idx, arrayLike)) {
        idx++;
    }

    return idx;
}

export default _getNumConsecutiveHits;
