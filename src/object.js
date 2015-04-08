
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
 * user.login.passwordConfirm = "avc123";
 *
 * pwdMatch(user) // => ["Passwords don't match", ["login.password", "login.passwordConfirm"]]
 *
 * @memberof module:lamb
 * @category Object
 * @param {Function} predicate - The predicate to test the object properties
 * @param {String} message - The error message
 * @param {String[]} keyPaths - The array of property names, or {@link module:lamb.getWithPath|paths}, to test.
 * @param {String} [pathSeparator="."]
 * @returns {Array<String, String[]>} An error in the form <code>["message", ["propertyA", "propertyB"]]</code> or an empty array.
 */
function checker (predicate, message, keyPaths, pathSeparator) {
    return function (obj) {
        var errors = [];
        var getValues = partial(getWithPath, obj, _, pathSeparator);

        return predicate.apply(obj, keyPaths.map(getValues)) ? [] : [message, keyPaths];
    };
}

/**
 * Builds an object from a list of key / value pairs like the one
 * returned by [pairs]{@link module:lamb.pairs}.<br/>
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

    pairsList.forEach(function (pair) {
        result[pair[0]] = pair[1];
    });

    return result;
}

/**
 * Returns the value of the object property with the given key.
 * @example
 * var user {name: "John"};
 *
 * _.get(user, "name") // => "John";
 * _.get(user, "surname") // => undefined
 *
 * @memberof module:lamb
 * @category Object
 * @param {Object} obj
 * @param {String} key
 * @returns {*}
 */
function get (obj, key) {
    return obj[key];
}

/**
 * A curried version of {@link module:lamb.get|get}.<br/>
 * Receives a property name and builds a function expecting the object from which we want to retrieve the property.
 * @example
 * var user1 = {name: "john"};
 * var user2 = {name: "jane"};
 * var getName = _.getKey("name");
 *
 * getName(user1) // => "john"
 * getName(user2) // => "jane"
 *
 * @memberof module:lamb
 * @category Object
 * @function
 * @param {String} key
 * @returns {Function}
 */
var getKey = _curry(get, 2, true);

/**
 * Gets a nested property value from an object using the given path.<br/>
 * The path is a string with property names separated by dots by default, but
 * it can be customised with the optional third parameter.
 * @example
 * var user = {
 *     name: "John",
 *     surname: "Doe",
 *     login: {
 *         "user.name": "jdoe",
 *         password: "abc123"
 *     }
 * };
 *
 * // same as _.get if no path is involved
 * _.getWithPath(user, "name") // => "John"
 *
 * _.getWithPath(user, "login.password") // => "abc123";
 * _.getWithPath(user, "login/user.name", "/") // => "jdoe"
 * _.getWithPath(user, "name.foo") // => undefined
 * _.getWithPath(user, "name.foo.bar") // => throws a TypeError
 *
 * @memberof module:lamb
 * @category Object
 * @param {Object|ArrayLike} obj
 * @param {String} path
 * @param {String} [separator="."]
 * @returns {*}
 */
function getWithPath (obj, path, separator) {
    return path.split(separator || ".").reduce(get, obj);
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
 * @function
 * @param {String} key
 * @returns {Function}
 */
var hasKey = _curry(has, 2, true);

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
 * @function
 * @param {String} key
 * @returns {Function}
 */
var hasOwnKey = _curry(hasOwn, 2, true);

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
 * // Any of these statements will fail and possibly
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
 * Builds an object from the two given lists, using the first one as keys and the last one as values.<br/>
 * If the list of keys is longer than the values one, the keys will be created with <code>undefined</code> values.<br/>
 * If more values than keys are supplied, the extra values will be ignored.<br/>
 * See also [tear]{@link module:lamb.tear} for the reverse operation.
 * @example
 * _.make(["a", "b", "c"], [1, 2, 3]) // => {a: 1, b: 2, c: 3}
 * _.make(["a", "b", "c"], [1, 2]) // => {a: 1, b: 2, c: undefined}
 * _.make(["a", "b"], [1, 2, 3]) // => {a: 1, b: 2}
 * _.make([null, void 0, 2], [1, 2, 3]) // => {"null": 1, "undefined": 2, "2": 3}
 *
 * @memberof module:lamb
 * @category Object
 * @param {String[]} keys
 * @param {Array} values
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
 * In case of key homonymy each source has precedence over the previous one.
 * @example
 * _.merge({a: 1}, {b: 3, c: 4}, {b: 5}) // => {a: 1, b: 5, c: 4}
 *
 * @memberof module:lamb
 * @category Object
 * @param {...Object} source
 * @returns {Object}
 */
function merge () {
    var result = {};

    _.forEach(arguments, function (source) {
        for (var key in source) {
            result[key] = source[key];
        }
    });

    return result;
}

/**
 * Converts an object into an array of key / value pairs of its enumerable properties.<br/>
 * See also [fromPairs]{@link module:lamb.fromPairs} for the reverse operation.
 * @example
 * _.pairs({a: 1, b: 2, c: 3}) // => [["a", 1], ["b", 2], ["c", 3]]
 *
 * @memberof module:lamb
 * @category Object
 * @param {Object} obj
 * @returns {Array<Array<String, *>>}
 */
function pairs (obj) {
    var result = [];

    for (var prop in obj) {
        result.push([prop, obj[prop]]);
    }

    return result;
}

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
 * var pickIfIstring = _.pickIf(_.isType("String"));
 *
 * pickIfIstring(user) // => {name: "john", surname: "doe"}
 *
 * @memberof module:lamb
 * @category Object
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
 * Returns a copy of the source object without the specified properties.
 * @example
 * var user = {name: "john", surname: "doe", age: 30};
 *
 * _.skip(user, ["name", "age"]) // => {surname: "doe"};
 * _.skip(user, ["name", "email"]) // => {surname: "doe", age: 30};
 *
 * @memberof module:lamb
 * @category Object
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
 * See also [make]{@link module:lamb.make} for the reverse operation.
 * @example
 * _.tear({a: 1, b: 2, c: 3}) // => [["a", "b", "c"], [1, 2, 3]]
 *
 * @memberof module:lamb
 * @category Object
 * @param {Object} obj
 * @returns {Array<Array<String>, Array<*>>}
 */
function tear (obj) {
    var keys = [];
    var values = [];

    for (var prop in obj) {
        keys.push(prop);
        values.push(obj[prop]);
    }

    return [keys, values];
}

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
 * @function
 * @param {Function[]} checkers
 * @returns {Function}
 */
var validateWith = _curry(validate, 2, true);

/**
 * Generates an array with the values of the enumerable properties of the given object.
 * @example
 * var user = {name: "john", surname: "doe", age: 30};
 *
 * _.values(user) // => ["john", "doe", 30]
 *
 * @memberof module:lamb
 * @category Object
 * @param {Object} obj
 * @returns {Array}
 */
function values (obj) {
    var result = [];

    for(var prop in obj) {
        result.push(obj[prop]);
    }

    return result;
}

lamb.checker = checker;
lamb.fromPairs = fromPairs;
lamb.get = get;
lamb.getKey = getKey;
lamb.getWithPath = getWithPath;
lamb.has = has;
lamb.hasKey = hasKey;
lamb.hasKeyValue = hasKeyValue;
lamb.hasOwn = hasOwn;
lamb.hasOwnKey = hasOwnKey;
lamb.immutable = immutable;
lamb.make = make;
lamb.merge = merge;
lamb.pairs = pairs;
lamb.pick = pick;
lamb.pickIf = pickIf;
lamb.skip = skip;
lamb.skipIf = skipIf;
lamb.tear = tear;
lamb.validate = validate;
lamb.validateWith = validateWith;
lamb.values = values;
