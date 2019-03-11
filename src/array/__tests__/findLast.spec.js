import * as lamb from "../..";
import { nonFunctions, wannabeEmptyArrays } from "../../__tests__/commons";

describe("findLast / findLastWhere / findLastIndex / findLastIndexWhere", function () {
    // to check "truthy" and "falsy" values returned by predicates
    var isVowel = function (char, idx, s) {
        expect(s[idx]).toBe(char);

        return ~"aeiouAEIOU".indexOf(char);
    };

    var persons = [
        { name: "Jane", surname: "Doe", age: 12 },
        { name: "John", surname: "Doe", age: 40 },
        { name: "Mario", surname: "Rossi", age: 18 },
        { name: "Paolo", surname: "Bianchi", age: 40 }
    ];

    var testString = "Hello world";
    var isNamedDoe = lamb.hasKeyValue("surname", "Doe");
    var is12YO = lamb.hasKeyValue("age", 12);
    var is40YO = lamb.hasKeyValue("age", 40);
    var is41YO = lamb.hasKeyValue("age", 41);

    describe("findLast / findLastWhere", function () {
        it("should find an element in an array-like object starting from the end, by using the given predicate", function () {
            expect(lamb.findLast(persons, is12YO)).toBe(persons[0]);
            expect(lamb.findLast(persons, isNamedDoe)).toBe(persons[1]);
            expect(lamb.findLast(persons, is40YO)).toBe(persons[3]);
            expect(lamb.findLastWhere(is12YO)(persons)).toBe(persons[0]);
            expect(lamb.findLastWhere(isNamedDoe)(persons)).toBe(persons[1]);
            expect(lamb.findLastWhere(is40YO)(persons)).toBe(persons[3]);
        });

        it("should return `undefined` if there is no element satisfying the predicate", function () {
            expect(lamb.findLast(persons, is41YO)).toBeUndefined();
            expect(lamb.findLastWhere(is41YO)(persons)).toBeUndefined();
        });

        it("should treat \"truthy\" and \"falsy\" values returned by predicates as booleans", function () {
            expect(lamb.findLast(testString, isVowel)).toBe("o");
            expect(lamb.findLast("zxc", isVowel)).toBeUndefined();
            expect(lamb.findLastWhere(isVowel)(testString)).toBe("o");
            expect(lamb.findLastWhere(isVowel)("zxc")).toBeUndefined();
        });

        it("should throw an exception if the predicate isn't a function or is missing", function () {
            nonFunctions.forEach(function (value) {
                expect(function () { lamb.findLast(persons, value); }).toThrow();
                expect(function () { lamb.findLastWhere(value)(persons); }).toThrow();
            });

            expect(function () { lamb.findLast(persons); }).toThrow();
            expect(function () { lamb.findLastWhere()(persons); }).toThrow();
        });

        it("should throw an exception if called without arguments", function () {
            expect(lamb.findLast).toThrow();
            expect(lamb.findLastWhere()).toThrow();
        });

        it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", function () {
            expect(function () { lamb.findLast(null, is40YO); }).toThrow();
            expect(function () { lamb.findLast(void 0, is40YO); }).toThrow();
            expect(function () { lamb.findLastWhere(is40YO)(null); }).toThrow();
            expect(function () { lamb.findLastWhere(is40YO)(void 0); }).toThrow();
        });

        it("should treat every other value as an empty array", function () {
            wannabeEmptyArrays.forEach(function (value) {
                expect(lamb.findLast(value, is40YO)).toBeUndefined();
                expect(lamb.findLastWhere(is40YO)(value)).toBeUndefined();
            });
        });
    });

    describe("findLastIndex / findLastIndexWhere", function () {
        it("should find the last index of an element in an array-like object by using the given predicate", function () {
            expect(lamb.findLastIndex(persons, is12YO)).toBe(0);
            expect(lamb.findLastIndex(persons, isNamedDoe)).toBe(1);
            expect(lamb.findLastIndex(persons, is40YO)).toBe(3);
            expect(lamb.findLastIndexWhere(is12YO)(persons)).toBe(0);
            expect(lamb.findLastIndexWhere(isNamedDoe)(persons)).toBe(1);
            expect(lamb.findLastIndexWhere(is40YO)(persons)).toBe(3);
        });

        it("should return `-1` if there is no element satisfying the predicate", function () {
            expect(lamb.findLastIndex(persons, is41YO)).toBe(-1);
            expect(lamb.findLastIndexWhere(is41YO)(persons)).toBe(-1);
        });

        it("should treat \"truthy\" and \"falsy\" values returned by predicates as booleans", function () {
            expect(lamb.findLastIndex(testString, isVowel)).toBe(7);
            expect(lamb.findLastIndex("zxc", isVowel)).toBe(-1);
            expect(lamb.findLastIndexWhere(isVowel)(testString)).toBe(7);
            expect(lamb.findLastIndexWhere(isVowel)("zxc")).toBe(-1);
        });

        it("should consider deleted or unassigned indexes in sparse arrays as `undefined` values", function () {
            /* eslint-disable no-sparse-arrays */
            expect(lamb.findLastIndex([1, , , 3], lamb.isUndefined)).toBe(2);
            expect(lamb.findLastIndexWhere(lamb.isUndefined)([1, , , 3])).toBe(2);
            /* eslint-enable no-sparse-arrays */
        });

        it("should throw an exception if the predicate isn't a function or is missing", function () {
            nonFunctions.forEach(function (value) {
                expect(function () { lamb.findLastIndex(persons, value); }).toThrow();
                expect(function () { lamb.findLastIndexWhere(value)(persons); }).toThrow();
            });

            expect(function () { lamb.findLastIndex(persons); }).toThrow();
            expect(function () { lamb.findLastIndexWhere()(persons); }).toThrow();
        });

        it("should throw an exception if called without arguments", function () {
            expect(lamb.findLastIndex).toThrow();
            expect(lamb.findLastIndexWhere()).toThrow();
        });

        it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", function () {
            expect(function () { lamb.findLastIndex(null, is40YO); }).toThrow();
            expect(function () { lamb.findLastIndex(void 0, is40YO); }).toThrow();
            expect(function () { lamb.findLastIndexWhere(is40YO)(null); }).toThrow();
            expect(function () { lamb.findLastIndexWhere(is40YO)(void 0); }).toThrow();
        });

        it("should treat every other value as an empty array", function () {
            wannabeEmptyArrays.forEach(function (value) {
                expect(lamb.findLastIndex(value, is40YO)).toBe(-1);
                expect(lamb.findLastIndexWhere(is40YO)(value)).toBe(-1);
            });
        });
    });
});
