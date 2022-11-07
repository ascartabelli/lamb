import isUndefined from "../core/isUndefined";
import slice from "../core/slice";
import _getPathKey from "./_getPathKey";
import _isArrayIndex from "./_isArrayIndex";
import _setIn from "./_setIn";
import _setIndex from "./_setIndex";

/**
 * Sets the object's property targeted by the given path to the desired value.<br/>
 * Works with arrays and is able to set their indexes, even negative ones.
 * @private
 * @param {Object|Array} source
 * @param {String[]} parts
 * @param {*} value
 * @returns {Object|Array}
 */
function _setPathIn (source, parts, value) {
    var key = parts[0];
    var partsLen = parts.length;
    var v;

    if (partsLen === 1) {
        v = value;
    } else {
        var targetKey = _getPathKey(source, key, false);

        v = _setPathIn(
            isUndefined(targetKey) ? targetKey : source[targetKey],
            slice(parts, 1, partsLen),
            value
        );
    }

    return _isArrayIndex(source, key) ? _setIndex(source, key, v) : _setIn(source, key, v);
}

export default _setPathIn;
