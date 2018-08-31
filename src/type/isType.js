import type from "../core/type";

/**
 * Builds a predicate that expects a value to check against the specified type.
 * @example
 * var isString = _.isType("String");
 *
 * isString("Hello") // => true
 * isString(new String("Hi")) // => true
 *
 * @memberof module:lamb
 * @category Type
 * @see {@link module:lamb.type|type}
 * @since 0.1.0
 * @param {String} typeName
 * @returns {Function}
 */
function isType (typeName) {
    return function (value) {
        return type(value) === typeName;
    };
}

export default isType;
