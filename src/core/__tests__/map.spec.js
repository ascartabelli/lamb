import * as lamb from "../..";
import { nonFunctions, wannabeEmptyArrays } from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("map / mapWith", function () {
    var double = function (n, idx, list) {
        expect(list[idx]).toBe(n);

        return n * 2;
    };
    var makeDoubles = lamb.mapWith(double);
    var numbers = [1, 2, 3, 4, 5];

    afterEach(function () {
        expect(numbers).toEqual([1, 2, 3, 4, 5]);
    });

    it("should apply the provided function to the elements of the given array", function () {
        expect(lamb.map(numbers, double)).toEqual([2, 4, 6, 8, 10]);
        expect(makeDoubles(numbers)).toEqual([2, 4, 6, 8, 10]);
    });

    it("should work with array-like objects", function () {
        expect(lamb.map("12345", double)).toEqual([2, 4, 6, 8, 10]);
        expect(makeDoubles("12345")).toEqual([2, 4, 6, 8, 10]);
    });

    it("should not skip deleted or unassigned elements, unlike the native method", function () {
        // eslint-disable-next-line comma-spacing, no-sparse-arrays
        var sparseArr = [, "foo", ,];
        var safeUpperCase = lamb.compose(lamb.invoke("toUpperCase"), String);
        var result = ["UNDEFINED", "FOO", "UNDEFINED"];

        expect(lamb.map(sparseArr, safeUpperCase)).toStrictArrayEqual(result);
        expect(lamb.map(sparseArr, lamb.identity)).toStrictArrayEqual([void 0, "foo", void 0]);
        expect(lamb.mapWith(safeUpperCase)(sparseArr)).toStrictArrayEqual(result);
        expect(lamb.mapWith(lamb.identity)(sparseArr)).toStrictArrayEqual([void 0, "foo", void 0]);
    });

    it("should throw an exception if the iteratee isn't a function or is missing", function () {
        nonFunctions.forEach(function (value) {
            expect(function () { lamb.mapWith(value)(numbers); }).toThrow();
        });

        expect(function () { lamb.mapWith()(numbers); }).toThrow();
    });

    it("should throw an exception if called without the data argument", function () {
        expect(lamb.map).toThrow();
        expect(makeDoubles).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", function () {
        expect(function () { lamb.map(null, double); }).toThrow();
        expect(function () { lamb.map(void 0, double); }).toThrow();
        expect(function () { makeDoubles(null); }).toThrow();
        expect(function () { makeDoubles(void 0); }).toThrow();
    });

    it("should treat every other value as an empty array", function () {
        wannabeEmptyArrays.forEach(function (value) {
            expect(lamb.map(value, double)).toEqual([]);
            expect(makeDoubles(value)).toEqual([]);
        });
    });
});
