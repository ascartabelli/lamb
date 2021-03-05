import map from "../core/map";
import subtract from "./subtract";

/**
 * Calculates the [median]{@link https://en.wikipedia.org/wiki/Median} of the given list of numbers.
 * @example
 * _.median([10, 2, 3, 1, 4, 5, 7]) // => 4
 * _.median([]) // => NaN
 *
 * @memberof module:lamb
 * @category Math
 * @see {@link module:lamb.mean|mean}
 * @since 0.60.0
 * @param {Number[]} numbers
 * @returns {Number}
 */
function median (numbers) {
    var len = numbers.length >>> 0;

    if (len === 0) {
        return NaN;
    }

    var result;
    var sortedNumbers = map(numbers, Number).sort(subtract);

    if (len % 2 === 0) {
        var pivot = len / 2;

        result = (sortedNumbers[pivot - 1] + sortedNumbers[pivot]) / 2;
    } else {
        result = sortedNumbers[(len - 1) / 2];
    }

    return result;
}

export default median;
