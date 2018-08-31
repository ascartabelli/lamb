/**
 * Accepts a list of sorting criteria with at least one element
 * and builds a function that compares two values with such criteria.
 * @private
 * @param {Sorter[]} criteria
 * @returns {Function}
 */
function _compareWith (criteria) {
    return function (a, b) {
        var len = criteria.length;
        var criterion = criteria[0];
        var result = criterion.compare(a.value, b.value);

        for (var i = 1; result === 0 && i < len; i++) {
            criterion = criteria[i];
            result = criterion.compare(a.value, b.value);
        }

        if (result === 0) {
            result = a.index - b.index;
        }

        return criterion.isDescending ? -result : result;
    };
}

export default _compareWith;
