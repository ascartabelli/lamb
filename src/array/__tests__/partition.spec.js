import identity from "../../core/identity";
import isGT from "../../logic/isGT";
import isType from "../../type/isType";
import isUndefined from "../../core/isUndefined";
import partition from "../partition";
import partitionWith from "../partitionWith";
import { nonFunctions, wannabeEmptyArrays } from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("partition / partitionWith", () => {
    // to check "truthy" and "falsy" values returned by predicates
    function isVowel (char, idx, s) {
        expect(s[idx]).toBe(char);

        return ~"aeiouAEIOU".indexOf(char);
    }

    it("should split an array in two lists; one with the elements satisfying the predicate, the other with the remaining elements", () => {
        function fooIsActive (el, idx, list) {
            expect(list[idx]).toBe(el);
            expect(list).toBe(persons);

            return el.active;
        }

        const persons = [
            { name: "Jane", surname: "Doe", active: false },
            { name: "John", surname: "Doe", active: true },
            { name: "Mario", surname: "Rossi", active: true },
            { name: "Paolo", surname: "Bianchi", active: false }
        ];
        const result = [[
            { name: "John", surname: "Doe", active: true },
            { name: "Mario", surname: "Rossi", active: true }
        ], [
            { name: "Jane", surname: "Doe", active: false },
            { name: "Paolo", surname: "Bianchi", active: false }
        ]];

        expect(partition(persons, fooIsActive)).toStrictEqual(result);
        expect(partitionWith(fooIsActive)(persons)).toStrictEqual(result);
    });

    it("should return two lists even when the predicate is always satisfied or never satisfied", () => {
        const isGreaterThanTen = isGT(10);
        const arr1 = [1, 2, 3, 4, 5];
        const arr2 = [11, 12, 13, 14, 15];
        const arr3 = [];
        const res1 = [[], arr1.concat()];
        const res2 = [arr2.concat(), []];
        const res3 = [[], []];

        expect(partition(arr1, isGreaterThanTen)).toStrictEqual(res1);
        expect(partitionWith(isGreaterThanTen)(arr1)).toStrictEqual(res1);
        expect(partition(arr2, isGreaterThanTen)).toStrictEqual(res2);
        expect(partitionWith(isGreaterThanTen)(arr2)).toStrictEqual(res2);
        expect(partition(arr3, isGreaterThanTen)).toStrictEqual(res3);
        expect(partitionWith(isGreaterThanTen)(arr3)).toStrictEqual(res3);
    });

    it("should work with array-like objects and treat \"truthy\" and \"falsy\" values returned by predicates as booleans", () => {
        const testString = "Hello world";
        const result = [["e", "o", "o"], ["H", "l", "l", " ", "w", "r", "l", "d"]];

        expect(partition(testString, isVowel)).toStrictEqual(result);
        expect(partitionWith(isVowel)(testString)).toStrictEqual(result);
    });

    it("should always return dense arrays", () => {
        const sparseArr = [1, , 3, , 5]; // eslint-disable-line no-sparse-arrays

        expect(partition(sparseArr, isUndefined)).toStrictArrayEqual([
            [void 0, void 0], [1, 3, 5]
        ]);
        expect(partitionWith(isUndefined)(sparseArr)).toStrictArrayEqual([
            [void 0, void 0], [1, 3, 5]
        ]);
    });

    it("should throw an exception if called without the data argument", () => {
        expect(partition).toThrow();
        expect(partitionWith(identity)).toThrow();
    });

    it("should throw an exception when the predicate isn't a function or is missing", () => {
        nonFunctions.forEach(value => {
            expect(() => { partition([1, 2], value); }).toThrow();
            expect(() => { partitionWith(value)([1, 2]); }).toThrow();
        });

        expect(() => { partition([1, 2]); }).toThrow();
        expect(() => { partitionWith()([1, 2]); }).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", () => {
        expect(() => { partition(null); }).toThrow();
        expect(() => { partition(void 0); }).toThrow();
        expect(() => { partitionWith(identity)(null); }).toThrow();
        expect(() => { partitionWith(identity)(void 0); }).toThrow();
    });

    it("should treat every other value as an empty array", () => {
        wannabeEmptyArrays.forEach(value => {
            expect(partition(value, isType("Number"))).toStrictEqual([[], []]);
            expect(partitionWith(isType("Number"))(value)).toStrictEqual([[], []]);
        });
    });
});
