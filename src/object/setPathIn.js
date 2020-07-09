import isNil from "../core/isNil";
import _makeTypeErrorFor from "../privates/_makeTypeErrorFor";
import _setPathIn from "../privates/_setPathIn";
import _toPathParts from "../privates/_toPathParts";

/**
 * Allows to change a nested value in a copy of the provided object.<br/>
 * The function will delegate the "set action" to {@link module:lamb.setIn|setIn} or
 * {@link module:lamb.setAt|setAt} depending on the value encountered in the path,
 * so please refer to the documentation of those functions for specifics about the
 * implementation.<br/>
 * Note anyway that the distinction will be between <code>Array</code>s, delegated
 * to {@link module:lamb.setAt|setAt}, and everything else (including array-like objects),
 * which will be delegated to {@link module:lamb.setIn|setIn}.<br/>
 * As a result of that, array-like objects will be converted to objects having numbers as keys
 * and paths targeting non-object values will be converted to empty objects.<br/>
 * You can anyway target array elements using integers in the path, even negative ones, but
 * the priority will be given to existing, and enumerable, object keys.<br/>
 * Non-enumerable properties encountered in the path will be considered as non-existent properties.<br/>
 * Like {@link module:lamb.getPathIn|getPathIn} or {@link module:lamb.getPath|getPath} you can
 * use custom path separators.
 * @example
 * const user = {id: 1, status: {active : false, scores: [2, 4, 6]}};
 *
 * _.setPathIn(user, "status.active", true) // => {id: 1, status: {active : true, scores: [2, 4, 6]}}
 *
 * @example <caption>Targeting arrays:</caption>
 * _.setPathIn(user, "status.scores.0", 8) // => {id: 1, status: {active : false, scores: [8, 4, 6]}}
 *
 * // you can use negative indexes as well
 * _.setPathIn(user, "status.scores.-1", 8) // => {id: 1, status: {active : false, scores: [2, 4, 8]}}
 *
 * @example <caption>Arrays can also be part of the path and not necessarily its target:</caption>
 * const user = {
 *     id: 1,
 *     scores: [
 *         {value: 2, year: "2000"},
 *         {value: 4, year: "2001"},
 *         {value: 6, year: "2002"}
 *     ]
 * };
 *
 * const newUser = _.setPathIn(user, "scores.0.value", 8);
 * // "newUser" holds:
 * // {
 * //     id: 1,
 * //     scores: [
 * //         {value: 8, year: "2000"},
 * //         {value: 4, year: "2001"},
 * //         {value: 6, year: "2002"}
 * //     ]
 * // }
 *
 * @memberof module:lamb
 * @category Object
 * @see {@link module:lamb.setPath|setPath}
 * @see {@link module:lamb.setIn|setIn}, {@link module:lamb.setKey|setKey}
 * @since 0.20.0
 * @param {Object|Array} source
 * @param {String} path
 * @param {*} value
 * @param {String} [separator="."]
 * @returns {Object|Array}
 */
function setPathIn (source, path, value, separator) {
    if (isNil(source)) {
        throw _makeTypeErrorFor(source, "object");
    }

    return _setPathIn(source, _toPathParts(path, separator), value);
}

export default setPathIn;
