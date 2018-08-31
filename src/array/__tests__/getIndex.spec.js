import * as lamb from "../..";
import { zeroesAsIntegers, wannabeEmptyArrays } from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("getIndex / getAt / head / last", function () {
    var arr = [1, 2, 3, 4, 5];
    var arrCopy = arr.slice();
    var s = "abcde";
    var sparseArr = [, , 3, ,]; // eslint-disable-line comma-spacing, no-sparse-arrays
    var sparseArrCopy = sparseArr.slice();

    afterEach(function () {
        expect(arr).toStrictArrayEqual(arrCopy);
        expect(sparseArr).toStrictArrayEqual(sparseArrCopy);
    });

    it("should retrieve the element at the given index in an array-like object", function () {
        var getThird = lamb.getAt(2);

        expect(lamb.getIndex(arr, 1)).toBe(2);
        expect(lamb.getIndex(s, 1)).toBe("b");
        expect(getThird(arr)).toBe(3);
        expect(getThird(s)).toBe("c");
        expect(lamb.head(arr)).toBe(1);
        expect(lamb.head(s)).toBe("a");
        expect(lamb.last(arr)).toBe(5);
        expect(lamb.last(s)).toBe("e");
    });

    it("should allow negative indexes", function () {
        expect(lamb.getIndex(arr, -2)).toBe(4);
        expect(lamb.getIndex(s, -2)).toBe("d");
        expect(lamb.getAt(-2)(arr)).toBe(4);
        expect(lamb.getAt(-2)(s)).toBe("d");
    });

    it("should work with sparse arrays", function () {
        expect(lamb.getIndex(sparseArr, 2)).toBe(3);
        expect(lamb.getIndex(sparseArr, -2)).toBe(3);
        expect(lamb.getAt(2)(sparseArr)).toBe(3);
        expect(lamb.getAt(-2)(sparseArr)).toBe(3);
        expect(lamb.head(sparseArr)).toBe(void 0);
        expect(lamb.last(sparseArr)).toBe(void 0);
    });

    it("should return `undefined` if the index is out of bounds", function () {
        expect(lamb.getIndex(arr, -6)).toBeUndefined();
        expect(lamb.getIndex(arr, 66)).toBeUndefined();

        expect(lamb.getAt(-6)(arr)).toBeUndefined();
        expect(lamb.getAt(66)(arr)).toBeUndefined();

        expect(lamb.head([])).toBeUndefined();
        expect(lamb.last([])).toBeUndefined();
    });

    it("should convert the `index` parameter to integer", function () {
        zeroesAsIntegers.forEach(function (value) {
            expect(lamb.getIndex(arr, value)).toBe(arr[0]);
            expect(lamb.getAt(value)(arr)).toBe(arr[0]);
        });

        [[1], 1.5, 1.25, 1.75, true, "1"].forEach(function (value) {
            expect(lamb.getIndex(arr, value)).toBe(arr[1]);
            expect(lamb.getAt(value)(arr)).toBe(arr[1]);
        });

        expect(lamb.getIndex(arr, new Date())).toBeUndefined();
        expect(lamb.getAt(new Date())(arr)).toBeUndefined();

        expect(lamb.getIndex(arr)).toBe(arr[0]);
        expect(lamb.getAt()(arr)).toBe(arr[0]);
    });

    it("should throw an exception if called without the data argument", function () {
        expect(lamb.getIndex).toThrow();
        expect(lamb.getAt(1)).toThrow();
        expect(lamb.head).toThrow();
        expect(lamb.last).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", function () {
        expect(function () { lamb.getIndex(null, 2); }).toThrow();
        expect(function () { lamb.getIndex(void 0, 2); }).toThrow();
        expect(function () { lamb.getAt(2)(null); }).toThrow();
        expect(function () { lamb.getAt(2)(void 0); }).toThrow();
        expect(function () { lamb.head(null); }).toThrow();
        expect(function () { lamb.last(void 0); }).toThrow();
    });

    it("should return `undefined` for any other value", function () {
        wannabeEmptyArrays.forEach(function (v) {
            expect(lamb.getIndex(v, 2)).toBeUndefined();
            expect(lamb.getAt(2)(v)).toBeUndefined();
            expect(lamb.head(v)).toBeUndefined();
            expect(lamb.last(v)).toBeUndefined();
        });
    });
});
