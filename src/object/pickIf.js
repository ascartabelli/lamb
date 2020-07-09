import isNil from "../core/isNil";
import _makeTypeErrorFor from "../privates/_makeTypeErrorFor";

/**
 * Builds a function expecting an object whose enumerable properties will be checked
 * against the given predicate.<br/>
 * The properties satisfying the predicate will be included in the resulting object.
 * @example
 * const user = {name: "john", surname: "doe", age: 30};
 * const pickIfIsString = _.pickIf(_.isType("String"));
 *
 * pickIfIsString(user) // => {name: "john", surname: "doe"}
 *
 * @memberof module:lamb
 * @category Object
 * @see {@link module:lamb.pickIn|pickIn}, {@link module:lamb.pick|pick}
 * @see {@link module:lamb.skipIn|skipIn}, {@link module:lamb.skip|skip},
 * {@link module:lamb.skipIf|skipIf}
 * @since 0.1.0
 * @param {ObjectIteratorCallback} predicate
 * @returns {Function}
 */
function pickIf (predicate) {
    return function (source) {
        if (isNil(source)) {
            throw _makeTypeErrorFor(source, "object");
        }

        var result = {};

        for (var key in source) {
            if (predicate(source[key], key, source)) {
                result[key] = source[key];
            }
        }

        return result;
    };
}

export default pickIf;
