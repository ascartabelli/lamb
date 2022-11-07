/**
 * Builds a list of the enumerable properties of an object.
 * The function is null-safe, unlike the public one.
 * @private
 * @param {Object} source
 * @returns {String[]}
 */
function _safeEnumerables (source) {
    var result = [];

    for (var key in source) {
        result.push(key);
    }

    return result;
}

export default _safeEnumerables;
