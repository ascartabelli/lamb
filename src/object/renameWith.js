import renameIn from "./renameIn";

/**
 * Uses the provided function as a <code>keysMap</code> generator and returns
 * a function expecting the object whose keys we want to {@link module:lamb.renameIn|renameIn}.
 * @example
 * var person = {"NAME": "John", "SURNAME": "Doe"};
 * var arrayToLower = _.mapWith(_.invoke("toLowerCase"));
 * var makeLowerKeysMap = function (source) {
 *     var sourceKeys = _.keys(source);
 *
 *     return _.make(sourceKeys, arrayToLower(sourceKeys));
 * };
 * var lowerKeysFor = _.renameWith(makeLowerKeysMap);
 *
 * lowerKeysFor(person) // => {"name": "John", "surname": "doe"};
 *
 * @memberof module:lamb
 * @category Object
 * @see {@link module:lamb.renameIn|renameIn}, {@link module:lamb.rename|rename}
 * @since 0.26.0
 * @param {Function} fn
 * @returns {Function}
 */
function renameWith (fn) {
    return function (source) {
        return renameIn(source, fn(source));
    };
}

export default renameWith;
