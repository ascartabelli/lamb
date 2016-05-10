
function _getNaturalIndex (index, len) {
    if (_isInteger(index) && _isInteger(len)) {
        return clamp(index, -len, len - 1) === index ? index < 0 ? index + len : index : void 0;
    }
}

function _getPathInfo (obj, parts) {
    var target = obj;
    var i = -1;
    var len = parts.length;
    var currentKey;
    var idx;

    while (++i < len) {
        currentKey = parts[i];

        if (_isIndex(target, currentKey)) {
            idx = _getNaturalIndex(+currentKey, target.length);

            if (isUndefined(idx)) {
                break;
            }

            target = target[idx];
        } else {
            if (!_isEnumerable(target, currentKey)) {
                break;
            }

            target = target[currentKey];
        }
    }

    return i === len ? {isValid: true, target: target} : {isValid: false, target: void 0};
}

function _isIndex (target, key) {
    return Array.isArray(target) && parseInt(key, 10) == key;
}

function _isEnumerable (obj, key) {
    return key in Object(obj) && (_isOwnEnumerable(obj, key) || ~_safeEnumerables(obj).indexOf(key));
}

function _isInteger (n) {
    return Math.floor(n) === n;
}

var _isOwnEnumerable = generic(_objectProto.propertyIsEnumerable);

function _setIndex (arrayLike, index, value, updater) {
    var result = slice(arrayLike);
    var idx = _getNaturalIndex(index, result.length);

    if (!isUndefined(idx)) {
        result[idx] = updater ? updater(arrayLike[idx]) : value;
    }

    return result;
}

function _setPathIn (obj, parts, value) {
    var key = parts[0];
    var v = parts.length === 1 ? value : _setPathIn(
        _getPathInfo(obj, [key]).target,
        parts.slice(1),
        value
    );

    return _isIndex(obj, key) ? _setIndex(obj, +key, v) : setIn(obj, key, v);
}

/**
 * A curried version of {@link module:lamb.getIndex|getIndex} that uses the provided index
 * to build a function expecting the array-like object holding the element we want to retrieve.
 * @example
 * var getFifthElement = _.getAt(4);
 *
 * getFifthElement([1, 2, 3, 4, 5]) // => 5
 * getFifthElement("foo bar") // => "b"
 * getFifthElement([]) // => undefined
 * getFifthElement("foo") // => undefined
 *
 * @example <caption>Using negative indexes</caption>
 * _.getAt(-2)([1, 2, 3]) // => 2
 * _.getAt(-3)("foo") // => "f"
 *
 * @memberof module:lamb
 * @category Array
 * @function
 * @see {@link module:lamb.getIndex|getIndex}
 * @see {@link module:lamb.head|head} and {@link module:lamb.last|last} for common use cases shortcuts.
 * @param {Number} index
 * @returns {Function}
 */
var getAt = _curry(getIndex, 2, true);

/**
 * Returns the value of the object property with the given key.
 * @example
 * var user = {name: "John"};
 *
 * _.getIn(user, "name") // => "John";
 * _.getIn(user, "surname") // => undefined
 *
 * @memberof module:lamb
 * @category Object
 * @see {@link module:lamb.getKey|getKey}
 * @see {@link module:lamb.getPath|getPath}, {@link module:lamb.getPathIn|getPathIn}
 * @param {Object} obj
 * @param {String} key
 * @returns {*}
 */
function getIn (obj, key) {
    return obj[key];
}

/**
 * Retrieves the element at the given index in an array-like object.<br/>
 * Like {@link module:lamb.slice|slice} the index can be negative.<br/>
 * If the index isn't supplied, or if its value isn't an integer within the array-like bounds,
 * the function will return <code>undefined</code>.<br/>
 * <code>getIndex</code> will throw an exception when receives <code>null</code> or
 * <code>undefined</code> in place of an array-like object, but returns <code>undefined</code>
 * for any other value.
 * @example
 * var arr = [1, 2, 3, 4, 5];
 *
 * _.getIndex(arr, 1) // => 2
 * _.getIndex(arr, -1) // => 5
 *
 * @memberof module:lamb
 * @category Array
 * @see {@link module:lamb.getAt|getAt}
 * @see {@link module:lamb.head|head} and {@link module:lamb.last|last} for common use cases shortcuts.
 * @param {ArrayLike} arrayLike
 * @param {Number} index
 * @returns {*}
 */
function getIndex (arrayLike, index) {
    var idx = _getNaturalIndex(index, arrayLike.length);
    return isUndefined(idx) ? idx : arrayLike[idx];
}

/**
 * A curried version of {@link module:lamb.getIn|getIn}.<br/>
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
 * @see {@link module:lamb.getIn|getIn}
 * @see {@link module:lamb.getPath|getPath}, {@link module:lamb.getPathIn|getPathIn}
 * @param {String} key
 * @returns {Function}
 */
var getKey = _curry(getIn, 2, true);

/**
 * Builds a partial application of {@link module:lamb.getPathIn|getPathIn} with the given
 * path and separator, expecting the object to act upon.<br/>
 * @example
 *  var user = {
 *     name: "John",
 *     surname: "Doe",
 *     login: {
 *         "user.name": "jdoe",
 *         password: "abc123"
 *     }
 * };
 *
 * var getPwd = _.getPath("login.password");
 * var getUsername = _.getPath("login/user.name", "/");
 *
 * getPwd(user) // => "abc123";
 * getUsername(user) // => "jdoe"
 *
 * @memberof module:lamb
 * @category Object
 * @see {@link module:lamb.getPathIn|getPathIn}
 * @see {@link module:lamb.getIn|getIn}, {@link module:lamb.getKey|getKey}
 * @param {String} path
 * @param {String} [separator="."]
 * @returns {Function}
 */
function getPath (path, separator) {
    return partial(getPathIn, _, path, separator);
}

/**
 * Gets a nested property value from an object using the given path.<br/>
 * The path is a string with property names separated by dots by default, but
 * it can be customised with the optional third parameter.<br/>
 * You can use integers in the path, even negative ones, to refer to array-like
 * object indexes, but the priority will be given to existing object keys:
 * the last example explains this particular case.
 * @example
 * var user = {
 *     name: "John",
 *     surname: "Doe",
 *     login: {
 *         "user.name": "jdoe",
 *         password: "abc123"
 *     },
 *     scores: [
 *         {id: 1, value: 10},
 *         {id: 2, value: 20},
 *         {id: 3, value: 30}
 *     ]
 * };
 *
 * _.getPathIn(user, "name") // => "John"
 * _.getPathIn(user, "login.password") // => "abc123";
 * _.getPathIn(user, "login/user.name", "/") // => "jdoe"
 * _.getPathIn(user, "name.foo") // => undefined
 * _.getPathIn(user, "name.foo.bar") // => undefined
 *
 * @example <caption>Accessing array-like objects indexes:</caption>
 * _.getPathIn(user, "login.password.1") // => "b"
 * _.getPathIn(user, "scores.0") // => {id: 1, value: 10}
 * _.getPathIn(user, "scores.-1.value") // => 30
 *
 * @example <caption>Priority will be given to existing object keys over indexes:</caption>
 * _.getPathIn(user, "scores.-1") // => {id: 3, value: 30}
 *
 * // let's do something funny
 * user.scores["-1"] = "foo bar";
 *
 * _.getPathIn(user, "scores.-1") // => "foo bar";
 *
 * @memberof module:lamb
 * @category Object
 * @see {@link module:lamb.getPath|getPath}
 * @see {@link module:lamb.getIn|getIn}, {@link module:lamb.getKey|getKey}
 * @param {Object|ArrayLike} obj
 * @param {String} path
 * @param {String} [separator="."]
 * @returns {*}
 */
function getPathIn (obj, path, separator) {
    return path.split(separator || ".").reduce(
        adapter(tapArgs(getIn, Object), tapArgs(getIndex, Object, Number)),
        obj
    );
}

/**
 * Retrieves the first element of an array-like object.<br/>
 * Just a common use case of {@link module:lamb.getAt|getAt} exposed for convenience.
 * @example
 * _.head([1, 2, 3]) // => 1
 * _.head("hello") // => "h"
 * _.head([]) // => undefined
 *
 * @memberof module:lamb
 * @category Array
 * @function
 * @see {@link module:lamb.last|last}
 * @see {@link module:lamb.getIndex|getIndex}, {@link module:lamb.getAt|getAt}
 * @param {ArrayLike} arrayLike
 * @returns {*}
 */
var head = getAt(0);

/**
 * Retrieves the last element of an array-like object.<br/>
 * Just a common use case of {@link module:lamb.getAt|getAt} exposed for convenience.
 * @example
 * _.last([1, 2, 3]) // => 3
 * _.last("hello") // => "o"
 * _.last([]) // => undefined
 *
 * @memberof module:lamb
 * @category Array
 * @function
 * @see {@link module:lamb.head|head}
 * @see {@link module:lamb.getIndex|getIndex}, {@link module:lamb.getAt|getAt}
 * @param {ArrayLike} arrayLike
 * @returns {*}
 */
var last = getAt(-1);

/**
 * Builds a function that creates a copy of an array-like object with the given
 * index changed to the desired value.<br/>
 * If the index is not an integer or if it's out of bounds, the function
 * will return a copy of the original array.<br/>
 * Negative indexes are allowed.
 * @example
 * var arr = [1, 2, 3, 4, 5];
 *
 * _.setAt(2, 99)(arr) // => [1, 2, 99, 4, 5]
 * arr // => [1, 2, 3, 4, 5]
 *
 * _.setAt(10, 99)(arr) // => [1, 2, 3, 4, 5] (not a reference to `arr`)
 *
 * @example <caption>Using negative indexes</caption>
 * _.setAt(-1, 99)(arr) // => [1, 2, 3, 4, 99]
 *
 * @memberof module:lamb
 * @category Array
 * @see {@link module:lamb.setIndex|setIndex}
 * @param {Number} index
 * @param {*} value
 * @returns {Function}
 */
function setAt (index, value) {
    return function (arrayLike) {
        return _setIndex(arrayLike, index, value);
    };
}

/**
 * Sets the specified key to the given value in a copy of the provided object.<br/>
 * All the enumerable keys of the source object will be simply copied to an empty
 * object without breaking references.<br/>
 * If the specified key is not part of the source object, it will be added to the
 * result.<br/>
 * The main purpose of the function is to work on simple plain objects used as
 * data structures, such as JSON objects, and makes no effort to play nice with
 * objects created from an OOP perspective (it's not worth it).<br/>
 * For example the prototype of the result will be <code>Object</code>'s regardless
 * of the <code>source</code>'s one.
 * @example
 * var user = {name: "John", surname: "Doe", age: 30};
 *
 * _.setIn(user, "name", "Jane") // => {name: "Jane", surname: "Doe", age: 30}
 * _.setIn(user, "gender", "male") // => {name: "John", surname: "Doe", age: 30, gender: "male"}
 *
 * // `user` still is {name: "John", surname: "Doe", age: 30}
 *
 * @memberof module:lamb
 * @category Object
 * @see {@link module:lamb.setKey|setKey}
 * @see {@link module:lamb.setPath|setPath}, {@link module:lamb.setPathIn|setPathIn}
 * @param {Object} source
 * @param {String} key
 * @param {*} value
 * @returns {Object}
 */
function setIn (source, key, value) {
    return _merge(_safeEnumerables, source, make([key], [value]));
}

/**
 * Creates a copy of an array-like object with the given index changed to
 * the desired value.<br/>
 * If the index is not an integer or if it's out of bounds, the function
 * will return a copy of the original array.<br/>
 * Negative indexes are allowed.
 * @example
 * var arr = [1, 2, 3];
 *
 * _.setIndex(arr, 1, 99) // => [1, 99, 3]
 * _.setIndex(arr, -1, 99) // => [1, 2, 99]
 * _.setIndex(arr, 10, 99) // => [1, 2, 3] (not a reference to `arr`)
 *
 * @memberof module:lamb
 * @category Array
 * @function
 * @see {@link module:lamb.setAt|setAt}
 * @param {ArrayLike} arrayLike
 * @param {Number} index
 * @param {*} value
 * @returns {*}
 */
var setIndex = aritize(_setIndex, 3);

/**
 * Builds a partial application of {@link module:lamb.setIn|setIn} with the provided
 * <code>key</code> and <code>value</code>.<br/>
 * The resulting function expects the object to act upon.<br/>
 * Please refer to {@link module:lamb.setIn|setIn}'s description for explanations about
 * how the copy of the source object is made.
 * @example
 * var user = {name: "John", surname: "Doe", age: 30};
 * var setAgeTo40 = _.setKey("age", 40);
 *
 * setAgeTo40(user) // => {name: "john", surname: "doe", age: 40}
 *
 * // `user` still is {name: "John", surname: "Doe", age: 30}
 *
 * @memberof module:lamb
 * @category Object
 * @see {@link module:lamb.setIn|setIn}
 * @see {@link module:lamb.setPath|setPath}, {@link module:lamb.setPathIn|setPathIn}
 * @param {String} key
 * @param {*} value
 * @returns {Function}
 */
function setKey (key, value) {
    return partial(setIn, _, key, value);
}

/**
 * Builds a partial application of {@link module:lamb.setPathIn|setPathIn} expecting the
 * object to act upon.<br/>
 * See {@link module:lamb.setPathIn|setPathIn} for more details and examples.
 * @example
 * var user = {id: 1, status: {active: false}};
 * var activate = _.setPath("status.active", true);
 *
 * activate(user) // => {id: 1, status: {active: true}}
 *
 * @memberof module:lamb
 * @category Object
 * @see {@link module:lamb.setPathIn|setPathIn}
 * @see {@link module:lamb.setIn|setIn}, {@link module:lamb.setKey|setKey}
 * @param {String} path
 * @param {*} value
 * @param {String} [separator="."]
 * @returns {Function}
 */
function setPath (path, value, separator) {
    return partial(setPathIn, _, path, value, separator);
}

/**
 * Allows to change a nested value in a copy of the provided object.<br/>
 * The function will delegate the "set action" to {@link module:lamb.setIn|setIn} or
 * {@link module:lamb.setAt|setAt} depending on the value encountered in the path,
 * so please refer to the documentation of those functions for specifics about the
 * implementation.<br/>
 * Note anyway that the distinction will be between <code>Array</code>s, delegated
 * to {@link module:lamb.setAt|setAt}, and everything else (including array-like objects),
 * which will be delegated to {@link module:lamb.setIn|setIn}.<br/>
 * As a result of that, array-like objects will be converted to objects having numbers as keys
 * and paths targeting non-object values will be converted to empty objects.<br/>
 * Non-enumerable properties encountered in the path will be considered as non-existent properties.<br/>
 * Like {@link module:lamb.getPathIn|getPathIn} or {@link module:lamb.getPath|getPath} you can
 * use custom path separators.
 * @example
 * var user = {id: 1, status: {active : false, scores: [2, 4, 6]}};
 *
 * _.setPathIn(user, "status.active", true) // => {id: 1, status: {active : true, scores: [2, 4, 6]}}
 *
 * @example <caption>Targeting arrays</caption>
 * _.setPathIn(user, "status.scores.0", 8) // => {id: 1, status: {active : false, scores: [8, 4, 6]}}
 *
 * // you can use negative indexes as well
 * _.setPathIn(user, "status.scores.-1", 8) // => {id: 1, status: {active : false, scores: [2, 4, 8]}}
 *
 * @example <caption>Arrays can also be part of the path and not necessarily its target</caption>
 * var user = {id: 1, scores: [
 *     {value: 2, year: "2000"},
 *     {value: 4, year: "2001"},
 *     {value: 6, year: "2002"}
 * ]};
 *
 * var newUser = _.setPathIn(user, "scores.0.value", 8);
 * // "newUser" holds:
 * // {id: 1, scores: [
 * //     {value: 8, year: "2000"},
 * //     {value: 4, year: "2001"},
 * //     {value: 6, year: "2002"}
 * // ]}
 *
 * @memberof module:lamb
 * @category Object
 * @see {@link module:lamb.setPath|setPath}
 * @see {@link module:lamb.setIn|setIn}, {@link module:lamb.setKey|setKey}
 * @param {Object|Array} source
 * @param {String} path
 * @param {*} value
 * @param {String} [separator="."]
 * @returns {Object|Array}
 */
function setPathIn (source, path, value, separator) {
    return _setPathIn(source, path.split(separator || "."), value);
}

/**
 * Builds a function that creates a copy of an array-like object with the given index
 * changed by applying the provided function to its value.<br/>
 * If the index is not an integer or if it's out of bounds, the function will return
 * a copy of the original array.<br/>
 * Negative indexes are allowed.
 * @example
 * var arr = ["a", "b", "c"];
 * var toUpperCase = _.invoker("toUpperCase");
 *
 * _.updateAt(1, toUpperCase)(arr) // => ["a", "B", "c"]
 * _.updateAt(-1, toUpperCase)(arr) // => ["a", "b", "C"]
 * _.updateAt(10, toUpperCase)(arr) // => ["a", "b", "c"] (not a reference to `arr`)
 *
 * @memberof module:lamb
 * @category Array
 * @see {@link module:lamb.updateIndex|updateIndex}
 * @param {Number} index
 * @param {Function} updater
 * @returns {Function}
 */
function updateAt (index, updater) {
    return function (arrayLike) {
        return _setIndex(arrayLike, index, null, updater);
    };
}

/**
 * Creates a copy of the given object having the desired key value updated by applying
 * the provided function to it.<br/>
 * This function is meant for updating existing enumerable properties, and for those it
 * will delegate the "set action" to {@link module:lamb.setIn|setIn}; a copy of the
 * <code>source</code> is returned otherwise.
 * @example
 * var user = {name: "John", visits: 2};
 * var toUpperCase = _.invoker("toUpperCase");
 *
 * _.updateIn(user, "name", toUpperCase) // => {name: "JOHN", visits: 2}
 * _.updateIn(user, "surname", toUpperCase) // => {name: "John", visits: 2}
 *
 * @example <caption>Non-enumerable properties will be treated as non-existent:</caption>
 * var user = Object.create({name: "John"}, {visits: {value: 2}});
 * var increment = _.partial(_.add, 1);
 *
 * _.updateIn(user, "visits", increment) // => {name: "John", visits: 2}
 *
 * @memberof module:lamb
 * @category Object
 * @see {@link module:lamb.updateKey|updateKey}
 * @see {@link module:lamb.updatePath|updatePath}, {@link module:lamb.updatePathIn|updatePathIn}
 * @param {Object} source
 * @param {String} key
 * @param {Function} updater
 * @returns {Object}
 */
function updateIn (source, key, updater) {
    return _isEnumerable(source, key) ? setIn(source, key, updater(source[key])) : _merge(_safeEnumerables, source);
}

/**
 * Creates a copy of an array-like object with the given index changed by applying the
 * provided function to its value.<br/>
 * If the index is not an integer or if it's out of bounds, the function will return
 * a copy of the original array.<br/>
 * Negative indexes are allowed.
 * @example
 * var arr = ["a", "b", "c"];
 * var toUpperCase = _.invoker("toUpperCase");
 *
 * _.updateIndex(arr, 1, toUpperCase) // => ["a", "B", "c"]
 * _.updateIndex(arr, -1, toUpperCase) // => ["a", "b", "C"]
 * _.updateIndex(arr, 10, toUpperCase) // => ["a", "b", "c"] (not a reference to `arr`)
 *
 * @memberof module:lamb
 * @category Array
 * @function
 * @see {@link module:lamb.updateAt|updateAt}
 * @param {ArrayLike} arrayLike
 * @param {Number} index
 * @param {Function} updater
 * @returns {Array}
 */
var updateIndex = partial(_setIndex, _, _, null);

/**
 * Builds a partial application of {@link module:lamb.updateIn|updateIn} with the provided
 * <code>key</code> and <code>updater</code>, expecting the object to act upon.
 * @example
 * var user = {name: "John", visits: 2};
 * var increment = _.partial(_.add, 1);
 * var incrementVisits = _.updateKey("visits", increment);
 *
 * incrementVisits(user) // => {name: "John", visits: 3}
 *
 * @memberof module:lamb
 * @category Object
 * @see {@link module:lamb.updateIn|updateIn}
 * @see {@link module:lamb.updatePath|updatePath}, {@link module:lamb.updatePathIn|updatePathIn}
 * @param {String} key
 * @param {Function} updater
 * @returns {Function}
 */
function updateKey (key, updater) {
    return partial(updateIn, _, key, updater);
}

/**
 * Builds a partial application of {@link module:lamb.updateIn|updateIn} expecting the object to act upon.
 * @example
 * var user = {id: 1, status: {scores: [2, 4, 6], visits: 0}};
 * var increment = _.partial(_.add, 1);
 * var incrementScores = _.updatePath("status.scores", _.mapWith(increment))
 *
 * incrementScores(user) // => {id: 1, status: {scores: [3, 5, 7], visits: 0}}
 *
 * @memberof module:lamb
 * @category Object
 * @see {@link module:lamb.updatePathIn|updatePathIn}
 * @see {@link module:lamb.updateIn|updateIn}, {@link module:lamb.updateKey|updateKey}
 * @param {String} path
 * @param {Function} updater
 * @param {String} [separator="."]
 * @returns {Function}
 */
function updatePath (path, updater, separator) {
    return partial(updatePathIn, _, path, updater, separator);
}

/**
 * Allows to change a nested value in a copy of the given object by applying the provided
 * function to it.<br/>
 * This function is meant for updating existing enumerable properties, and for those it
 * will delegate the "set action" to {@link module:lamb.setPathIn|setPathIn}; a copy of the
 * <code>source</code> is returned otherwise.<br/>
 * Like the other "path" functions, negative indexes can be used to access array elements.
 * @example
 * var user = {id: 1, status: {scores: [2, 4, 6], visits: 0}};
 * var increment = _.partial(_.add, 1);
 *
 * _.updatePathIn(user, "status.visits", increment) // => {id: 1, status: {scores: [2, 4, 6]}, visits: 1}
 *
 * @example <caption>Targeting arrays</caption>
 * _.updatePathIn(user, "status.scores.0", increment) // => {id: 1, status: {scores: [3, 4, 6], visits: 0}}
 *
 * // you can use negative indexes as well
 * _.updatePathIn(user, "status.scores.-1", increment) // => {id: 1, status: {scores: [2, 4, 7], visits: 0}}
 *
 * @example <caption>Arrays can also be part of the path and not necessarily its target</caption>
 * var user = {id: 1, scores: [
 *     {value: 2, year: "2000"},
 *     {value: 4, year: "2001"},
 *     {value: 6, year: "2002"}
 * ]};
 *
 * var newUser = _.updatePathIn(user, "scores.0.value", increment);
 * // "newUser" holds:
 * // {id: 1, scores: [
 * //     {value: 3, year: "2000"},
 * //     {value: 4, year: "2001"},
 * //     {value: 6, year: "2002"}
 * // ]}
 *
 * @memberof module:lamb
 * @category Object
 * @see {@link module:lamb.updatePath|updatePath}
 * @see {@link module:lamb.updateIn|updateIn}, {@link module:lamb.updateKey|updateKey}
 * @param {Object|Array} source
 * @param {String} path
 * @param {Function} updater
 * @param {String} [separator="."]
 * @returns {Object|Array}
 */
function updatePathIn (source, path, updater, separator) {
    var parts = path.split(separator || ".");
    var pathInfo = _getPathInfo(source, parts);

    if (pathInfo.isValid) {
        return _setPathIn(source, parts, updater(pathInfo.target));
    } else {
        return Array.isArray(source) ? slice(source) : _merge(_safeEnumerables, source);
    }
}

lamb.getAt = getAt;
lamb.getIn = getIn;
lamb.getIndex = getIndex;
lamb.getKey = getKey;
lamb.getPath = getPath;
lamb.getPathIn = getPathIn;
lamb.head = head;
lamb.last = last;
lamb.setAt = setAt;
lamb.setIn = setIn;
lamb.setIndex = setIndex;
lamb.setKey = setKey;
lamb.setPath = setPath;
lamb.setPathIn = setPathIn;
lamb.updateAt = updateAt;
lamb.updateIn = updateIn;
lamb.updateIndex = updateIndex;
lamb.updateKey = updateKey;
lamb.updatePath = updatePath;
lamb.updatePathIn = updatePathIn;
