import find from "../find";
import findIndex from "../findIndex";
import findIndexWhere from "../findIndexWhere";
import findWhere from "../findWhere";
import hasKeyValue from "../../object/hasKeyValue";
import isUndefined from "../../core/isUndefined";
import { nonFunctions, wannabeEmptyArrays } from "../../__tests__/commons";

describe("find / findWhere / findIndex / findIndexWhere", () => {
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
    const isNamedBianchi = hasKeyValue("surname", "Bianchi");
    const is40YO = hasKeyValue("age", 40);
    const is41YO = hasKeyValue("age", 41);

    describe("find / findWhere", () => {
        it("should find an element in an array-like object by using the given predicate", () => {
            expect(find(persons, isNamedDoe)).toBe(persons[0]);
            expect(find(persons, isNamedBianchi)).toBe(persons[3]);
            expect(find(persons, is40YO)).toBe(persons[1]);
            expect(findWhere(isNamedDoe)(persons)).toBe(persons[0]);
            expect(findWhere(isNamedBianchi)(persons)).toBe(persons[3]);
            expect(findWhere(is40YO)(persons)).toBe(persons[1]);
        });

        it("should return `undefined` if there is no element satisfying the predicate", () => {
            expect(find(persons, is41YO)).toBeUndefined();
            expect(findWhere(is41YO)(persons)).toBeUndefined();
        });

        it("should treat \"truthy\" and \"falsy\" values returned by predicates as booleans", () => {
            expect(find(testString, isVowel)).toBe("e");
            expect(find("zxc", isVowel)).toBeUndefined();
            expect(findWhere(isVowel)(testString)).toBe("e");
            expect(findWhere(isVowel)("zxc")).toBeUndefined();
        });

        it("should throw an exception if the predicate isn't a function or is missing", () => {
            nonFunctions.forEach(value => {
                expect(() => { find(persons, value); }).toThrow();
                expect(() => { findWhere(value)(persons); }).toThrow();
            });

            expect(() => { find(persons); }).toThrow();
            expect(() => { findWhere()(persons); }).toThrow();
        });

        it("should throw an exception if called without arguments", () => {
            expect(find).toThrow();
            expect(findWhere()).toThrow();
        });

        it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", () => {
            expect(() => { find(null, is40YO); }).toThrow();
            expect(() => { find(void 0, is40YO); }).toThrow();
            expect(() => { findWhere(is40YO)(null); }).toThrow();
            expect(() => { findWhere(is40YO)(void 0); }).toThrow();
        });

        it("should treat every other value as an empty array", () => {
            wannabeEmptyArrays.forEach(value => {
                expect(find(value, is40YO)).toBeUndefined();
                expect(findWhere(is40YO)(value)).toBeUndefined();
            });
        });
    });

    describe("findIndex / findIndexWhere", () => {
        it("should find the index of an element in an array-like object by using the given predicate", () => {
            expect(findIndex(persons, isNamedDoe)).toBe(0);
            expect(findIndex(persons, isNamedBianchi)).toBe(3);
            expect(findIndex(persons, is40YO)).toBe(1);
            expect(findIndexWhere(isNamedDoe)(persons)).toBe(0);
            expect(findIndexWhere(isNamedBianchi)(persons)).toBe(3);
            expect(findIndexWhere(is40YO)(persons)).toBe(1);
        });

        it("should return `-1` if there is no element satisfying the predicate", () => {
            expect(findIndex(persons, is41YO)).toBe(-1);
            expect(findIndexWhere(is41YO)(persons)).toBe(-1);
        });

        it("should treat \"truthy\" and \"falsy\" values returned by predicates as booleans", () => {
            expect(findIndex(testString, isVowel)).toBe(1);
            expect(findIndex("zxc", isVowel)).toBe(-1);
            expect(findIndexWhere(isVowel)(testString)).toBe(1);
            expect(findIndexWhere(isVowel)("zxc")).toBe(-1);
        });

        it("should consider deleted or unassigned indexes in sparse arrays as `undefined` values", () => {
            /* eslint-disable no-sparse-arrays */
            expect(findIndex([1, , 3], isUndefined)).toBe(1);
            expect(findIndexWhere(isUndefined)([1, , 3])).toBe(1);
            /* eslint-enable no-sparse-arrays */
        });

        it("should throw an exception if the predicate isn't a function or is missing", () => {
            nonFunctions.forEach(value => {
                expect(() => { findIndex(persons, value); }).toThrow();
                expect(() => { findIndexWhere(value)(persons); }).toThrow();
            });

            expect(() => { findIndex(persons); }).toThrow();
            expect(() => { findIndexWhere()(persons); }).toThrow();
        });

        it("should throw an exception if called without arguments", () => {
            expect(findIndex).toThrow();
            expect(findIndexWhere()).toThrow();
        });

        it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", () => {
            expect(() => { findIndex(null, is40YO); }).toThrow();
            expect(() => { findIndex(void 0, is40YO); }).toThrow();
            expect(() => { findIndexWhere(is40YO)(null); }).toThrow();
            expect(() => { findIndexWhere(is40YO)(void 0); }).toThrow();
        });

        it("should treat every other value as an empty array", () => {
            wannabeEmptyArrays.forEach(value => {
                expect(findIndex(value, is40YO)).toBe(-1);
                expect(findIndexWhere(is40YO)(value)).toBe(-1);
            });
        });
    });
});
