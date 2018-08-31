/**
 * If a method with the given name exists on the target, applies it to the provided
 * arguments and returns the result. Returns <code>undefined</code> otherwise.<br/>
 * The arguments for the method are built by concatenating the array of bound arguments,
 * optionally received by {@link module:lamb.invoker|invoker}, with the final set of, also
 * optional, <code>args</code>.
 * @private
 * @param {Array} boundArgs
 * @param {String} methodName
 * @param {Object} target
 * @param {...*} [args]
 * @returns {*}
 */
function _invoker (boundArgs, methodName, target) {
    var method = target[methodName];

    if (typeof method !== "function") {
        return void 0;
    }

    var boundArgsLen = boundArgs.length;
    var ofs = 3 - boundArgsLen;
    var len = arguments.length - ofs;
    var args = Array(len);

    for (var i = 0; i < boundArgsLen; i++) {
        args[i] = boundArgs[i];
    }

    for (; i < len; i++) {
        args[i] = arguments[i + ofs];
    }

    return method.apply(target, args);
}

export default _invoker;
