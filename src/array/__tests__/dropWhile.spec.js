import dropWhile from "../dropWhile";
import isUndefined from "../../core/isUndefined";
import { nonFunctions, wannabeEmptyArrays } from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("dropWhile", () => {
    // to check "truthy" and "falsy" values returned by predicates
    function isVowel (char, idx, s) {
        expect(s[idx]).toBe(char);

        return ~"aeiouAEIOU".indexOf(char);
    }

    function isEven (n, idx, list) {
        expect(list[idx]).toBe(n);

        return n % 2 === 0;
    }

    const dropWhileIsEven = dropWhile(isEven);

    it("should build a function that drops the first elements satisfying a predicate from an array or array-like object", () => {
        expect(dropWhileIsEven([])).toStrictEqual([]);
        expect(dropWhileIsEven([2, 4, 6, 8])).toStrictEqual([]);
        expect(dropWhileIsEven([2, 3, 4, 6, 8])).toStrictEqual([3, 4, 6, 8]);
        expect(dropWhileIsEven([2, 4, 6, 7, 8])).toStrictEqual([7, 8]);
        expect(dropWhileIsEven([1, 3, 5, 7])).toStrictEqual([1, 3, 5, 7]);
    });

    it("should treat \"truthy\" and \"falsy\" values returned by predicates as booleans", () => {
        const dropWhileisVowel = dropWhile(isVowel);

        expect(dropWhileisVowel("aiuola")).toStrictEqual(["l", "a"]);
    });

    it("should build a function throwing an exception if the predicate isn't a function", () => {
        nonFunctions.forEach(value => {
            expect(() => { dropWhile(value)([1, 2]); }).toThrow();
        });

        expect(() => { dropWhile()([1, 2]); }).toThrow();
    });

    it("should always return dense arrays", () => {
        const dropWhileIsUndefined = dropWhile(isUndefined);

        /* eslint-disable no-sparse-arrays */
        expect(dropWhileIsEven([2, 4, , , 5])).toStrictArrayEqual([void 0, void 0, 5]);
        expect(dropWhileIsUndefined([, , void 0, , void 0, 5, 6])).toStrictArrayEqual([5, 6]);
        /* eslint-enable no-sparse-arrays */
    });

    it("should throw an exception if called without the data argument", () => {
        expect(dropWhileIsEven).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", () => {
        expect(() => { dropWhileIsEven(null); }).toThrow();
        expect(() => { dropWhileIsEven(void 0); }).toThrow();
    });

    it("should treat every other value as an empty array", () => {
        wannabeEmptyArrays.forEach(value => {
            expect(dropWhileIsEven(value)).toStrictEqual([]);
        });
    });
});
