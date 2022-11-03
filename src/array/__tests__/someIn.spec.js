import isUndefined from "../../core/isUndefined";
import some from "../some";
import someIn from "../someIn";
import { nonFunctions, wannabeEmptyArrays } from "../../__tests__/commons";

describe("some / someIn", () => {
    function isEven (n, idx, list) {
        expect(list[idx]).toBe(n);

        return n % 2 === 0;
    }

    // to check "truthy" and "falsy" values returned by predicates
    function isVowel (char, idx, s) {
        expect(s[idx]).toBe(char);

        return ~"aeiouAEIOU".indexOf(char);
    }

    const a1 = [1, 3, 5, 6, 7, 8];
    const a2 = [1, 3, 5, 7];

    it("should check if at least one element of an array satisfies the given predicate", () => {
        expect(someIn(a1, isEven)).toBe(true);
        expect(some(isEven)(a1)).toBe(true);
        expect(someIn(a2, isEven)).toBe(false);
        expect(some(isEven)(a2)).toBe(false);
    });

    it("should work with array-like objects", () => {
        expect(someIn("134567", isEven)).toBe(true);
        expect(some(isEven)("134567")).toBe(true);
        expect(someIn("1357", isEven)).toBe(false);
        expect(some(isEven)("1357")).toBe(false);
    });

    it("should always return false for empty array-likes", () => {
        expect(someIn([], isEven)).toBe(false);
        expect(some(isEven)([])).toBe(false);
        expect(someIn("", isEven)).toBe(false);
        expect(some(isEven)("")).toBe(false);
    });

    it("should stop calling the predicate as soon as a `true` value is returned", () => {
        const isGreaterThan10 = jest.fn(n => n > 10);
        const arr = [1, 3, 15, 10, 11];

        expect(someIn(arr, isGreaterThan10)).toBe(true);
        expect(isGreaterThan10).toHaveBeenCalledTimes(3);

        expect(some(isGreaterThan10)(arr)).toBe(true);
        expect(isGreaterThan10).toHaveBeenCalledTimes(6);
    });

    it("should treat \"truthy\" and \"falsy\" values returned by predicates as booleans", () => {
        expect(someIn("hello", isVowel)).toBe(true);
        expect(some(isVowel)("hello")).toBe(true);
        expect(someIn("hll", isVowel)).toBe(false);
        expect(some(isVowel)("hll")).toBe(false);
    });

    it("should not skip deleted or unassigned elements, unlike the native method", () => {
        const arr = Array(5);

        arr[2] = 99;

        expect(someIn(arr, isUndefined)).toBe(true);
        expect(some(isUndefined)(arr)).toBe(true);
    });

    it("should throw an exception if the predicate isn't a function or is missing", () => {
        nonFunctions.forEach(function (value) {
            expect(() => { someIn(a1, value); }).toThrow();
            expect(() => { some(value)(a1); }).toThrow();
        });

        expect(() => { someIn(a1); }).toThrow();
        expect(() => { some()(a1); }).toThrow();
    });

    it("should throw an exception if called without the data argument", () => {
        expect(some(isEven)).toThrow();
        expect(someIn).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", () => {
        expect(() => { someIn(null, isEven); }).toThrow();
        expect(() => { someIn(void 0, isEven); }).toThrow();
        expect(() => { some(isEven)(null); }).toThrow();
        expect(() => { some(isEven)(void 0); }).toThrow();
    });

    it("should treat every other value as an empty array and return `false`", () => {
        wannabeEmptyArrays.forEach(value => {
            expect(someIn(value, isEven)).toBe(false);
            expect(some(isEven)(value)).toBe(false);
        });
    });
});
