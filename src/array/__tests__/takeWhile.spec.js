import * as lamb from "../..";
import { nonFunctions, wannabeEmptyArrays } from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("takeWhile", function () {
    // to check "truthy" and "falsy" values returned by predicates
    var isVowel = function (char, idx, s) {
        expect(s[idx]).toBe(char);

        return ~"aeiouAEIOU".indexOf(char);
    };

    var isEven = function (n, idx, list) {
        expect(list[idx]).toBe(n);

        return n % 2 === 0;
    };
    var takeWhileIsEven = lamb.takeWhile(isEven);

    it("should build a function that takes the first elements satisfying a predicate from an array or array-like object", function () {
        expect(takeWhileIsEven([])).toEqual([]);
        expect(takeWhileIsEven([1, 3, 5, 7])).toEqual([]);
        expect(takeWhileIsEven([2, 3, 4, 6, 8])).toEqual([2]);
        expect(takeWhileIsEven([2, 4, 6, 7, 8])).toEqual([2, 4, 6]);
        expect(takeWhileIsEven([2, 4, 6, 8])).toEqual([2, 4, 6, 8]);
    });

    it("should treat \"truthy\" and \"falsy\" values returned by predicates as booleans", function () {
        var takeWhileisVowel = lamb.takeWhile(isVowel);

        expect(takeWhileisVowel("aiuola")).toEqual(["a", "i", "u", "o"]);
    });

    it("should build a function throwing an exception if the predicate isn't a function", function () {
        nonFunctions.forEach(function (value) {
            expect(function () { lamb.takeWhile(value)([1, 2]); }).toThrow();
        });

        expect(function () { lamb.takeWhile()([1, 2]); }).toThrow();
    });

    it("should always return dense arrays", function () {
        var takeWhileIsUndefined = lamb.takeWhile(lamb.isUndefined);
        var r = [void 0, void 0, void 0, void 0, void 0];

        /* eslint-disable no-sparse-arrays */
        expect(takeWhileIsUndefined([, , void 0, , void 0, 5, 6])).toStrictArrayEqual(r);
        expect(takeWhileIsEven([2, 4, , , 6])).toStrictArrayEqual([2, 4]);
        /* eslint-enable no-sparse-arrays */
    });

    it("should throw an exception if called without the data argument", function () {
        expect(takeWhileIsEven).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", function () {
        expect(function () { takeWhileIsEven(null); }).toThrow();
        expect(function () { takeWhileIsEven(void 0); }).toThrow();
    });

    it("should treat every other value as an empty array", function () {
        wannabeEmptyArrays.forEach(function (value) {
            expect(takeWhileIsEven(value)).toEqual([]);
        });
    });
});
