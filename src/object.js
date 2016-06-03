
function _immutable (obj, seen) {
    if (seen.indexOf(obj) === -1) {
        seen.push(Object.freeze(obj));

        Object.getOwnPropertyNames(obj).forEach(function (key) {
            var value = obj[key];

            if (typeof value === "object" && !isNull(value)) {
                _immutable(value, seen);
            }
        });
    }

    return obj;
}

function _keyToPair (key) {
    return [key, this[key]];
}

function _merge (getKeys) {
    return reduce(slice(arguments, 1), function (result, source) {
        forEach(getKeys(source), function (key) {
            result[key] = source[key];
        });

        return result;
    }, {});
}

var _pairsFrom = _curry(function (getKeys, obj) {
    return getKeys(obj).map(_keyToPair, obj);
});

function _safeEnumerables (obj) {
    var keys = [];

    for (var key in obj) {
        keys.push(key);
    }

    return keys;
}

var _safeKeys = compose(Object.keys, Object);

var _tearFrom = _curry(function (getKeys, obj) {
    return getKeys(obj).reduce(function (result, key) {
        result[0].push(key);
        result[1].push(obj[key]);
        return result;
    }, [[], []]);
});

var _unsafeKeyListFrom = _curry(function (getKeys, obj) {
    return (isNil(obj) ? Object.keys : getKeys)(obj);
});

var _valuesFrom = _curry(function (getKeys, obj) {
    return getKeys(obj).map(partial(getIn, obj));
});

/**
 * Builds a <code>checker</code> function meant to be used with {@link module:lamb.validate|validate}.<br/>
 * Note that the function accepts multiple <code>keyPaths</code> as a means to compare their values. In
 * other words all the received <code>keyPaths</code> will be passed as arguments to the <code>predicate</code>
 * to run the test.<br/>
 * If you want to run the same single property check with multiple properties, you should build
 * multiple <code>checker</code>s and combine them with {@link module:lamb.validate|validate}.
 * @example
 * var user = {
 *     name: "John",
 *     surname: "Doe",
 *     login: {
 *         username: "jdoe",
 *         password: "abc123",
 *         passwordConfirm: "abc123"
 *     }
 * };
 * var pwdMatch = _.checker(
 *     _.is,
 *     "Passwords don't match",
 *     ["login.password", "login.passwordConfirm"]
 * );
 *
 * pwdMatch(user) // => []
 *
 * var newUser = _.setPathIn(user, "login.passwordConfirm", "avc123");
 *
 * pwdMatch(newUser) // => ["Passwords don't match", ["login.password", "login.passwordConfirm"]]
 *
 * @memberof module:lamb
 * @category Object
 * @see {@link module:lamb.validate|validate}, {@link module:lamb.validateWith|validateWith}
 * @param {Function} predicate - The predicate to test the object properties
 * @param {String} message - The error message
 * @param {String[]} keyPaths - The array of property names, or {@link module:lamb.getPathIn|paths}, to test.
 * @param {String} [pathSeparator="."]
 * @returns {Array<String, String[]>} An error in the form <code>["message", ["propertyA", "propertyB"]]</code> or an empty array.
 */
function checker (predicate, message, keyPaths, pathSeparator) {
    return function (obj) {
        var getValues = partial(getPathIn, obj, _, pathSeparator);
        return predicate.apply(obj, keyPaths.map(getValues)) ? [] : [message, keyPaths];
    };
}

/**
 * Creates an array with all the enumerable properties of the given object.
 * @example <caption>Showing the difference with {@link module:lamb.keys|keys}</caption>
 * var baseFoo = Object.create({a: 1}, {b: {value: 2}});
 * var foo = Object.create(baseFoo, {
 *     c: {value: 3},
 *     d: {value: 4, enumerable: true}
 * });
 *
 * _.keys(foo) // => ["d"]
 * _.enumerables(foo) // => ["d", "a"]
 *
 * @memberof module:lamb
 * @category Object
 * @function
 * @see {@link module:lamb.keys|keys}
 * @param {Object} obj
 * @returns {String[]}
 */
var enumerables = _unsafeKeyListFrom(_safeEnumerables);

/**
 * Builds an object from a list of key / value pairs like the one
 * returned by [pairs]{@link module:lamb.pairs} or {@link module:lamb.ownPairs|ownPairs}.<br/>
 * In case of duplicate keys the last key / value pair is used.
 * @example
 * _.fromPairs([["a", 1], ["b", 2], ["c", 3]]) // => {"a": 1, "b": 2, "c": 3}
 * _.fromPairs([["a", 1], ["b", 2], ["a", 3]]) // => {"a": 3, "b": 2}
 * _.fromPairs([[1], [void 0, 2], [null, 3]]) // => {"1": undefined, "undefined": 2, "null": 3}
 *
 * @memberof module:lamb
 * @category Object
 * @param {Array<Array<String, *>>} pairsList
 * @returns {Object}
 */
function fromPairs (pairsList) {
    var result = {};
	
	forEach(pairsList, function (pair) {
        result[pair[0]] = pair[1];
    });

    return result;
}

/**
 * Verifies the existence of a property in an object.
 * @example
 * var user1 = {name: "john"};
 *
 * _.has(user1, "name") // => true
 * _.has(user1, "surname") // => false
 * _.has(user1, "toString") // => true
 *
 * var user2 = Object.create(null);
 *
 * // not inherited through the prototype chain
 * _.has(user2, "toString") // => false
 *
 * @memberof module:lamb
 * @category Object
 * @param {Object} obj
 * @param {String} key
 * @returns {Boolean}
 */
function has (obj, key) {
	if (typeof obj !== "object" && !isUndefined(obj)) {
		obj = Object(obj);
	}	
	
    return key in obj;
}

/**
 * Curried version of {@link module:lamb.has|has}.<br/>
 * Returns a function expecting the object to check against the given key.
 * @example
 * var user1 = {name: "john"};
 * var user2 = {};
 * var hasName = _.hasKey("name");
 *
 * hasName(user1) // => true
 * hasName(user2) // => false
 *
 * @memberof module:lamb
 * @category Object
 * @param {String} key
 * @returns {Function}
 */
function hasKey (key) {
	return function (obj) {
		return has(obj, key);
	};
}

/**
 * Builds a function expecting an object to check against the given key / value pair.
 * @example
 * var hasTheCorrectAnswer = _.hasKeyValue("answer", 42);
 *
 * hasTheCorrectAnswer({answer: 2}) // false
 * hasTheCorrectAnswer({answer: 42}) // true
 *
 * @memberof module:lamb
 * @category Object
 * @function
 * @param {String} key
 * @param {*} value
 * @returns {Function}
 */
var hasKeyValue = function (key, value) {
    return compose(partial(is, value), getKey(key));
};

/**
 * Verifies if an object has the specified property and that the property isn't inherited through
 * the prototype chain.<br/>
 * @example <caption>Comparison with <code>has</code>.</caption>
 * var user = {name: "john"};
 *
 * _.has(user, "name") // => true
 * _.has(user, "surname") // => false
 * _.has(user, "toString") // => true
 *
 * _.hasOwn(user, "name") // => true
 * _.hasOwn(user, "surname") // => false
 * _.hasOwn(user, "toString") // => false
 *
 * @memberof module:lamb
 * @category Object
 * @function
 * @param {Object} obj
 * @param {String} key
 * @returns {Boolean}
 */
var hasOwn = generic(_objectProto.hasOwnProperty);

/**
 * Curried version of {@link module:lamb.hasOwn|hasOwn}.<br/>
 * Returns a function expecting the object to check against the given key.
 * @example
 * var user = {name: "john"};
 * var hasOwnName = _.hasOwnKey("name");
 * var hasOwnToString = _.hasOwnToString("toString");
 *
 * hasOwnName(user) // => true
 * hasOwnToString(user) // => false
 *
 * @memberof module:lamb
 * @category Object
 * @param {String} key
 * @returns {Function}
 */
function hasOwnKey (key) {
	return function (obj) {
		return hasOwn(obj, key);
	};
}

/**
 * Makes an object immutable by recursively calling [Object.freeze]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze}
 * on its members.<br/>
 * Any attempt to extend or modify the object can throw a <code>TypeError</code> or fail silently,
 * depending on the environment and the [strict mode]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode} directive.
 * @example
 * var user = _.immutable({
 *     name: "John",
 *     surname: "Doe",
 *     login: {
 *         username: "jdoe",
 *         password: "abc123"
 *     },
 *     luckyNumbers: [13, 17]
 * });
 *
 * // All of these statements will fail and possibly
 * // throw a TypeError (see the function description)
 * user.name = "Joe";
 * delete user.name;
 * user.newProperty = [];
 * user.login.password = "foo";
 * user.luckyNumbers.push(-13);
 *
 * @memberof module:lamb
 * @category Object
 * @param {Object} obj
 * @returns {Object}
 */
function immutable (obj) {
    return _immutable(obj, []);
}

/**
 * Retrieves the list of the own enumerable properties of an object.<br/>
 * Although [Object.keys]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys}
 * is already present in ECMAScript 5, its behaviour changed in the subsequent specifications
 * of the standard as you can read in the link above.<br/>
 * This function <em>shims</em> the ECMAScript 6 version, by forcing a conversion to
 * object for any value but <code>null</code> and <code>undefined</code>.
 * @example <caption>Showing the difference with {@link module:lamb.enumerables|enumerables}</caption>
 * var baseFoo = Object.create({a: 1}, {b: {value: 2}});
 * var foo = Object.create(baseFoo, {
 *     c: {value: 3},
 *     d: {value: 4, enumerable: true}
 * });
 *
 * _.enumerables(foo) // => ["d", "a"]
 * _.keys(foo) // => ["d"]
 *
 * @memberof module:lamb
 * @category Object
 * @function
 * @see {@link module:lamb.enumerables|enumerables}
 * @param {Object} obj
 * @returns {String[]}
 */
var keys = _unsafeKeyListFrom(_safeKeys);

/**
 * Builds an object from the two given lists, using the first one as keys and the last one as values.<br/>
 * If the list of keys is longer than the values one, the keys will be created with <code>undefined</code> values.<br/>
 * If more values than keys are supplied, the extra values will be ignored.<br/>
 * See also {@link module:lamb.tear|tear} and {@link module:lamb.tearOwn|tearOwn} for the reverse operation.
 * @example
 * _.make(["a", "b", "c"], [1, 2, 3]) // => {a: 1, b: 2, c: 3}
 * _.make(["a", "b", "c"], [1, 2]) // => {a: 1, b: 2, c: undefined}
 * _.make(["a", "b"], [1, 2, 3]) // => {a: 1, b: 2}
 * _.make([null, void 0, 2], [1, 2, 3]) // => {"null": 1, "undefined": 2, "2": 3}
 *
 * @memberof module:lamb
 * @category Object
 * @param {String[]} keys
 * @param {ArrayLike} values
 * @returns {Object}
 */
function make (keys, values) {
    var result = {};
    var valuesLen = values.length;

    for (var i = 0, len = keys.length; i < len; i++) {
        result[keys[i]] = i < valuesLen ? values[i] : void 0;
    }

    return result;
}

/**
 * Merges the enumerable properties of the provided sources into a new object.<br/>
 * In case of key homonymy each source has precedence over the previous one.<br/>
 * See also {@link module:lamb.mergeOwn|mergeOwn} for merging only own properties of
 * the given sources.
 * @example
 * _.merge({a: 1}, {b: 3, c: 4}, {b: 5}) // => {a: 1, b: 5, c: 4}
 *
 * @example <caption>Arrays or array-like objects will be transformed to objects with numbers as keys:</caption>
 * _.merge([1, 2], {a: 2}) // => {"0": 1, "1": 2, a: 2}
 * _.merge("foo", {a: 2}) // => {"0": "f", "1": "o", "2": "o", a: 2}
 *
 * @example <caption>Every other value will be treated as an empty object:</caption>
 * _.merge({a: 2}, null, NaN) // => {a: 2}
 *
 * @memberof module:lamb
 * @category Object
 * @function
 * @param {...Object} source
 * @returns {Object}
 */
var merge = partial(_merge, _safeEnumerables);

/**
 * Same as {@link module:lamb.merge|merge}, but only the own properties of the sources are taken into account.
 * @example <caption>showing the difference with <code>merge</code>:</caption>
 * var baseFoo = Object.create({a: 1}, {b: {value: 2, enumerable: true}, z: {value: 5}});
 * var foo = Object.create(baseFoo, {
 *     c: {value: 3, enumerable: true}
 * });
 *
 * var bar = {d: 4};
 *
 * _.merge(foo, bar) // => {a: 1, b: 2, c: 3, d: 4}
 * _.mergeOwn(foo, bar) // => {c: 3, d: 4}
 *
 * @example <caption>Arrays or array-like objects will be transformed to objects with numbers as keys:</caption>
 * _.mergeOwn([1, 2], {a: 2}) // => {"0": 1, "1": 2, a: 2}
 * _.mergeOwn("foo", {a: 2}) // => {"0": "f", "1": "o", "2": "o", a: 2}
 *
 * @example <caption>Every other value will be treated as an empty object:</caption>
 * _.mergeOwn({a: 2}, null, NaN) // => {a: 2}
 *
 * @memberof module:lamb
 * @category Object
 * @function
 * @param {...Object} source
 * @returns {Object}
 */
var mergeOwn = partial(_merge, _safeKeys);

/**
 * Same as {@link module:lamb.pairs|pairs}, but only the own enumerable properties of the object are
 * taken into account.<br/>
 * See also {@link module:lamb.fromPairs|fromPairs} for the reverse operation.
 * @example <caption>showing the difference with <code>pairs</code></caption>
 * var baseFoo = Object.create({a: 1}, {b: {value: 2, enumerable: true}, z: {value: 5}});
 * var foo = Object.create(baseFoo, {
 *     c: {value: 3, enumerable: true}
 * });
 *
 * _.pairs(foo) // => [["c", 3], ["b", 2], ["a", 1]]
 * _.ownPairs(foo) // => [["c", 3]]
 *
 * @memberof module:lamb
 * @category Object
 * @function
 * @param {Object} obj
 * @returns {Array<Array<String, *>>}
 */
var ownPairs = _pairsFrom(keys);

/**
 * Same as {@link module:lamb.values|values}, but only the own enumerable properties of the object are
 * taken into account.<br/>
 * @example <caption>showing the difference with <code>values</code></caption>
 * var baseFoo = Object.create({a: 1}, {b: {value: 2, enumerable: true}, z: {value: 5}});
 * var foo = Object.create(baseFoo, {
 *     c: {value: 3, enumerable: true}
 * });
 *
 * _.values(foo) // => [3, 2, 1]
 * _.ownValues(foo) // => [3]
 *
 * @memberof module:lamb
 * @category Object
 * @function
 * @param {Object} obj
 * @returns {Array}
 */
var ownValues = _valuesFrom(keys);

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
 * @param {Object} obj
 * @returns {Array<Array<String, *>>}
 */
var pairs = _pairsFrom(enumerables);

/**
 * Returns an object containing only the specified properties of the given object.<br/>
 * Non existent properties will be ignored.
 * @example
 * var user = {name: "john", surname: "doe", age: 30};
 *
 * _.pick(user, ["name", "age"]) // => {"name": "john", "age": 30};
 * _.pick(user, ["name", "email"]) // => {"name": "john"}
 *
 * @memberof module:lamb
 * @category Object
 * @see {@link module:lamb.pickIf|pickIf}
 * @param {Object} source
 * @param {String[]} whitelist
 * @returns {Object}
 */
function pick (source, whitelist) {
    var result = {};

    whitelist.forEach(function (key) {
        if (key in source) {
            result[key] = source[key];
        }
    });

    return result;
}

/**
 * Builds a function expecting an object whose properties will be checked against the given predicate.<br/>
 * The properties satisfying the predicate will be included in the resulting object.
 * @example
 * var user = {name: "john", surname: "doe", age: 30};
 * var pickIfIsString = _.pickIf(_.isType("String"));
 *
 * pickIfIsString(user) // => {name: "john", surname: "doe"}
 *
 * @memberof module:lamb
 * @category Object
 * @see {@link module:lamb.pick|pick}
 * @param {ObjectIteratorCallback} predicate
 * @param {Object} [predicateContext]
 * @returns {Function}
 */
function pickIf (predicate, predicateContext) {
    return function (source) {
        var result = {};

        for (var key in source) {
            if (predicate.call(predicateContext, source[key], key, source)) {
                result[key] = source[key];
            }
        }

        return result;
    };
}

/**
 * Creates a copy of the given object with its enumerable keys renamed as
 * indicated in the provided lookup table.
 * @example
 * var person = {"firstName": "John", "lastName": "Doe"};
 * var keysMap = {"firstName": "name", "lastName": "surname"};
 *
 * _.rename(person, keysMap) // => {"name": "John", "surname": "Doe"}
 *
 * @example <caption>It's safe using it to swap keys:</caption>
 * var keysMap = {"firstName": "lastName", "lastName": "firstName"};
 *
 * _.rename(person, keysMap) // => {"lastName": "John", "firstName": "Doe"}
 *
 * @memberof module:lamb
 * @category Object
 * @see {@link module:lamb.renameKeys|renameKeys}, {@link module:lamb.renameWith|renameWith}
 * @param {Object} source
 * @param {Object} keysMap
 * @returns {Object}
 */
function rename (source, keysMap) {
    keysMap = Object(keysMap);
    var result = {};
    var oldKeys = enumerables(source);

    for (var prop in keysMap) {
        if (~oldKeys.indexOf(prop)) {
            result[keysMap[prop]] = source[prop];
        }
    }

    for (var i = 0, len = oldKeys.length, key; i < len; i++) {
        key = oldKeys[i];

        if (!(key in keysMap || key in result)) {
            result[key] = source[key];
        }
    }

    return result;
}

/**
 * A curried version of {@link module:lamb.rename|rename} expecting a
 * <code>keysMap</code> to build a function waiting for the object to act upon.
 * @example
 * var persons = [
 *     {"firstName": "John", "lastName": "Doe"},
 *     {"first_name": "Mario", "last_name": "Rossi"},
 * ];
 * var normalizeKeys = _.renameKeys({
 *     "firstName": "name",
 *     "first_name": "name",
 *     "lastName": "surname",
 *     "last_name": "surname"
 * });
 *
 * persons.map(normalizeKeys) // => [{"name": "John", "surname": "Doe"}, {"name": "Mario", "surname": "Rossi"}]
 *
 * @memberof module:lamb
 * @category Object
 * @function
 * @see {@link module:lamb.rename|rename}, {@link module:lamb.renameWith|renameWith}
 * @param {Object} keysMap
 * @returns {Function}
 */
var renameKeys = _curry(rename, 2, true);

/**
 * Uses the provided function as a <code>keysMap</code> generator and returns
 * a function expecting the object whose keys we want to {@link module:lamb.rename|rename}.
 * @example
 * var person = {"NAME": "John", "SURNAME": "Doe"};
 * var makeLowerKeysMap = function (source) {
 *     var sourceKeys = _.keys(source);
 *     return _.make(sourceKeys, sourceKeys.map(_.invoker("toLowerCase")));
 * };
 * var lowerKeysFor = _.renameWith(makeLowerKeysMap);
 *
 * lowerKeysFor(person) // => {"name": "John", "surname": "doe"};
 *
 * @memberof module:lamb
 * @category Object
 * @see {@link module:lamb.rename|rename}, {@link module:lamb.renameKeys|renameKeys}
 * @param {Function} fn
 * @returns {Function}
 */
function renameWith (fn) {
    return function (source) {
        return rename(source, fn(source));
    };
}

/**
 * Returns a copy of the source object without the specified properties.
 * @example
 * var user = {name: "john", surname: "doe", age: 30};
 *
 * _.skip(user, ["name", "age"]) // => {surname: "doe"};
 * _.skip(user, ["name", "email"]) // => {surname: "doe", age: 30};
 *
 * @memberof module:lamb
 * @category Object
 * @see {@link module:lamb.skipIf|skipIf}
 * @param {Object} source
 * @param {String[]} blacklist
 * @returns {Object}
 */
function skip (source, blacklist) {
    var result = {};

    for (var key in source) {
        if (blacklist.indexOf(key) === -1) {
            result[key] = source[key];
        }
    }

    return result;
}

/**
 * Builds a function expecting an object whose properties will be checked against the given predicate.<br/>
 * The properties satisfying the predicate will be omitted in the resulting object.
 * @example
 * var user = {name: "john", surname: "doe", age: 30};
 * var skipIfIstring = _.skipIf(_.isType("String"));
 *
 * skipIfIstring(user) // => {age: 30}
 *
 * @memberof module:lamb
 * @category Object
 * @see {@link module:lamb.skip|skip}
 * @param {ObjectIteratorCallback} predicate
 * @param {Object} [predicateContext]
 * @returns {Function}
 */
function skipIf (predicate, predicateContext) {
    return pickIf(not(predicate), predicateContext);
}

/**
 * Tears an object apart by transforming it in an array of two lists: one containing its enumerable keys,
 * the other containing the corresponding values.<br/>
 * Although this "tearing apart" may sound as a rather violent process, the source object will be unharmed.<br/>
 * See also {@link module:lamb.tearOwn|tearOwn} for picking only the own enumerable properties and
 * {@link module:lamb.make|make} for the reverse operation.
 * @example
 * _.tear({a: 1, b: 2, c: 3}) // => [["a", "b", "c"], [1, 2, 3]]
 *
 * @memberof module:lamb
 * @category Object
 * @function
 * @param {Object} obj
 * @returns {Array<Array<String>, Array<*>>}
 */
var tear = _tearFrom(enumerables);

/**
 * Same as {@link module:lamb.tear|tear}, but only the own properties of the object are taken into account.<br/>
 * See also {@link module:lamb.make|make} for the reverse operation.
 * @example <caption>showing the difference with <code>tear</code></caption>
 * var baseFoo = Object.create({a: 1}, {b: {value: 2, enumerable: true}, z: {value: 5}});
 * var foo = Object.create(baseFoo, {
 *     c: {value: 3, enumerable: true}
 * });
 *
 * _.tear(foo) // => [["c", "b", "a"], [3, 2, 1]]
 * _.tearOwn(foo) // => [["c"], [3]]
 *
 * @memberof module:lamb
 * @category Object
 * @function
 * @param {Object} obj
 * @returns {Array<Array<String>, Array<*>>}
 */
var tearOwn = _tearFrom(keys);

/**
 * Validates an object with the given list of {@link module:lamb.checker|checker} functions.
 * @example
 * var hasContent = function (s) { return s.trim().length > 0; };
 * var isAdult = function (age) { return age >= 18; };
 * var userCheckers = [
 *     _.checker(hasContent, "Name is required", ["name"]),
 *     _.checker(hasContent, "Surname is required", ["surname"]),
 *     _.checker(isAdult, "Must be at least 18 years old", ["age"])
 * ];
 *
 * var user1 = {name: "john", surname: "doe", age: 30};
 * var user2 = {name: "jane", surname: "", age: 15};
 *
 * _.validate(user1, userCheckers) // => []
 * _.validate(user2, userCheckers) // => [["Surname is required", ["surname"]], ["Must be at least 18 years old", ["age"]]]
 *
 * @memberof module:lamb
 * @category Object
 * @see {@link module:lamb.validateWith|validateWith}
 * @see {@link module:lamb.checker|checker}
 * @param {Object} obj
 * @param {Function[]} checkers
 * @returns {Array<Array<String, String[]>>} An array of errors in the form returned by {@link module:lamb.checker|checker}, or an empty array.
 */
function validate (obj, checkers) {
    return checkers.reduce(function (errors, checker) {
        var result = checker(obj);
        result.length && errors.push(result);
        return errors;
    }, []);
}

/**
 * A curried version of {@link module:lamb.validate|validate} accepting a list of {@link module:lamb.checker|checkers} and
 * returning a function expecting the object to validate.
 * @example
 * var hasContent = function (s) { return s.trim().length > 0; };
 * var isAdult = function (age) { return age >= 18; };
 * var userCheckers = [
 *     _.checker(hasContent, "Name is required", ["name"]),
 *     _.checker(hasContent, "Surname is required", ["surname"]),
 *     _.checker(isAdult, "Must be at least 18 years old", ["age"])
 * ];
 * var validateUser = _.validateWith(userCheckers);
 *
 * var user1 = {name: "john", surname: "doe", age: 30};
 * var user2 = {name: "jane", surname: "", age: 15};
 *
 * validateUser(user1) // => []
 * validateUser(user2) // => [["Surname is required", ["surname"]], ["Must be at least 18 years old", ["age"]]]
 *
 * @memberof module:lamb
 * @category Object
 * @see {@link module:lamb.validate|validate}
 * @see {@link module:lamb.checker|checker}
 * @function
 * @param {Function[]} checkers
 * @returns {Function}
 */
var validateWith = _curry(validate, 2, true);

/**
 * Generates an array with the values of the enumerable properties of the given object.<br/>
 * See also {@link module:lamb.ownValues|ownValues} for picking only the own properties of the object.
 * @example
 * var user = {name: "john", surname: "doe", age: 30};
 *
 * _.values(user) // => ["john", "doe", 30]
 *
 * @memberof module:lamb
 * @category Object
 * @function
 * @param {Object} obj
 * @returns {Array}
 */
var values = _valuesFrom(enumerables);

lamb.checker = checker;
lamb.enumerables = enumerables;
lamb.fromPairs = fromPairs;
lamb.has = has;
lamb.hasKey = hasKey;
lamb.hasKeyValue = hasKeyValue;
lamb.hasOwn = hasOwn;
lamb.hasOwnKey = hasOwnKey;
lamb.immutable = immutable;
lamb.keys = keys;
lamb.make = make;
lamb.merge = merge;
lamb.mergeOwn = mergeOwn;
lamb.ownPairs = ownPairs;
lamb.ownValues = ownValues;
lamb.pairs = pairs;
lamb.pick = pick;
lamb.pickIf = pickIf;
lamb.rename = rename;
lamb.renameKeys = renameKeys;
lamb.renameWith = renameWith;
lamb.skip = skip;
lamb.skipIf = skipIf;
lamb.tear = tear;
lamb.tearOwn = tearOwn;
lamb.validate = validate;
lamb.validateWith = validateWith;
lamb.values = values;
