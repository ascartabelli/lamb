import * as lamb from "../..";
import { nonFunctions, wannabeEmptyArrays } from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("sortedInsert", function () {
    var descSorter = lamb.sorterDesc();

    // eslint-disable-next-line id-length
    var personsByCaseInsensitiveNameAsc = [
        { name: "jane", surname: "doe" },
        { name: "John", surname: "Doe" },
        { name: "john", surname: "doe" },
        { name: "John", surname: "Moe" },
        { name: "Mario", surname: "Rossi" }
    ];

    var toLowerCase = lamb.invoke("toLowerCase");
    var getLowerCaseName = lamb.compose(toLowerCase, lamb.getKey("name"));

    it("should insert an element in a copy of a sorted array respecting the order", function () {
        var expectedResult = [
            { name: "jane", surname: "doe" },
            { name: "John", surname: "Doe" },
            { name: "john", surname: "doe" },
            { name: "John", surname: "Moe" },
            { name: "marco", surname: "Rossi" },
            { name: "Mario", surname: "Rossi" }
        ];

        var result = lamb.sortedInsert(
            personsByCaseInsensitiveNameAsc,
            { name: "marco", surname: "Rossi" },
            [lamb.sorter(getLowerCaseName)]
        );

        expect(result).toEqual(expectedResult);
        expect(result).not.toBe(personsByCaseInsensitiveNameAsc);
        expect(personsByCaseInsensitiveNameAsc.length).toBe(5);

        // references are not broken
        expect(personsByCaseInsensitiveNameAsc[0]).toBe(result[0]);
    });

    it("should be able to insert an element in a multi-sorted array", function () {
        var expectedResult = [
            { name: "jane", surname: "doe" },
            { name: "John", surname: "Doe" },
            { name: "john", surname: "doe" },
            { name: "John", surname: "Foe" },
            { name: "John", surname: "Moe" },
            { name: "Mario", surname: "Rossi" }
        ];

        var getLowerCaseSurname = lamb.compose(toLowerCase, lamb.getKey("surname"));

        var result = lamb.sortedInsert(
            personsByCaseInsensitiveNameAsc,
            { name: "John", surname: "Foe" },
            [getLowerCaseName, getLowerCaseSurname]
        );

        expect(result).toEqual(expectedResult);
        expect(result).not.toBe(personsByCaseInsensitiveNameAsc);
        expect(personsByCaseInsensitiveNameAsc.length).toBe(5);

        // references are not broken
        expect(personsByCaseInsensitiveNameAsc[0]).toBe(result[0]);
    });

    it("should allow inserting in a descending sorted array", function () {
        expect(lamb.sortedInsert([3, 2, 1], 1.5, [descSorter])).toEqual([3, 2, 1.5, 1]);
        expect(lamb.sortedInsert([3, 2, 1], 2, [descSorter])).toEqual([3, 2, 2, 1]);
    });

    it("should be able to insert values at the beginning and at the end of the array", function () {
        var arr = [1, 2, 3];

        expect(lamb.sortedInsert(arr, 0)).toEqual([0, 1, 2, 3]);
        expect(lamb.sortedInsert(arr, 4)).toEqual([1, 2, 3, 4]);
    });

    it("should accept an empty list", function () {
        expect(lamb.sortedInsert([], 1)).toEqual([1]);
    });

    it("should accept array-like objects", function () {
        var s = "abdefg";
        var result = ["a", "b", "c", "d", "e", "f", "g"];

        expect(lamb.sortedInsert(s, "c", [lamb.sorter()])).toEqual(result);
    });

    it("should automatically build a default sorting criterion if supplied only with a reader", function () {
        expect(lamb.sortedInsert([1, 2, 3], "2.5", [Number])).toEqual([1, 2, "2.5", 3]);
    });

    it("should use a default ascending sorter if no sorters are supplied", function () {
        expect(lamb.sortedInsert([1, 2, 3], 2.5)).toEqual([1, 2, 2.5, 3]);
    });

    it("should use a default ascending sorter if any of the received criteria isn't a function or a Sorter", function () {
        nonFunctions.forEach(function (value) {
            expect(lamb.sortedInsert([1, 2, 3], 2.5, [value])).toEqual([1, 2, 2.5, 3]);
        });
    });

    it("should return an array copy of the array-like if there is no element to insert", function () {
        expect(lamb.sortedInsert([1, 2, 3])).toEqual([1, 2, 3]);
        expect(lamb.sortedInsert("abc")).toEqual(["a", "b", "c"]);
    });

    it("should allow to insert `nil` values if the value is passed explicitly", function () {
        expect(lamb.sortedInsert([1, 2, 3], null)).toEqual([1, 2, 3, null]);
        expect(lamb.sortedInsert([1, 2, 3], void 0)).toEqual([1, 2, 3, void 0]);
    });

    it("should consider deleted or unassigned indexes in sparse arrays as `undefined` values", function () {
        // eslint-disable-next-line comma-spacing, no-sparse-arrays
        var arr = ["a", "b", "c", , ,];
        var result = ["a", "b", "c", void 0, void 0, "z"];

        expect(lamb.sortedInsert(arr, "z", String)).toStrictArrayEqual(result);
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", function () {
        expect(function () {lamb.sortedInsert(null, 99); }).toThrow();
        expect(function () {lamb.sortedInsert(void 0, 99); }).toThrow();
    });

    it("should throw an exception if called without arguments", function () {
        expect(lamb.sortedInsert).toThrow();
    });

    it("should treat every other value as an empty array", function () {
        wannabeEmptyArrays.forEach(function (value) {
            expect(lamb.sortedInsert(value, 99)).toEqual([99]);
        });
    });
});
