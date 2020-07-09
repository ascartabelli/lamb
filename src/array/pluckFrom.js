import map from "../core/map";
import getKey from "../object/getKey";

/**
 * "Plucks" the values of the specified key from a list of objects.
 * @example
 * const persons = [
 *     {"name": "Jane", "surname": "Doe", "age": 12},
 *     {"name": "John", "surname": "Doe", "age": 40},
 *     {"name": "Mario", "surname": "Rossi", "age": 18},
 *     {"name": "Paolo", "surname": "Bianchi", "age": 15}
 * ];
 *
 * _.pluckFrom(persons, "age") // => [12, 40, 18, 15]
 *
 * const lists = [
 *     [1, 2],
 *     [3, 4, 5],
 *     [6]
 * ];
 *
 * _.pluckFrom(lists, "length") // => [2, 3, 1]
 *
 * @memberof module:lamb
 * @category Array
 * @see {@link module:lamb.pluck|pluck}
 * @since 0.1.0
 * @param {ArrayLike} arrayLike
 * @param {String} key
 * @returns {Array}
 */
function pluckFrom (arrayLike, key) {
    return map(arrayLike, getKey(key));
}

export default pluckFrom;
