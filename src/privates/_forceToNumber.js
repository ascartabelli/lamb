/**
 * Converts a value to a number and returns it if it's not NaN, otherwise
 * returns zero.
 * @private
 * @param {*} value
 * @returns {Number}
 */
function _forceToNumber (value) {
    var n = +value;

    return n === n ? n : 0; // eslint-disable-line no-self-compare
}

export default _forceToNumber;
