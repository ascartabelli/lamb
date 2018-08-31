import * as lamb from "../..";
import { wannabeEmptyArrays, zeroesAsIntegers } from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("setIndex / setAt", function () {
    var arr = [1, 2, 3, 4, 5];
    var arrCopy = arr.slice();
    var s = "abcde";
    var sparseArr = [, , 3, ,]; // eslint-disable-line comma-spacing, no-sparse-arrays
    var sparseArrCopy = sparseArr.slice();
    var sparseArrAsDense = [void 0, void 0, 3, void 0];

    afterEach(function () {
        expect(arr).toStrictArrayEqual(arrCopy);
        expect(sparseArr).toStrictArrayEqual(sparseArrCopy);
    });

    it("should allow to set a value in a copy of the given array-like object", function () {
        var r1 = [1, 2, 99, 4, 5];
        var r2 = ["z", "b", "c", "d", "e"];

        expect(lamb.setIndex(arr, 2, 99)).toEqual(r1);
        expect(lamb.setAt(2, 99)(arr)).toEqual(r1);
        expect(lamb.setIndex(s, 0, "z")).toEqual(r2);
        expect(lamb.setAt(0, "z")(s)).toEqual(r2);
    });

    it("should allow negative indexes", function () {
        var newArr = lamb.setIndex(arr, -1, 99);
        var newArr2 = lamb.setAt(-5, 99)(arr);

        expect(newArr).toEqual([1, 2, 3, 4, 99]);
        expect(newArr2).toEqual([99, 2, 3, 4, 5]);
    });

    it("should always return dense arrays", function () {
        var r1 = [void 0, void 0, 99, void 0];
        var r2 = [void 0, void 0, 3, 99];

        expect(lamb.setIndex(sparseArr, 2, 99)).toStrictArrayEqual(r1);
        expect(lamb.setIndex(sparseArr, -2, 99)).toStrictArrayEqual(r1);
        expect(lamb.setIndex(sparseArr, -1, 99)).toStrictArrayEqual(r2);
        expect(lamb.setIndex(sparseArr, 3, 99)).toStrictArrayEqual(r2);
        expect(lamb.setAt(2, 99)(sparseArr)).toStrictArrayEqual(r1);
        expect(lamb.setAt(-2, 99)(sparseArr)).toStrictArrayEqual(r1);
        expect(lamb.setAt(-1, 99)(sparseArr)).toStrictArrayEqual(r2);
        expect(lamb.setAt(3, 99)(sparseArr)).toStrictArrayEqual(r2);
    });

    it("should return an array copy of the array-like if the index is out of bounds", function () {
        var newArr = lamb.setIndex(arr, 5, 99);
        var newArr2 = lamb.setAt(-6, 99)(arr);
        var newS = lamb.setAt(10, 99)(s);
        var newSparseArr = lamb.setIndex(sparseArr, 5, 99);
        var newSparseArr2 = lamb.setAt(5, 99)(sparseArr);

        expect(newArr).toEqual([1, 2, 3, 4, 5]);
        expect(newArr2).toEqual([1, 2, 3, 4, 5]);
        expect(newArr).not.toBe(arr);
        expect(newArr2).not.toBe(arr);
        expect(newS).toEqual(["a", "b", "c", "d", "e"]);
        expect(newSparseArr).toEqual(sparseArrAsDense);
        expect(newSparseArr).not.toBe(sparseArr);
        expect(newSparseArr2).toEqual(sparseArrAsDense);
        expect(newSparseArr2).not.toBe(sparseArr);
    });

    it("should convert the `index` parameter to integer", function () {
        var r1 = [99, 2, 3, 4, 5];
        var r2 = [1, 99, 3, 4, 5];
        var r3 = [void 0, 2, 3, 4, 5];

        zeroesAsIntegers.forEach(function (value) {
            expect(lamb.setIndex(arr, value, 99)).toEqual(r1);
            expect(lamb.setAt(value, 99)(arr)).toEqual(r1);
        });

        [[1], 1.5, 1.25, 1.75, true, "1"].forEach(function (value) {
            expect(lamb.setIndex(arr, value, 99)).toEqual(r2);
            expect(lamb.setAt(value, 99)(arr)).toEqual(r2);
        });

        expect(lamb.setIndex(arr, new Date(), 99)).toEqual(arr);
        expect(lamb.setAt(new Date(), 99)(arr)).toEqual(arr);

        expect(lamb.setIndex(arr)).toEqual(r3);
        expect(lamb.setAt()(arr)).toEqual(r3);
    });

    it("should throw an exception if called without the data argument", function () {
        expect(lamb.setIndex).toThrow();
        expect(lamb.setAt(1, 1)).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", function () {
        expect(function () { lamb.setAt(0, 99)(null); }).toThrow();
        expect(function () { lamb.setAt(0, 99)(void 0); }).toThrow();
        expect(function () { lamb.setIndex(null, 0, 99); }).toThrow();
        expect(function () { lamb.setIndex(void 0, 0, 99); }).toThrow();
    });

    it("should return an empty array for every other value", function () {
        wannabeEmptyArrays.forEach(function (v) {
            expect(lamb.setIndex(v, 2, 99)).toEqual([]);
            expect(lamb.setAt(2, 99)(v)).toEqual([]);
        });
    });
});
