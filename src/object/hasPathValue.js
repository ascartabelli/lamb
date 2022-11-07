import areSVZ from "../core/areSVZ";
import _getPathInfo from "../privates/_getPathInfo";
import _toPathParts from "../privates/_toPathParts";

/**
 * Builds a predicate to check if the given path exists in an sourceect and holds the desired value.<br/>
 * The value check is made with the ["SameValueZero" comparison]{@link module:lamb.areSVZ|areSVZ}.<br/>
 * Note that the function will check even non-enumerable properties.
 * @example
 * const user = {
 *     name: "John",
 *     surname: "Doe",
 *     personal: {
 *         age: 25,
 *         gender: "M"
 *     },
 *     scores: [
 *         {id: 1, value: 10, passed: false},
 *         {id: 2, value: 20, passed: false},
 *         {id: 3, value: 30, passed: true}
 *     ]
 * };
 *
 * const isMale = _.hasPathValue("personal.gender", "M");
 * const hasPassedFirstTest = _.hasPathValue("scores.0.passed", true);
 * const hasPassedLastTest = _.hasPathValue("scores.-1.passed", true);
 *
 * isMale(user) // => true
 * hasPassedFirstTest(user) // => false
 * hasPassedLastTest(user) // => true
 *
 * @memberof module:lamb
 * @category Object
 * @see {@link module:lamb.hasKeyValue|hasKeyValue}
 * @since 0.41.0
 * @param {String} path
 * @param {*} value
 * @param {String} [separator="."]
 * @returns {Function}
 */
function hasPathValue (path, value, separator) {
    return function (source) {
        var pathInfo = _getPathInfo(source, _toPathParts(path, separator), true);

        return pathInfo.isValid && areSVZ(pathInfo.target, value);
    };
}

export default hasPathValue;
