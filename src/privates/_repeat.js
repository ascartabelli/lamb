/**
 * A null-safe function to repeat the source string the desired amount of times.
 * @private
 * @param {String} source
 * @param {Number} times
 * @returns {String}
 */
function _repeat (source, times) {
    var result = "";

    for (var i = 0; i < times; i++) {
        result += source;
    }

    return result;
}

export default _repeat;
