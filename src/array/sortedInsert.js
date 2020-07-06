import slice from "../core/slice";
import _compareWith from "../privates/_compareWith";
import _getInsertionIndex from "../privates/_getInsertionIndex";
import _makeCriteria from "../privates/_makeCriteria";

/**
 * Inserts an element in a copy of a sorted array respecting the sort order.
 * @example <caption>With simple values:</caption>
 * _.sortedInsert([], 1) // => [1]
 * _.sortedInsert([2, 4, 6], 5) // => [2, 4, 5, 6]
 * _.sortedInsert([4, 2, 1], 3, _.sorterDesc()) // => [4, 3, 2, 1]
 *
 * @example <caption>With complex values:</caption>
 * var persons = [
 *     {"name": "jane", "surname": "doe"},
 *     {"name": "John", "surname": "Doe"},
 *     {"name": "Mario", "surname": "Rossi"}
 * ];
 *
 * var getLowerCaseName = _.compose(
 *     _.invoke("toLowerCase"),
 *     _.getKey("name")
 * );
 *
 * var result = _.sortedInsert(
 *     persons,
 *     {"name": "marco", "surname": "Rossi"},
 *     getLowerCaseName
 * );
 *
 * // `result` holds:
 * // [
 * //     {"name": "jane", "surname": "doe"},
 * //     {"name": "John", "surname": "Doe"},
 * //     {"name": "marco", "surname": "Rossi"},
 * //     {"name": "Mario", "surname": "Rossi"}
 * // ]
 *
 * @memberof module:lamb
 * @category Array
 * @see {@link module:lamb.sort|sort}, {@link module:lamb.sortWith|sortWith}
 * @see {@link module:lamb.sorter|sorter}, {@link module:lamb.sorterDesc|sorterDesc}
 * @see {@link module:lamb.insert|insert}, {@link module:lamb.insertAt|insertAt} to insert the element
 * at a specific index
 * @since 0.27.0
 * @param {ArrayLike} arrayLike
 * @param {*} element
 * @param {Sorter[]|Function[]} [sorters=[{@link module:lamb.sorter|sorter()}]] - The sorting criteria
 * used to sort the array.
 * @returns {Array}
 */
function sortedInsert (arrayLike, element, sorters) {
    var result = slice(arrayLike, 0, arrayLike.length);

    if (arguments.length === 1) {
        return result;
    }

    var criteria = _makeCriteria(sorters);
    var idx = _getInsertionIndex(result, element, _compareWith(criteria), 0, result.length);

    result.splice(idx, 0, element);

    return result;
}

export default sortedInsert;
