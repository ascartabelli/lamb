import isUndefined from "../../core/isUndefined";
import takeWhile from "../takeWhile";
import { nonFunctions, wannabeEmptyArrays } from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("takeWhile", () => {
    function isEven (n, idx, list) {
        expect(list[idx]).toBe(n);

        return n % 2 === 0;
    }

    // to check "truthy" and "falsy" values returned by predicates
    function isVowel (char, idx, s) {
        expect(s[idx]).toBe(char);

        return ~"aeiouAEIOU".indexOf(char);
    }

    const takeWhileIsEven = takeWhile(isEven);

    it("should build a function that takes the first elements satisfying a predicate from an array or array-like object", () => {
        expect(takeWhileIsEven([])).toStrictEqual([]);
        expect(takeWhileIsEven([1, 3, 5, 7])).toStrictEqual([]);
        expect(takeWhileIsEven([2, 3, 4, 6, 8])).toStrictEqual([2]);
        expect(takeWhileIsEven([2, 4, 6, 7, 8])).toStrictEqual([2, 4, 6]);
        expect(takeWhileIsEven([2, 4, 6, 8])).toStrictEqual([2, 4, 6, 8]);
    });

    it("should treat \"truthy\" and \"falsy\" values returned by predicates as booleans", () => {
        const takeWhileisVowel = takeWhile(isVowel);

        expect(takeWhileisVowel("aiuola")).toStrictEqual(["a", "i", "u", "o"]);
    });

    it("should build a function throwing an exception if the predicate isn't a function", () => {
        nonFunctions.forEach(value => {
            expect(() => { takeWhile(value)([1, 2]); }).toThrow();
        });

        expect(() => { takeWhile()([1, 2]); }).toThrow();
    });

    it("should always return dense arrays", () => {
        const takeWhileIsUndefined = takeWhile(isUndefined);
        const r = [void 0, void 0, void 0, void 0, void 0];

        /* eslint-disable no-sparse-arrays */
        expect(takeWhileIsUndefined([, , void 0, , void 0, 5, 6])).toStrictArrayEqual(r);
        expect(takeWhileIsEven([2, 4, , , 6])).toStrictArrayEqual([2, 4]);
        /* eslint-enable no-sparse-arrays */
    });

    it("should throw an exception if called without the data argument", () => {
        expect(takeWhileIsEven).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", () => {
        expect(() => { takeWhileIsEven(null); }).toThrow();
        expect(() => { takeWhileIsEven(void 0); }).toThrow();
    });

    it("should treat every other value as an empty array", () => {
        wannabeEmptyArrays.forEach(value => {
            expect(takeWhileIsEven(value)).toStrictEqual([]);
        });
    });
});
