import _curry2 from "../privates/_curry2";
import rename from "./rename";

/**
 * A curried version of {@link module:lamb.rename|rename} expecting a
 * <code>keysMap</code> to build a function waiting for the object to act upon.
 * @example
 * var persons = [
 *     {"firstName": "John", "lastName": "Doe"},
 *     {"first_name": "Mario", "last_name": "Rossi"},
 * ];
 * var normalizeKeys = _.renameKeys({
 *     "firstName": "name",
 *     "first_name": "name",
 *     "lastName": "surname",
 *     "last_name": "surname"
 * });
 *
 * _.map(persons, normalizeKeys) // =>
 * // [
 * //     {"name": "John", "surname": "Doe"},
 * //     {"name": "Mario", "surname": "Rossi"}
 * // ]
 *
 * @memberof module:lamb
 * @category Object
 * @function
 * @see {@link module:lamb.rename|rename}, {@link module:lamb.renameWith|renameWith}
 * @since 0.26.0
 * @param {Object} keysMap
 * @returns {Function}
 */
var renameKeys = _curry2(rename, true);

export default renameKeys;
