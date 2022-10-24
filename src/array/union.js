import identity from "../core/identity";
import unionBy from "./unionBy";

/**
 * Returns a list of every unique element present in the two given array-like objects.<br/>
 * Uses the ["SameValueZero" comparison]{@link module:lamb.areSVZ|areSVZ}
 * to test the equality of values.<br/>
 * When two values are considered equal, the first occurence will be the one included
 * in the result array.<br/>
 * See also {@link module:lamb.unionBy|unionBy} if you need to transform the values before
 * the comparison or if you have to extract them from complex ones.
 * @example
 * _.union([1, 2, 3, 2], [2, 3, 4]) // => [1, 2, 3, 4]
 * _.union("abc", "bcd") // => ["a", "b", "c", "d"]
 *
 * @memberof module:lamb
 * @category Array
 * @function
 * @see {@link module:lamb.unionBy|unionBy}
 * @see {@link module:lamb.difference|difference}
 * @see {@link module:lamb.intersection|intersection}
 * @see {@link module:lamb.symmetricDifference|symmetricDifference}
 * @since 0.5.0
 * @param {ArrayLike} a
 * @param {ArrayLike} b
 * @returns {Array}
 */
var union = unionBy(identity);

export default union;
