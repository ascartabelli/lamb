import * as lamb from "../..";
import { wannabeEmptyArrays, zeroesAsIntegers } from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("rotate / rotateBy", function () {
    var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    afterEach(function () {
        expect(arr).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });

    it("should rotate the values of the array by the desired amount", function () {
        var r1 = [10, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        var r2 = [7, 8, 9, 10, 1, 2, 3, 4, 5, 6];

        expect(lamb.rotate(arr, 1)).toEqual(r1);
        expect(lamb.rotateBy(1)(arr)).toEqual(r1);
        expect(lamb.rotate(arr, 4)).toEqual(r2);
        expect(lamb.rotateBy(4)(arr)).toEqual(r2);
        expect(lamb.rotate([1], 1)).toEqual([1]);
        expect(lamb.rotateBy(1)([1])).toEqual([1]);
    });

    it("should return a copy of the source array if the `amount` is zero or equal to the array length or its additive inverse", function () {
        expect(lamb.rotate(arr, 0)).toEqual(arr);
        expect(lamb.rotateBy(0)(arr)).toEqual(arr);
        expect(lamb.rotate(arr, 10)).toEqual(arr);
        expect(lamb.rotateBy(10)(arr)).toEqual(arr);
        expect(lamb.rotate(arr, -10)).toEqual(arr);
        expect(lamb.rotateBy(-10)(arr)).toEqual(arr);
    });

    it("should accept values greater than the array length or less than its additive inverse and continue \"rotating\" values", function () {
        var r1 = [8, 9, 10, 1, 2, 3, 4, 5, 6, 7];
        var r2 = [5, 6, 7, 8, 9, 10, 1, 2, 3, 4];

        expect(lamb.rotate(arr, 13)).toEqual(r1);
        expect(lamb.rotateBy(13)(arr)).toEqual(r1);
        expect(lamb.rotate(arr, -14)).toEqual(r2);
        expect(lamb.rotateBy(-14)(arr)).toEqual(r2);
    });

    it("should convert to integer the value received as `amount`", function () {
        var d = new Date();
        var r1 = [10, 1, 2, 3, 4, 5, 6, 7, 8, 9];

        [[1], 1.5, 1.25, 1.75, true, "1"].forEach(function (value) {
            expect(lamb.rotate(arr, value)).toEqual(r1);
            expect(lamb.rotateBy(value)(arr)).toEqual(r1);
        });

        expect(lamb.rotate(arr, d)).toEqual(lamb.rotate(arr, d % arr.length));
        expect(lamb.rotateBy(d)(arr)).toEqual(lamb.rotate(arr, d % arr.length));

        zeroesAsIntegers.forEach(function (value) {
            expect(lamb.rotate(arr, value)).toEqual(arr);
            expect(lamb.rotateBy(value)(arr)).toEqual(arr);
        });

        expect(lamb.rotate(arr)).toEqual(arr);
        expect(lamb.rotateBy()(arr)).toEqual(arr);
    });

    it("should work with array-like objects", function () {
        var s = "123456789";
        var r = ["7", "8", "9", "1", "2", "3", "4", "5", "6"];

        expect(lamb.rotate(s, 3)).toEqual(r);
        expect(lamb.rotateBy(3)(s)).toEqual(r);
    });

    it("should always return dense arrays", function () {
        // eslint-disable-next-line comma-spacing, no-sparse-arrays
        var sparse = [1, , 3, ,];
        var r = [void 0, 3, void 0, 1];

        expect(lamb.rotate(sparse, 3)).toStrictArrayEqual(r);
        expect(lamb.rotateBy(3)(sparse)).toStrictArrayEqual(r);
    });

    it("should throw an exception if called without an array-like", function () {
        expect(lamb.rotate).toThrow();
        expect(lamb.rotateBy(10)).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined`", function () {
        expect(function () { lamb.rotate(null, 3); }).toThrow();
        expect(function () { lamb.rotateBy(3)(null); }).toThrow();
        expect(function () { lamb.rotate(void 0, 5); }).toThrow();
        expect(function () { lamb.rotateBy(3)(void 0); }).toThrow();
    });

    it("should treat every other value as an empty array", function () {
        wannabeEmptyArrays.forEach(function (value) {
            expect(lamb.rotate(value, 2)).toEqual([]);
            expect(lamb.rotateBy(1)(value)).toEqual([]);
        });
    });
});
