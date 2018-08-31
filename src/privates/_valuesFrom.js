import map from "../core/map";
import _curry2 from "./_curry2";

/**
 * Using the provided function to retrieve the keys of an object, builds
 * a function expecting an object to create the list of values for such keys.
 * @private
 * @function
 * @param {Function} getKeys
 * @returns {Function}
 */
var _valuesFrom = _curry2(function (getKeys, obj) {
    return map(getKeys(obj), function (key) {
        return obj[key];
    });
});

export default _valuesFrom;
