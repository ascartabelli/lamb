import * as lamb from "../..";
import { nonFunctions, wannabeEmptyArrays } from "../../__tests__/commons";

describe("reduce / reduceWith", function () {
    var arr = [1, 2, 3, 4, 5];
    var s = "12345";

    afterEach(function () {
        expect(arr).toEqual([1, 2, 3, 4, 5]);
    });

    it("should fold or reduce the provided array with the given accumulator function starting from the first element", function () {
        var subtract = jest.fn(function (prev, current, idx, list) {
            expect(list).toBe(arr);
            expect(list[idx]).toBe(current);

            return prev - current;
        });

        var prevValues = [
            1, -1, -4, -8, 0, -1, -3, -6, -10, 10, 9, 7, 4, 0,
            1, -1, -4, -8, 0, -1, -3, -6, -10, 10, 9, 7, 4, 0
        ];

        expect(lamb.reduce(arr, subtract)).toBe(-13);
        expect(lamb.reduce(arr, subtract, 0)).toBe(-15);
        expect(lamb.reduce(arr, subtract, 10)).toBe(-5);
        expect(lamb.reduceWith(subtract)(arr)).toBe(-13);
        expect(lamb.reduceWith(subtract, 0)(arr)).toBe(-15);
        expect(lamb.reduceWith(subtract, 10)(arr)).toBe(-5);

        expect(subtract).toHaveBeenCalledTimes(prevValues.length);

        prevValues.forEach(function (prevValue, idx) {
            expect(subtract.mock.calls[idx][0]).toEqual(prevValue);
        });
    });

    it("should work with array-like objects", function () {
        var fn = lamb.tapArgs(lamb.subtract, [lamb.identity, Number]);

        expect(lamb.reduce(s, fn)).toBe(-13);
        expect(lamb.reduce(s, fn, 0)).toBe(-15);
        expect(lamb.reduce(s, fn, 10)).toBe(-5);
        expect(lamb.reduceWith(fn)(s)).toBe(-13);
        expect(lamb.reduceWith(fn, 0)(s)).toBe(-15);
        expect(lamb.reduceWith(fn, 10)(s)).toBe(-5);
    });

    it("should not skip deleted or unassigned elements, unlike the native method", function () {
        var sum = jest.fn(function (a, b) { return a + b; });
        var sparseArr = Array(3);

        sparseArr[1] = 3;

        expect(lamb.reduce(sparseArr, sum, 0)).toEqual(NaN);
        expect(lamb.reduceWith(sum, 0)(sparseArr)).toEqual(NaN);
        expect(sum).toHaveBeenCalledTimes(6);
    });

    it("should build a function throwing an exception if the accumulator isn't a function or is missing", function () {
        nonFunctions.forEach(function (value) {
            expect(function () { lamb.reduce(arr, value, 0); }).toThrow();
            expect(function () { lamb.reduceWith(value, 0)(arr); }).toThrow();
        });

        expect(function () { lamb.reduce(arr); }).toThrow();
        expect(function () { lamb.reduceWith()(arr); }).toThrow();
    });

    it("should throw an exception if called without the data argument", function () {
        expect(lamb.reduce).toThrow();
        expect(lamb.reduceWith(lamb.sum, 0)).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", function () {
        expect(function () { lamb.reduce(null, lamb.subtract, 0); }).toThrow();
        expect(function () { lamb.reduce(void 0, lamb.subtract, 0); }).toThrow();
        expect(function () { lamb.reduceWith(lamb.subtract, 0)(null); }).toThrow();
        expect(function () { lamb.reduceWith(lamb.subtract, 0)(void 0); }).toThrow();
    });

    it("should throw an exception when supplied with an empty array-like without an initial value", function () {
        expect(function () { lamb.reduce([], lamb.subtract); }).toThrow();
        expect(function () { lamb.reduce("", lamb.subtract); }).toThrow();
        expect(function () { lamb.reduceWith(lamb.subtract)([]); }).toThrow();
        expect(function () { lamb.reduceWith(lamb.subtract)(""); }).toThrow();
    });

    it("should treat every other value as an empty array and return the initial value", function () {
        wannabeEmptyArrays.forEach(function (value) {
            expect(lamb.reduce(value, lamb.subtract, 99)).toEqual(99);
            expect(lamb.reduceWith(lamb.subtract, 99)(value)).toEqual(99);
        });
    });
});
