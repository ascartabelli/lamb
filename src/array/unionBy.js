import binary from "../core/binary";
import pipe from "../function/pipe";
import drop from "./drop";
import flatMapWith from "./flatMapWith";
import list from "./list";
import uniquesBy from "./uniquesBy";

/**
 * Using the provided iteratee to transform values, builds a function that will
 * return an array of the unique elements  in the two provided array-like objects.<br/>
 * Uses the ["SameValueZero" comparison]{@link module:lamb.areSVZ|areSVZ}
 * to test the equality of values.<br/>
 * When two values are considered equal, the first occurence will be the one included
 * in the result array.<br/>
 * See also {@link module:lamb.union|union} if you don't need to compare transformed values.
 * @example
 * const unionByFloor = _.unionBy(Math.floor);
 *
 * unionByFloor([2.8, 3.2, 1.5], [3.5, 1.2, 4]) // => [2.8, 3.2, 1.5, 4]
 *
 * @memberof module:lamb
 * @category Array
 * @see {@link module:lamb.union|union}
 * @see {@link module:lamb.difference|difference}
 * @see {@link module:lamb.intersection|intersection}
 * @see {@link module:lamb.symmetricDifference|symmetricDifference}
 * @since 0.51.0
 * @param {ListIteratorCallback} iteratee
 * @returns {Function}
 */
function unionBy (iteratee) {
    return pipe([binary(list), flatMapWith(drop(0)), uniquesBy(iteratee)]);
}

export default unionBy;
