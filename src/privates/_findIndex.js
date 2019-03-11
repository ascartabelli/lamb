/**
 * Helper to create the {@link module:lamb.findIndex|findIndex} and
 * {@link module:lamb.findLastIndex|findLastIndex} functions.
 * @private
 * @param {ArrayLike} arrayLike
 * @param {ListIteratorCallback} predicate
 * @param {Boolean} fromLast
 * @returns {Number}
 */
function _findIndex (arrayLike, predicate, fromLast) {
    var start;
    var increment;
    var len = arrayLike.length;
    var result = -1;

    if (fromLast) {
        start = len - 1;
        increment = -1;
    } else {
        start = 0;
        increment = 1;
    }

    for (var i = start; i < len && i >= 0; i += increment) {
        if (predicate(arrayLike[i], i, arrayLike)) {
            result = i;
            break;
        }
    }

    return result;
}

export default _findIndex;
