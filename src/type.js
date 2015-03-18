
/**
 * Verifies if a value is <code>null</code> or <code>undefined</code>.
 * @example
 * _.isNil(NaN) // => false
 * _.isNil({}) // => false
 * _.isNil(null) // => true
 * _.isNil(void 0) // => true
 * _.isNil() // => true
 *
 * @memberof module:lamb
 * @category Type
 * @function
 * @param {*} value
 * @returns {Boolean}
 */
var isNil = anyOf(isNull, isUndefined);

/**
 * Verifies if a value is <code>null</code>.
 * @example
 * _.isNull(null) // => true
 * _.isNull(void 0) // => false
 * _.isNull(false) // => false
 *
 * @memberof module:lamb
 * @category Type
 * @param {*} value
 * @returns {Boolean}
 */
function isNull (value) {
    return value === null;
}

/**
 * Builds a predicate that expects a value to check against the specified type.
 * @example
 * var isString = _.isType("String");
 *
 * isString("Hello") // => true
 * isString(new String("Hi")) // => true
 *
 * @memberof module:lamb
 * @category Type
 * @param {String} type
 * @returns {Function}
 */
function isType (type) {
    return function (value) {
        return typeOf(value) === type;
    };
}

/**
 * Verifies if a value is <code>undefined</code>.
 * @example
 * _.isUndefined(null) // => false
 * _.isUndefined(void 0) // => true
 * _.isUndefined(false) // => false
 *
 * @memberof module:lamb
 * @category Type
 * @param {*} value
 * @returns {Boolean}
 */
function isUndefined (value) {
    // using void because undefined could be theoretically shadowed
    return value === void 0;
}

/**
 * Retrieves the "type tag" from the given value.
 * @example
 * _.typeOf(Object.prototype.toString) // => "Function"
 * _.typeOf(/a/) // => "RegExp"
 *
 * @memberof module:lamb
 * @category Type
 * @param {*} value
 * @returns {String}
 */
function typeOf (value) {
    return _objectProto.toString.call(value).replace(/^\[\w+\s+|\]$/g, "");
}

lamb.isNil = isNil;
lamb.isNull = isNull;
lamb.isType = isType;
lamb.isUndefined = isUndefined;
lamb.typeOf = typeOf;
