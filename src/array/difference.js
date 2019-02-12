import partial from "../core/partial";
import filter from "./filter";
import isIn from "./isIn";
import not from "../logic/not";
import uniques from "./uniques";

/**
 * Returns an array of unique items present only in the first of the two given
 * array-like objects. To determine uniqueness the function uses the
 * ["SameValueZero" comparison]{@link module:lamb.areSVZ|areSVZ}.
 * @example
 * var a1 = [1, 2, 1, 3, 4];
 * var a2 = [2, 4, 5, 6];
 * var a3 = [3, 4, 5, 2, 1];
 *
 * _.difference(a1, a2) // => [1, 3]
 * _.difference(a2, a3) // => [6]
 * _.difference(a1, a3) // => []
 *
 * @memberof module:lamb
 * @category Array
 * @see {@link module:lamb.intersection|intersection}
 * @see {@link module:lamb.union|union}, {@link module:lamb.unionBy|unionBy}
 * @see {@link module:lamb.pull|pull}, {@link module:lamb.pullFrom|pullFrom}
 * @since 0.6.0
 * @param {ArrayLike} arrayLike
 * @param {ArrayLike} other
 * @returns {Array}
 */
function difference (arrayLike, other) {
    var isNotInOther = partial(not(isIn), [other]);

    return uniques(filter(arrayLike, isNotInOther));
}

export default difference;
