import areSVZ from "../core/areSVZ";

/**
 * The default comparer for sorting functions.<br/>
 * If the given values are of different types they
 * will be both converted to strings.<br/>
 * Uses the SameValueZero comparison.
 * @private
 * @param {*} a
 * @param {*} b
 * @returns {Number} -1 | 0 | 1
 */
function _comparer (a, b) {
    var result = 0;

    if (typeof a !== typeof b) {
        a = String(a);
        b = String(b);
    }

    if (!areSVZ(a, b)) {
        // eslint-disable-next-line no-self-compare
        result = a > b || a !== a ? 1 : -1;
    }

    return result;
}

export default _comparer;
