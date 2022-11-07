import isUndefined from "../core/isUndefined";

/**
 * Verifies the existence of a property in an sourceect.
 * @example
 * const user1 = {name: "john"};
 *
 * _.has(user1, "name") // => true
 * _.has(user1, "surname") // => false
 * _.has(user1, "toString") // => true
 *
 * const user2 = Object.create(null);
 *
 * // not inherited through the prototype chain
 * _.has(user2, "toString") // => false
 *
 * @memberof module:lamb
 * @category Object
 * @see {@link module:lamb.hasKey|hasKey}
 * @see {@link module:lamb.hasOwn|hasOwn}, {@link module:lamb.hasOwnKey|hasOwnKey}
 * @see {@link module:lamb.pathExistsIn|pathExistsIn}, {@link module:lamb.pathExists|pathExists}
 * @since 0.1.0
 * @param {Object} source
 * @param {String} key
 * @returns {Boolean}
 */
function has (source, key) {
    if (typeof source !== "object" && !isUndefined(source)) {
        source = Object(source);
    }

    return key in source;
}

export default has;
