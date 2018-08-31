import * as lamb from "../..";
import { nonFunctions, wannabeEmptyArrays } from "../../__tests__/commons";

describe("find / findWhere / findIndex / findIndexWhere", function () {
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
    var is40YO = lamb.hasKeyValue("age", 40);
    var is41YO = lamb.hasKeyValue("age", 41);

    describe("find", function () {
        it("should find an element in an array-like object by using the given predicate", function () {
            expect(lamb.find(persons, is40YO)).toEqual(persons[1]);
            expect(lamb.findWhere(is40YO)(persons)).toEqual(persons[1]);
        });

        it("should return `undefined` if there is no element satisfying the predicate", function () {
            expect(lamb.find(persons, is41YO)).toBeUndefined();
            expect(lamb.findWhere(is41YO)(persons)).toBeUndefined();
        });

        it("should treat \"truthy\" and \"falsy\" values returned by predicates as booleans", function () {
            expect(lamb.find(testString, isVowel)).toBe("e");
            expect(lamb.find("zxc", isVowel)).toBeUndefined();
            expect(lamb.findWhere(isVowel)(testString)).toBe("e");
            expect(lamb.findWhere(isVowel)("zxc")).toBeUndefined();
        });

        it("should throw an exception if the predicate isn't a function or is missing", function () {
            nonFunctions.forEach(function (value) {
                expect(function () { lamb.find(persons, value); }).toThrow();
                expect(function () { lamb.findWhere(value)(persons); }).toThrow();
            });

            expect(function () { lamb.find(persons); }).toThrow();
            expect(function () { lamb.findWhere()(persons); }).toThrow();
        });

        it("should throw an exception if called without arguments", function () {
            expect(lamb.find).toThrow();
            expect(lamb.findWhere()).toThrow();
        });

        it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", function () {
            expect(function () { lamb.find(null, is40YO); }).toThrow();
            expect(function () { lamb.find(void 0, is40YO); }).toThrow();
            expect(function () { lamb.findWhere(is40YO)(null); }).toThrow();
            expect(function () { lamb.findWhere(is40YO)(void 0); }).toThrow();
        });

        it("should treat every other value as an empty array", function () {
            wannabeEmptyArrays.forEach(function (value) {
                expect(lamb.find(value, is40YO)).toBeUndefined();
                expect(lamb.findWhere(is40YO)(value)).toBeUndefined();
            });
        });
    });

    describe("findIndex", function () {
        it("should find the index of an element in an array-like object by using the given predicate", function () {
            expect(lamb.findIndex(persons, is40YO)).toBe(1);
            expect(lamb.findIndexWhere(is40YO)(persons)).toBe(1);
        });

        it("should return `-1` if there is no element satisfying the predicate", function () {
            expect(lamb.findIndex(persons, is41YO)).toBe(-1);
            expect(lamb.findIndexWhere(is41YO)(persons)).toBe(-1);
        });

        it("should treat \"truthy\" and \"falsy\" values returned by predicates as booleans", function () {
            expect(lamb.findIndex(testString, isVowel)).toBe(1);
            expect(lamb.findIndex("zxc", isVowel)).toBe(-1);
            expect(lamb.findIndexWhere(isVowel)(testString)).toBe(1);
            expect(lamb.findIndexWhere(isVowel)("zxc")).toBe(-1);
        });

        it("should consider deleted or unassigned indexes in sparse arrays as `undefined` values", function () {
            /* eslint-disable no-sparse-arrays */
            expect(lamb.findIndex([1, , 3], lamb.isUndefined)).toBe(1);
            expect(lamb.findIndexWhere(lamb.isUndefined)([1, , 3])).toBe(1);
            /* eslint-enable no-sparse-arrays */
        });

        it("should throw an exception if the predicate isn't a function or is missing", function () {
            nonFunctions.forEach(function (value) {
                expect(function () { lamb.findIndex(persons, value); }).toThrow();
                expect(function () { lamb.findIndexWhere(value)(persons); }).toThrow();
            });

            expect(function () { lamb.findIndex(persons); }).toThrow();
            expect(function () { lamb.findIndexWhere()(persons); }).toThrow();
        });

        it("should throw an exception if called without arguments", function () {
            expect(lamb.findIndex).toThrow();
            expect(lamb.findIndexWhere()).toThrow();
        });

        it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", function () {
            expect(function () { lamb.findIndex(null, is40YO); }).toThrow();
            expect(function () { lamb.findIndex(void 0, is40YO); }).toThrow();
            expect(function () { lamb.findIndexWhere(is40YO)(null); }).toThrow();
            expect(function () { lamb.findIndexWhere(is40YO)(void 0); }).toThrow();
        });

        it("should treat every other value as an empty array", function () {
            wannabeEmptyArrays.forEach(function (value) {
                expect(lamb.findIndex(value, is40YO)).toBe(-1);
                expect(lamb.findIndexWhere(is40YO)(value)).toBe(-1);
            });
        });
    });
});
