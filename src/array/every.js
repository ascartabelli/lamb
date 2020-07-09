import _curry2 from "../privates/_curry2";
import everyIn from "./everyIn";

/**
 * A curried version of {@link module:lamb.everyIn|everyIn} that expects a predicate
 * to build a function waiting for the array-like to act upon.
 * @example
 * const data = [2, 3, 5, 6, 8];
 * const isEven = n => n % 2 === 0;
 * const allEvens = _.every(isEven);
 * const allIntegers = _.every(_.isInteger);
 *
 * allEvens(data) // => false
 * allIntegers(data) // => true
 *
 * @memberof module:lamb
 * @category Array
 * @function
 * @see {@link module:lamb.everyIn|everyIn}
 * @see {@link module:lamb.some|some}, {@link module:lamb.someIn|someIn}
 * @since 0.39.0
 * @param {ListIteratorCallback} predicate
 * @returns {Function}
 */
var every = _curry2(everyIn, true);

export default every;
