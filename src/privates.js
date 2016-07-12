
/**
 * The default comparer for sorting functions.<br/>
 * If the given values are of different types they
 * will be both converted to strings.<br/>
 * Uses the SameValueZero comparison.
 * @private
 * @param {*} a
 * @param {*} b
 * @returns {Number} -1 | 0 | 1
 */
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

/**
 * Accepts a list of sorting criteria and builds a function that compares
 * two values with such criteria.
 * @private
 * @param {Sorter[]} criteria
 * @returns {Function}
 */
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

/**
 * Used by curry functions to collect arguments until the arity is consumed,
 * then applies the original function.
 * @private
 * @param {Function} fn
 * @param {Number} arity
 * @param {Boolean} isRightCurry
 * @param {Function} slicer
 * @param {Array} argsHolder
 */
function _currier (fn, arity, isRightCurry, slicer, argsHolder) {
    return function () {
        var args = argsHolder.concat(slicer(arguments));

        if (args.length >= arity) {
            return fn.apply(this, isRightCurry ? args.reverse() : args);
        } else {
            return _currier(fn, arity, isRightCurry, slicer, args);
        }
    };
}

/**
 * Prepares a function for currying by setting the proper parameters for
 * the <code>_currier</code> function.
 * If the desumed arity isn't greater than one, it will return the received
 * function itself, instead.
 * @private
 * @param {Function} fn
 * @param {Number} [arity=fn.length]
 * @param {Boolean} isRightCurry
 * @param {Boolean} isAutoCurry
 */
function _curry (fn, arity, isRightCurry, isAutoCurry) {
    var slicer = isAutoCurry ? function (argsObj) {
        var len = argsObj.length;

        if (len) {
            for (var i = 0, args = []; i < len; i++) {
                args[i] = argsObj[i];
            }

            return args;
        } else {
            return [void 0];
        }
    } : function (argsObj) {
        return argsObj.length ? [argsObj[0]] : [void 0];
    };

    if ((arity >>> 0) !== arity) {
        arity = fn.length;
    }

    return arity > 1 ? _currier(fn, arity, isRightCurry, slicer, []) : fn;
}

/**
 * Flattens an array.
 * @private
 * @param {Array} array
 * @param {Array} output The empty array to collect the result
 * @returns {Array} The output array filled with the results
 */
function _flatten (array, output) {
    forEach(array, function (value) {
        if (Array.isArray(value)) {
            _flatten(value, output);
        } else {
            output.push(value);
        }
    });

    return output;
}

/**
 * Establishes at which index an element should be inserted in a sorted array to respect
 * the array order. Needs the comparer used to sort the array.
 * @param {Array} array
 * @param {*} element
 * @param {Function} comparer
 * @param {Number} start
 * @param {Number} end
 * @private
 */
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

/**
 * Checks if the given index, even negative, exists in the target object, if
 * it's an array-like, and transforms it to a natural number.
 * Returns <code>undefined<code> otherwise.
 * @private
 * @param {ArrayLike} target
 * @param {Number} index
 * @returns {Number|undefined}
 */
function _getNaturalIndex (target, index) {
    var len = target.length;

    if (_isInteger(index) && _isInteger(len)) {
        return clamp(index, -len, len - 1) === index ? index < 0 ? index + len : index : void 0;
    }
}

/**
 * Gets the number of consecutive elements satisfying a predicate in an array-like object.
 * @private
 * @param {ArrayLike} arrayLike
 * @param {Function} predicate
 * @param {Object} predicateContext
 */
function _getNumConsecutiveHits (arrayLike, predicate, predicateContext) {
    var idx = -1;
    var len = arrayLike.length;

    if (arguments.length === 3) {
        predicate = predicate.bind(predicateContext);
    }

    while (++idx < len && predicate(arrayLike[idx], idx, arrayLike));

    return idx;
}

/**
 * Builds the prefix or suffix to be used when padding a string.
 * @private
 * @param {String} source
 * @param {String} char
 * @param {Number} len
 * @returns {String}
 */
function _getPadding (source, char, len) {
    if (!isNil(source) && type(source) !== "String") {
        source = String(source);
    }

    return repeat(Object(char)[0] || " ", Math.ceil(len - source.length));
}

/**
 * Checks if a path is valid in the given object and retrieves the path target.
 * @private
 * @param {Object} obj
 * @param {String[]} parts
 * @param {Boolean} walkNonEnumerables
 * @returns {Object}
 */
function _getPathInfo (obj, parts, walkNonEnumerables) {
    var target = obj;
    var i = -1;
    var len = parts.length;
    var key;
    var keyAsNumber;

    while (++i < len) {
        key = parts[i];

        if (!(_isEnumerable(target, key) || key in Object(target) && walkNonEnumerables)) {
            keyAsNumber = Number(key);
            key = keyAsNumber < 0 ? _getNaturalIndex(target, keyAsNumber) : void 0;
        }

        if (isUndefined(key)) {
            break;
        }

        target = target[key];
    }

    return i === len ? {isValid: true, target: target} : {isValid: false, target: void 0};
}

/**
 * Builds a "grouping function" for an array-like object.
 * @private
 * @param {Function} makeValue
 * @param {*} startValue
 * @returns {Function}
 */
function _groupWith (makeValue, startValue) {
    return function (arrayLike, iteratee, iterateeContext) {
        if (arguments.length === 3) {
            iteratee = iteratee.bind(iterateeContext);
        }

        return reduce(arrayLike, function (result, element, idx) {
            var key = iteratee(element, idx, arrayLike);
            var value = makeValue(key in result ? result[key] : startValue , element);

            result[key] = value;

            return result;
        }, {});
    };
}

/**
 * Makes an object immutable by recursively calling <code>Object.freeze</code>
 * on its members.
 * @private
 * @param {Object} obj
 * @param {Array} seen
 * @returns {Object} The obj parameter itself, not a copy.
 */
function _immutable (obj, seen) {
    if (seen.indexOf(obj) === -1) {
        seen.push(Object.freeze(obj));

        forEach(Object.getOwnPropertyNames(obj), function (key) {
            var value = obj[key];

            if (typeof value === "object" && !isNull(value)) {
                _immutable(value, seen);
            }
        });
    }

    return obj;
}

/**
 * Accepts a target object and a key name and verifies that the target is an array and that
 * the key is an existing index.
 * @private
 * @param {Object} target
 * @param {String|Number} key
 * @returns {Boolean}
 */
function _isArrayIndex (target, key) {
    var n = Number(key);
    return Array.isArray(target) && _isInteger(n) && !(n < 0 && _isEnumerable(target, key));
}

/**
 * Checks whether the specified key is an enumerable property of the given object or not.
 * @private
 * @param {Object} obj
 * @param {String} key
 * @returns {Boolean}
 */
function _isEnumerable (obj, key) {
    return key in Object(obj) && (_isOwnEnumerable(obj, key) || ~_safeEnumerables(obj).indexOf(key));
}

/**
 * Checks if the given value is an integer.
 * @private
 * @param {*} n
 * @returns {Boolean}
 */
function _isInteger (n) {
    return Math.floor(n) === n;
}

/**
 * Checks whether the specified key is a own enumerable property of the given object or not.
 * @private
 * @function
 * @param {Object} obj
 * @param {String} key
 * @returns {Boolean}
 */
var _isOwnEnumerable = generic(_objectProto.propertyIsEnumerable);

/**
 * Accepts an object and build a function expecting a key to create a "pair" with the key
 * and its value.
 * @private
 * @param {Object} obj
 * @returns {Function}
 */
function _keyToPairIn (obj) {
    return function (key) {
       return [key, obj[key]];
    };
}

/**
 * Builds a list of sorting criteria from a list of sorter functions. Returns a list containing
 * a single default sorting criterion if the sorter list is empty.
 * @private
 * @param {Function[]} sorters
 * @returns {Sorter[]}
 */
function _makeCriteria (sorters) {
    return sorters.length ? map(sorters, _makeCriterion) : [_sorter()];
}

/**
 * Converts a sorting function to a sorting criterion if necessary.
 * @private
 * @param {Function} criterion
 * @returns {Sorter}
 */
function _makeCriterion (criterion) {
    return typeof Object(criterion).compare === "function" ? criterion : _sorter(criterion);
}

/**
 * Builds a TypeError stating that it's not possible to convert the given value to the
 * desired type.
 * @private
 * @param {*} value
 * @param {String} desiredType
 * @returns {TypeError}
 */
function _makeTypeErrorFor(value, desiredType) {
    return new TypeError("Cannot convert " + type(value).toLowerCase() + " to " + desiredType);
}

/**
 * Merges the received objects using the provided functions to retrieve their keys.
 * @private
 * @param {Function} getKeys
 * @param {...Object} source
 * @returns {Object}
 */
function _merge (getKeys) {
    return reduce(slice(arguments, 1), function (result, source) {
        forEach(getKeys(source), function (key) {
            result[key] = source[key];
        });

        return result;
    }, {});
}

/**
 * Using the provided function to retrieve the keys of an object, builds
 * a function expecting an object to create a list of key / value pairs.
 * @private
 * @function
 * @param {Function} getKeys
 * @returns {Function}
 */
var _pairsFrom = _curry(function (getKeys, obj) {
    return map(getKeys(obj), _keyToPairIn(obj));
});

/**
 * Builds a partial application of a function expecting an iteratee and an
 * optional context other than its main data argument.<br/>
 * The context is passed to the function only when is explicitly given
 * a value.
 * @private
 * @param {Function} fn
 * @returns {Function}
 */
function _partialWithIteratee (fn) {
    return function (iteratee, iterateeContext) {
        return partial(
            arguments.length === 2 ? fn : binary(fn),
            _,
            iteratee,
            iterateeContext
        );
    };
}

/**
 * Builds a list of the enumerable properties of an object.
 * The function is null-safe, unlike the public one.
 * @private
 * @param {Object} obj
 * @returns {String[]}
 */
function _safeEnumerables (obj) {
    var keys = [];

    for (var key in obj) {
        keys.push(key);
    }

    return keys;
}

/**
 * A null-safe version of <code>Object.keys</code>.
 * @private
 * @param {Object} obj
 * @returns {String[]}
 */
var _safeKeys = compose(Object.keys, Object);

/**
 * Sets an index in an array-like object.<br/>
 * If provided with an updater function it will use it to update the current value,
 * otherwise sets the index to the specified value.
 * @private
 * @param {ArrayLike} arrayLike
 * @param {Number} index
 * @param {*} [value]
 * @param {Function} [updater]
 */
function _setIndex (arrayLike, index, value, updater) {
    var result = slice(arrayLike);
    var idx = _getNaturalIndex(result, index);
    var isUpdate = arguments.length === 4;

    if (!isUndefined(idx)) {
        result[idx] = isUpdate ? updater(arrayLike[idx]) : value;
    }

    return result;
}

/**
 * Sets the object's property targeted by the given path to the desired value.<br/>
 * Works with arrays and is able to set their indexes, even negative ones.
 * @private
 * @param {Object|Array} obj
 * @param {String[]} parts
 * @param {*} value
 * @returns {Object|Array}
 */
function _setPathIn (obj, parts, value) {
    var key = parts[0];
    var v = parts.length === 1 ? value : _setPathIn(
        _getPathInfo(obj, [key], false).target,
        slice(parts, 1),
        value
    );

    return _isArrayIndex(obj, key) ? _setIndex(obj, +key, v) : setIn(Object(obj), key, v);
}

/**
 * Builds a sorting criterion. If the comparer function is missing, the default
 * comparer will be used instead.
 * @param {Function} reader
 * @param {Boolean} isDescending
 * @param {Function} [comparer]
 * @private
 */
function _sorter (reader, isDescending, comparer) {
    return {
        isDescending: isDescending === true,
        compare: function (a, b) {
            if (typeof reader === "function" && reader !== identity) {
                a = reader(a);
                b = reader(b);
            }

            return (typeof comparer === "function" ? comparer : _comparer)(a, b);
        }
    };
}

/**
 * Using the provided function to retrieve the keys of an object, builds
 * a function expecting an object to create an array containing a list
 * of the keys in its first index and the corresponding list of values
 * in the second one.
 * @private
 * @function
 * @param {Function} getKeys
 * @returns {Function}
 */
var _tearFrom = _curry(function (getKeys, obj) {
    return reduce(getKeys(obj), function (result, key) {
        result[0].push(key);
        result[1].push(obj[key]);
        return result;
    }, [[], []]);
});

/**
 * Splits a sting path using the provided separator and returns an array
 * of path parts.
 * @private
 * @param {String} path
 * @param {String} separator
 * @returns {String[]}
 */
function _toPathParts (path, separator) {
    return String(path).split(separator || ".");
}

/**
 * Creates a non-null-safe version of the provided "getKeys" function.
 * @private
 * @function
 * @param {Function} getKeys
 * @returns {Function}
 */
var _unsafeKeyListFrom = _curry(function (getKeys, obj) {
    return (isNil(obj) ? Object.keys : getKeys)(obj);
});

/**
 * Using the provided function to retrieve the keys of an object, builds
 * a function expecting an object to create the list of values for such keys.
 * @private
 * @function
 * @param {Function} getKeys
 * @returns {Function}
 */
var _valuesFrom = _curry(function (getKeys, obj) {
    return map(getKeys(obj), partial(getIn, obj));
});
