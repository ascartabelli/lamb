import _safeEnumerables from "../privates/_safeEnumerables";
import _unsafeKeyListFrom from "../privates/_unsafeKeyListFrom";

/**
 * Creates an array with all the enumerable properties of the given object.
 * @example <caption>Showing the difference with {@link module:lamb.keys|keys}:</caption>
 * const baseFoo = Object.create({a: 1}, {b: {value: 2}});
 * const foo = Object.create(baseFoo, {
 *     c: {value: 3},
 *     d: {value: 4, enumerable: true}
 * });
 *
 * _.keys(foo) // => ["d"]
 * _.enumerables(foo) // => ["d", "a"]
 *
 * @memberof module:lamb
 * @category Object
 * @function
 * @see {@link module:lamb.keys|keys}
 * @since 0.12.0
 * @param {Object} source
 * @returns {String[]}
 */
var enumerables = _unsafeKeyListFrom(_safeEnumerables);

export default enumerables;
