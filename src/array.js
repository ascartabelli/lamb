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
var append = _curry2(appendTo, true);

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
    return slice(arrayLike, 0, arrayLike.length).concat([value]);
}

/**
 * Returns an array of unique items present only in the first of the two given
 * array-like objects. To determine uniqueness the function uses the
 * ["SameValueZero" comparison]{@link module:lamb.areSVZ|areSVZ}.
 * @example
 * var a1 = [1, 2, 1, 3, 4];
 * var a2 = [2, 4, 5, 6];
 * var a3 = [3, 4, 5, 2, 1];
 *
 * _.difference(a1, a2) // => [1, 3]
 * _.difference(a2, a3) // => [6]
 * _.difference(a1, a3) // => []
 *
 * @memberof module:lamb
 * @category Array
 * @param {ArrayLike} arrayLike
 * @param {ArrayLike} other
 * @returns {Array}
 */
function difference (arrayLike, other) {
    var isNotInOther = partial(not(isIn), [other]);

    return uniques(filter(arrayLike, isNotInOther));
}

/**
 * A curried version of {@link module:lamb.dropFrom|dropFrom} that expects the number of elements
 * to drop to build a function waiting for the list to take the elements from.<br/>
 * See the note and examples for {@link module:lamb.dropFrom|dropFrom} about passing a
 * negative <code>n</code>.
 * @example
 * var drop2 = _.drop(2);
 *
 * drop2([1, 2, 3, 4, 5]) // => [3, 4, 5]
 *
 * @memberof module:lamb
 * @category Array
 * @function
 * @see {@link module:lamb.dropFrom|dropFrom}
 * @see {@link module:lamb.takeFrom|takeFrom}, {@link module:lamb.take|take}
 * @see {@link module:lamb.takeWhile|takeWhile}, {@link module:lamb.dropWhile|dropWhile}
 * @param {Number} n
 * @returns {Function}
 */
var drop = _curry2(dropFrom, true);

/**
 * Builds an array without the first <code>n</code> elements of the given array or array-like object.
 * Note that, being this only a shortcut for a specific use case of {@link module:lamb.slice|slice},
 * <code>n</code> can be a negative number.
 * @example
 * var arr = [1, 2, 3, 4, 5];
 *
 * _.dropFrom(arr, 2) // => [3, 4, 5]
 * _.dropFrom(arr, -1) // => [5]
 * _.dropFrom(arr, -10) // => [1, 2, 3, 4, 5]
 *
 * @memberof module:lamb
 * @category Array
 * @see {@link module:lamb.drop|drop}
 * @see {@link module:lamb.takeFrom|takeFrom}, {@link module:lamb.take|take}
 * @see {@link module:lamb.takeWhile|takeWhile}, {@link module:lamb.dropWhile|dropWhile}
 * @param {ArrayLike} arrayLike
 * @param {Number} n
 * @returns {Array}
 */
function dropFrom (arrayLike, n) {
    return slice(arrayLike, n, arrayLike.length);
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
 * @see {@link module:lamb.dropFrom|dropFrom}, {@link module:lamb.drop|drop}
 * @see {@link module:lamb.takeFrom|takeFrom}, {@link module:lamb.take|take}
 * @param {ListIteratorCallback} predicate
 * @returns {Function}
 */
function dropWhile (predicate) {
    return function (arrayLike) {
        return slice(arrayLike, _getNumConsecutiveHits(arrayLike, predicate), arrayLike.length);
    };
}

/**
 * Similar to {@link module:lamb.map|map}, but if the mapping function returns an array this will
 * be concatenated, rather than pushed, to the final result.
 * @example <caption>Showing the difference with <code>map</code>:</caption>
 * var words = ["foo", "bar"];
 * var toCharArray = function (s) { return s.split(""); };
 *
 * _.map(words, toCharArray) // => [["f", "o", "o"], ["b", "a", "r"]]
 * _.flatMap(words, toCharArray) // => ["f", "o", "o", "b", "a", "r"]
 *
 * @memberof module:lamb
 * @category Array
 * @see {@link module:lamb.flatMapWith|flatMapWith}
 * @see {@link module:lamb.map|map}, {@link module:lamb.mapWith|mapWith}
 * @param {Array} array
 * @param {ListIteratorCallback} iteratee
 * @returns {Array}
 */
function flatMap (array, iteratee) {
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
 * A curried version of {@link module:lamb.flatMap|flatMap} that uses provided iteratee
 * to build a function expecting the array to act upon.
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
 * @see {@link module:lamb.map|map}, {@link module:lamb.mapWith|mapWith}
 * @param {ListIteratorCallback} iteratee
 * @returns {Function}
 */
var flatMapWith = _curry2(flatMap, true);

/**
 * Flattens an array.
 * @example <caption>Showing the difference with <code>shallowFlatten</code>:</caption>
 * var arr = [1, 2, [3, 4, [5, 6]], 7, 8];
 *
 * _.flatten(arr) // => [1, 2, 3, 4, 5, 6, 7, 8]
 * _.shallowFlatten(arr) // => [1, 2, 3, 4, [5, 6], 7, 8]
 *
 * @memberof module:lamb
 * @category Array
 * @function
 * @see {@link module:lamb.shallowFlatten|shallowFlatten}
 * @param {Array} array
 * @returns {Array}
 */
var flatten = _makeArrayFlattener(true);

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
var init = partial(slice, [_, 0, -1]);

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
    var result = slice(arrayLike, 0, arrayLike.length);

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
 * @function
 * @see {@link module:lamb.insert|insert}
 * @see {@link module:lamb.sortedInsert|sortedInsert}
 * @see {@link module:lamb.append|append}, {@link module:lamb.appendTo|appendTo}
 * @param {Number} index
 * @param {*} element
 * @returns {Function}
 */
var insertAt = _makePartial3(insert);

/**
 * Returns an array of every item that is included in all given arrays or array-like objects.<br/>
 * Note that this function uses the ["SameValueZero" comparison]{@link module:lamb.areSVZ|areSVZ}.
 * @example
 * var a1 = [1, 2, 3, 4];
 * var a2 = [2, 5, 4, 6];
 * var a3 = [5, 6, 7];
 *
 * _.intersection(a1, a2) // => [2, 4]
 * _.intersection(a2, a3) // => [5, 6]
 * _.intersection(a1, a3) // => []
 *
 * @memberof module:lamb
 * @category Array
 * @param {...ArrayLike} arrayLike
 * @returns {Array}
 */
function intersection () {
    if (arguments.length === 0) {
        return [];
    }

    var rest = _argsTail.apply(null, arguments);

    return filter(uniques(arguments[0]), function (item) {
        return everyIn(rest, contains(item));
    });
}

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
 * @returns {Array<Array<*>, Array<*>>}
 */
function partition (arrayLike, predicate) {
    var result = [[], []];
    var len = arrayLike.length;

    for (var i = 0, el; i < len; i++) {
        el = arrayLike[i];
        result[predicate(el, i, arrayLike) ? 0 : 1].push(el);
    }

    return result;
}

/**
 * A curried version of {@link module:lamb.partition|partition} that uses the provided
 * predicate to build a function expecting the array-like object to act upon.
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
 * @returns {Function}
 */
var partitionWith = _curry2(partition, true);

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
 * @function
 * @see {@link module:lamb.pluck|pluck}
 * @param {String} key
 * @returns {Function}
 */
var pluckKey = compose(mapWith, getKey);

/**
 * A curried version of {@link module:lamb.pullFrom|pullFrom} expecting
 * a list of values to build a function waiting for an array-like object.<br/>
 * The new function will create an array copy of the array-like without
 * the specified values.<br/>
 * The equality test is made with the ["SameValueZero" comparison]{@link module:lamb.areSVZ|areSVZ}.
 * @example
 * var scores = [40, 20, 30, 10];
 * var newScores = [30, 10];
 * var pullNewScores = _.pull(newScores);
 *
 * pullNewScores(scores) // => [40, 20]
 *
 * @memberof module:lamb
 * @category Array
 * @function
 * @see {@link module:lamb.pullFrom|pullFrom}
 * @param {ArrayLike} values
 * @returns {Function}
 */
var pull = _curry2(pullFrom, true);

/**
 * Creates an array copy of the given array-like object without the
 * specified values.<br/>
 * The equality test is made with the ["SameValueZero" comparison]{@link module:lamb.areSVZ|areSVZ}.
 * @example
 * var arr = [1, 2, 3, 4, 5];
 *
 * _.pullFrom(arr, [2, 5]) // => [1, 3, 4]
 *
 * @memberof module:lamb
 * @category Array
 * @see {@link module:lamb.pull|pull}
 * @param {ArrayLike} arrayLike
 * @param {ArrayLike} values
 * @returns {Array}
 */
function pullFrom (arrayLike, values) {
    return values ? filter(arrayLike, function (element) {
        return !isIn(values, element);
    }) : slice(arrayLike, 0, arrayLike.length);
}

/**
 * Flattens the "first level" of an array.
 * @example <caption>Showing the difference with <code>flatten</code>:</caption>
 * var arr = [1, 2, [3, 4, [5, 6]], 7, 8];
 *
 * _.flatten(arr) // => [1, 2, 3, 4, 5, 6, 7, 8]
 * _.shallowFlatten(arr) // => [1, 2, 3, 4, [5, 6], 7, 8]
 *
 * @memberof module:lamb
 * @category Array
 * @function
 * @see {@link module:lamb.flatten|flatten}
 * @param {Array} array
 * @returns {Array}
 */
var shallowFlatten = _makeArrayFlattener(false);

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
var tail = drop(1);

/**
 * A curried version of {@link module:lamb.takeFrom|takeFrom} that expects the number of elements
 * to retrieve to build a function waiting for the list to take the elements from.<br/>
 * See the note and examples for {@link module:lamb.takeFrom|takeFrom} about passing a
 * negative <code>n</code>.
 * @example
 * var take2 = _.take(2);
 *
 * take2([1, 2, 3, 4, 5]) // => [1, 2]
 *
 * @memberof module:lamb
 * @category Array
 * @function
 * @see {@link module:lamb.takeFrom|takeFrom}
 * @see {@link module:lamb.dropFrom|dropFrom}, {@link module:lamb.drop|drop}
 * @see {@link module:lamb.takeWhile|takeWhile}, {@link module:lamb.dropWhile|dropWhile}
 * @param {Number} n
 * @returns {Function}
 */
var take = _curry2(takeFrom, true);

/**
 * Retrieves the first <code>n</code> elements from an array or array-like object.<br/>
 * Note that, being this a shortcut for a common use case of {@link module:lamb.slice|slice},
 * <code>n</code> can be a negative number.
 * @example
 * var arr = [1, 2, 3, 4, 5];
 *
 * _.takeFrom(arr, 3) // => [1, 2, 3]
 * _.takeFrom(arr, -1) // => [1, 2, 3, 4]
 * _.takeFrom(arr, -10) // => []
 *
 * @memberof module:lamb
 * @category Array
 * @see {@link module:lamb.take|take}
 * @see {@link module:lamb.dropFrom|dropFrom}, {@link module:lamb.drop|drop}
 * @see {@link module:lamb.takeWhile|takeWhile}, {@link module:lamb.dropWhile|dropWhile}
 * @param {ArrayLike} arrayLike
 * @param {Number} n
 * @returns {Array}
 */
function takeFrom (arrayLike, n) {
    return slice(arrayLike, 0, n);
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
 * @see {@link module:lamb.takeFrom|takeFrom}, {@link module:lamb.take|take}
 * @see {@link module:lamb.dropFrom|dropFrom}, {@link module:lamb.drop|drop}
 * @param {ListIteratorCallback} predicate
 * @returns {Function}
 */
function takeWhile (predicate) {
    return function (arrayLike) {
        return slice(arrayLike, 0, _getNumConsecutiveHits(arrayLike, predicate));
    };
}

/**
 * Transposes a matrix. Can also be used to reverse a {@link module:lamb.zip|zip} operation.<br/>
 * Just like {@link module:lamb.zip|zip}, the received array-like objects will be truncated to the
 * shortest length.
 * @example <caption>Transposing a matrix:</caption>
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
 * @example <caption>Showing the relationship with <code>zip</code>:</caption>
 * var zipped = _.zip(["a", "b", "c"], [1, 2, 3]); // => [["a", 1], ["b", 2], ["c", 3]]
 *
 * _.transpose(zipped) // => [["a", "b", "c"], [1, 2, 3]]
 *
 * @memberof module:lamb
 * @category Array
 * @see {@link module:lamb.zip|zip}
 * @param {ArrayLike<ArrayLike<*>>} arrayLike
 * @returns {Array<Array<*>>}
 */
function transpose (arrayLike) {
    var minLen = MAX_ARRAY_LENGTH;
    var len = _toArrayLength(arrayLike.length);

    if (len === 0) {
        return [];
    }

    for (var j = 0, elementLen; j < len; j++) {
        elementLen = _toArrayLength(arrayLike[j].length);

        if (elementLen < minLen) {
            minLen = elementLen;
        }
    }

    var result = Array(minLen);

    for (var i = 0, el; i < minLen; i++) {
        el = result[i] = Array(len);

        for (j = 0; j < len; j++) {
            el[j] = arrayLike[j][i];
        }
    }

    return result;
}

/**
 * Returns a list of every unique element present in the given array-like objects.<br/>
 * Uses the ["SameValueZero" comparison]{@link module:lamb.areSVZ|areSVZ}
 * to test the equality of values.<br/>
 * When two values are considered equal, the first occurence will be the one included
 * in the result array.<br/>
 * See also {@link module:lamb.unionBy|unionBy} if you need to transform the values before
 * the comparison or if you have to extract them from complex ones.
 * @example
 * _.union([1, 2, 3, 2], [3, 4], [1, 5]) // => [1, 2, 3, 4, 5]
 * _.union("abc", "bcd", "cde") // => ["a", "b", "c", "d", "e"]
 *
 * @memberof module:lamb
 * @category Array
 * @function
 * @see {@link module:lamb.unionBy|unionBy}
 * @param {...ArrayLike} arrayLike
 * @returns {Array}
 */
var union = unionBy(identity);

/**
 * Using the provided iteratee, builds a function that will return an array of the unique elements
 * in the provided array-like objects.<br/>
 * Uses the ["SameValueZero" comparison]{@link module:lamb.areSVZ|areSVZ}
 * to test the equality of values.<br/>
 * When two values are considered equal, the first occurence will be the one included
 * in the result array.<br/>
 * See also {@link module:lamb.union|union} if you don't need to transform the values.
 * @example
 * var unionByFloor = _.unionBy(Math.floor);
 *
 * unionByFloor([2.8, 3.2, 1.5], [3.5, 1.2, 4]) // => [2.8, 3.2, 1.5, 4]
 *
 * @memberof module:lamb
 * @category Array
 * @see {@link module:lamb.union|union}
 * @param {ListIteratorCallback} iteratee
 * @returns {Function}
 */
function unionBy (iteratee) {
    return compose(uniquesBy(iteratee), flatMapWith(drop(0)), list);
}

/**
 * Returns an array comprised of the unique elements of the given array-like object.<br/>
 * Note that this function uses the ["SameValueZero" comparison]{@link module:lamb.areSVZ|areSVZ}
 * to test the equality of values.<br/>
 * When two values are considered equal, the first occurence will be the one included
 * in the result array.<br/>
 * See also {@link module:lamb.uniquesBy|uniquesBy} if you need to transform your values before
 * the comparison or if you have to extract them from complex ones.
 * @example
 * _.uniques([-0, 1, 2, 0, 2, 3, 4, 3, 5, 1]) // => [-0, 1, 2, 3, 4, 5]
 *
 * @memberof module:lamb
 * @category Array
 * @function
 * @see {@link module:lamb.uniquesBy|uniquesBy}
 * @param {ArrayLike} arrayLike
 * @returns {Array}
 */
var uniques = uniquesBy(identity);

/**
 * Using the provided iteratee, builds a function that will return an array comprised of the
 * unique elements of an array-like object. The values being compared are the ones returned by
 * the iteratee.<br/>
 * The equality test is made with the ["SameValueZero" comparison]{@link module:lamb.areSVZ|areSVZ}.<br/>
 * When two values are considered equal, the first occurence will be the one included
 * in the result array.<br/>
 * See also {@link module:lamb.uniques|uniques} if you don't need to transform your values before the
 * comparison.
 * @example
 * var data  = [
 *     {id: "1", name: "John"},
 *     {id: "4", name: "Jane"},
 *     {id: "5", name: "Joe"},
 *     {id: "1", name: "Mario"},
 *     {id: "5", name: "Paolo"},
 * ];
 * var uniquesById = _.uniquesBy(_.getKey("id"));
 *
 * uniquesById(data) // => [{id: "1", name: "John"}, {id: "4", name: "Jane"}, {id: "5", name: "Joe"}]
 *
 * @memberof module:lamb
 * @category Array
 * @see {@link module:lamb.uniques|uniques}
 * @param {ListIteratorCallback} iteratee
 * @returns {Function}
 */
function uniquesBy (iteratee) {
    return function (arrayLike) {
        var result = [];
        var len = arrayLike.length;

        for (var i = 0, seen = [], hasNaN = false, value; i < len; i++) {
            value = iteratee(arrayLike[i], i, arrayLike);

            if (value === value) { // eslint-disable-line no-self-compare
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
    };
}

/**
 * Builds a list of arrays out of the given array-like objects by pairing items with the same index.<br/>
 * The received array-like objects will be truncated to the shortest length.
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
 * @see {@link module:lamb.transpose|transpose} for the reverse operation
 * @see {@link module:lamb.zipWithIndex|zipWithIndex}
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
 * @see {@link module:lamb.zip|zip}
 * @param {ArrayLike} arrayLike
 * @returns {Array<Array<*, Number>>}
 */
var zipWithIndex = mapWith(binary(list));

lamb.append = append;
lamb.appendTo = appendTo;
lamb.difference = difference;
lamb.drop = drop;
lamb.dropFrom = dropFrom;
lamb.dropWhile = dropWhile;
lamb.flatMap = flatMap;
lamb.flatMapWith = flatMapWith;
lamb.flatten = flatten;
lamb.init = init;
lamb.insert = insert;
lamb.insertAt = insertAt;
lamb.intersection = intersection;
lamb.partition = partition;
lamb.partitionWith = partitionWith;
lamb.pluck = pluck;
lamb.pluckKey = pluckKey;
lamb.pull = pull;
lamb.pullFrom = pullFrom;
lamb.shallowFlatten = shallowFlatten;
lamb.tail = tail;
lamb.take = take;
lamb.takeFrom = takeFrom;
lamb.takeWhile = takeWhile;
lamb.transpose = transpose;
lamb.union = union;
lamb.unionBy = unionBy;
lamb.uniques = uniques;
lamb.uniquesBy = uniquesBy;
lamb.zip = zip;
lamb.zipWithIndex = zipWithIndex;
