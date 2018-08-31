import partial from "../core/partial";
import _argsTail from "../privates/_argsTail";
import _invoker from "../privates/_invoker";

/**
 * Builds a function that will invoke the given method name on any received object and
 * return the result. If no method with such name is found the function will return
 * <code>undefined</code>.<br/>
 * Along with the method name it's possible to supply some arguments that will be bound to the
 * method call. Further arguments can also be passed when the function is actually called, and
 * they will be concatenated to the bound ones.<br/>
 * Returning <code>undefined</code> is a behaviour meant to quickly create a case for
 * {@link module:lamb.adapter|adapter} without the need to check for the existence of the
 * desired method.<br/>
 * See also {@link module:lamb.generic|generic} to create functions out of object methods.
 * @example <caption>Basic polymorphism with <code>invoker</code>:</caption>
 * var polySlice = _.invoker("slice");
 *
 * polySlice([1, 2, 3, 4, 5], 1, 3) // => [2, 3]
 * polySlice("Hello world", 1, 3) // => "el"
 *
 * @example <caption>With bound arguments:</caption>
 * var substrFrom2 = _.invoker("substr", 2);
 * substrFrom2("Hello world") // => "llo world"
 * substrFrom2("Hello world", 5) // => "llo w"
 *
 * @memberof module:lamb
 * @category Function
 * @see {@link module:lamb.invokerOn|invokerOn}
 * @since 0.1.0
 * @param {String} methodName
 * @param {...*} [boundArg]
 * @returns {Function}
 */
function invoker (methodName) {
    return partial(_invoker, [_argsTail.apply(null, arguments), methodName]);
}

export default invoker;
