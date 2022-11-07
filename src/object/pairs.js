import _pairsFrom from "../privates/_pairsFrom";
import enumerables from "./enumerables";

/**
 * Converts an object into an array of key / value pairs of its enumerable properties.<br/>
 * See also {@link module:lamb.ownPairs|ownPairs} for picking only the own enumerable
 * properties and {@link module:lamb.fromPairs|fromPairs} for the reverse operation.
 * @example
 * _.pairs({a: 1, b: 2, c: 3}) // => [["a", 1], ["b", 2], ["c", 3]]
 *
 * @memberof module:lamb
 * @category Object
 * @function
 * @see {@link module:lamb.ownPairs|ownPairs}
 * @see {@link module:lamb.fromPairs|fromPairs}
 * @since 0.8.0
 * @param {Object} source
 * @returns {Array<Array<String, *>>}
 */
var pairs = _pairsFrom(enumerables);

export default pairs;
