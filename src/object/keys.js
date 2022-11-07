import _safeKeys from "../privates/_safeKeys";
import _unsafeKeyListFrom from "../privates/_unsafeKeyListFrom";

/**
 * Retrieves the list of the own enumerable properties of an object.<br/>
 * Although [Object.keys]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys}
 * is already present in ECMAScript 5, its behaviour changed in the subsequent specifications
 * of the standard.<br/>
 * This function <em>shims</em> the ECMAScript 6 version, by forcing a conversion to
 * object for any value but <code>null</code> and <code>undefined</code>.
 * @example <caption>Showing the difference with {@link module:lamb.enumerables|enumerables}:</caption>
 * const baseFoo = Object.create({a: 1}, {b: {value: 2}});
 * const foo = Object.create(baseFoo, {
 *     c: {value: 3},
 *     d: {value: 4, enumerable: true}
 * });
 *
 * _.enumerables(foo) // => ["d", "a"]
 * _.keys(foo) // => ["d"]
 *
 * @memberof module:lamb
 * @category Object
 * @function
 * @see {@link module:lamb.enumerables|enumerables}
 * @since 0.25.1
 * @param {Object} source
 * @returns {String[]}
 */
var keys = _unsafeKeyListFrom(_safeKeys);

export default keys;
