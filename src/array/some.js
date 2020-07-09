import _curry2 from "../privates/_curry2";
import someIn from "./someIn";

/**
 * A curried version of {@link module:lamb.someIn|someIn} that uses the given predicate to
 * build a function waiting for the array-like to act upon.
 * @example
 * const data = [1, 3, 5, 6, 7, 8];
 * const isEven = n => n % 2 === 0;
 * const containsEvens = _.some(isEven);
 * const containsStrings = _.some(_.isType("String"));
 *
 * containsEvens(data) // => true
 * containsStrings(data) // => false
 *
 * @memberof module:lamb
 * @category Array
 * @function
 * @see {@link module:lamb.someIn|someIn}
 * @see {@link module:lamb.every|every}, {@link module:lamb.everyIn|everyIn}
 * @since 0.39.0
 * @param {ListIteratorCallback} predicate
 * @returns {Function}
 */
var some = _curry2(someIn, true);

export default some;
