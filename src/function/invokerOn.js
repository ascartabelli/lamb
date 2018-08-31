import __ from "../core/__";
import partial from "../core/partial";
import _invoker from "../privates/_invoker";

/**
 * Accepts an object and builds a function expecting a method name, and optionally arguments,
 * to call on such object.
 * Like {@link module:lamb.invoker|invoker}, if no method with the given name is found the
 * function will return <code>undefined</code>.
 * @example
 * var isEven = function (n) { return n % 2 === 0; };
 * var arr = [1, 2, 3, 4, 5];
 * var invokerOnArr = _.invokerOn(arr);
 *
 * invokerOnArr("filter", isEven) // => [2, 4]
 * invokerOnArr("slice", 1, 3) // => [2, 3]
 *
 * @memberof module:lamb
 * @category Function
 * @see {@link module:lamb.invoker|invoker}
 * @since 0.15.0
 * @param {Object} target
 * @returns {Function}
 */
function invokerOn (target) {
    return partial(_invoker, [[], __, target]);
}

export default invokerOn;
