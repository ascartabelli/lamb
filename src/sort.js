
function _comparer (a, b) {
    var result = 0;

    if (typeof a !== typeof b) {
        a = String(a);
        b = String(b);
    }

    if (!isSVZ(a, b)) {
        if (a > b || a !== a) {
            result = 1;
        } else if (a < b || b !== b) {
            result = -1;
        }
    }

    return result;
}

function _compareWith (criteria) {
    var len = criteria.length;

    return function (a, b) {
        var result = 0;
        var isDescSort;
        var criterion;

        for (var i = 0; i < len; i++) {
            criterion = criteria[i];
            result = criterion.compare(a.value, b.value);

            if (result !== 0) {
                isDescSort = criteria[i].isDescending;
                break;
            }
        }

        if (result === 0) {
            isDescSort = criteria[len - 1].isDescending;
            result = a.index - b.index;
        }

        return isDescSort ? -result : result;
    };
}

function _getInsertionIndex (array, element, comparer, start, end) {
    if (array.length === 0) {
        return 0;
    }

    var pivot = (start + end) >> 1;
    var result = comparer({
        value: element,
        index: pivot
    }, {
        value: array[pivot],
        index: pivot
    });

    if (end - start <= 1) {
        return result < 0 ? pivot : pivot + 1;
    } else if (result < 0) {
        return _getInsertionIndex(array, element, comparer, start, pivot);
    } else if (result === 0) {
        return pivot + 1;
    } else {
        return _getInsertionIndex(array, element, comparer, pivot, end);
    }
}

function _makeCriteria (sorters) {
    return sorters.length ? sorters.map(_makeCriterion) : [_sorter()];
}

function _makeCriterion (criterion) {
    return typeof Object(criterion).compare === "function" ? criterion : _sorter(criterion);
}

function _sorter (reader, isDescending, comparer) {
    return {
        isDescending: isDescending === true,
        compare: function (a, b) {
            if (typeof reader === "function" && reader !== identity) {
                a = reader(a);
                b = reader(b);
            }

            return (comparer || _comparer)(a, b);
        }
    };
}

/**
 * Inserts an element in a copy of a sorted array respecting the sort order.
 * @example <caption>with simple values</caption>
 * _.insert([], 1) // => [1]
 * _.insert([2, 4, 6], 5) // => [2, 4, 5, 6]
 * _.insert([4, 2, 1], 3, _.sorterDesc()) // => [4, 3, 2, 1]
 *
 * @example <caption>with complex values</caption>
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
 * var result = _.insert(
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
 * @see {@link module:lamb.sort|sort}
 * @see {@link module:lamb.sorter|sorter}
 * @see {@link module:lamb.sorterDesc|sorterDesc}
 * @see {@link module:lamb.sortWith|sortWith}
 * @param {Array} array
 * @param {*} element
 * @param {...(Sorter|Function)} [sorter={@link module:lamb.sorter|sorter()}] - The sorting criteria used to sort the array.
 * @returns {Array}
 */
function insert (array, element) {
    var criteria = _makeCriteria(slice(arguments, 2));
    var result = array.concat();
    var idx = _getInsertionIndex(array, element, _compareWith(criteria), 0, array.length);

    result.splice(idx, 0, element);
    return result;
}

/**
 * Returns a [stably]{@link https://en.wikipedia.org/wiki/Sorting_algorithm#Stability} sorted copy of an
 * array-like object using the given criteria.<br/>
 * Sorting criteria are built using Lamb's {@link module:lamb.sorter|sorter} function, but you can also
 * pass simple "reader" functions and default ascending sorters will be built for you.<br/>
 * A "reader" is a function that evaluates the array element and supplies the value to be used in the comparison.<br/>
 * Please note that if the arguments received by the default comparer aren't of the same type, they will be compared as strings.
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
 * @param {ArrayLike} arrayLike
 * @param {...(Sorter|Function)} [sorter={@link module:lamb.sorter|sorter()}]
 * @returns {Array}
 */
function sort (arrayLike) {
    var criteria = _makeCriteria(slice(arguments, 1));
    var data = [];
    var result = [];
    var len = arrayLike.length;

    for (var i = 0; i < len; i++) {
        data.push({
            value: arrayLike[i],
            index: i
        });
    }

    data.sort(_compareWith(criteria));

    for (i = 0; i < len; i++) {
        result.push(data[i].value);
    }

    return result;
}

/**
 * Creates an ascending sort criterion with the provided <code>reader</code> and <code>comparer</code>.<br/>
 * See {@link module:lamb.sort|sort} for various examples.
 *
 * @memberof module:lamb
 * @category Array
 * @function
 * @see {@link module:lamb.insert|insert}
 * @see {@link module:lamb.sort|sort}
 * @see {@link module:lamb.sorterDesc|sorterDesc}
 * @see {@link module:lamb.sortWith|sortWith}
 * @param {Function} [reader={@link module:lamb.identity|identity}] A function meant to generate a simple value from a complex one. The function should evaluate the array element and supply the value to be passed to the comparer.
 * @param {Function} [comparer] An optional custom comparer function.
 * @returns {Sorter}
 */
var sorter = partial(_sorter, _, false, _);

/**
 * Creates a descending sort criterion with the provided <code>reader</code> and <code>comparer</code>.<br/>
 * See {@link module:lamb.sort|sort} for various examples.
 *
 * @memberof module:lamb
 * @category Array
 * @function
 * @see {@link module:lamb.insert|insert}
 * @see {@link module:lamb.sort|sort}
 * @see {@link module:lamb.sorter|sorter}
 * @see {@link module:lamb.sortWith|sortWith}
 * @param {Function} [reader={@link module:lamb.identity|identity}] A function meant to generate a simple value from a complex one. The function should evaluate the array element and supply the value to be passed to the comparer.
 * @param {Function} [comparer] An optional custom comparer function.
 * @returns {Sorter}
 */
var sorterDesc = partial(_sorter, _, true, _);

/**
 * Builds a partial application of {@link module:lamb.sort|sort} using the provided criteria. The returned
 * function expects the array-like object to sort.
 * As usual, sorting criteria are built using Lamb's {@link module:lamb.sorter|sorter} function, but you can also
 * pass simple "reader" functions and default ascending sorters will be built.<br/>
 * A "reader" is a function that evaluates the array element and supplies the value to be used in the comparison.<br/>
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
 * @param {...(Sorter|Function)} [sorter={@link module:lamb.sorter|sorter()}]
 * @returns {Function}
 */
function sortWith () {
    var sorters = slice(arguments);

    return function (arrayLike) {
        return sort.apply(null, [arrayLike].concat(sorters));
    };
}

lamb.insert = insert;
lamb.sort = sort;
lamb.sorter = sorter;
lamb.sorterDesc = sorterDesc;
lamb.sortWith = sortWith;
