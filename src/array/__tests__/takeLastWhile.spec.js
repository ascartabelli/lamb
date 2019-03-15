import * as lamb from "../..";
import { nonFunctions, wannabeEmptyArrays } from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("takeLastWhile", function () {
    // to check "truthy" and "falsy" values returned by predicates
    var isVowel = function (char, idx, s) {
        expect(s[idx]).toBe(char);

        return ~"aeiouAEIOU".indexOf(char);
    };

    var isEven = function (n, idx, list) {
        expect(list[idx]).toBe(n);

        return n % 2 === 0;
    };
    var takeLastWhileIsEven = lamb.takeLastWhile(isEven);

    it("should build a function that takes the last elements satisfying a predicate from an array or array-like object", function () {
        expect(takeLastWhileIsEven([])).toEqual([]);
        expect(takeLastWhileIsEven([1, 3, 5, 7])).toEqual([]);
        expect(takeLastWhileIsEven([2, 3, 4, 6, 8])).toEqual([4, 6, 8]);
        expect(takeLastWhileIsEven([2, 4, 6, 7, 8])).toEqual([8]);
        expect(takeLastWhileIsEven([2, 4, 6, 8])).toEqual([2, 4, 6, 8]);
    });

    it("should treat \"truthy\" and \"falsy\" values returned by predicates as booleans", function () {
        var takeLastWhileisVowel = lamb.takeLastWhile(isVowel);

        expect(takeLastWhileisVowel("mugnaio")).toEqual(["a", "i", "o"]);
    });

    it("should build a function throwing an exception if the predicate isn't a function", function () {
        nonFunctions.forEach(function (value) {
            expect(function () { lamb.takeLastWhile(value)([1, 2]); }).toThrow();
        });

        expect(function () { lamb.takeLastWhile()([1, 2]); }).toThrow();
    });

    it("should always return dense arrays", function () {
        var takeLastWhileIsUndefined = lamb.takeLastWhile(lamb.isUndefined);
        var r = [void 0, void 0, void 0, void 0];

        /* eslint-disable no-sparse-arrays */
        expect(takeLastWhileIsUndefined([5, 6, , void 0, , void 0])).toStrictArrayEqual(r);
        expect(takeLastWhileIsEven([2, , , 4, 6])).toStrictArrayEqual([4, 6]);
        /* eslint-enable no-sparse-arrays */
    });

    it("should throw an exception if called without the data argument", function () {
        expect(takeLastWhileIsEven).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", function () {
        expect(function () { takeLastWhileIsEven(null); }).toThrow();
        expect(function () { takeLastWhileIsEven(void 0); }).toThrow();
    });

    it("should treat every other value as an empty array", function () {
        wannabeEmptyArrays.forEach(function (value) {
            expect(takeLastWhileIsEven(value)).toEqual([]);
        });
    });
});
