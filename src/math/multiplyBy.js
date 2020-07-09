import _curry2 from "../privates/_curry2";
import multiply from "./multiply";

/**
 * A curried version of {@link module:lamb.multiply|multiply}.
 * @example
 * const double = _.multiplyBy(2);
 *
 * double(5) // => 10
 *
 * @memberof module:lamb
 * @category Math
 * @function
 * @see {@link module:lamb.multiply|multiply}
 * @since 0.50.0
 * @param {Number} a
 * @returns {Function}
 */
var multiplyBy = _curry2(multiply, true);

export default multiplyBy;
