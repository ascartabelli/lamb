import * as lamb from "../..";
import { nonFunctions, wannabeEmptyArrays } from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("partition / partitionWith", function () {
    // to check "truthy" and "falsy" values returned by predicates
    var isVowel = function (char, idx, s) {
        expect(s[idx]).toBe(char);

        return ~"aeiouAEIOU".indexOf(char);
    };

    it("should split an array in two lists; one with the elements satisfying the predicate, the other with the remaining elements", function () {
        var persons = [
            { name: "Jane", surname: "Doe", active: false },
            { name: "John", surname: "Doe", active: true },
            { name: "Mario", surname: "Rossi", active: true },
            { name: "Paolo", surname: "Bianchi", active: false }
        ];

        var fooIsActive = function (el, idx, list) {
            expect(list[idx]).toBe(el);
            expect(list).toBe(persons);

            return el.active;
        };

        var result = [[
            { name: "John", surname: "Doe", active: true },
            { name: "Mario", surname: "Rossi", active: true }
        ], [
            { name: "Jane", surname: "Doe", active: false },
            { name: "Paolo", surname: "Bianchi", active: false }
        ]];

        expect(lamb.partition(persons, fooIsActive)).toEqual(result);
        expect(lamb.partitionWith(fooIsActive)(persons)).toEqual(result);
    });

    it("should return two lists even when the predicate is always satisfied or never satisfied", function () {
        var isGreaterThanTen = lamb.isGT(10);
        var arr1 = [1, 2, 3, 4, 5];
        var arr2 = [11, 12, 13, 14, 15];
        var arr3 = [];
        var res1 = [[], arr1.concat()];
        var res2 = [arr2.concat(), []];
        var res3 = [[], []];

        expect(lamb.partition(arr1, isGreaterThanTen)).toEqual(res1);
        expect(lamb.partitionWith(isGreaterThanTen)(arr1)).toEqual(res1);
        expect(lamb.partition(arr2, isGreaterThanTen)).toEqual(res2);
        expect(lamb.partitionWith(isGreaterThanTen)(arr2)).toEqual(res2);
        expect(lamb.partition(arr3, isGreaterThanTen)).toEqual(res3);
        expect(lamb.partitionWith(isGreaterThanTen)(arr3)).toEqual(res3);
    });

    it("should work with array-like objects and treat \"truthy\" and \"falsy\" values returned by predicates as booleans", function () {
        var testString = "Hello world";
        var result = [["e", "o", "o"], ["H", "l", "l", " ", "w", "r", "l", "d"]];

        expect(lamb.partition(testString, isVowel)).toEqual(result);
        expect(lamb.partitionWith(isVowel)(testString)).toEqual(result);
    });

    it("should always return dense arrays", function () {
        var sparseArr = [1, , 3, , 5]; // eslint-disable-line no-sparse-arrays

        expect(lamb.partition(sparseArr, lamb.isUndefined)).toStrictArrayEqual([
            [void 0, void 0], [1, 3, 5]
        ]);
        expect(lamb.partitionWith(lamb.isUndefined)(sparseArr)).toStrictArrayEqual([
            [void 0, void 0], [1, 3, 5]
        ]);
    });

    it("should throw an exception if called without the data argument", function () {
        expect(lamb.partition).toThrow();
        expect(lamb.partitionWith(lamb.identity)).toThrow();
    });

    it("should throw an exception when the predicate isn't a function or is missing", function () {
        nonFunctions.forEach(function (value) {
            expect(function () { lamb.partition([1, 2], value); }).toThrow();
            expect(function () { lamb.partitionWith(value)([1, 2]); }).toThrow();
        });

        expect(function () { lamb.partition([1, 2]); }).toThrow();
        expect(function () { lamb.partitionWith()([1, 2]); }).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", function () {
        expect(function () { lamb.partition(null); }).toThrow();
        expect(function () { lamb.partition(void 0); }).toThrow();
        expect(function () { lamb.partitionWith(lamb.identity)(null); }).toThrow();
        expect(function () { lamb.partitionWith(lamb.identity)(void 0); }).toThrow();
    });

    it("should treat every other value as an empty array", function () {
        wannabeEmptyArrays.forEach(function (value) {
            expect(lamb.partition(value, lamb.isType("Number"))).toEqual([[], []]);
            expect(lamb.partitionWith(lamb.isType("Number"))(value)).toEqual([[], []]);
        });
    });
});
