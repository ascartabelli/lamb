import reduce from "../core/reduce";
import _curry2 from "./_curry2";

/**
 * Using the provided function to retrieve the keys of an object, builds
 * a function expecting an object to create an array containing a list
 * of the keys in its first index and the corresponding list of values
 * in the second one.
 * @private
 * @function
 * @param {Function} getKeys
 * @returns {Function}
 */
var _tearFrom = _curry2(function (getKeys, source) {
    return reduce(getKeys(source), function (result, key) {
        result[0].push(key);
        result[1].push(source[key]);

        return result;
    }, [[], []]);
});

export default _tearFrom;
