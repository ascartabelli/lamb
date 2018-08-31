import * as lamb from "../..";
import { nonFunctions, wannabeEmptyArrays } from "../../__tests__/commons";

describe("some / someIn", function () {
    var a1 = [1, 3, 5, 6, 7, 8];
    var a2 = [1, 3, 5, 7];
    var isEven = function (n, idx, list) {
        expect(list[idx]).toBe(n);

        return n % 2 === 0;
    };

    // to check "truthy" and "falsy" values returned by predicates
    var isVowel = function (char, idx, s) {
        expect(s[idx]).toBe(char);

        return ~"aeiouAEIOU".indexOf(char);
    };

    it("should check if at least one element of an array satisfies the given predicate", function () {
        expect(lamb.someIn(a1, isEven)).toBe(true);
        expect(lamb.some(isEven)(a1)).toBe(true);
        expect(lamb.someIn(a2, isEven)).toBe(false);
        expect(lamb.some(isEven)(a2)).toBe(false);
    });

    it("should work with array-like objects", function () {
        expect(lamb.someIn("134567", isEven)).toBe(true);
        expect(lamb.some(isEven)("134567")).toBe(true);
        expect(lamb.someIn("1357", isEven)).toBe(false);
        expect(lamb.some(isEven)("1357")).toBe(false);
    });

    it("should always return false for empty array-likes", function () {
        expect(lamb.someIn([], isEven)).toBe(false);
        expect(lamb.some(isEven)([])).toBe(false);
        expect(lamb.someIn("", isEven)).toBe(false);
        expect(lamb.some(isEven)("")).toBe(false);
    });

    it("should stop calling the predicate as soon as a `true` value is returned", function () {
        var isGreaterThan10 = jest.fn(function (n) {
            return n > 10;
        });
        var arr = [1, 3, 15, 10, 11];

        expect(lamb.someIn(arr, isGreaterThan10)).toBe(true);
        expect(isGreaterThan10).toHaveBeenCalledTimes(3);

        expect(lamb.some(isGreaterThan10)(arr)).toBe(true);
        expect(isGreaterThan10).toHaveBeenCalledTimes(6);
    });

    it("should treat \"truthy\" and \"falsy\" values returned by predicates as booleans", function () {
        expect(lamb.someIn("hello", isVowel)).toBe(true);
        expect(lamb.some(isVowel)("hello")).toBe(true);
        expect(lamb.someIn("hll", isVowel)).toBe(false);
        expect(lamb.some(isVowel)("hll")).toBe(false);
    });

    it("should not skip deleted or unassigned elements, unlike the native method", function () {
        var arr = Array(5);

        arr[2] = 99;

        expect(lamb.someIn(arr, lamb.isUndefined)).toBe(true);
        expect(lamb.some(lamb.isUndefined)(arr)).toBe(true);
    });

    it("should throw an exception if the predicate isn't a function or is missing", function () {
        nonFunctions.forEach(function (value) {
            expect(function () { lamb.someIn(a1, value); }).toThrow();
            expect(function () { lamb.some(value)(a1); }).toThrow();
        });

        expect(function () { lamb.someIn(a1); }).toThrow();
        expect(function () { lamb.some()(a1); }).toThrow();
    });

    it("should throw an exception if called without the data argument", function () {
        expect(lamb.some(isEven)).toThrow();
        expect(lamb.someIn).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", function () {
        expect(function () { lamb.someIn(null, isEven); }).toThrow();
        expect(function () { lamb.someIn(void 0, isEven); }).toThrow();
        expect(function () { lamb.some(isEven)(null); }).toThrow();
        expect(function () { lamb.some(isEven)(void 0); }).toThrow();
    });

    it("should treat every other value as an empty array and return `false`", function () {
        wannabeEmptyArrays.forEach(function (value) {
            expect(lamb.someIn(value, isEven)).toBe(false);
            expect(lamb.some(isEven)(value)).toBe(false);
        });
    });
});
