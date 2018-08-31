import list from "../array/list";

/**
 * Returns a function that applies the original function with the arguments in reverse order.
 * @example
 * _.list(1, 2, 3) // => [1, 2, 3]
 * _.flip(_.list)(1, 2, 3) // => [3, 2, 1]
 *
 * @memberof module:lamb
 * @category Function
 * @since 0.1.0
 * @param {Function} fn
 * @returns {Function}
 */
function flip (fn) {
    return function () {
        var args = list.apply(null, arguments).reverse();

        return fn.apply(this, args);
    };
}

export default flip;
