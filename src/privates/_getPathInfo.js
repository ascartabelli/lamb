import isNil from "../core/isNil";
import isUndefined from "../core/isUndefined";
import _getPathKey from "./_getPathKey";
import _makeTypeErrorFor from "./_makeTypeErrorFor";

/**
 * Checks if a path is valid in the given object and retrieves the path target.
 * @private
 * @param {Object} obj
 * @param {String[]} parts
 * @param {Boolean} walkNonEnumerables
 * @returns {Object}
 */
function _getPathInfo (obj, parts, walkNonEnumerables) {
    if (isNil(obj)) {
        throw _makeTypeErrorFor(obj, "object");
    }

    var target = obj;
    var i = -1;
    var len = parts.length;
    var key;

    while (++i < len) {
        key = _getPathKey(target, parts[i], walkNonEnumerables);

        if (isUndefined(key)) {
            break;
        }

        target = target[key];
    }

    return i === len ? { isValid: true, target: target } : { isValid: false, target: void 0 };
}

export default _getPathInfo;
