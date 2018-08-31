import * as lamb from "../..";
import { zeroesAsNumbers } from "../../__tests__/commons";

describe("range", function () {
    it("should generate an arithmetic progression of integers with the given parameters", function () {
        expect(lamb.range(3, 15, 2)).toEqual([3, 5, 7, 9, 11, 13]);
        expect(lamb.range(1, -10, -2)).toEqual([1, -1, -3, -5, -7, -9]);
    });

    it("should return an empty array if `start` isn't less than `limit` with a positive `step`", function () {
        expect(lamb.range(5, 3, 1)).toEqual([]);
        expect(lamb.range(1, -10, 2)).toEqual([]);
    });

    it("should return an empty array if `start` isn't greater than `limit` with a negative `step`", function () {
        expect(lamb.range(3, 5, -1)).toEqual([]);
        expect(lamb.range(-10, -1, -2)).toEqual([]);
    });

    it("should return an empty array if `step` is zero and `limit` equals `start`", function () {
        expect(lamb.range(2, 2, 0)).toEqual([]);
    });

    it("should return an array containing `start` if `step` is zero and `limit` isn't equal to `start`", function () {
        expect(lamb.range(2, 10, 0)).toEqual([2]);
    });

    it("should keep the sign of zeroes received as `start`", function () {
        expect(lamb.range(0, 2, 1)).toEqual([0, 1]);
        expect(lamb.range(-0, 2, 1)).toEqual([-0, 1]);
    });

    it("should convert the `start` parameter to number", function () {
        zeroesAsNumbers.forEach(function (value) {
            expect(lamb.range(value, 3)).toEqual([0, 1, 2]);
        });

        [[1], true, "1"].forEach(function (value) {
            expect(lamb.range(value, 3)).toEqual([1, 2]);
        });

        [[1.5], "1.5"].forEach(function (value) {
            expect(lamb.range(value, 3)).toEqual([1.5, 2.5]);
        });
    });

    it("should convert the `limit` parameter to number", function () {
        zeroesAsNumbers.forEach(function (value) {
            expect(lamb.range(-3, value)).toEqual([-3, -2, -1]);
        });

        [[1], true, "1"].forEach(function (value) {
            expect(lamb.range(-1, value)).toEqual([-1, 0]);
        });

        [[1.5], "1.5"].forEach(function (value) {
            expect(lamb.range(0, value, .5)).toEqual([0, 0.5, 1]);
        });
    });

    it("should use one as the default value of `step` if the parameter is missing", function () {
        expect(lamb.range(2, 10)).toEqual([2, 3, 4, 5, 6, 7, 8, 9]);
    });

    it("should convert the `step` parameter to number", function () {
        zeroesAsNumbers.forEach(function (value) {
            expect(lamb.range(-3, 3, value)).toEqual([-3]);
            expect(lamb.range(3, 3, value)).toEqual([]);
        });

        [[1], true, "1"].forEach(function (value) {
            expect(lamb.range(-1, 1, value)).toEqual([-1, 0]);
        });

        [[.5], ".5"].forEach(function (value) {
            expect(lamb.range(0, 1.5, value)).toEqual([0, 0.5, 1]);
        });
    });

    it("should return an empty array if called without parameters", function () {
        expect(lamb.range()).toEqual([]);
    });
});
