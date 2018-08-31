/**
 * Builds a predicate to check if the given key satisfies the desired condition
 * on an object.
 * @example
 * var users = [
 *     {name: "John", age: 25},
 *     {name: "Jane", age: 15},
 * ];
 * var isAdult = _.keySatisfies(_.isGTE(18), "age");
 *
 * isAdult(users[0]) // => true
 * isAdult(users[1]) // => false
 *
 * @memberof module:lamb
 * @category Object
 * @see {@link module:lamb.pathSatisfies|pathSatisfies}
 * @since 0.45.0
 * @param {Function} predicate
 * @param {String} key
 * @returns {Function}
 */
function keySatisfies (predicate, key) {
    return function (obj) {
        return predicate.call(this, obj[key]);
    };
}

export default keySatisfies;
