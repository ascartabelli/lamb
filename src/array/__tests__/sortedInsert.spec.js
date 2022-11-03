import compose from "../../core/compose";
import getKey from "../../object/getKey";
import invoke from "../../function/invoke";
import sortedInsert from "../sortedInsert";
import sorter from "../sorter";
import sorterDesc from "../sorterDesc";
import { nonFunctions, wannabeEmptyArrays } from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("sortedInsert", () => {
    const descSorter = sorterDesc();

    // eslint-disable-next-line id-length
    const personsByCaseInsensitiveNameAsc = [
        { name: "jane", surname: "doe" },
        { name: "John", surname: "Doe" },
        { name: "john", surname: "doe" },
        { name: "John", surname: "Moe" },
        { name: "Mario", surname: "Rossi" }
    ];

    const toLowerCase = invoke("toLowerCase");
    const getLowerCaseName = compose(toLowerCase, getKey("name"));

    it("should insert an element in a copy of a sorted array respecting the order", () => {
        const expectedResult = [
            { name: "jane", surname: "doe" },
            { name: "John", surname: "Doe" },
            { name: "john", surname: "doe" },
            { name: "John", surname: "Moe" },
            { name: "marco", surname: "Rossi" },
            { name: "Mario", surname: "Rossi" }
        ];

        const result = sortedInsert(
            personsByCaseInsensitiveNameAsc,
            { name: "marco", surname: "Rossi" },
            [sorter(getLowerCaseName)]
        );

        expect(result).toStrictEqual(expectedResult);
        expect(result).not.toBe(personsByCaseInsensitiveNameAsc);
        expect(personsByCaseInsensitiveNameAsc.length).toBe(5);

        // references are not broken
        expect(personsByCaseInsensitiveNameAsc[0]).toBe(result[0]);
    });

    it("should be able to insert an element in a multi-sorted array", () => {
        const expectedResult = [
            { name: "jane", surname: "doe" },
            { name: "John", surname: "Doe" },
            { name: "john", surname: "doe" },
            { name: "John", surname: "Foe" },
            { name: "John", surname: "Moe" },
            { name: "Mario", surname: "Rossi" }
        ];

        const getLowerCaseSurname = compose(toLowerCase, getKey("surname"));

        const result = sortedInsert(
            personsByCaseInsensitiveNameAsc,
            { name: "John", surname: "Foe" },
            [getLowerCaseName, getLowerCaseSurname]
        );

        expect(result).toStrictEqual(expectedResult);
        expect(result).not.toBe(personsByCaseInsensitiveNameAsc);
        expect(personsByCaseInsensitiveNameAsc.length).toBe(5);

        // references are not broken
        expect(personsByCaseInsensitiveNameAsc[0]).toBe(result[0]);
    });

    it("should allow inserting in a descending sorted array", () => {
        expect(sortedInsert([3, 2, 1], 1.5, [descSorter])).toStrictEqual([3, 2, 1.5, 1]);
        expect(sortedInsert([3, 2, 1], 2, [descSorter])).toStrictEqual([3, 2, 2, 1]);
    });

    it("should be able to insert values at the beginning and at the end of the array", () => {
        const arr = [1, 2, 3];

        expect(sortedInsert(arr, 0)).toStrictEqual([0, 1, 2, 3]);
        expect(sortedInsert(arr, 4)).toStrictEqual([1, 2, 3, 4]);
    });

    it("should accept an empty list", () => {
        expect(sortedInsert([], 1)).toStrictEqual([1]);
    });

    it("should accept array-like objects", () => {
        const s = "abdefg";
        const result = ["a", "b", "c", "d", "e", "f", "g"];

        expect(sortedInsert(s, "c", [sorter()])).toStrictEqual(result);
    });

    it("should automatically build a default sorting criterion if supplied only with a reader", () => {
        expect(sortedInsert([1, 2, 3], "2.5", [Number])).toStrictEqual([1, 2, "2.5", 3]);
    });

    it("should use a default ascending sorter if no sorters are supplied", () => {
        expect(sortedInsert([1, 2, 3], 2.5)).toStrictEqual([1, 2, 2.5, 3]);
    });

    it("should use a default ascending sorter if any of the received criteria isn't a function or a Sorter", () => {
        nonFunctions.forEach(value => {
            expect(sortedInsert([1, 2, 3], 2.5, [value])).toStrictEqual([1, 2, 2.5, 3]);
        });
    });

    it("should return an array copy of the array-like if there is no element to insert", () => {
        expect(sortedInsert([1, 2, 3])).toStrictEqual([1, 2, 3]);
        expect(sortedInsert("abc")).toStrictEqual(["a", "b", "c"]);
    });

    it("should allow to insert `nil` values if the value is passed explicitly", () => {
        expect(sortedInsert([1, 2, 3], null)).toStrictEqual([1, 2, 3, null]);
        expect(sortedInsert([1, 2, 3], void 0)).toStrictEqual([1, 2, 3, void 0]);
    });

    it("should consider deleted or unassigned indexes in sparse arrays as `undefined` values", () => {
        // eslint-disable-next-line comma-spacing, no-sparse-arrays
        const arr = ["a", "b", "c", , ,];
        const result = ["a", "b", "c", void 0, void 0, "z"];

        expect(sortedInsert(arr, "z", String)).toStrictArrayEqual(result);
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", () => {
        expect(() => {sortedInsert(null, 99); }).toThrow();
        expect(() => {sortedInsert(void 0, 99); }).toThrow();
    });

    it("should throw an exception if called without arguments", () => {
        expect(sortedInsert).toThrow();
    });

    it("should treat every other value as an empty array", () => {
        wannabeEmptyArrays.forEach(value => {
            expect(sortedInsert(value, 99)).toStrictEqual([99]);
        });
    });
});
