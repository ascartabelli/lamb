import identity from "./identity";

/**
 * Returns a function that is the composition of the functions given as parameters.
 * The first function consumes the result of the function that follows.
 * @example
 * const sayHi = name => `Hi, ${name}`;
 * const capitalize = s => s[0].toUpperCase() + s.substring(1).toLowerCase();
 * const fixNameAndSayHi = _.compose(sayHi, capitalize);
 *
 * sayHi("bOb") // => "Hi, bOb"
 * fixNameAndSayHi("bOb") // "Hi, Bob"
 *
 * const users = [{name: "fred"}, {name: "bOb"}];
 * const sayHiToUser = _.compose(fixNameAndSayHi, _.getKey("name"));
 *
 * _.map(users, sayHiToUser) // ["Hi, Fred", "Hi, Bob"]
 *
 * @memberof module:lamb
 * @category Function
 * @see {@link module:lamb.pipe|pipe}
 * @since 0.1.0
 * @param {Function} a
 * @param {Function} b
 * @returns {Function}
 */
function compose (a, b) {
    return arguments.length ? function () {
        return a.call(this, b.apply(this, arguments));
    } : identity;
}

export default compose;
