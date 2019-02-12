import enumerables from "./enumerables";

/**
 * Creates a copy of the given object with its enumerable keys renamed as
 * indicated in the provided lookup table.
 * @example
 * var person = {"firstName": "John", "lastName": "Doe"};
 * var keysMap = {"firstName": "name", "lastName": "surname"};
 *
 * _.rename(person, keysMap) // => {"name": "John", "surname": "Doe"}
 *
 * @example <caption>It's safe using it to swap keys:</caption>
 * var keysMap = {"firstName": "lastName", "lastName": "firstName"};
 *
 * _.rename(person, keysMap) // => {"lastName": "John", "firstName": "Doe"}
 *
 * @memberof module:lamb
 * @category Object
 * @see {@link module:lamb.renameKeys|renameKeys}, {@link module:lamb.renameWith|renameWith}
 * @since 0.26.0
 * @param {Object} source
 * @param {Object} keysMap
 * @returns {Object}
 */
function rename (source, keysMap) {
    keysMap = Object(keysMap);
    var result = {};
    var oldKeys = enumerables(source);

    for (var prop in keysMap) {
        if (~oldKeys.indexOf(prop)) {
            result[keysMap[prop]] = source[prop];
        }
    }

    for (var i = 0, len = oldKeys.length, key; i < len; i++) {
        key = oldKeys[i];

        if (!(key in keysMap || key in result)) {
            result[key] = source[key];
        }
    }

    return result;
}

export default rename;
