import * as lamb from "../..";
import { wannabeEmptyArrays, zeroesAsIntegers } from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("drop / dropFrom", function () {
    it("should drop the first `n` elements of an array or array-like object", function () {
        expect(lamb.dropFrom(["a", "b"], 1)).toEqual(["b"]);
        expect(lamb.drop(3)([1, 2, 3, 4])).toEqual([4]);
    });

    it("should work with array-like objects", function () {
        expect(lamb.dropFrom("abcd", 2)).toEqual(["c", "d"]);
        expect(lamb.drop(2)("abcd")).toEqual(["c", "d"]);
    });

    it("should accept a negative `n`", function () {
        expect(lamb.dropFrom([1, 2, 3, 4], -1)).toEqual([4]);
        expect(lamb.drop(-3)("abcd")).toEqual(["b", "c", "d"]);
    });

    it("should return a copy of the source array when `n` is 0 or less or equal than the additive inverse of the array-like length", function () {
        expect(lamb.dropFrom(["a", "b"], 0)).toEqual(["a", "b"]);
        expect(lamb.dropFrom([1, 2, 3, 4], -4)).toEqual([1, 2, 3, 4]);
        expect(lamb.drop(-10)([1, 2, 3, 4])).toEqual([1, 2, 3, 4]);
    });

    it("should return an empty array when `n` is greater than or equal to the array-like length", function () {
        expect(lamb.dropFrom([1, 2, 3, 4], 4)).toEqual([]);
        expect(lamb.dropFrom([1, 2, 3, 4], 5)).toEqual([]);
        expect(lamb.drop(10)([1, 2, 3, 4])).toEqual([]);
    });

    it("should convert to integer the value received as `n`", function () {
        var arr = [1, 2, 3, 4, 5];

        zeroesAsIntegers.forEach(function (value) {
            expect(lamb.drop(value)(arr)).toEqual(arr);
            expect(lamb.dropFrom(arr, value)).toEqual(arr);
        });

        [[1], 1.5, 1.25, 1.75, true, "1"].forEach(function (value) {
            expect(lamb.drop(value)(arr)).toEqual([2, 3, 4, 5]);
            expect(lamb.dropFrom(arr, value)).toEqual([2, 3, 4, 5]);
        });

        expect(lamb.drop(new Date())(arr)).toEqual([]);
        expect(lamb.dropFrom(arr, new Date())).toEqual([]);

        expect(lamb.drop()(arr)).toEqual(arr);
        expect(lamb.dropFrom(arr)).toEqual(arr);
    });

    it("should always return dense arrays", function () {
        /* eslint-disable no-sparse-arrays */
        expect(lamb.dropFrom([1, , 3], 1)).toStrictArrayEqual([void 0, 3]);
        expect(lamb.drop(1)([1, , 3])).toStrictArrayEqual([void 0, 3]);
        /* eslint-enable no-sparse-arrays */
    });

    it("should throw an exception if called without the data argument or without arguments at all", function () {
        expect(lamb.dropFrom).toThrow();
        expect(lamb.drop(1)).toThrow();
        expect(lamb.drop()).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined`", function () {
        expect(function () { lamb.dropFrom(null, 0); }).toThrow();
        expect(function () { lamb.dropFrom(void 0, 0); }).toThrow();
        expect(function () { lamb.drop(0)(null); }).toThrow();
        expect(function () { lamb.drop(0)(void 0); }).toThrow();
    });

    it("should treat every other value as an empty array", function () {
        wannabeEmptyArrays.forEach(function (value) {
            expect(lamb.dropFrom(value, 0)).toEqual([]);
            expect(lamb.drop(0)(value)).toEqual([]);
        });
    });
});
