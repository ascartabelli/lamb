import * as lamb from "../..";
import { nonFunctions, wannabeEmptyArrays } from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("dropWhile", function () {
    // to check "truthy" and "falsy" values returned by predicates
    var isVowel = function (char, idx, s) {
        expect(s[idx]).toBe(char);

        return ~"aeiouAEIOU".indexOf(char);
    };

    var isEven = function (n, idx, list) {
        expect(list[idx]).toBe(n);

        return n % 2 === 0;
    };

    var dropWhileIsEven = lamb.dropWhile(isEven);

    it("should build a function that drops the first elements satisfying a predicate from an array or array-like object", function () {
        expect(dropWhileIsEven([])).toEqual([]);
        expect(dropWhileIsEven([2, 4, 6, 8])).toEqual([]);
        expect(dropWhileIsEven([2, 3, 4, 6, 8])).toEqual([3, 4, 6, 8]);
        expect(dropWhileIsEven([2, 4, 6, 7, 8])).toEqual([7, 8]);
        expect(dropWhileIsEven([1, 3, 5, 7])).toEqual([1, 3, 5, 7]);
    });

    it("should treat \"truthy\" and \"falsy\" values returned by predicates as booleans", function () {
        var dropWhileisVowel = lamb.dropWhile(isVowel);

        expect(dropWhileisVowel("aiuola")).toEqual(["l", "a"]);
    });

    it("should build a function throwing an exception if the predicate isn't a function", function () {
        nonFunctions.forEach(function (value) {
            expect(function () { lamb.dropWhile(value)([1, 2]); }).toThrow();
        });

        expect(function () { lamb.dropWhile()([1, 2]); }).toThrow();
    });

    it("should always return dense arrays", function () {
        var dropWhileIsUndefined = lamb.dropWhile(lamb.isUndefined);

        /* eslint-disable no-sparse-arrays */
        expect(dropWhileIsEven([2, 4, , , 5])).toStrictArrayEqual([void 0, void 0, 5]);
        expect(dropWhileIsUndefined([, , void 0, , void 0, 5, 6])).toStrictArrayEqual([5, 6]);
        /* eslint-enable no-sparse-arrays */
    });

    it("should throw an exception if called without the data argument", function () {
        expect(dropWhileIsEven).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", function () {
        expect(function () { dropWhileIsEven(null); }).toThrow();
        expect(function () { dropWhileIsEven(void 0); }).toThrow();
    });

    it("should treat every other value as an empty array", function () {
        wannabeEmptyArrays.forEach(function (value) {
            expect(dropWhileIsEven(value)).toEqual([]);
        });
    });
});
