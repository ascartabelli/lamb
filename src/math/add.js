import _curry2 from "../privates/_curry2";
import sum from "./sum";

/**
 * A curried version of {@link module:lamb.sum|sum}.
 * @example
 * const add5 = _.add(5);
 *
 * _.add5(4) // => 9
 * _.add5(-2) // => 3
 *
 * @memberof module:lamb
 * @category Math
 * @function
 * @see {@link module:lamb.sum|sum}
 * @since 0.1.0
 * @param {Number} a
 * @returns {Function}
 */
var add = _curry2(sum, true);

export default add;
