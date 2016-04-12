
/**
 * Adds two numbers.
 * @example
 * _.add(4, 5) // => 9
 *
 * @memberof module:lamb
 * @category Math
 * @param {Number} a
 * @param {Number} b
 * @returns {Number}
 */
function add (a, b) {
    return a + b;
}

/**
 * "Clamps" a number within the given limits.
 * @example
 * _.clamp(-5, 0, 10) // => 0
 * _.clamp(5, 0, 10) // => 5
 * _.clamp(15, 0, 10) // => 10
 *
 * @memberof module:lamb
 * @category Math
 * @param {Number} n
 * @param {Number} min
 * @param {Number} max
 * @returns {Number}
 */
function clamp (n, min, max) {
    return n < min ? min : n > max ? max : n;
}

/**
 * Divides two numbers.
 * @example
 * _.divide(5, 2) // => 2.5
 *
 * @memberof module:lamb
 * @category Math
 * @param {Number} a
 * @param {Number} b
 * @returns {Number}
 */
function divide (a, b) {
    return a / b;
}

/**
 * Generates a sequence of values of the desired length with the provided iteratee.
 * The values being iterated, and received by the iteratee, are the results generated so far.
 * @example
 * var fibonacci = function (n, idx, results) {
 *     return n + (results[idx - 1] || 0);
 * };
 *
 * _.generate(1, 10, fibonacci) // => [1, 1, 2, 3, 5, 8, 13, 21, 34, 55]
 *
 * @memberof module:lamb
 * @category Math
 * @param {*} start - The starting value
 * @param {Number} len - The desired length for the sequence
 * @param {ListIteratorCallback} iteratee
 * @param {Object} [iterateeContext]
 * @returns {Array}
 */
function generate (start, len, iteratee, iterateeContext) {
    var result = [start];

    for (var i = 0, limit = len - 1; i < limit; i++) {
        result.push(iteratee.call(iterateeContext, result[i], i, result));
    }

    return result;
}

/**
 * Performs the modulo operation and should not be confused with the {@link module:lamb.remainder|remainder}.
 * The function performs a floored division to calculate the result and not a truncated one, hence the sign of
 * the dividend is not kept, unlike the {@link module:lamb.remainder|remainder}.
 * @example
 * _.modulo(5, 3) // => 2
 * _.remainder(5, 3) // => 2
 *
 * _.modulo(-5, 3) // => 1
 * _.remainder(-5, 3) // => -2
 *
 * @memberof module:lamb
 * @category Math
 * @see {@link http://en.wikipedia.org/wiki/Modulo_operation}
 * @param {Number} a
 * @param {Number} b
 * @returns {Number}
 */
function modulo (a, b) {
    return a - (b * Math.floor(a / b));
}

/**
 * Multiplies two numbers.
 * @example
 * _.multiply(5, 3) // => 15
 *
 * @memberof module:lamb
 * @category Math
 * @param {Number} a
 * @param {Number} b
 * @returns {Number}
 */
function multiply (a, b) {
    return a * b;
}

/**
 * Generates a random integer between two given integers, both included.
 * Note that no safety measure is taken if the provided arguments aren't integers, so
 * you may end up with unexpected (not really) results.
 * For example <code>randomInt(0.1, 1.2)</code> could be <code>2</code>.
 * @example
 *
 * _.randomInt(1, 10) // => an integer >=1 && <= 10
 *
 * @memberof module:lamb
 * @category Math
 * @param {Number} min
 * @param {Number} max
 * @returns {Number}
 */
function randomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Generates an arithmetic progression of numbers starting from <code>start</code> up to,
 * but not including, <code>limit</code>, using the given <code>step</code>.
 * @example
 * _.range(2, 10) // => [2, 3, 4, 5, 6, 7, 8, 9]
 * _.range(2, 10, 0) // => [2]
 * _.range(1, -10, -2) // => [1, -1, -3, -5, -7, -9]
 * _.range(1, -10, 2) // => [1]
 *
 * @memberof module:lamb
 * @category Math
 * @param {Number} start
 * @param {Number} limit
 * @param {Number} [step=1]
 * @returns {Number[]}
 */
function range (start, limit, step) {
    if (step === 0 || arguments.length < 2) {
        return [start];
    }

    if (!step) {
        step = 1;
    }

    var len = Math.max(Math.ceil((limit - start) / step), 0);
    return generate(start, len, partial(add, step));
}

/**
 * Gets the remainder of the division of two numbers.
 * Not to be confused with the {@link module:lamb.modulo|modulo} as the remainder
 * keeps the sign of the dividend and may lead to some unexpected results.
 * @example
 * // example of wrong usage of the remainder
 * // (in this case the modulo operation should be used)
 * var isOdd = function (n) { return _.remainder(n, 2) === 1; };
 * isOdd(-3) // => false as -3 % 2 === -1
 *
 * @memberof module:lamb
 * @category Math
 * @see {@link http://en.wikipedia.org/wiki/Modulo_operation}
 * @param {Number} a
 * @param {Number} b
 * @returns {Number}
 */
function remainder (a, b) {
    return a % b;
}

/**
 * Subtracts two numbers.
 * @example
 * _.subtract(5, 3) // => 2
 *
 * @memberof module:lamb
 * @category Math
 * @param {Number} a
 * @param {Number} b
 * @returns {Number}
 */
function subtract (a, b) {
    return a - b;
}

lamb.add = add;
lamb.clamp = clamp;
lamb.divide = divide;
lamb.generate = generate;
lamb.modulo = modulo;
lamb.multiply = multiply;
lamb.randomInt = randomInt;
lamb.range = range;
lamb.remainder = remainder;
lamb.subtract = subtract;
