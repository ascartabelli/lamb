import every from "../every";
import everyIn from "../everyIn";
import isUndefined from "../../core/isUndefined";
import not from "../../logic/not";
import { nonFunctions, wannabeEmptyArrays } from "../../__tests__/commons";

describe("every / everyIn", () => {
    function isEven (n, idx, list) {
        expect(list[idx]).toBe(n);

        return n % 2 === 0;
    }

    // to check "truthy" and "falsy" values returned by predicates
    function isVowel (char, idx, s) {
        expect(s[idx]).toBe(char);

        return ~"aeiouAEIOU".indexOf(char);
    }

    const a1 = [2, 4, 6, 8];
    const a2 = [1, 3, 5, 6, 7, 8];

    it("should check if every element of an array satisfies the given predicate", () => {
        expect(everyIn(a1, isEven)).toBe(true);
        expect(every(isEven)(a1)).toBe(true);
        expect(everyIn(a2, isEven)).toBe(false);
        expect(every(isEven)(a2)).toBe(false);
    });

    it("should work with array-like objects", () => {
        expect(everyIn("2468", isEven)).toBe(true);
        expect(every(isEven)("2468")).toBe(true);
        expect(everyIn("24678", isEven)).toBe(false);
        expect(every(isEven)("24678")).toBe(false);
    });

    it("should always return true for empty array-likes because of vacuous truth", () => {
        expect(everyIn([], isEven)).toBe(true);
        expect(every(isEven)([])).toBe(true);
        expect(everyIn("", isEven)).toBe(true);
        expect(every(isEven)("")).toBe(true);
    });

    it("should stop calling the predicate as soon as a `false` value is returned", () => {
        const isGreaterThan10 = jest.fn(function (n) {
            return n > 10;
        });

        const arr = [12, 13, 9, 15];

        expect(everyIn(arr, isGreaterThan10)).toBe(false);
        expect(isGreaterThan10).toHaveBeenCalledTimes(3);

        expect(every(isGreaterThan10)(arr)).toBe(false);
        expect(isGreaterThan10).toHaveBeenCalledTimes(6);
    });

    it("should treat \"truthy\" and \"falsy\" values returned by predicates as booleans", () => {
        expect(everyIn("aiu", isVowel)).toBe(true);
        expect(every(isVowel)("aiu")).toBe(true);
        expect(everyIn("aiuole", isVowel)).toBe(false);
        expect(every(isVowel)("aiuole")).toBe(false);
    });

    it("should not skip deleted or unassigned elements, unlike the native method", () => {
        const isDefined = not(isUndefined);
        const arr = Array(5);

        arr[2] = 99;

        expect(everyIn(arr, isDefined)).toBe(false);
        expect(every(isDefined)(arr)).toBe(false);
    });

    it("should throw an exception if the predicate isn't a function or is missing", () => {
        nonFunctions.forEach(value => {
            expect(() => { everyIn(a1, value); }).toThrow();
            expect(() => { every(value)(a1); }).toThrow();
        });

        expect(() => { everyIn(a1); }).toThrow();
        expect(() => { every()(a1); }).toThrow();
    });

    it("should throw an exception if called without the data argument", () => {
        expect(every(isEven)).toThrow();
        expect(everyIn).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", () => {
        expect(() => { everyIn(null, isEven); }).toThrow();
        expect(() => { everyIn(void 0, isEven); }).toThrow();
        expect(() => { every(isEven)(null); }).toThrow();
        expect(() => { every(isEven)(void 0); }).toThrow();
    });

    it("should treat every other value as an empty array and return `true`", () => {
        wannabeEmptyArrays.forEach(value => {
            expect(everyIn(value, isEven)).toBe(true);
            expect(every(isEven)(value)).toBe(true);
        });
    });
});
