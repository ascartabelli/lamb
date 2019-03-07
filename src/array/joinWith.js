import _curry2 from "../privates/_curry2";
import join from "./join";

/**
 * A curried version of {@link module:lamb.join|join} that accepts an optional
 * separator and builds a function expecting the array-like object to act upon.<br/>
 * Please refer to the description and examples of {@link module:lamb.join|join}
 * to understand the differences with the native array method.
 * @example
 * var words = ["foo", "bar", "baz"];
 * var joinWithDash = _.joinWith("-");
 *
 * joinWithDash(words) // => "foo-bar-baz"
 *
 * @memberof module:lamb
 * @category Array
 * @function
 * @see {@link module:lamb.join|join}
 * @since 0.58.0
 * @param {String} separator
 * @returns {Function}
 */
var joinWith = _curry2(join, true);

export default joinWith;
