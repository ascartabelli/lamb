import * as lamb from "../..";
import { nonFunctions, wannabeEmptyArrays } from "../../__tests__/commons";

describe("every / everyIn", function () {
    var a1 = [2, 4, 6, 8];
    var a2 = [1, 3, 5, 6, 7, 8];
    var isEven = function (n, idx, list) {
        expect(list[idx]).toBe(n);

        return n % 2 === 0;
    };

    // to check "truthy" and "falsy" values returned by predicates
    var isVowel = function (char, idx, s) {
        expect(s[idx]).toBe(char);

        return ~"aeiouAEIOU".indexOf(char);
    };

    it("should check if every element of an array satisfies the given predicate", function () {
        expect(lamb.everyIn(a1, isEven)).toBe(true);
        expect(lamb.every(isEven)(a1)).toBe(true);
        expect(lamb.everyIn(a2, isEven)).toBe(false);
        expect(lamb.every(isEven)(a2)).toBe(false);
    });

    it("should work with array-like objects", function () {
        expect(lamb.everyIn("2468", isEven)).toBe(true);
        expect(lamb.every(isEven)("2468")).toBe(true);
        expect(lamb.everyIn("24678", isEven)).toBe(false);
        expect(lamb.every(isEven)("24678")).toBe(false);
    });

    it("should always return true for empty array-likes because of vacuous truth", function () {
        expect(lamb.everyIn([], isEven)).toBe(true);
        expect(lamb.every(isEven)([])).toBe(true);
        expect(lamb.everyIn("", isEven)).toBe(true);
        expect(lamb.every(isEven)("")).toBe(true);
    });

    it("should stop calling the predicate as soon as a `false` value is returned", function () {
        var isGreaterThan10 = jest.fn(function (n) {
            return n > 10;
        });

        var arr = [12, 13, 9, 15];

        expect(lamb.everyIn(arr, isGreaterThan10)).toBe(false);
        expect(isGreaterThan10).toHaveBeenCalledTimes(3);

        expect(lamb.every(isGreaterThan10)(arr)).toBe(false);
        expect(isGreaterThan10).toHaveBeenCalledTimes(6);
    });

    it("should treat \"truthy\" and \"falsy\" values returned by predicates as booleans", function () {
        expect(lamb.everyIn("aiu", isVowel)).toBe(true);
        expect(lamb.every(isVowel)("aiu")).toBe(true);
        expect(lamb.everyIn("aiuole", isVowel)).toBe(false);
        expect(lamb.every(isVowel)("aiuole")).toBe(false);
    });

    it("should not skip deleted or unassigned elements, unlike the native method", function () {
        var isDefined = lamb.not(lamb.isUndefined);
        var arr = Array(5);

        arr[2] = 99;

        expect(lamb.everyIn(arr, isDefined)).toBe(false);
        expect(lamb.every(isDefined)(arr)).toBe(false);
    });

    it("should throw an exception if the predicate isn't a function or is missing", function () {
        nonFunctions.forEach(function (value) {
            expect(function () { lamb.everyIn(a1, value); }).toThrow();
            expect(function () { lamb.every(value)(a1); }).toThrow();
        });

        expect(function () { lamb.everyIn(a1); }).toThrow();
        expect(function () { lamb.every()(a1); }).toThrow();
    });

    it("should throw an exception if called without the data argument", function () {
        expect(lamb.every(isEven)).toThrow();
        expect(lamb.everyIn).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", function () {
        expect(function () { lamb.everyIn(null, isEven); }).toThrow();
        expect(function () { lamb.everyIn(void 0, isEven); }).toThrow();
        expect(function () { lamb.every(isEven)(null); }).toThrow();
        expect(function () { lamb.every(isEven)(void 0); }).toThrow();
    });

    it("should treat every other value as an empty array and return `true`", function () {
        wannabeEmptyArrays.forEach(function (value) {
            expect(lamb.everyIn(value, isEven)).toBe(true);
            expect(lamb.every(isEven)(value)).toBe(true);
        });
    });
});
