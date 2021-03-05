import reduce from "../core/reduce";

/**
 * Calculates the [arithmetic mean]{@link https://en.wikipedia.org/wiki/Arithmetic_mean} of the given list of numbers.
 * @example
 * _.mean([1, 2, 3, 4, 5, 6, 7, 8, 9]) // => 5
 * _.mean([]) // => NaN
 *
 * @memberof module:lamb
 * @category Math
 * @see {@link module:lamb.median|median}
 * @since 0.60.0
 * @param {Number[]} numbers
 * @returns {Number}
 */
function mean (numbers) {
    return reduce(numbers, function (r, n) {
        return +n + r;
    }, 0) / numbers.length;
}

export default mean;
