import isUndefined from "../../core/isUndefined";
import takeLastWhile from "../takeLastWhile";
import { nonFunctions, wannabeEmptyArrays } from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("takeLastWhile", () => {
    function isEven (n, idx, list) {
        expect(list[idx]).toBe(n);

        return n % 2 === 0;
    }

    // to check "truthy" and "falsy" values returned by predicates
    function isVowel (char, idx, s) {
        expect(s[idx]).toBe(char);

        return ~"aeiouAEIOU".indexOf(char);
    }

    const takeLastWhileIsEven = takeLastWhile(isEven);

    it("should build a function that takes the last elements satisfying a predicate from an array or array-like object", () => {
        expect(takeLastWhileIsEven([])).toStrictEqual([]);
        expect(takeLastWhileIsEven([1, 3, 5, 7])).toStrictEqual([]);
        expect(takeLastWhileIsEven([2, 3, 4, 6, 8])).toStrictEqual([4, 6, 8]);
        expect(takeLastWhileIsEven([2, 4, 6, 7, 8])).toStrictEqual([8]);
        expect(takeLastWhileIsEven([2, 4, 6, 8])).toStrictEqual([2, 4, 6, 8]);
    });

    it("should treat \"truthy\" and \"falsy\" values returned by predicates as booleans", () => {
        const takeLastWhileisVowel = takeLastWhile(isVowel);

        expect(takeLastWhileisVowel("mugnaio")).toStrictEqual(["a", "i", "o"]);
    });

    it("should build a function throwing an exception if the predicate isn't a function", () => {
        nonFunctions.forEach(value => {
            expect(() => { takeLastWhile(value)([1, 2]); }).toThrow();
        });

        expect(() => { takeLastWhile()([1, 2]); }).toThrow();
    });

    it("should always return dense arrays", () => {
        const takeLastWhileIsUndefined = takeLastWhile(isUndefined);
        const r = [void 0, void 0, void 0, void 0];

        /* eslint-disable no-sparse-arrays */
        expect(takeLastWhileIsUndefined([5, 6, , void 0, , void 0])).toStrictArrayEqual(r);
        expect(takeLastWhileIsEven([2, , , 4, 6])).toStrictArrayEqual([4, 6]);
        /* eslint-enable no-sparse-arrays */
    });

    it("should throw an exception if called without the data argument", () => {
        expect(takeLastWhileIsEven).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", () => {
        expect(() => { takeLastWhileIsEven(null); }).toThrow();
        expect(() => { takeLastWhileIsEven(void 0); }).toThrow();
    });

    it("should treat every other value as an empty array", () => {
        wannabeEmptyArrays.forEach(value => {
            expect(takeLastWhileIsEven(value)).toStrictEqual([]);
        });
    });
});
