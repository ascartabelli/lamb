import * as lamb from "../..";
import {
    nonFunctions,
    wannabeEmptyArrays,
    zeroesAsIntegers
} from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("updateIndex / updateAt", function () {
    var arr = [1, 2, 3, 4, 5];
    var arrCopy = arr.slice();
    var fn99 = lamb.always(99);
    var s = "abcde";
    var sparseArr = [, , 3, ,]; // eslint-disable-line comma-spacing, no-sparse-arrays
    var sparseArrCopy = sparseArr.slice();
    var sparseArrAsDense = [void 0, void 0, 3, void 0];

    afterEach(function () {
        expect(arr).toStrictArrayEqual(arrCopy);
        expect(sparseArr).toStrictArrayEqual(sparseArrCopy);
    });

    it("should allow to update a value in a copy of the given array-like object with the provided function", function () {
        var inc = jest.fn(function (n) { return n + 1; });

        expect(lamb.updateIndex(arr, 2, inc)).toEqual([1, 2, 4, 4, 5]);
        expect(lamb.updateAt(2, inc)(arr)).toEqual([1, 2, 4, 4, 5]);
        expect(inc).toHaveBeenCalledTimes(2);
        expect(inc.mock.calls[0].length).toBe(1);
        expect(inc.mock.calls[1].length).toBe(1);
        expect(inc.mock.calls[0]).toEqual([3]);
        expect(inc.mock.calls[1]).toEqual([3]);
        expect(lamb.updateIndex(s, 0, lamb.always("z"))).toEqual(["z", "b", "c", "d", "e"]);
        expect(lamb.updateAt(0, lamb.always("z"))(s)).toEqual(["z", "b", "c", "d", "e"]);
        expect(lamb.updateAt(1, fn99)([1, void 0, 3])).toEqual([1, 99, 3]);
    });

    it("should allow negative indexes", function () {
        var newArr = lamb.updateIndex(arr, -1, fn99);
        var newArr2 = lamb.updateAt(-5, fn99)(arr);

        expect(newArr).toEqual([1, 2, 3, 4, 99]);
        expect(newArr2).toEqual([99, 2, 3, 4, 5]);
    });

    it("should always return dense arrays", function () {
        var r1 = [void 0, void 0, 99, void 0];
        var r2 = [void 0, void 0, 3, 99];

        expect(lamb.updateIndex(sparseArr, 2, fn99)).toStrictArrayEqual(r1);
        expect(lamb.updateIndex(sparseArr, -2, fn99)).toStrictArrayEqual(r1);
        expect(lamb.updateIndex(sparseArr, -1, fn99)).toStrictArrayEqual(r2);
        expect(lamb.updateIndex(sparseArr, 3, fn99)).toStrictArrayEqual(r2);
        expect(lamb.updateAt(2, fn99)(sparseArr)).toStrictArrayEqual(r1);
        expect(lamb.updateAt(-2, fn99)(sparseArr)).toStrictArrayEqual(r1);
        expect(lamb.updateAt(-1, fn99)(sparseArr)).toStrictArrayEqual(r2);
        expect(lamb.updateAt(3, fn99)(sparseArr)).toStrictArrayEqual(r2);
    });

    it("should return an array copy of the array-like if the index is out of bounds", function () {
        var newArr = lamb.updateIndex(arr, 5, fn99);
        var newArr2 = lamb.updateAt(-6, fn99)(arr);
        var newS = lamb.updateAt(10, fn99)(s);
        var newSparseArr = lamb.updateIndex(sparseArr, 5, fn99);
        var newSparseArr2 = lamb.updateAt(5, fn99)(sparseArr);

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

        zeroesAsIntegers.forEach(function (value) {
            expect(lamb.updateIndex(arr, value, fn99)).toEqual(r1);
            expect(lamb.updateAt(value, fn99)(arr)).toEqual(r1);
        });

        [[1], 1.5, 1.25, 1.75, true, "1"].forEach(function (value) {
            expect(lamb.updateIndex(arr, value, fn99)).toEqual(r2);
            expect(lamb.updateAt(value, fn99)(arr)).toEqual(r2);
        });

        expect(lamb.updateIndex(arr, new Date(), fn99)).toEqual(arr);
        expect(lamb.updateAt(new Date(), fn99)(arr)).toEqual(arr);
    });

    it("should throw an exception if the `updater` isn't a function or if is missing", function () {
        nonFunctions.forEach(function (value) {
            expect(function () { lamb.updateIndex(arr, 0, value); }).toThrow();
            expect(function () { lamb.updateAt(0, value)(arr); }).toThrow();
        });

        expect(function () { lamb.updateIndex(arr, 0); }).toThrow();
        expect(function () { lamb.updateAt(0)(arr); }).toThrow();
    });

    it("should throw an exception if called without the data argument", function () {
        expect(lamb.updateIndex).toThrow();
        expect(lamb.updateAt(1, fn99)).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", function () {
        expect(function () { lamb.updateIndex(null, 0, fn99); }).toThrow();
        expect(function () { lamb.updateIndex(void 0, 0, fn99); }).toThrow();
        expect(function () { lamb.updateAt(0, fn99)(null); }).toThrow();
        expect(function () { lamb.updateAt(0, fn99)(void 0); }).toThrow();
    });

    it("should return an empty array for every other value", function () {
        wannabeEmptyArrays.forEach(function (v) {
            expect(lamb.updateIndex(v, 2, fn99)).toEqual([]);
            expect(lamb.updateAt(2, fn99)(v)).toEqual([]);
        });
    });
});
