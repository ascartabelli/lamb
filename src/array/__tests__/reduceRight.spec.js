import * as lamb from "../..";
import { nonFunctions, wannabeEmptyArrays } from "../../__tests__/commons";

describe("reduceRight / reduceRightWith", function () {
    var arr = [1, 2, 3, 4, 5];
    var s = "12345";

    afterEach(function () {
        expect(arr).toEqual([1, 2, 3, 4, 5]);
    });

    it("should fold or reduce the provided array with the given accumulator function starting from the last element", function () {
        var subtract = jest.fn(function (prev, current, idx, list) {
            expect(list).toBe(arr);
            expect(list[idx]).toBe(current);

            return prev - current;
        });

        var prevValues = [
            5, 1, -2, -4, 0, -5, -9, -12, -14, 10, 5, 1, -2, -4,
            5, 1, -2, -4, 0, -5, -9, -12, -14, 10, 5, 1, -2, -4
        ];

        expect(lamb.reduceRight(arr, subtract)).toBe(-5);
        expect(lamb.reduceRight(arr, subtract, 0)).toBe(-15);
        expect(lamb.reduceRight(arr, subtract, 10)).toBe(-5);
        expect(lamb.reduceRightWith(subtract)(arr)).toBe(-5);
        expect(lamb.reduceRightWith(subtract, 0)(arr)).toBe(-15);
        expect(lamb.reduceRightWith(subtract, 10)(arr)).toBe(-5);

        expect(subtract).toHaveBeenCalledTimes(prevValues.length);

        prevValues.forEach(function (prevValue, idx) {
            expect(subtract.mock.calls[idx][0]).toEqual(prevValue);
        });
    });

    it("should work with array-like objects", function () {
        var fn = lamb.tapArgs(lamb.subtract, [lamb.identity, Number]);

        expect(lamb.reduceRight(s, fn)).toBe(-5);
        expect(lamb.reduceRight(s, fn, 0)).toBe(-15);
        expect(lamb.reduceRight(s, fn, 10)).toBe(-5);
        expect(lamb.reduceRightWith(fn)(s)).toBe(-5);
        expect(lamb.reduceRightWith(fn, 0)(s)).toBe(-15);
        expect(lamb.reduceRightWith(fn, 10)(s)).toBe(-5);
    });

    it("should not skip deleted or unassigned elements, unlike the native method", function () {
        var sum = jest.fn(function (a, b) { return a + b; });
        var sparseArr = Array(3);

        sparseArr[1] = 3;

        expect(lamb.reduceRight(sparseArr, sum, 0)).toEqual(NaN);
        expect(lamb.reduceRightWith(sum, 0)(sparseArr)).toEqual(NaN);
        expect(sum).toHaveBeenCalledTimes(6);
    });

    it("should build a function throwing an exception if the accumulator isn't a function or is missing", function () {
        nonFunctions.forEach(function (value) {
            expect(function () { lamb.reduceRight(arr, value, 0); }).toThrow();
            expect(function () { lamb.reduceRightWith(value, 0)(arr); }).toThrow();
        });

        expect(function () { lamb.reduceRight(arr); }).toThrow();
        expect(function () { lamb.reduceRightWith()(arr); }).toThrow();
    });

    it("should throw an exception if called without the data argument", function () {
        expect(lamb.reduceRight).toThrow();
        expect(lamb.reduceRightWith(lamb.sum, 0)).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", function () {
        expect(function () { lamb.reduceRight(null, lamb.subtract, 0); }).toThrow();
        expect(function () { lamb.reduceRight(void 0, lamb.subtract, 0); }).toThrow();
        expect(function () { lamb.reduceRightWith(lamb.subtract, 0)(null); }).toThrow();
        expect(function () { lamb.reduceRightWith(lamb.subtract, 0)(void 0); }).toThrow();
    });

    it("should throw an exception when supplied with an empty array-like without an initial value", function () {
        expect(function () { lamb.reduceRight([], lamb.subtract); }).toThrow();
        expect(function () { lamb.reduceRight("", lamb.subtract); }).toThrow();
        expect(function () { lamb.reduceRightWith(lamb.subtract)([]); }).toThrow();
        expect(function () { lamb.reduceRightWith(lamb.subtract)(""); }).toThrow();
    });

    it("should treat every other value as an empty array and return the initial value", function () {
        wannabeEmptyArrays.forEach(function (value) {
            expect(lamb.reduceRight(value, lamb.subtract, 99)).toEqual(99);
            expect(lamb.reduceRightWith(lamb.subtract, 99)(value)).toEqual(99);
        });
    });
});
