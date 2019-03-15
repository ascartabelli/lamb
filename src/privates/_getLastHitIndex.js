/**
 * Gets the index of the last element satisfying a predicate in an array-like object.
 * @private
 * @param {ArrayLike} arrayLike
 * @param {ListIteratorCallback} predicate
 * @param {Boolean} fromLast
 * @returns {Number}
 */
function _getLastHitIndex (arrayLike, predicate, fromLast) {
    var idx;
    var increment;
    var len = arrayLike.length;

    if (fromLast) {
        idx = len - 1;
        increment = -1;
    } else {
        idx = 0;
        increment = 1;
    }

    while (idx >= 0 && idx < len && predicate(arrayLike[idx], idx, arrayLike)) {
        idx += increment;
    }

    return idx;
}

export default _getLastHitIndex;
