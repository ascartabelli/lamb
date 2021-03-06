import compose from "../core/compose";
import not from "../logic/not";
import pickIf from "./pickIf";

/**
 * Builds a function expecting an object whose enumerable properties will be checked
 * against the given predicate.<br/>
 * The properties satisfying the predicate will be omitted in the resulting object.
 * @example
 * const user = {name: "john", surname: "doe", age: 30};
 * const skipIfIstring = _.skipIf(_.isType("String"));
 *
 * skipIfIstring(user) // => {age: 30}
 *
 * @memberof module:lamb
 * @category Object
 * @function
 * @see {@link module:lamb.skipIn|skipIn}, {@link module:lamb.skip|skip}
 * @see {@link module:lamb.pickIn|pickIn}, {@link module:lamb.pick|pick},
 * {@link module:lamb.pickIf|pickIf}
 * @since 0.1.0
 * @param {ObjectIteratorCallback} predicate
 * @returns {Function}
 */
var skipIf = compose(pickIf, not);

export default skipIf;
