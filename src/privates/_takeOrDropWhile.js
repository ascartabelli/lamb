import _getLastHitIndex from "./_getLastHitIndex";
import slice from "../core/slice";

/**
 * Helper to build the {@link module:lamb.takeWhile|takeWhile},
 * {@link module:lamb.takeLastWhile|takeLastWhile}, {@link module:lamb.dropWhile|dropWhile} and
 * {@link module:lamb.dropLastWhile|dropLastWhile} functions.
 * @private
 * @param {Boolean} isTake
 * @param {Boolean} fromLast
 * @returns {Function}
 */
function _takeOrDropWhile (isTake, fromLast) {
    return function (predicate) {
        return function (arrayLike) {
            var idxFrom;
            var idxTo;
            var lastHitIndex = _getLastHitIndex(arrayLike, predicate, fromLast);

            if (isTake && fromLast) {
                idxFrom = lastHitIndex + 1;
                idxTo = arrayLike.length;
            } else if (isTake) {
                idxFrom = 0;
                idxTo = lastHitIndex;
            } else if (!isTake && fromLast) {
                idxFrom = 0;
                idxTo = lastHitIndex + 1;
            } else {
                idxFrom = lastHitIndex;
                idxTo = arrayLike.length;
            }

            return slice(arrayLike, idxFrom, idxTo);
        };
    };
}

export default _takeOrDropWhile;
