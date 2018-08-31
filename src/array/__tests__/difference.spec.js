import * as lamb from "../..";
import { wannabeEmptyArrays } from "../../__tests__/commons";

describe("difference", function () {
    var a1 = [0, 1, 2, 3, 4, NaN];
    var a2 = [-0, 2, 3, 4, 5, NaN];
    var a3 = [4, 5, 1, 4, 5];
    var a4 = [6, 7];

    it("should return a new array with the items present only in the first of the two arrays", function () {
        var r = lamb.difference(a1, a4);

        expect(r).toEqual(a1);
        expect(r).not.toBe(a1);
        expect(lamb.difference(a1, a3)).toEqual([0, 2, 3, NaN]);
    });

    it("should use the \"SameValueZero\" comparison and keep the first encountered value in case of equality", function () {
        expect(lamb.difference(a1, a2)).toEqual([1]);
        expect(lamb.difference([-0, 1, 0, 2], [1, 3, 2])).toEqual([-0]);
    });

    it("should return an array without duplicates", function () {
        expect(lamb.difference(a3, a4)).toEqual([4, 5, 1]);
        expect(lamb.difference(a3, a1)).toEqual([5]);
    });

    it("should work with array-like objects", function () {
        expect(lamb.difference("abc", "bd")).toEqual(["a", "c"]);
        expect(lamb.difference(["a", "b", "c"], "bd")).toEqual(["a", "c"]);
        expect(lamb.difference("abc", ["b", "d"])).toEqual(["a", "c"]);
    });

    it("should throw an exception if called without arguments", function () {
        expect(lamb.difference).toThrow();
    });

    it("should throw an exception when a parameter is `null` or `undefined`", function () {
        expect(function () { lamb.difference(null, a4); }).toThrow();
        expect(function () { lamb.difference(void 0, a4); }).toThrow();
        expect(function () { lamb.difference(a4, null); }).toThrow();
        expect(function () { lamb.difference(a4, void 0); }).toThrow();
        expect(function () { lamb.difference(a4); }).toThrow();
    });

    it("should treat every other value in the main parameter as an empty array", function () {
        wannabeEmptyArrays.forEach(function (value) {
            expect(lamb.difference(value, a4)).toEqual([]);
        });
    });

    it("should treat every non-array-like value in the `other` parameter as an empty array", function () {
        wannabeEmptyArrays.forEach(function (value) {
            expect(lamb.difference(a1, value)).toEqual(a1);
            expect(lamb.difference(wannabeEmptyArrays, value)).toEqual(lamb.uniques(wannabeEmptyArrays));
        });
    });
});
