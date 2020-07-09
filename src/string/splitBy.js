import _curry2 from "../privates/_curry2";
import split from "./split";

/**
 * A curried version of {@link module:lamb.split|split} that accepts
 * a separator and builds a function expecting the string to split.
 * @example
 * const splitByCommma = _.splitBy(",");
 *
 * splitByCommma("Jan,Feb,Mar,Apr,May") // => ["Jan", "Feb", "Mar", "Apr", "May"]
 *
 * @memberof module:lamb
 * @category String
 * @function
 * @see {@link module:lamb.split|split}
 * @see {@link module:lamb.join|join}, {@link module:lamb.joinWith|joinWith}
 * @since 0.59.0
 * @param {String|RegExp} separator
 * @returns {Function}
 */
var splitBy = _curry2(split, true);

export default splitBy;
