import isNil from "../core/isNil";
import _makeTypeErrorFor from "../privates/_makeTypeErrorFor";

/**
 * Creates a new object by applying the given function
 * to all enumerable properties of the source one.
 * @example
 * const weights = {
 *     john: "72.5 Kg",
 *     jane: "52.3 Kg"
 * };
 *
 * _.mapValues(weights, parseFloat) // => {john: 72.5, jane: 52.3}
 *
 * @memberof module:lamb
 * @category Object
 * @see {@link module:lamb.mapValuesWith|mapValuesWith}
 * @since 0.54.0
 * @param {Object} source
 * @param {ObjectIteratorCallback} fn
 * @returns {Object}
 */
function mapValues (source, fn) {
    if (isNil(source)) {
        throw _makeTypeErrorFor(source, "object");
    }

    var result = {};

    for (var key in source) {
        result[key] = fn(source[key], key, source);
    }

    return result;
}

export default mapValues;
