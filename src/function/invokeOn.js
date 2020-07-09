import __ from "../core/__";
import partial from "../core/partial";
import _invoke from "../privates/_invoke";

/**
 * Accepts an object and builds a function expecting a method name, and optionally arguments,
 * to call on such object.
 * Like {@link module:lamb.invoke|invoke}, if no method with the given name is found the
 * function will return <code>undefined</code>.
 * @example
 * const isEven = n => n % 2 === 0;
 * const arr = [1, 2, 3, 4, 5];
 * const invokeOnArr = _.invokeOn(arr);
 *
 * invokeOnArr("filter", isEven) // => [2, 4]
 * invokeOnArr("slice", 1, 3) // => [2, 3]
 *
 * @memberof module:lamb
 * @category Function
 * @see {@link module:lamb.invoke|invoke}
 * @since 0.15.0
 * @param {Object} target
 * @returns {Function}
 */
function invokeOn (target) {
    return partial(_invoke, [__, [], target]);
}

export default invokeOn;
