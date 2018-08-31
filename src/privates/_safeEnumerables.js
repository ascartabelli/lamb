/**
 * Builds a list of the enumerable properties of an object.
 * The function is null-safe, unlike the public one.
 * @private
 * @param {Object} obj
 * @returns {String[]}
 */
function _safeEnumerables (obj) {
    var result = [];

    for (var key in obj) {
        result.push(key);
    }

    return result;
}

export default _safeEnumerables;
