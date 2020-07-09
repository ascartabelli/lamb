import _curry2 from "../privates/_curry2";
import pickIn from "./pickIn";

/**
 * A curried version of {@link module:lamb.pickIn|pickIn}, expecting a whitelist of keys to build
 * a function waiting for the object to act upon.
 * @example
 * const user = {id: 1, name: "Jane", surname: "Doe", active: false};
 * const getUserInfo = _.pick(["id", "active"]);
 *
 * getUserInfo(user) // => {id: 1, active: false}
 *
 * @example <caption>A useful composition with <code>mapWith</code>:</caption>
 * const users = [
 *     {id: 1, name: "Jane", surname: "Doe", active: false},
 *     {id: 2, name: "John", surname: "Doe", active: true},
 *     {id: 3, name: "Mario", surname: "Rossi", active: true},
 *     {id: 4, name: "Paolo", surname: "Bianchi", active: false}
 * ];
 * const select = _.compose(_.mapWith, _.pick);
 * const selectUserInfo = select(["id", "active"]);
 *
 * selectUserInfo(users) // =>
 * // [
 * //     {id: 1, active: false},
 * //     {id: 2, active: true},
 * //     {id: 3, active: true},
 * //     {id: 4, active: false}
 * // ]
 *
 * @memberof module:lamb
 * @category Object
 * @function
 * @see {@link module:lamb.pickIn|pickIn}, {@link module:lamb.pickIf|pickIf}
 * @see {@link module:lamb.skipIn|skipIn}, {@link module:lamb.skip|skip},
 * {@link module:lamb.skipIf|skipIf}
 * @since 0.35.0
 * @param {String[]} whitelist
 * @returns {Function}
 */
var pick = _curry2(pickIn, true);

export default pick;
