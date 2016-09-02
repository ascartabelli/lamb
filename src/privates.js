/**
 * Builds an array with the received arguments excluding the first one.<br/>
 * To be used with the arguments object, which needs to be passed to the apply
 * method of this function.
 * @private
 * @function
 * @param {...*} value
 * @returns {Array}
 */
var _argsTail = _argsToArrayFrom(1);

/**
 * Builds helper functions to extract portions of the arguments
 * object rather efficiently without having to write for loops
 * manually for each case.<br/>
 * The arguments object needs to be passed to the apply method
 * of the generated function.
 * @private
 * @param {Number} idx
 * @returns {Function}
 */
function _argsToArrayFrom (idx) {
    return function () {
        var argsLen = arguments.length || idx;
        var len = argsLen - idx;
        var result = Array(len);

        for (var i = 0; i < len; i++) {
            result[i] = arguments[i + idx];
        }

        return result;
    };
}

/**
 * Keeps building a partial application of the received function as long
 * as it's called with placeholders; applies the original function with
 * the collected parameters otherwise.
 * @private
 * @param {Function} fn
 * @param {Array} argsHolder
 * @returns {Function|*}
 */
function _asPartial (fn, argsHolder) {
    return function () {
        var argsHolderLen = argsHolder.length;
        var argsLen = arguments.length;
        var lastIdx = 0;
        var newArgs = [];
        var canApply = true;

        for (var i = 0; i < argsLen; i++) {
            if (arguments[i] === _) {
                canApply = false;
                break;
            }
        }

        for (var idx = 0, boundArg; idx < argsHolderLen; idx++) {
            boundArg = argsHolder[idx];
            newArgs[idx] = lastIdx < argsLen && boundArg === _ ? arguments[lastIdx++] : boundArg;
        }

        while (lastIdx < argsLen) {
            newArgs[idx++] = arguments[lastIdx++];
        }

        return canApply ? fn.apply(this, newArgs) : _asPartial(fn, newArgs);
    };
}

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

    /* eslint-disable no-self-compare */

    if (!isSVZ(a, b)) {
        if (a > b || a !== a) {
            result = 1;
        } else if (a < b || b !== b) {
            result = -1;
        }
    }

    /* eslint-enable no-self-compare */

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
 * @param {Boolean} isAutoCurry
 * @param {Array} argsHolder
 * @returns {Function}
 */
function _currier (fn, arity, isRightCurry, isAutoCurry, argsHolder) {
    return function () {
        var holderLen = argsHolder.length;
        var argsLen = arguments.length;
        var newArgsLen = holderLen + (argsLen > 1 && isAutoCurry ? argsLen : 1);
        var newArgs = Array(newArgsLen);

        for (var i = 0; i < holderLen; i++) {
            newArgs[i] = argsHolder[i];
        }

        for (; i < newArgsLen; i++) {
            newArgs[i] = arguments[i - holderLen];
        }

        if (newArgsLen >= arity) {
            return fn.apply(this, isRightCurry ? newArgs.reverse() : newArgs);
        } else {
            return _currier(fn, arity, isRightCurry, isAutoCurry, newArgs);
        }
    };
}

/**
 * Prepares a function for currying by setting the proper arity for
 * the <code>_currier</code> function.
 * If the desumed arity isn't greater than one, it will return the received
 * function itself, instead.
 * @private
 * @param {Function} fn
 * @param {Number} [arity=fn.length]
 * @param {Boolean} isRightCurry
 * @param {Boolean} isAutoCurry
 * @returns {Function}
 */
function _curry (fn, arity, isRightCurry, isAutoCurry) {
    if (arity >>> 0 !== arity) {
        arity = fn.length;
    }

    return arity > 1 ? _currier(fn, arity, isRightCurry, isAutoCurry, []) : fn;
}

/**
 * Flattens an array.
 * @private
 * @param {Array} array - The source array
 * @param {Boolean} isDeep - Whether to perform a deep flattening or not
 * @param {Array} output - An array to collect the result
 * @param {Number} idx - The next index to be filled in the output
 * @returns {Array} The output array filled with the results
 */
function _flatten (array, isDeep, output, idx) {
    for (var i = 0, len = array.length, value, j, vLen; i < len; i++) {
        value = array[i];

        if (!Array.isArray(value)) {
            output[idx++] = value;
        } else if (isDeep) {
            _flatten(value, true, output, idx);
            idx = output.length;
        } else {
            vLen = value.length;
            output.length += vLen;

            for (j = 0; j < vLen; j++) {
                output[idx++] = value[j];
            }
        }
    }

    return output;
}

/**
 * Establishes at which index an element should be inserted in a sorted array to respect
 * the array order. Needs the comparer used to sort the array.
 * @private
 * @param {Array} array
 * @param {*} element
 * @param {Function} comparer
 * @param {Number} start
 * @param {Number} end
 * @returns {Number}
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
 * @returns {Number|Undefined}
 */
function _getNaturalIndex (target, index) {
    var len = target.length;

    if (_isInteger(index) && _isInteger(len)) {
        return clamp(index, -len, len - 1) === index ? index < 0 ? index + len : index : void 0;
    } else {
        return void 0;
    }
}

/**
 * Gets the number of consecutive elements satisfying a predicate in an array-like object.
 * @private
 * @param {ArrayLike} arrayLike
 * @param {ListIteratorCallback} predicate
 * @param {Object} predicateContext
 * @returns {Number}
 */
function _getNumConsecutiveHits (arrayLike, predicate, predicateContext) {
    var idx = 0;
    var len = arrayLike.length;

    if (arguments.length === 3) {
        predicate = predicate.bind(predicateContext);
    }

    while (idx < len && predicate(arrayLike[idx], idx, arrayLike)) {
        idx++;
    }

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
            key = keyAsNumber < 0 ? _getNaturalIndex(target, keyAsNumber) :
                Array.isArray(target) && keyAsNumber < target.length ? keyAsNumber : void 0;
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
 * @returns {Function}
 */
function _groupWith (makeValue) {
    return function (arrayLike, iteratee, iterateeContext) {
        if (arguments.length === 3) {
            iteratee = iteratee.bind(iterateeContext);
        }

        var result = {};
        var len = arrayLike.length;

        for (var i = 0, element, key; i < len; i++) {
            element = arrayLike[i];
            key = iteratee(element, i, arrayLike);
            result[key] = makeValue(result[key], element);
        }

        return result;
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
 * If a method with the given name exists on the target, applies it with the provided
 * arguments and returns the result. Returns <code>undefined</code> otherwise.<br/>
 * The arguments for the method are built by concatenating the array of bound arguments,
 * optionally received by {@link module:lamb.invoker|invoker}, with the final set of, also
 * optional, <code>args</code>.
 * @private
 * @param {Array} boundArgs
 * @param {String} methodName
 * @param {Object} target
 * @param {...*} [args]
 * @returns {*}
 */
function _invoker (boundArgs, methodName, target) {
    var method = target[methodName];

    if (typeof method !== "function") {
        return void 0;
    }

    var boundArgsLen = boundArgs.length;
    var ofs = 3 - boundArgsLen;
    var len = arguments.length - ofs;
    var args = Array(len);

    for (var i = 0; i < boundArgsLen; i++) {
        args[i] = boundArgs[i];
    }

    for (; i < len; i++) {
        args[i] = arguments[i + ofs];
    }

    return method.apply(target, args);
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
 * Helper to build the {@link module:lamb.everyIn|everyIn} or the
 * {@link module:lamb.someIn|someIn} function.
 * @private
 * @param {Boolean} defaultResult
 * @returns {Function}
 */
function _makeArrayChecker (defaultResult) {
    return function (arrayLike, predicate, predicateContext) {
        if (arguments.length === 3) {
            predicate = predicate.bind(predicateContext);
        }

        for (var i = 0, len = arrayLike.length; i < len; i++) {
            if (defaultResult ^ !!predicate(arrayLike[i], i, arrayLike)) {
                return !defaultResult;
            }
        }

        return defaultResult;
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
 * Builds a reduce function. The <code>step</code> parameter must be <code>1</code>
 * to build  {@link module:lamb.reduce|reduce} and <code>-1</code> to build
 * {@link module:lamb.reduceRight|reduceRight}.
 * @private
 * @param {Number} step
 * @returns {Function}
 */
function _makeReducer (step) {
    return function (arrayLike, accumulator, initialValue) {
        var len = arrayLike.length >>> 0;
        var idx = step === 1 ? 0 : len - 1;
        var nCalls;
        var result;

        if (arguments.length === 3) {
            nCalls = len;
            result = initialValue;
        } else {
            if (len === 0) {
                throw new TypeError("Reduce of empty array-like with no initial value");
            }

            result = arrayLike[idx];
            idx += step;
            nCalls = len - 1;
        }

        for (; nCalls--; idx += step) {
            result = accumulator(result, arrayLike[idx], idx, arrayLike);
        }

        return result;
    };
}

/**
 * Builds a TypeError stating that it's not possible to convert the given value to the
 * desired type.
 * @private
 * @param {*} value
 * @param {String} desiredType
 * @returns {TypeError}
 */
function _makeTypeErrorFor (value, desiredType) {
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
    return reduce(_argsTail.apply(null, arguments), function (result, source) {
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
 * optional argument other than its main data parameter.<br/>
 * The optional argument is passed to the function only when is explicitly given
 * a value.<br/>
 * The optional argument is usually the iteratee context, but reduce functions
 * pass their initial value instead.
 * @private
 * @param {Function} fn
 * @returns {Function}
 */
function _partialWithIteratee (fn) {
    return function (iteratee, optionalArgument) {
        var f = arguments.length === 2 ? fn : binary(fn);

        return partial(f, _, iteratee, optionalArgument);
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
 * @returns {Array}
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
 * @private
 * @param {Function} reader
 * @param {Boolean} isDescending
 * @param {Function} [comparer]
 * @returns {Sorter}
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
