import has from "./has";

/**
 * Returns an object containing only the specified properties of the given object.<br/>
 * Non existent properties will be ignored.
 * @example
 * const user = {name: "john", surname: "doe", age: 30};
 *
 * _.pickIn(user, ["name", "age"]) // => {"name": "john", "age": 30};
 * _.pickIn(user, ["name", "email"]) // => {"name": "john"}
 *
 * @memberof module:lamb
 * @category Object
 * @see {@link module:lamb.pickIf|pickIf}, {@link module:lamb.pick|pick}
 * @see {@link module:lamb.skipIn|skipIn}, {@link module:lamb.skipIf|skipIf}
 * @since 0.1.0
 * @param {Object} source
 * @param {String[]} whitelist
 * @returns {Object}
 */
function pickIn (source, whitelist) {
    var result = {};

    for (var i = 0, len = whitelist.length, key; i < len; i++) {
        key = whitelist[i];

        if (has(source, key)) {
            result[key] = source[key];
        }
    }

    return result;
}

export default pickIn;
