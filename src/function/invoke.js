import _invoke from "../privates/_invoke";
import partial from "../core/partial";

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
 * @example <caption>Basic polymorphism with <code>invoke</code>:</caption>
 * const polySlice = _.invoke("slice");
 *
 * polySlice([1, 2, 3, 4, 5], 1, 3) // => [2, 3]
 * polySlice("Hello world", 1, 3) // => "el"
 *
 * @example <caption>With bound arguments:</caption>
 * const substringFrom2 = _.invoke("substring", [2]);
 *
 * substringFrom2("Hello world") // => "llo world"
 * substringFrom2("Hello world", 5) // => "llo"
 *
 * @memberof module:lamb
 * @category Function
 * @see {@link module:lamb.invokeOn|invokeOn}
 * @since 0.1.0
 * @param {String} methodName
 * @param {ArrayLike} [boundArgs=[]]
 * @returns {Function}
 */
function invoke (methodName, boundArgs) {
    return partial(_invoke, [methodName, boundArgs]);
}

export default invoke;
