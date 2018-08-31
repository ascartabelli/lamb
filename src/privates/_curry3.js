/**
 * Curries a function of arity 3.
 * @private
 * @param {Function} fn
 * @param {Boolean} [isRightCurry=false]
 * @returns {Function}
 */
function _curry3 (fn, isRightCurry) {
    return function (a) {
        return function (b) {
            return function (c) {
                return isRightCurry ? fn.call(this, c, b, a) : fn.call(this, a, b, c);
            };
        };
    };
}

export default _curry3;
