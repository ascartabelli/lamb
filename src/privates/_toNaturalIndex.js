import _toInteger from "./_toInteger";

/**
 * Checks if the given number, even negative, represents an array-like index
 * within the provided length. If so returns its natural number equivalent.<br/>
 * Returns <code>NaN<code> otherwise.
 * @private
 * @param {Number} idx
 * @param {Number} len
 * @returns {Number}
 */
function _toNaturalIndex (idx, len) {
    idx = _toInteger(idx);

    return idx >= -len && idx < len ? idx < 0 ? idx + len : idx : NaN;
}

export default _toNaturalIndex;
