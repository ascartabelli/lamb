import _search from "../privates/_search";

/**
 * Builds a predicate expecting a string to test against the given regular expression pattern.
 * @example
 * const hasNumbersOnly = _.testWith(/^\d+$/);
 *
 * hasNumbersOnly("123") // => true
 * hasNumbersOnly("123 Kg") // => false
 *
 * @memberof module:lamb
 * @category String
 * @since 0.1.0
 * @param {RegExp} pattern
 * @returns {Function}
 */
function testWith (pattern) {
    return function (s) {
        return _search(s, pattern) !== -1;
    };
}

export default testWith;
