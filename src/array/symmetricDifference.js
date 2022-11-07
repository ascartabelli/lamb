import difference from "./difference";

/**
 * Returns the [symmetric difference]{@link https://en.wikipedia.org/wiki/Symmetric_difference}
 * of two array-like objects. In other words returns the array of unique
 * items contained in the first or second array-like, but not the ones
 * in their {@link module:lamb.intersection|intersection}.<br/>
 * To determine uniqueness the function uses the
 * ["SameValueZero" comparison]{@link module:lamb.areSVZ|areSVZ}.
 * @example
 * const a1 = [0, 1, 2, 3, 2, 4, NaN];
 * const a2 = [-0, 2, 3, 4, 5, NaN];
 * const a3 = [1, 3, 4, 5];
 *
 * _.symmetricDifference(a1, a2) // => [1, 5]
 * _.symmetricDifference(a2, a3) // => [-0, 2, NaN, 1]
 *
 * @memberof module:lamb
 * @category Array
 * @see {@link module:lamb.difference|difference}
 * @see {@link module:lamb.intersection|intersection}
 * @see {@link module:lamb.union|union}, {@link module:lamb.unionBy|unionBy}
 * @since 0.61.0
 * @param {ArrayLike} a
 * @param {ArrayLike} b
 * @returns {Array}
 */
function symmetricDifference (a, b) {
    return difference(a, b).concat(difference(b, a));
}

export default symmetricDifference;
