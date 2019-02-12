import _curry2 from "./_curry2";
import isNil from "../core/isNil";
import _makeTypeErrorFor from "./_makeTypeErrorFor";

/**
 * Creates a non-null-safe version of the provided "getKeys" function.
 * @private
 * @function
 * @param {Function} getKeys
 * @returns {Function}
 */
var _unsafeKeyListFrom = _curry2(function (getKeys, obj) {
    if (isNil(obj)) {
        throw _makeTypeErrorFor(obj, "object");
    }

    return getKeys(obj);
});

export default _unsafeKeyListFrom;
