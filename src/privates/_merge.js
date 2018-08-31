import forEach from "../core/forEach";
import reduce from "../core/reduce";

/**
 * Merges the received objects using the provided function to retrieve their keys.
 * @private
 * @param {Function} getKeys
 * @param {Object} a
 * @param {Object} b
 * @returns {Function}
 */
function _merge (getKeys, a, b) {
    return reduce([a, b], function (result, source) {
        forEach(getKeys(source), function (key) {
            result[key] = source[key];
        });

        return result;
    }, {});
}

export default _merge;
