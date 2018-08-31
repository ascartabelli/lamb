import __ from "../core/__";
import binary from "../core/binary";
import partial from "../core/partial";

/**
 * Builds a partial application of a ternary function so that its first parameter
 * is expected as the last one.<br/>
 * The <code>shouldAritize</code> parameter is for the "reduce" functions, where
 * the absence of the <code>initialValue</code> transforms a "fold" operation into a
 * "reduce" one.
 * @private
 * @param {Function} fn
 * @param {Boolean} shouldAritize
 * @returns {Function}
 */
function _makePartial3 (fn, shouldAritize) {
    return function (a, b) {
        var f = shouldAritize && arguments.length !== 2 ? binary(fn) : fn;

        return partial(f, [__, a, b]);
    };
}

export default _makePartial3;
