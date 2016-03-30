
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
 * @see {@link module:lamb.isNull|isNull} and {@link module:lamb.isNull|isUndefined} for individual checks.
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
 * @see {@link module:lamb.isNil|isNil} if you want to check for <code>undefined</code> too.
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
 * @see {@link module:lamb.type|type}
 * @param {String} typeTag
 * @returns {Function}
 */
function isType (typeName) {
    return function (value) {
        return type(value) === typeName;
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
 * @see {@link module:lamb.isNil|isNil} if you want to check for <code>null</code> too.
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
 * var x = 5;
 * var y = new Number(5);
 *
 * typeof x // => "number"
 * typeof y // => "object"
 * _.type(x) // => "Number"
 * _.type(y) // => "Number"
 *
 * _.type(Object.prototype.toString) // => "Function"
 * _.type(/a/) // => "RegExp"
 *
 * @memberof module:lamb
 * @category Type
 * @see {@link module:lamb.isType|isType}
 * @param {*} value
 * @returns {String}
 */
function type (value) {
    return _objectProto.toString.call(value).replace(/^\[\w+\s+|\]$/g, "");
}

lamb.isNil = isNil;
lamb.isNull = isNull;
lamb.isType = isType;
lamb.isUndefined = isUndefined;
lamb.type = type;
