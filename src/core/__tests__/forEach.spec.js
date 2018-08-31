import * as lamb from "../..";
import { nonFunctions, wannabeEmptyArrays } from "../../__tests__/commons";

describe("forEach", function () {
    var arr = [1, 2, 3, 4, 5];
    var fn = function (el, idx, list) {
        expect(list[idx]).toBe(el);
    };

    it("should execute the given function for every element of the provided array", function () {
        expect(lamb.forEach(arr, fn)).toBeUndefined();
    });

    it("should work with array-like objects", function () {
        expect(lamb.forEach("foo bar", fn)).toBeUndefined();
    });

    it("should not skip deleted or unassigned elements, unlike the native method", function () {
        var sparseArr = Array(3);

        sparseArr[1] = 3;

        var dummyFn = jest.fn();

        expect(lamb.forEach(sparseArr, dummyFn)).toBeUndefined();
        expect(dummyFn).toHaveBeenCalledTimes(3);
        expect(dummyFn.mock.calls[0]).toEqual([void 0, 0, sparseArr]);
        expect(dummyFn.mock.calls[1]).toEqual([3, 1, sparseArr]);
        expect(dummyFn.mock.calls[2]).toEqual([void 0, 2, sparseArr]);
    });

    it("should throw an exception if the predicate isn't a function or is missing", function () {
        nonFunctions.forEach(function (value) {
            expect(function () { lamb.forEach(arr, value); }).toThrow();
        });

        expect(function () { lamb.forEach(arr); }).toThrow();
    });

    it("should throw an exception if called without the data argument", function () {
        expect(lamb.forEach).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", function () {
        expect(function () { lamb.forEach(null, fn); }).toThrow();
        expect(function () { lamb.forEach(void 0, fn); }).toThrow();
    });

    it("should treat every other value as an empty array", function () {
        var dummyFn = jest.fn();

        wannabeEmptyArrays.forEach(function (value) {
            expect(lamb.forEach(value, dummyFn)).toBeUndefined();
        });

        expect(dummyFn).toHaveBeenCalledTimes(0);
    });
});
