import binary from "../core/binary";
import generic from "../core/generic";

/**
 * Splits a string into an array of substrings using the given separator.
 * @example
 * _.split("Jan,Feb,Mar,Apr,May", ",") // => ["Jan", "Feb", "Mar", "Apr", "May"]
 * _.split("Jan, Feb , Mar,Apr,   May", /\s*,\s*‍/) // => ["Jan", "Feb", "Mar", "Apr", "May"]
 *
 * @memberof module:lamb
 * @category String
 * @function
 * @see {@link module:lamb.splitBy|splitBy}
 * @see {@link module:lamb.join|join}, {@link module:lamb.joinWith|joinWith}
 * @since 0.59.0
 * @param {String} source
 * @param {String|RegExp} separator
 * @returns {String[]}
 */
var split = binary(generic(String.prototype.split));

export default split;
