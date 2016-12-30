/**
 * Returns a [stably]{@link https://en.wikipedia.org/wiki/Sorting_algorithm#Stability} sorted
 * copy of an array-like object using the given criteria.<br/>
 * Sorting criteria are built using Lamb's {@link module:lamb.sorter|sorter} function, but you
 * can also pass simple "reader" functions and default ascending sorters will be built for you.<br/>
 * A "reader" is a function that evaluates the array element and supplies the value to be used
 * in the comparison.<br/>
 * Please note that if the arguments received by the default comparer aren't of the same type,
 * they will be compared as strings.
 *
 * @example <caption>Stable sort:</caption>
 * var persons = [
 *     {"name": "John", "surname" :"Doe"},
 *     {"name": "Mario", "surname": "Rossi"},
 *     {"name": "John", "surname" :"Moe"},
 *     {"name": "Jane", "surname": "Foe"}
 * ];
 *
 * var personsByName = _.sort(persons, _.getKey("name"));
 *
 * // personsByName holds:
 * // [
 * //     {"name": "Jane", "surname": "Foe"},
 * //     {"name": "John", "surname" :"Doe"},
 * //     {"name": "John", "surname" :"Moe"},
 * //     {"name": "Mario", "surname": "Rossi"}
 * // ]
 *
 * @example <caption>Stable multi-sort:</caption>
 * var personsByNameAscSurnameDesc = _.sort(
 *     persons,
 *     _.getKey("name"),
 *     _.sorterDesc(_.getKey("surname"))
 * );
 *
 * // personsByNameAscSurnameDesc holds:
 * // [
 * //     {"name": "Jane", "surname": "Foe"},
 * //     {"name": "John", "surname" :"Moe"},
 * //     {"name": "John", "surname" :"Doe"},
 * //     {"name": "Mario", "surname": "Rossi"}
 * // ]
 *
 * @example <caption>Using custom comparers:</caption>
 * var localeSorter = new Intl.Collator("it");
 * var chars = ["a", "è", "à", "é", "c", "b", "e"];
 *
 * _.sort(chars, localeSorter) // => ["a", "à", "b", "c", "e", "é", "è"]
 *
 * var localeSorterDesc = _.sorterDesc(_.identity, localeSorter.compare);
 *
 * _.sort(chars, localeSorterDesc) // => ["è", "é", "e", "c", "b", "à", "a"]
 *
 * @memberof module:lamb
 * @category Array
 * @see {@link module:lamb.sortWith|sortWith}
 * @see {@link module:lamb.sorter|sorter}, {@link module:lamb.sorterDesc|sorterDesc}
 * @param {ArrayLike} arrayLike
 * @param {...(Sorter|Function)} [sorter={@link module:lamb.sorter|sorter()}]
 * @returns {Array}
 */
function sort (arrayLike) {
    var criteria = _makeCriteria(_argsTail.apply(null, arguments));
    var len = _toArrayLength(arrayLike.length);
    var result = Array(len);

    for (var i = 0; i < len; i++) {
        result[i] = {value: arrayLike[i], index: i};
    }

    result.sort(_compareWith(criteria));

    for (i = 0; i < len; i++) {
        result[i] = result[i].value;
    }

    return result;
}

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
 *     _.invoker("toLowerCase"),
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
 * @param {ArrayLike} arrayLike
 * @param {*} element
 * @param {...(Sorter|Function)} [sorter={@link module:lamb.sorter|sorter()}] - The sorting criteria
 * used to sort the array.
 * @returns {Array}
 */
function sortedInsert (arrayLike, element) {
    var result = slice(arrayLike, 0, arrayLike.length);

    if (arguments.length === 1) {
        return result;
    }

    var len = arguments.length - 2;
    var sorters = Array(len);

    for (var i = 0; i < len; i++) {
        sorters[i] = arguments[i + 2];
    }

    var criteria = _makeCriteria(sorters);
    var idx = _getInsertionIndex(result, element, _compareWith(criteria), 0, result.length);

    result.splice(idx, 0, element);

    return result;
}

/**
 * Creates an ascending sort criterion with the provided <code>reader</code> and
 * <code>comparer</code>.<br/>
 * See {@link module:lamb.sort|sort} for various examples.
 *
 * @memberof module:lamb
 * @category Array
 * @function
 * @see {@link module:lamb.sortedInsert|sortedInsert}
 * @see {@link module:lamb.sort|sort}, {@link module:lamb.sortWith|sortWith}
 * @see {@link module:lamb.sorterDesc|sorterDesc}
 * @param {Function} [reader={@link module:lamb.identity|identity}] A function meant to generate a
 * simple value from a complex one. The function should evaluate the array element and supply the
 * value to be passed to the comparer.
 * @param {Function} [comparer] An optional custom comparer function.
 * @returns {Sorter}
 */
var sorter = partial(_sorter, _, false, _);

/**
 * Creates a descending sort criterion with the provided <code>reader</code> and
 * <code>comparer</code>.<br/>
 * See {@link module:lamb.sort|sort} for various examples.
 *
 * @memberof module:lamb
 * @category Array
 * @function
 * @see {@link module:lamb.sortedInsert|sortedInsert}
 * @see {@link module:lamb.sort|sort}, {@link module:lamb.sortWith|sortWith}
 * @see {@link module:lamb.sorter|sorter}
 * @param {Function} [reader={@link module:lamb.identity|identity}] A function meant to generate a
 * simple value from a complex one. The function should evaluate the array element and supply the
 * value to be passed to the comparer.
 * @param {Function} [comparer] An optional custom comparer function.
 * @returns {Sorter}
 */
var sorterDesc = partial(_sorter, _, true, _);

/**
 * Builds a partial application of {@link module:lamb.sort|sort} using the provided criteria.
 * The returned function expects the array-like object to sort.
 * As usual, sorting criteria are built using Lamb's {@link module:lamb.sorter|sorter} function,
 * but you can also pass simple "reader" functions and default ascending sorters will be built.<br/>
 * A "reader" is a function that evaluates the array element and supplies the value to be used in
 * the comparison.<br/>
 * See {@link module:lamb.sort|sort} for more examples.
 *
 * @example
 * var sortAsNumbers = _.sortWith(parseFloat);
 * var weights = ["2 Kg", "10 Kg", "1 Kg", "7 Kg"];
 *
 * sortAsNumbers(weights) // => ["1 Kg", "2 Kg", "7 Kg", "10 Kg"]
 *
 * @memberof module:lamb
 * @category Array
 * @see {@link module:lamb.sort|sort}
 * @see {@link module:lamb.sorter|sorter}, {@link module:lamb.sorterDesc|sorterDesc}
 * @param {...(Sorter|Function)} [sorter={@link module:lamb.sorter|sorter()}]
 * @returns {Function}
 */
function sortWith () {
    var sorters = list.apply(null, arguments);

    return function (arrayLike) {
        return sort.apply(null, [arrayLike].concat(sorters));
    };
}

lamb.sort = sort;
lamb.sortedInsert = sortedInsert;
lamb.sorter = sorter;
lamb.sorterDesc = sorterDesc;
lamb.sortWith = sortWith;
