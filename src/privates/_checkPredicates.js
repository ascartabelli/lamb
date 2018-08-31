import _makeTypeErrorFor from "./_makeTypeErrorFor";

/**
 * Creates a function to check the given predicates.<br/>
 * Used to build the {@link module:lamb.allOf|allOf} and the
 * {@link module:lamb.anyOf|anyOf} functions.
 * @private
 * @param {Boolean} checkAll
 * @returns {Function}
 */
function _checkPredicates (checkAll) {
    return function (predicates) {
        if (!Array.isArray(predicates)) {
            throw _makeTypeErrorFor(predicates, "array");
        }

        return function () {
            for (var i = 0, len = predicates.length, result; i < len; i++) {
                result = predicates[i].apply(this, arguments);

                if (checkAll && !result) {
                    return false;
                } else if (!checkAll && result) {
                    return true;
                }
            }

            return checkAll;
        };
    };
}

export default _checkPredicates;
