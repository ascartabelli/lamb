import isNil from "../core/isNil";
import _makeTypeErrorFor from "../privates/_makeTypeErrorFor";
import make from "./make";

/**
 * Returns a copy of the source object without the specified properties.
 * @example
 * const user = {name: "john", surname: "doe", age: 30};
 *
 * _.skipIn(user, ["name", "age"]) // => {surname: "doe"};
 * _.skipIn(user, ["name", "email"]) // => {surname: "doe", age: 30};
 *
 * @memberof module:lamb
 * @category Object
 * @see {@link module:lamb.skip|skip}, {@link module:lamb.skipIf|skipIf}
 * @see {@link module:lamb.pickIn|pickIn}, {@link module:lamb.pick|pick},
 * {@link module:lamb.pickIf|pickIf}
 * @since 0.1.0
 * @param {Object} source
 * @param {String[]} blacklist
 * @returns {Object}
 */
function skipIn (source, blacklist) {
    if (isNil(source)) {
        throw _makeTypeErrorFor(source, "object");
    }

    var result = {};
    var props = make(blacklist, []);

    for (var key in source) {
        if (!(key in props)) {
            result[key] = source[key];
        }
    }

    return result;
}

export default skipIn;
