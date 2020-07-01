import compose from "../core/compose";
import mapWith from "../core/mapWith";
import getKey from "../object/getKey";

/**
 * A curried version of {@link module:lamb.pluckFrom|pluckFrom} expecting the key to retrieve to
 * build a function waiting for the array-like object to act upon.
 * @example
 * var persons = [
 *     {"name": "Jane", "surname": "Doe", "age": 12},
 *     {"name": "John", "surname": "Doe", "age": 40},
 *     {"name": "Mario", "surname": "Rossi", "age": 18},
 *     {"name": "Paolo", "surname": "Bianchi", "age": 15}
 * ];
 * var getAges = _.pluck("age");
 *
 * getAges(persons) // => [12, 40, 18, 15]
 *
 * @memberof module:lamb
 * @category Array
 * @function
 * @see {@link module:lamb.pluckFrom|pluckFrom}
 * @since 0.12.0
 * @param {String} key
 * @returns {Function}
 */
var pluck = compose(mapWith, getKey);

export default pluck;
