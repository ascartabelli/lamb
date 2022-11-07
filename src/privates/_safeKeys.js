import compose from "../core/compose";

/**
 * A null-safe version of <code>Object.keys</code>.
 * @private
 * @function
 * @param {Object} source
 * @returns {String[]}
 */
var _safeKeys = compose(Object.keys, Object);

export default _safeKeys;
