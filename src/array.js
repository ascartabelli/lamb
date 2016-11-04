/**
 * A curried version of {@link module:lamb.appendTo|appendTo} that uses the value to append
 * to build a function expecting the array-like object to act upon.
 * @example
 * var arr = [1, 2, 3, 4];
 *
 * _.append(5)(arr) // => [1, 2, 3, 4, 5]
 * _.append([5])(arr) // => [1, 2, 3, 4, [5]]
 *
 * @memberof module:lamb
 * @category Array
 * @function
 * @see {@link module:lamb.appendTo|appendTo}
 * @see {@link module:lamb.insert|insert}, {@link module:lamb.insertAt|insertAt}
 * @param {*} value
 * @returns {Function}
 */
var append = _curry(appendTo, 2, true);

/**
 * Appends the given value at the end of a copy of the provided array-like object.
 * @example
 * var arr = [1, 2, 3, 4];
 *
 * _.appendTo(arr, 5) // => [1, 2, 3, 4, 5]
 * _.appendTo(arr, [5]) // => [1, 2, 3, 4, [5]]
 *
 * @memberof module:lamb
 * @category Array
 * @see {@link module:lamb.append|append}
 * @see {@link module:lamb.insert|insert}, {@link module:lamb.insertAt|insertAt}
 * @param {ArrayLike} arrayLike
 * @param {*} value
 * @returns {Array}
 */
function appendTo (arrayLike, value) {
    return Array.isArray(arrayLike) ? arrayLike.concat([value]) : slice(arrayLike).concat([value]);
}

/**
 * Returns an array of items present only in the first of the given arrays.<br/>
 * Note that this function uses the ["SameValueZero" comparison]{@link module:lamb.isSVZ|isSVZ}.
 * @example
 * var a1 = [1, 2, 3, 4];
 * var a2 = [2, 4, 5];
 * var a3 = [4, 5, 3, 1];
 *
 * _.difference(a1, a2) // => [1, 3]
 * _.difference(a1, a2, a3) // => []
 *
 * @memberof module:lamb
 * @category Array
 * @param {Array} array
 * @param {...Array} other
 * @returns {Array}
 */
function difference (array) {
    var rest = shallowFlatten(map(_argsTail.apply(null, arguments), unary(slice)));
    var isInRest = partial(isIn, rest, _, 0);

    return filter(array, not(isInRest));
}

/**
 * Builds an array without the first <code>n</code> elements of the given array or array-like object.
 * Note that, being this only a shortcut for a specific use case of {@link module:lamb.slice|slice},
 * <code>n</code> can be a negative number.
 * @example
 * var arr = [1, 2, 3, 4, 5];
 *
 * _.drop(arr, 2) // => [3, 4, 5]
 * _.drop(arr, -1) // => [5]
 * _.drop(arr, -10) // => [1, 2, 3, 4, 5]
 *
 * @memberof module:lamb
 * @category Array
 * @function
 * @see {@link module:lamb.dropN|dropN}
 * @see {@link module:lamb.take|take}, {@link module:lamb.takeN|takeN}
 * @see {@link module:lamb.takeWhile|takeWhile}, {@link module:lamb.dropWhile|dropWhile}
 * @param {ArrayLike} arrayLike
 * @param {Number} n
 * @returns {Array}
 */
var drop = binary(slice);

/**
 * A curried version of {@link module:lamb.drop|drop} that expects the number of elements
 * to drop to build a function waiting for the list to take the elements from.
 * See the note and examples for {@link module:lamb.drop|drop} about passing a negative <code>n</code>.
 * @example
 * var drop2 = _.dropN(2);
 *
 * drop2([1, 2, 3, 4, 5]) // => [3, 4, 5]
 *
 * @memberof module:lamb
 * @category Array
 * @see {@link module:lamb.drop|drop}
 * @see {@link module:lamb.take|take}, {@link module:lamb.takeN|takeN}
 * @see {@link module:lamb.takeWhile|takeWhile}, {@link module:lamb.dropWhile|dropWhile}
 * @param {Number} n
 * @returns {Function}
 */
function dropN (n) {
    return function (arrayLike) {
        return slice(arrayLike, n);
    };
}

/**
 * Builds a function that drops the first <code>n</code> elements satisfying a predicate
 * from an array or array-like object.
 * @example
 * var isEven = function (n) { return n % 2 === 0; };
 * var dropWhileIsEven = _.dropWhile(isEven);
 *
 * dropWhileIsEven([2, 4, 6, 8]) // => []
 * dropWhileIsEven([2, 4, 7, 8]) // => [7, 8]
 *
 * @memberof module:lamb
 * @category Array
 * @see {@link module:lamb.takeWhile|takeWhile}
 * @see {@link module:lamb.drop|drop}, {@link module:lamb.dropN|dropN}
 * @see {@link module:lamb.take|take}, {@link module:lamb.takeN|takeN}
 * @param {ListIteratorCallback} predicate
 * @param {Object} [predicateContext]
 * @returns {Function}
 */
function dropWhile (predicate, predicateContext) {
    var fn = arguments.length === 2 ? _getNumConsecutiveHits : binary(_getNumConsecutiveHits);

    return function (arrayLike) {
        return slice(arrayLike, fn(arrayLike, predicate, predicateContext));
    };
}

/**
 * Similar to {@link module:lamb.map|map}, but if the mapping function returns an array this will
 * be concatenated, rather than pushed, to the final result.
 * @example <caption>showing the difference with <code>map</code></caption>
 * var words = ["foo", "bar"];
 * var toCharArray = function (s) { return s.split(""); };
 *
 * _.map(words, toCharArray) // => [["f", "o", "o"], ["b", "a", "r"]]
 * _.flatMap(words, toCharArray) // => ["f", "o", "o", "b", "a", "r"]
 *
 * @memberof module:lamb
 * @category Array
 * @see {@link module:lamb.flatMapWith|flatMapWith}
 * @param {Array} array
 * @param {ListIteratorCallback} iteratee
 * @param {Object} [iterateeContext]
 * @returns {Array}
 */
function flatMap (array, iteratee, iterateeContext) {
    if (arguments.length === 3) {
        iteratee = iteratee.bind(iterateeContext);
    }

    return reduce(array, function (result, el, idx, arr) {
        var v = iteratee(el, idx, arr);

        if (!Array.isArray(v)) {
            v = [v];
        }

        for (var i = 0, len = v.length, rLen = result.length; i < len; i++) {
            result[rLen + i] = v[i];
        }

        return result;
    }, []);
}

/**
 * Builds a partial application of {@link module:lamb.flatMap|flatMap} using the given iteratee
 * and the optional context. The resulting function expects the array to act upon.
 * @example
 * var toCharArray = function (s) { return s.split(""); };
 * var wordsToCharArray = _.flatMapWith(toCharArray);
 *
 * wordsToCharArray(["foo", "bar"]) // => ["f", "o", "o", "b", "a", "r"]
 *
 * @memberof module:lamb
 * @category Array
 * @function
 * @see {@link module:lamb.flatMap|flatMap}
 * @param {ListIteratorCallback} iteratee
 * @param {Object} [iterateeContext]
 * @returns {Function}
 */
var flatMapWith = _partialWithIteratee(flatMap);

/**
 * Flattens an array.
 * @example <caption>showing the difference with <code>shallowFlatten</code></caption>
 * var arr = [1, 2, [3, 4, [5, 6]], 7, 8];
 *
 * _.flatten(arr) // => [1, 2, 3, 4, 5, 6, 7, 8]
 * _.shallowFlatten(arr) // => [1, 2, 3, 4, [5, 6], 7, 8]
 *
 * @memberof module:lamb
 * @category Array
 * @see {@link module:lamb.shallowFlatten|shallowFlatten}
 * @param {Array} array
 * @returns {Array}
 */
function flatten (array) {
    return Array.isArray(array) ? _flatten(array, true, [], 0) : slice(array);
}

/**
 * Returns a copy of the given array-like object without the last element.
 * @example
 * _.init([1, 2, 3, 4]) // => [1, 2, 3]
 * _.init([1]) // => []
 * _.init([]) // => []
 *
 * @memberof module:lamb
 * @category Array
 * @function
 * @see {@link module:lamb.tail|tail}
 * @see {@link module:lamb.head|head}, {@link module:lamb.last|last}
 * @param {ArrayLike} arrayLike
 * @returns {Array}
 */
var init = partial(slice, _, 0, -1);

/**
 * Inserts the provided element in a copy of an array-like object at the
 * specified index.<br/>
 * If the index is greater than the length of the array-like, the element
 * will be appended at the end.<br/>
 * Negative indexes are allowed; when a negative index is out of bounds
 * the element will be inserted at the start of the resulting array.
 * @example
 * var arr = [1, 2, 3, 4, 5];
 *
 * _.insert(arr, 3, 99) // => [1, 2, 3, 99, 4, 5]
 * _.insert(arr, -2, 99) // => [1, 2, 3, 99, 4, 5]
 * _.insert(arr, 10, 99) // => [1, 2, 3, 4, 5, 99]
 * _.insert(arr, -10, 99) // => [99, 1, 2, 3, 4, 5]
 *
 * @memberof module:lamb
 * @category Array
 * @see {@link module:lamb.insertAt|insertAt}
 * @see {@link module:lamb.sortedInsert|sortedInsert}
 * @see {@link module:lamb.append|append}, {@link module:lamb.appendTo|appendTo}
 * @param {ArrayLike} arrayLike
 * @param {Number} index
 * @param {*} element
 * @returns {Array}
 */
function insert (arrayLike, index, element) {
    var result = slice(arrayLike);

    result.splice(index, 0, element);

    return result;
}

/**
 * Builds a partial application of {@link module:lamb.insert|insert}
 * expecting the array-like object to act upon.
 * @example
 * var arr = [1, 2, 3, 4, 5];
 *
 * _.insertAt(3, 99)(arr) // => [1, 2, 3, 99, 4, 5]
 * _.insertAt(-2, 99)(arr) // => [1, 2, 3, 99, 4, 5]
 * _.insertAt(10, 99)(arr) // => [1, 2, 3, 4, 5, 99]
 * _.insertAt(-10, 99)(arr) // => [99, 1, 2, 3, 4, 5]
 *
 * @memberof module:lamb
 * @category Array
 * @see {@link module:lamb.insert|insert}
 * @see {@link module:lamb.sortedInsert|sortedInsert}
 * @see {@link module:lamb.append|append}, {@link module:lamb.appendTo|appendTo}
 * @param {Number} index
 * @param {*} element
 * @returns {Function}
 */
function insertAt (index, element) {
    return partial(insert, _, index, element);
}

/**
 * Returns an array of every item that is included in all given arrays.<br>
 * Note that this function uses the ["SameValueZero" comparison]{@link module:lamb.isSVZ|isSVZ}.
 * @example
 * var a1 = [1, 2, 3, 4];
 * var a2 = [2, 5, 4, 6];
 * var a3 = [5, 6, 7];
 *
 * _.intersection(a1, a2) // => [2, 4]
 * _.intersection(a1, a3) // => []
 *
 * @memberof module:lamb
 * @category Array
 * @param {...Array} array
 * @returns {Array}
 */
function intersection () {
    var rest = _argsTail.apply(null, arguments);

    return filter(uniques(arguments[0]), function (item) {
        return everyIn(rest, contains(item));
    });
}

/**
 * Generates an array with the values passed as arguments.
 * @example
 * _.list(1, 2, 3) // => [1, 2, 3]
 *
 * @memberof module:lamb
 * @category Array
 * @function
 * @param {...*} value
 * @returns {Array}
 */
var list = _argsToArrayFrom(0);

/**
 * Splits an array-like object in two lists: the first with the elements satisfying the given predicate,
 * the others with the remaining elements.
 * @example
 * var isEven = function (n) { return n % 2 === 0; };
 * var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
 *
 * _.partition(numbers, isEven) // => [[2, 4, 6, 8, 10], [1, 3, 5, 7, 9]]
 *
 * @memberof module:lamb
 * @category Array
 * @see {@link module:lamb.partitionWith|partitionWith}
 * @param {ArrayLike} arrayLike
 * @param {ListIteratorCallback} predicate
 * @param {Object} [predicateContext]
 * @returns {Array<Array<*>, Array<*>>}
 */
function partition (arrayLike, predicate, predicateContext) {
    var result = [[], []];
    var len = arrayLike.length;

    if (arguments.length === 3) {
        predicate = predicate.bind(predicateContext);
    }

    for (var i = 0, el; i < len; i++) {
        el = arrayLike[i];
        result[predicate(el, i, arrayLike) ? 0 : 1].push(el);
    }

    return result;
}

/**
 * Builds a partial application of {@link module:lamb.partition|partition} using the given
 * predicate and the optional context.
 * The resulting function expects the array-like object to act upon.
 * @example
 * var users = [
 *     {"name": "Jane", "surname": "Doe", "active": false},
 *     {"name": "John", "surname": "Doe", "active": true},
 *     {"name": "Mario", "surname": "Rossi", "active": true},
 *     {"name": "Paolo", "surname": "Bianchi", "active": false}
 * ];
 * var isActive = _.hasKeyValue("active", true);
 * var splitByActiveStatus = _.partitionWith(isActive);
 *
 * splitByActiveStatus(users) // =>
 * // [[
 * //     {"name": "John", "surname": "Doe", "active": true},
 * //     {"name": "Mario", "surname": "Rossi", "active": true}
 * // ], [
 * //     {"name": "Jane", "surname": "Doe", "active": false},
 * //     {"name": "Paolo", "surname": "Bianchi", "active": false}
 * // ]]
 *
 * @memberof module:lamb
 * @category Array
 * @function
 * @see {@link module:lamb.partition|partition}
 * @param {ListIteratorCallback} predicate
 * @param {Object} [predicateContext]
 * @returns {Function}
 */
var partitionWith = _partialWithIteratee(partition);

/**
 * "Plucks" the values of the specified key from a list of objects.
 * @example
 * var persons = [
 *     {"name": "Jane", "surname": "Doe", "age": 12},
 *     {"name": "John", "surname": "Doe", "age": 40},
 *     {"name": "Mario", "surname": "Rossi", "age": 18},
 *     {"name": "Paolo", "surname": "Bianchi", "age": 15}
 * ];
 *
 * _.pluck(persons, "age") // => [12, 40, 18, 15]
 *
 * var lists = [
 *     [1, 2],
 *     [3, 4, 5],
 *     [6]
 * ];
 *
 * _.pluck(lists, "length") // => [2, 3, 1]
 *
 * @memberof module:lamb
 * @category Array
 * @see {@link module:lamb.pluckKey|pluckKey}
 * @param {ArrayLike} arrayLike
 * @param {String} key
 * @returns {Array}
 */
function pluck (arrayLike, key) {
    return map(arrayLike, getKey(key));
}

/**
 * A curried version of {@link module:lamb.pluck|pluck} expecting the key to retrieve to
 * build a function waiting for the array-like object to act upon.
 * @example
 * var persons = [
 *     {"name": "Jane", "surname": "Doe", "age": 12},
 *     {"name": "John", "surname": "Doe", "age": 40},
 *     {"name": "Mario", "surname": "Rossi", "age": 18},
 *     {"name": "Paolo", "surname": "Bianchi", "age": 15}
 * ];
 * var getAges = _.pluckKey("age");
 *
 * getAges(persons) // => [12, 40, 18, 15]
 *
 * @memberof module:lamb
 * @category Array
 * @see {@link module:lamb.pluck|pluck}
 * @function
 * @param {String} key
 * @returns {Function}
 */
var pluckKey = compose(mapWith, getKey);

/**
 * Reverses a copy of the given array-like object.
 * @example
 * var arr = [1, 2, 3];
 *
 * _.reverse(arr) // => [3, 2, 1];
 *
 * // `arr` still is [1, 2, 3]
 *
 * @memberof module:lamb
 * @category Array
 * @param {ArrayLike} arrayLike
 * @returns {Array}
 */
function reverse (arrayLike) {
    return slice(arrayLike).reverse();
}

/**
 * Flattens the "first level" of an array.
 * @example <caption>showing the difference with <code>flatten</code></caption>
 * var arr = [1, 2, [3, 4, [5, 6]], 7, 8];
 *
 * _.flatten(arr) // => [1, 2, 3, 4, 5, 6, 7, 8]
 * _.shallowFlatten(arr) // => [1, 2, 3, 4, [5, 6], 7, 8]
 *
 * @memberof module:lamb
 * @category Array
 * @see {@link module:lamb.flatten|flatten}
 * @param {Array} array
 * @returns {Array}
 */
function shallowFlatten (array) {
    return Array.isArray(array) ? _flatten(array, false, [], 0) : slice(array);
}

/**
 * Returns a copy of the given array-like object without the first element.
 * @example
 * _.tail([1, 2, 3, 4]) // => [2, 3, 4]
 * _.tail([1]) // => []
 * _.tail([]) // => []
 *
 * @memberof module:lamb
 * @category Array
 * @function
 * @see {@link module:lamb.init|init}
 * @see {@link module:lamb.head|head}, {@link module:lamb.last|last}
 * @param {ArrayLike} arrayLike
 * @returns {Array}
 */
var tail = partial(slice, _, 1, void 0);

/**
 * Retrieves the first <code>n</code> elements from an array or array-like object.<br/>
 * Note that, being this a shortcut for a common use case of {@link module:lamb.slice|slice},
 * <code>n</code> can be a negative number.
 * @example
 * var arr = [1, 2, 3, 4, 5];
 *
 * _.take(arr, 3) // => [1, 2, 3]
 * _.take(arr, -1) // => [1, 2, 3, 4]
 * _.take(arr, -10) // => []
 *
 * @memberof module:lamb
 * @category Array
 * @see {@link module:lamb.takeN|takeN}
 * @see {@link module:lamb.drop|drop}, {@link module:lamb.dropN|dropN}
 * @see {@link module:lamb.takeWhile|takeWhile}, {@link module:lamb.dropWhile|dropWhile}
 * @param {ArrayLike} arrayLike
 * @param {Number} n
 * @returns {Array}
 */
function take (arrayLike, n) {
    return slice(arrayLike, 0, +n);
}

/**
 * A curried version of {@link module:lamb.take|take} that expects the number of elements
 * to retrieve to build a function waiting for the list to take the elements from.
 * See the note and examples for {@link module:lamb.take|take} about passing a negative <code>n</code>.
 * @example
 * var take2 = _.takeN(2);
 *
 * take2([1, 2, 3, 4, 5]) // => [1, 2]
 *
 * @memberof module:lamb
 * @category Array
 * @see {@link module:lamb.take|take}
 * @see {@link module:lamb.drop|drop}, {@link module:lamb.dropN|dropN}
 * @see {@link module:lamb.takeWhile|takeWhile}, {@link module:lamb.dropWhile|dropWhile}
 * @param {Number} n
 * @returns {Function}
 */
function takeN (n) {
    return function (arrayLike) {
        return slice(arrayLike, 0, +n);
    };
}

/**
 * Builds a function that takes the first <code>n</code> elements satisfying a predicate from
 * an array or array-like object.
 * @example
 * var isEven = function (n) { return n % 2 === 0; };
 * var takeWhileIsEven = _.takeWhile(isEven);
 *
 * takeWhileIsEven([1, 2, 4, 6, 8]) // => []
 * takeWhileIsEven([2, 4, 7, 8]) // => [2, 4]
 *
 * @memberof module:lamb
 * @category Array
 * @see {@link module:lamb.dropWhile|dropWhile}
 * @see {@link module:lamb.take|take}, {@link module:lamb.takeN|takeN}
 * @see {@link module:lamb.drop|drop}, {@link module:lamb.dropN|dropN}
 * @param {ListIteratorCallback} predicate
 * @param {Object} predicateContext
 * @returns {Function}
 */
function takeWhile (predicate, predicateContext) {
    var fn = arguments.length === 2 ? _getNumConsecutiveHits : binary(_getNumConsecutiveHits);

    return function (arrayLike) {
        return slice(arrayLike, 0, fn(arrayLike, predicate, predicateContext));
    };
}

/**
 * Transposes a matrix. Can also be used to reverse a {@link module:lamb.zip|zip} operation.<br/>
 * Just like {@link module:lamb.zip|zip}, the received array-like objects will be truncated to the
 * shortest length.
 * @example <caption>transposing a matrix</caption>
 * _.transpose([
 *     [1, 2, 3],
 *     [4, 5, 6],
 *     [7, 8, 9]
 * ]) // =>
 * // [
 * //     [1, 4, 7],
 * //     [2, 5, 8],
 * //     [3, 6, 9]
 * // ]
 *
 * @example <caption>showing the relationship with <code>zip</code></caption>
 * var zipped = _.zip(["a", "b", "c"], [1, 2, 3]); // => [["a", 1], ["b", 2], ["c", 3]]
 *
 * _.transpose(zipped) // => [["a", "b", "c"], [1, 2, 3]]
 *
 * @memberof module:lamb
 * @category Array
 * @param {ArrayLike<ArrayLike<*>>} arrayLike
 * @returns {Array<Array<*>>}
 */
function transpose (arrayLike) {
    var result = [];
    var len = arrayLike.length >>> 0;

    if (len === 0) {
        return result;
    }

    var minLen = arrayLike[0].length >>> 0;

    for (var j = 1, elementLen; j < len && minLen > 0; j++) {
        elementLen = arrayLike[j].length >>> 0;

        if (elementLen < minLen) {
            minLen = elementLen;
        }
    }

    for (var i = 0, el; i < minLen; i++) {
        el = result[i] = Array(len);

        for (j = 0; j < len; j++) {
            el[j] = arrayLike[j][i];
        }
    }

    return result;
}

/**
 * Returns a list of every unique element present in the given array-like objects.
 * @example
 * _.union([1, 2, 3, 2], [3, 4], [1, 5]) // => [1, 2, 3, 4, 5]
 * _.union("abc", "bcd", "cde") // => ["a", "b", "c", "d", "e"]
 *
 * @memberof module:lamb
 * @category Array
 * @function
 * @param {...ArrayLike} arrayLike
 * @returns {Array}
 */
var union = compose(uniques, flatMapWith(unary(slice)), list);

/**
 * Returns an array comprised of the unique elements of the given array-like object.<br/>
 * Can work with lists of complex objects if supplied with an iteratee.<br/>
 * Note that this function uses the ["SameValueZero" comparison]{@link module:lamb.isSVZ|isSVZ}.<br/>
 * When two values are considered equal, the first occurence will be the one included
 * in the result array.
 * @example <caption>With simple values:</caption>
 * _.uniques([-0, 1, 2, 0, 2, 3, 4, 3, 5, 1]) // => [-0, 1, 2, 3, 4, 5]
 *
 * @example <caption>With complex values:</caption>
 * var data  = [
 *     {id: "1", name: "John"},
 *     {id: "4", name: "Jane"},
 *     {id: "5", name: "Joe"},
 *     {id: "1", name: "Mario"},
 *     {id: "5", name: "Paolo"},
 * ];
 *
 * _.uniques(data, _.getKey("id")) // =>
 * // [
 * //     {id: "1", name: "John"},
 * //     {id: "4", name: "Jane"},
 * //     {id: "5", name: "Joe"}
 * // ]
 *
 * @memberof module:lamb
 * @category Array
 * @param {ArrayLike} arrayLike
 * @param {ListIteratorCallback} [iteratee={@link module:lamb.identity|identity}]
 * @param {Object} [iterateeContext]
 * @returns {Array}
 */
function uniques (arrayLike, iteratee, iterateeContext) {
    if (typeof iteratee !== "function") {
        iteratee = identity;
    } else if (arguments.length === 3) {
        iteratee = iteratee.bind(iterateeContext);
    }

    var result = [];
    var len = arrayLike.length;

    for (var i = 0, seen = [], hasNaN = false, value; i < len; i++) {
        value = iteratee(arrayLike[i], i, arrayLike);

        // eslint-disable-next-line no-self-compare
        if (value === value) {
            if (seen.indexOf(value) === -1) {
                seen[seen.length] = value;
                result[result.length] = arrayLike[i];
            }
        } else if (!hasNaN) {
            hasNaN = true;
            result[result.length] = arrayLike[i];
        }
    }

    return result;
}

/**
 * Builds a list of arrays out of the given array-like objects by pairing items with the same index.<br/>
 * The received array-like objects will be truncated to the shortest length.<br/>
 * See also {@link module:lamb.zipWithIndex|zipWithIndex} and {@link module:lamb.transpose|transpose}
 * for the reverse operation.
 * @example
 * _.zip(
 *     ["a", "b", "c"],
 *     [1, 2, 3],
 *     [true, false, true]
 * ) // => [["a", 1, true], ["b", 2, false], ["c", 3, true]]
 *
 * _.zip([1, 2, 3, 4], [5, 6, 7]) // => [[1, 5], [2, 6], [3, 7]]
 *
 * @memberof module:lamb
 * @category Array
 * @function
 * @param {...ArrayLike} arrayLike
 * @returns {Array<Array<*>>}
 */
var zip = compose(transpose, list);

/**
 * "{@link module:lamb.zip|Zips}" an array-like object by pairing its values with their index.
 * @example
 * _.zipWithIndex(["a", "b", "c"]) // => [["a", 0], ["b", 1], ["c", 2]]
 *
 * @memberof module:lamb
 * @category Array
 * @function
 * @param {ArrayLike} arrayLike
 * @returns {Array<Array<*, Number>>}
 */
var zipWithIndex = mapWith(binary(list));

lamb.append = append;
lamb.appendTo = appendTo;
lamb.difference = difference;
lamb.drop = drop;
lamb.dropN = dropN;
lamb.dropWhile = dropWhile;
lamb.flatMap = flatMap;
lamb.flatMapWith = flatMapWith;
lamb.flatten = flatten;
lamb.init = init;
lamb.insert = insert;
lamb.insertAt = insertAt;
lamb.intersection = intersection;
lamb.list = list;
lamb.partition = partition;
lamb.partitionWith = partitionWith;
lamb.pluck = pluck;
lamb.pluckKey = pluckKey;
lamb.reverse = reverse;
lamb.shallowFlatten = shallowFlatten;
lamb.tail = tail;
lamb.take = take;
lamb.takeN = takeN;
lamb.takeWhile = takeWhile;
lamb.transpose = transpose;
lamb.union = union;
lamb.uniques = uniques;
lamb.zip = zip;
lamb.zipWithIndex = zipWithIndex;
