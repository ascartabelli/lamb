import identity from "../core/identity";
import _makeTypeErrorFor from "../privates/_makeTypeErrorFor";

/**
 * Creates a pipeline of functions, where each function consumes the result of the previous one.
 * @example
 * var __ = _.__;
 * var square = _.partial(Math.pow, [__, 2]);
 * var getMaxAndSquare = _.pipe([Math.max, square]);
 *
 * getMaxAndSquare(3, 5) // => 25
 *
 * @memberof module:lamb
 * @category Function
 * @function
 * @see {@link module:lamb.compose|compose}
 * @since 0.1.0
 * @param {Function[]} functions
 * @returns {Function}
 */
function pipe (functions) {
    if (!Array.isArray(functions)) {
        throw _makeTypeErrorFor(functions, "array");
    }

    var len = functions.length;

    return len ? function () {
        var result = functions[0].apply(this, arguments);

        for (var i = 1; i < len; i++) {
            result = functions[i].call(this, result);
        }

        return result;
    } : identity;
}

export default pipe;
