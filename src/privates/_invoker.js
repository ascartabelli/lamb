import _toArrayLength from "./_toArrayLength";

/**
 * If a method with the given name exists on the target, applies it to the provided
 * arguments and returns the result. Returns <code>undefined</code> otherwise.<br/>
 * The arguments for the method are built by concatenating the array of bound arguments,
 * received by {@link module:lamb.invoker|invoker}, with the final set of <code>args</code>,
 * if present.
 * @private
 * @param {String} methodName
 * @param {Array} boundArgs
 * @param {Object} target
 * @param {...*} [args]
 * @returns {*}
 */
function _invoker (methodName, boundArgs, target) {
    var method = target[methodName];

    if (typeof method !== "function") {
        return void 0;
    }

    var boundArgsLen = boundArgs ? _toArrayLength(boundArgs.length) : 0;
    var finalArgsLen = boundArgsLen + arguments.length - 3;
    var finalArgs = Array(finalArgsLen);

    for (var i = 0; i < boundArgsLen; i++) {
        finalArgs[i] = boundArgs[i];
    }

    for (var ofs = 3 - i; i < finalArgsLen; i++) {
        finalArgs[i] = arguments[i + ofs];
    }

    return method.apply(target, finalArgs);
}

export default _invoker;
