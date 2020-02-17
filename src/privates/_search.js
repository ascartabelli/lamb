import generic from "../core/generic";

/**
 * A generic version of <code>String.prototype.search</code>
 * @private
 * @function
 * @param {String} s
 * @param {RegExp} pattern
 * @returns {Number}
 */
var _search = generic(String.prototype.search);

export default _search;
