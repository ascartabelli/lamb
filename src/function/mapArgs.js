import mapWith from "../core/mapWith";
import list from "../array/list";
import apply from "./apply";
import pipe from "./pipe";

/**
 * Builds a function that allows to map over the received arguments before applying them
 * to the original one.
 * @example
 * const sumArray = _.reduceWith(_.sum);
 * const sumArgs = _.compose(sumArray, _.list);
 *
 * sumArgs(1, 2, 3, 4, 5) // => 15
 *
 * const square = n => n ** 2;
 * const sumSquares = _.mapArgs(sumArgs, square);
 *
 * sumSquares(1, 2, 3, 4, 5) // => 55
 *
 * @memberof module:lamb
 * @category Function
 * @see {@link module:lamb.tapArgs|tapArgs}
 * @since 0.3.0
 * @param {Function} fn
 * @param {ListIteratorCallback} mapper
 * @returns {Function}
 */
function mapArgs (fn, mapper) {
    return pipe([list, mapWith(mapper), apply(fn)]);
}

export default mapArgs;
