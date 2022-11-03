import dropLastWhile from "../dropLastWhile";
import isUndefined from "../../core/isUndefined";
import { nonFunctions, wannabeEmptyArrays } from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("dropLastWhile", () => {
    // to check "truthy" and "falsy" values returned by predicates
    const isVowel = function (char, idx, s) {
        expect(s[idx]).toBe(char);

        return ~"aeiouAEIOU".indexOf(char);
    };

    const isEven = function (n, idx, list) {
        expect(list[idx]).toBe(n);

        return n % 2 === 0;
    };

    const dropLastWhileIsEven = dropLastWhile(isEven);

    it("should build a function that drops the last elements satisfying a predicate from an array or array-like object", () => {
        expect(dropLastWhileIsEven([])).toStrictEqual([]);
        expect(dropLastWhileIsEven([2, 4, 6, 8])).toStrictEqual([]);
        expect(dropLastWhileIsEven([2, 3, 4, 6, 8])).toStrictEqual([2, 3]);
        expect(dropLastWhileIsEven([2, 4, 6, 7, 8])).toStrictEqual([2, 4, 6, 7]);
        expect(dropLastWhileIsEven([1, 3, 5, 7])).toStrictEqual([1, 3, 5, 7]);
    });

    it("should treat \"truthy\" and \"falsy\" values returned by predicates as booleans", () => {
        const dropLastWhileisVowel = dropLastWhile(isVowel);

        expect(dropLastWhileisVowel("mugnaio")).toStrictEqual(["m", "u", "g", "n"]);
    });

    it("should build a function throwing an exception if the predicate isn't a function", () => {
        nonFunctions.forEach(value => {
            expect(() => { dropLastWhile(value)([1, 2]); }).toThrow();
        });

        expect(() => { dropLastWhile()([1, 2]); }).toThrow();
    });

    it("should always return dense arrays", () => {
        const dropLastWhileIsUndefined = dropLastWhile(isUndefined);

        /* eslint-disable no-sparse-arrays */
        expect(dropLastWhileIsEven([2, 4, , , 6, 8])).toStrictArrayEqual([2, 4, void 0, void 0]);
        expect(dropLastWhileIsUndefined([2, 4, , void 0, , void 0])).toStrictArrayEqual([2, 4]);
        /* eslint-enable no-sparse-arrays */
    });

    it("should throw an exception if called without the data argument", () => {
        expect(dropLastWhileIsEven).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", () => {
        expect(() => { dropLastWhileIsEven(null); }).toThrow();
        expect(() => { dropLastWhileIsEven(void 0); }).toThrow();
    });

    it("should treat every other value as an empty array", () => {
        wannabeEmptyArrays.forEach(value => {
            expect(dropLastWhileIsEven(value)).toStrictEqual([]);
        });
    });
});
