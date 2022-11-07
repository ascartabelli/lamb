import areSVZ from "../core/areSVZ";
import isUndefined from "../core/isUndefined";
import has from "./has";

/**
 * Builds a predicate expecting an object to check against the given key / value pair.<br/>
 * The value check is made with the ["SameValueZero" comparison]{@link module:lamb.areSVZ|areSVZ}.
 * @example
 * const hasTheCorrectAnswer = _.hasKeyValue("answer", 42);
 *
 * hasTheCorrectAnswer({answer: 2}) // false
 * hasTheCorrectAnswer({answer: 42}) // true
 *
 * @memberof module:lamb
 * @category Object
 * @see {@link module:lamb.hasPathValue|hasPathValue}
 * @since 0.1.0
 * @param {String} key
 * @param {*} value
 * @returns {Function}
 */
function hasKeyValue (key, value) {
    return function (source) {
        return isUndefined(value)
            ? has(source, key) && source[key] === value
            : areSVZ(value, source[key]);
    };
}

export default hasKeyValue;
