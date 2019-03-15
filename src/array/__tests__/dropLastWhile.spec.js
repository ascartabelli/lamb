import * as lamb from "../..";
import { nonFunctions, wannabeEmptyArrays } from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("dropLastWhile", function () {
    // to check "truthy" and "falsy" values returned by predicates
    var isVowel = function (char, idx, s) {
        expect(s[idx]).toBe(char);

        return ~"aeiouAEIOU".indexOf(char);
    };

    var isEven = function (n, idx, list) {
        expect(list[idx]).toBe(n);

        return n % 2 === 0;
    };

    var dropLastWhileIsEven = lamb.dropLastWhile(isEven);

    it("should build a function that drops the last elements satisfying a predicate from an array or array-like object", function () {
        expect(dropLastWhileIsEven([])).toEqual([]);
        expect(dropLastWhileIsEven([2, 4, 6, 8])).toEqual([]);
        expect(dropLastWhileIsEven([2, 3, 4, 6, 8])).toEqual([2, 3]);
        expect(dropLastWhileIsEven([2, 4, 6, 7, 8])).toEqual([2, 4, 6, 7]);
        expect(dropLastWhileIsEven([1, 3, 5, 7])).toEqual([1, 3, 5, 7]);
    });

    it("should treat \"truthy\" and \"falsy\" values returned by predicates as booleans", function () {
        var dropLastWhileisVowel = lamb.dropLastWhile(isVowel);

        expect(dropLastWhileisVowel("mugnaio")).toEqual(["m", "u", "g", "n"]);
    });

    it("should build a function throwing an exception if the predicate isn't a function", function () {
        nonFunctions.forEach(function (value) {
            expect(function () { lamb.dropLastWhile(value)([1, 2]); }).toThrow();
        });

        expect(function () { lamb.dropLastWhile()([1, 2]); }).toThrow();
    });

    it("should always return dense arrays", function () {
        var dropLastWhileIsUndefined = lamb.dropLastWhile(lamb.isUndefined);

        /* eslint-disable no-sparse-arrays */
        expect(dropLastWhileIsEven([2, 4, , , 6, 8])).toStrictArrayEqual([2, 4, void 0, void 0]);
        expect(dropLastWhileIsUndefined([2, 4, , void 0, , void 0])).toStrictArrayEqual([2, 4]);
        /* eslint-enable no-sparse-arrays */
    });

    it("should throw an exception if called without the data argument", function () {
        expect(dropLastWhileIsEven).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", function () {
        expect(function () { dropLastWhileIsEven(null); }).toThrow();
        expect(function () { dropLastWhileIsEven(void 0); }).toThrow();
    });

    it("should treat every other value as an empty array", function () {
        wannabeEmptyArrays.forEach(function (value) {
            expect(dropLastWhileIsEven(value)).toEqual([]);
        });
    });
});
