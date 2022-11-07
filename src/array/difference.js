import _LookupHelper from "../privates/_LookupHelper";
import _makeTypeErrorFor from "../privates/_makeTypeErrorFor";
import filter from "./filter";
import isNil from "../core/isNil";
import uniques from "./uniques";

/**
 * Returns an array of unique items present only in the first of the two given
 * array-like objects. To determine uniqueness the function uses the
 * ["SameValueZero" comparison]{@link module:lamb.areSVZ|areSVZ}.
 * @example
 * const a1 = [1, 2, 1, 3, 4];
 * const a2 = [2, 4, 5, 6];
 * const a3 = [3, 4, 5, 2, 1];
 *
 * _.difference(a1, a2) // => [1, 3]
 * _.difference(a2, a3) // => [6]
 * _.difference(a1, a3) // => []
 *
 * @memberof module:lamb
 * @category Array
 * @see {@link module:lamb.intersection|intersection}
 * @see {@link module:lamb.symmetricDifference|symmetricDifference}
 * @see {@link module:lamb.union|union}, {@link module:lamb.unionBy|unionBy}
 * @see {@link module:lamb.pull|pull}, {@link module:lamb.pullFrom|pullFrom}
 * @since 0.6.0
 * @param {ArrayLike} a
 * @param {ArrayLike} b
 * @returns {Array}
 */
function difference (a, b) {
    if (isNil(b)) {
        throw _makeTypeErrorFor(b, "array");
    }

    var toExclude = new _LookupHelper(b);
    var isNotInB = function (v) {
        return !toExclude.has(v);
    };

    return uniques(filter(a, isNotInB));
}

export default difference;
