import findLast from "../findLast";
import findLastIndex from "../findLastIndex";
import findLastIndexWhere from "../findLastIndexWhere";
import findLastWhere from "../findLastWhere";
import hasKeyValue from "../../object/hasKeyValue";
import isUndefined from "../../core/isUndefined";
import { nonFunctions, wannabeEmptyArrays } from "../../__tests__/commons";

describe("findLast / findLastWhere / findLastIndex / findLastIndexWhere", () => {
    // to check "truthy" and "falsy" values returned by predicates
    function isVowel (char, idx, s) {
        expect(s[idx]).toBe(char);

        return ~"aeiouAEIOU".indexOf(char);
    }

    const persons = [
        { name: "Jane", surname: "Doe", age: 12 },
        { name: "John", surname: "Doe", age: 40 },
        { name: "Mario", surname: "Rossi", age: 18 },
        { name: "Paolo", surname: "Bianchi", age: 40 }
    ];
    const testString = "Hello world";
    const isNamedDoe = hasKeyValue("surname", "Doe");
    const is12YO = hasKeyValue("age", 12);
    const is40YO = hasKeyValue("age", 40);
    const is41YO = hasKeyValue("age", 41);

    describe("findLast / findLastWhere", () => {
        it("should find an element in an array-like object starting from the end, by using the given predicate", () => {
            expect(findLast(persons, is12YO)).toBe(persons[0]);
            expect(findLast(persons, isNamedDoe)).toBe(persons[1]);
            expect(findLast(persons, is40YO)).toBe(persons[3]);
            expect(findLastWhere(is12YO)(persons)).toBe(persons[0]);
            expect(findLastWhere(isNamedDoe)(persons)).toBe(persons[1]);
            expect(findLastWhere(is40YO)(persons)).toBe(persons[3]);
        });

        it("should return `undefined` if there is no element satisfying the predicate", () => {
            expect(findLast(persons, is41YO)).toBeUndefined();
            expect(findLastWhere(is41YO)(persons)).toBeUndefined();
        });

        it("should treat \"truthy\" and \"falsy\" values returned by predicates as booleans", () => {
            expect(findLast(testString, isVowel)).toBe("o");
            expect(findLast("zxc", isVowel)).toBeUndefined();
            expect(findLastWhere(isVowel)(testString)).toBe("o");
            expect(findLastWhere(isVowel)("zxc")).toBeUndefined();
        });

        it("should throw an exception if the predicate isn't a function or is missing", () => {
            nonFunctions.forEach(value => {
                expect(() => { findLast(persons, value); }).toThrow();
                expect(() => { findLastWhere(value)(persons); }).toThrow();
            });

            expect(() => { findLast(persons); }).toThrow();
            expect(() => { findLastWhere()(persons); }).toThrow();
        });

        it("should throw an exception if called without arguments", () => {
            expect(findLast).toThrow();
            expect(findLastWhere()).toThrow();
        });

        it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", () => {
            expect(() => { findLast(null, is40YO); }).toThrow();
            expect(() => { findLast(void 0, is40YO); }).toThrow();
            expect(() => { findLastWhere(is40YO)(null); }).toThrow();
            expect(() => { findLastWhere(is40YO)(void 0); }).toThrow();
        });

        it("should treat every other value as an empty array", () => {
            wannabeEmptyArrays.forEach(value => {
                expect(findLast(value, is40YO)).toBeUndefined();
                expect(findLastWhere(is40YO)(value)).toBeUndefined();
            });
        });
    });

    describe("findLastIndex / findLastIndexWhere", () => {
        it("should find the last index of an element in an array-like object by using the given predicate", () => {
            expect(findLastIndex(persons, is12YO)).toBe(0);
            expect(findLastIndex(persons, isNamedDoe)).toBe(1);
            expect(findLastIndex(persons, is40YO)).toBe(3);
            expect(findLastIndexWhere(is12YO)(persons)).toBe(0);
            expect(findLastIndexWhere(isNamedDoe)(persons)).toBe(1);
            expect(findLastIndexWhere(is40YO)(persons)).toBe(3);
        });

        it("should return `-1` if there is no element satisfying the predicate", () => {
            expect(findLastIndex(persons, is41YO)).toBe(-1);
            expect(findLastIndexWhere(is41YO)(persons)).toBe(-1);
        });

        it("should treat \"truthy\" and \"falsy\" values returned by predicates as booleans", () => {
            expect(findLastIndex(testString, isVowel)).toBe(7);
            expect(findLastIndex("zxc", isVowel)).toBe(-1);
            expect(findLastIndexWhere(isVowel)(testString)).toBe(7);
            expect(findLastIndexWhere(isVowel)("zxc")).toBe(-1);
        });

        it("should consider deleted or unassigned indexes in sparse arrays as `undefined` values", () => {
            /* eslint-disable no-sparse-arrays */
            expect(findLastIndex([1, , , 3], isUndefined)).toBe(2);
            expect(findLastIndexWhere(isUndefined)([1, , , 3])).toBe(2);
            /* eslint-enable no-sparse-arrays */
        });

        it("should throw an exception if the predicate isn't a function or is missing", () => {
            nonFunctions.forEach(value => {
                expect(() => { findLastIndex(persons, value); }).toThrow();
                expect(() => { findLastIndexWhere(value)(persons); }).toThrow();
            });

            expect(() => { findLastIndex(persons); }).toThrow();
            expect(() => { findLastIndexWhere()(persons); }).toThrow();
        });

        it("should throw an exception if called without arguments", () => {
            expect(findLastIndex).toThrow();
            expect(findLastIndexWhere()).toThrow();
        });

        it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", () => {
            expect(() => { findLastIndex(null, is40YO); }).toThrow();
            expect(() => { findLastIndex(void 0, is40YO); }).toThrow();
            expect(() => { findLastIndexWhere(is40YO)(null); }).toThrow();
            expect(() => { findLastIndexWhere(is40YO)(void 0); }).toThrow();
        });

        it("should treat every other value as an empty array", () => {
            wannabeEmptyArrays.forEach(value => {
                expect(findLastIndex(value, is40YO)).toBe(-1);
                expect(findLastIndexWhere(is40YO)(value)).toBe(-1);
            });
        });
    });
});
