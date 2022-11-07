import _curry2 from "./_curry2";

/**
 * Accepts an object and build a function expecting a key to create a "pair" with the key
 * and its value.
 * @private
 * @function
 * @param {Object} source
 * @returns {Function}
 */
var _keyToPairIn = _curry2(function (source, key) {
    return [key, source[key]];
});

export default _keyToPairIn;
