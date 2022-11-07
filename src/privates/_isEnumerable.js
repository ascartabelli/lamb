import _isOwnEnumerable from "./_isOwnEnumerable";
import _safeEnumerables from "./_safeEnumerables";

/**
 * Checks whether the specified key is an enumerable property of the given object or not.
 * @private
 * @param {Object} source
 * @param {String} key
 * @returns {Boolean}
 */
function _isEnumerable (source, key) {
    return key in Object(source) && (_isOwnEnumerable(source, key) || ~_safeEnumerables(source).indexOf(key));
}

export default _isEnumerable;
