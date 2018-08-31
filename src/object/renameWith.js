import rename from "./rename";

/**
 * Uses the provided function as a <code>keysMap</code> generator and returns
 * a function expecting the object whose keys we want to {@link module:lamb.rename|rename}.
 * @example
 * var person = {"NAME": "John", "SURNAME": "Doe"};
 * var arrayToLower = _.mapWith(_.invoker("toLowerCase"));
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
 * @see {@link module:lamb.rename|rename}, {@link module:lamb.renameKeys|renameKeys}
 * @since 0.26.0
 * @param {Function} fn
 * @returns {Function}
 */
function renameWith (fn) {
    return function (source) {
        return rename(source, fn(source));
    };
}

export default renameWith;
