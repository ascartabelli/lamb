import * as lamb from "../..";
import { wannabeEmptyArrays, zeroesAsIntegers } from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("take / takeFrom", function () {
    it("should retrieve the first `n` elements of an array or array-like object", function () {
        expect(lamb.takeFrom(["a", "b"], 1)).toEqual(["a"]);
        expect(lamb.take(3)([1, 2, 3, 4])).toEqual([1, 2, 3]);
    });

    it("should work with array-like objects", function () {
        expect(lamb.takeFrom("abcd", 2)).toEqual(["a", "b"]);
        expect(lamb.take(2)("abcd")).toEqual(["a", "b"]);
    });

    it("should accept a negative `n`", function () {
        expect(lamb.takeFrom([1, 2, 3, 4], -1)).toEqual([1, 2, 3]);
        expect(lamb.take(-3)("abcd")).toEqual(["a"]);
    });

    it("should return a copy of the source array when `n` is greater than or equal to the array-like length", function () {
        expect(lamb.takeFrom(["a", "b"], 3)).toEqual(["a", "b"]);
        expect(lamb.takeFrom([1, 2, 3, 4], 4)).toEqual([1, 2, 3, 4]);
        expect(lamb.take(10)([1, 2, 3, 4])).toEqual([1, 2, 3, 4]);
    });

    it("should return an empty array when `n` is 0 or less or equal than the additive inverse of the array-like length", function () {
        expect(lamb.takeFrom([1, 2, 3, 4], 0)).toEqual([]);
        expect(lamb.take(-4)([1, 2, 3, 4])).toEqual([]);
        expect(lamb.take(-10)([1, 2, 3, 4])).toEqual([]);
    });

    it("should convert to integer the value received as `n`", function () {
        var arr = [1, 2, 3, 4, 5];

        zeroesAsIntegers.forEach(function (value) {
            expect(lamb.take(value)(arr)).toEqual([]);
            expect(lamb.takeFrom(arr, value)).toEqual([]);
        });

        [[1], 1.5, 1.25, 1.75, true, "1"].forEach(function (value) {
            expect(lamb.take(value)(arr)).toEqual([1]);
            expect(lamb.takeFrom(arr, value)).toEqual([1]);
        });

        expect(lamb.take(new Date())(arr)).toEqual(arr);
        expect(lamb.takeFrom(arr, new Date())).toEqual(arr);

        expect(lamb.take()(arr)).toEqual([]);
        expect(lamb.takeFrom(arr)).toEqual([]);
    });

    it("should always return dense arrays", function () {
        /* eslint-disable no-sparse-arrays */
        expect(lamb.takeFrom([1, , 3], 2)).toStrictArrayEqual([1, void 0]);
        expect(lamb.take(2)([1, , 3])).toStrictArrayEqual([1, void 0]);
        /* eslint-enable no-sparse-arrays */
    });

    it("should throw an exception if called without the data argument or without arguments at all", function () {
        expect(lamb.takeFrom).toThrow();
        expect(lamb.take(1)).toThrow();
        expect(lamb.take()).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined`", function () {
        expect(function () { lamb.takeFrom(null, 0); }).toThrow();
        expect(function () { lamb.takeFrom(void 0, 0); }).toThrow();
        expect(function () { lamb.take(0)(null); }).toThrow();
        expect(function () { lamb.take(0)(void 0); }).toThrow();
    });

    it("should treat every other value as an empty array", function () {
        wannabeEmptyArrays.forEach(function (value) {
            expect(lamb.takeFrom(value, 0)).toEqual([]);
            expect(lamb.take(0)(value)).toEqual([]);
        });
    });
});
