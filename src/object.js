
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
 * @param {String[]} keyPaths - The array of property names, or {@link module:lamb.getFromPath|paths}, to test.
 * @param {String} [pathSeparator="."]
 * @returns {Array<String, String[]>} An error in the form <code>["message", ["propertyA", "propertyB"]]</code> or an empty array.
 */
function checker (predicate, message, keyPaths, pathSeparator) {
    return function (obj) {
        var errors = [];
        var getValues = partial(getFromPath, obj, _, pathSeparator);

        return predicate.apply(obj, keyPaths.map(getValues)) ? [] : [message, keyPaths];
    };
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
 * Gets a nested property value from an object using the given path.<br/>
 * The path is a string with property names separated by dots by default, but
 * it can be defined with the optional third parameter.
 * @example
 * var user = {
 *     name: "John",
 *     surname: "Doe",
 *     login: {
 *         user.name: "jdoe",
 *         password: "abc123"
 *     }
 * };
 *
 * // same as _.get if no path is involved
 * _.getFromPath(user, "name") // => "John"
 *
 * _.getFromPath(user, "login.password") // => "abc123";
 * _.getFromPath(user, "login/user.name", "/") // => "jdoe"
 * _.getFromPath(user, "name.foo") // => undefined
 * _.getFromPath(user, "name.foo.bar") // => throws a TypeError
 *
 * @memberof module:lamb
 * @category Object
 * @param {Object|ArrayLike} obj
 * @param {String} path
 * @param {String} [separator="."]
 * @returns {*}
 */
function getFromPath (obj, path, separator) {
    return path.split(separator || ".").reduce(get, obj);
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
 * @example <caption>Comparison con <code>has</code>.</caption>
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
 * Generates an array with the values of the enumerable own properties of the given object.
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
    var keys = Object.keys(obj);
    var keysLen = keys.length;
    var result = [];

    for (var i = 0; i < keysLen; i++) {
        result[i] = obj[keys[i]];
    }

    return result;
}

lamb.checker = checker;
lamb.get = get;
lamb.getFromPath = getFromPath;
lamb.getKey = getKey;
lamb.has = has;
lamb.hasKey = hasKey;
lamb.hasKeyValue = hasKeyValue;
lamb.hasOwn = hasOwn;
lamb.hasOwnKey = hasOwnKey;
lamb.pick = pick;
lamb.pickIf = pickIf;
lamb.skip = skip;
lamb.skipIf = skipIf;
lamb.validate = validate;
lamb.validateWith = validateWith;
lamb.values = values;
