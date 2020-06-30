import _curry2 from "../privates/_curry2";
import skipIn from "./skipIn";

/**
 * A curried version of {@link module:lamb.skipIn|skipIn}, expecting a blacklist of keys to build
 * a function waiting for the object to act upon.
 * @example
 * var user = {id: 1, name: "Jane", surname: "Doe", active: false};
 * var getUserInfo = _.skip(["name", "surname"]);
 *
 * getUserInfo(user) // => {id: 1, active: false}
 *
 * @example <caption>A useful composition with <code>mapWith</code>:</caption>
 * var users = [
 *     {id: 1, name: "Jane", surname: "Doe", active: false},
 *     {id: 2, name: "John", surname: "Doe", active: true},
 *     {id: 3, name: "Mario", surname: "Rossi", active: true},
 *     {id: 4, name: "Paolo", surname: "Bianchi", active: false}
 * ];
 * var discard = _.compose(_.mapWith, _.skip);
 * var discardNames = discard(["name", "surname"]);
 *
 * discardNames(users) // =>
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
 * @see {@link module:lamb.skipIn|skipIn}, {@link module:lamb.skipIf|skipIf}
 * @see {@link module:lamb.pickIn|pickIn}, {@link module:lamb.pick|pick},
 * {@link module:lamb.pickIf|pickIf}
 * @since 0.35.0
 * @param {String[]} blacklist
 * @returns {Function}
 */
var skip = _curry2(skipIn, true);

export default skip;
