import map from "../core/map";
import _curry2 from "./_curry2";
import _keyToPairIn from "./_keyToPairIn";

/**
 * Using the provided function to retrieve the keys, builds a new function
 * expecting an object to create a list of key / value pairs.
 * @private
 * @function
 * @param {Function} getKeys
 * @returns {Function}
 */
var _pairsFrom = _curry2(function (getKeys, obj) {
    return map(getKeys(obj), _keyToPairIn(obj));
});

export default _pairsFrom;
