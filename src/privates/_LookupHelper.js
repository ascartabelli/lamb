import isIn from "../array/isIn";
import generic from "../core/generic";

var nativeSlice = generic(Array.prototype.slice);

/**
 * Utility function to check whether the passed value is
 * an Array or an "array-like" object.
 * @private
 * @param {*} target
 * @returns {Boolean}
 */
function _isArrayLike (target) {
    var len = target ? target.length : NaN;

    return Array.isArray(target) || len === 0 || (
        typeof len === "number"
            && len > 0
            && (len - 1) in Object(target)
    );
}

/**
 * Helper object to have faster lookups if the environment
 * supports Sets.
 * @class
 * @private
 * @param {ArrayLike} [arrayLike]
 */
function _LookupHelper (arrayLike) {
    var hasNativeSet = typeof Set === "function";
    var sourceElements = Array.isArray(arrayLike)
        ? arrayLike
        : _isArrayLike(arrayLike)
            ? nativeSlice(arrayLike)
            : [];

    /* eslint-disable-next-line no-undef */
    var sourceElementsSet = hasNativeSet ? new Set(sourceElements) : null;

    this.add = function (value) {
        if (hasNativeSet) {
            sourceElementsSet.add(value);
        } else {
            sourceElements.push(value);
        }

        return this;
    };

    this.has = function (value) {
        return hasNativeSet
            ? sourceElementsSet.has(value)
            : isIn(sourceElements, value);
    };
}

export default _LookupHelper;
