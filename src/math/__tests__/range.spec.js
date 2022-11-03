import range from "../range";
import { zeroesAsNumbers } from "../../__tests__/commons";

describe("range", () => {
    it("should generate an arithmetic progression of integers with the given parameters", () => {
        expect(range(3, 15, 2)).toStrictEqual([3, 5, 7, 9, 11, 13]);
        expect(range(1, -10, -2)).toStrictEqual([1, -1, -3, -5, -7, -9]);
    });

    it("should return an empty array if `start` isn't less than `limit` with a positive `step`", () => {
        expect(range(5, 3, 1)).toStrictEqual([]);
        expect(range(1, -10, 2)).toStrictEqual([]);
    });

    it("should return an empty array if `start` isn't greater than `limit` with a negative `step`", () => {
        expect(range(3, 5, -1)).toStrictEqual([]);
        expect(range(-10, -1, -2)).toStrictEqual([]);
    });

    it("should return an empty array if `step` is zero and `limit` equals `start`", () => {
        expect(range(2, 2, 0)).toStrictEqual([]);
    });

    it("should return an array containing `start` if `step` is zero and `limit` isn't equal to `start`", () => {
        expect(range(2, 10, 0)).toStrictEqual([2]);
    });

    it("should keep the sign of zeroes received as `start`", () => {
        expect(range(0, 2, 1)).toStrictEqual([0, 1]);
        expect(range(-0, 2, 1)).toStrictEqual([-0, 1]);
    });

    it("should convert the `start` parameter to number", () => {
        zeroesAsNumbers.forEach(value => {
            expect(range(value, 3)).toStrictEqual([0, 1, 2]);
        });

        [[1], true, "1"].forEach(value => {
            expect(range(value, 3)).toStrictEqual([1, 2]);
        });

        [[1.5], "1.5"].forEach(value => {
            expect(range(value, 3)).toStrictEqual([1.5, 2.5]);
        });
    });

    it("should convert the `limit` parameter to number", () => {
        zeroesAsNumbers.forEach(value => {
            expect(range(-3, value)).toStrictEqual([-3, -2, -1]);
        });

        [[1], true, "1"].forEach(value => {
            expect(range(-1, value)).toStrictEqual([-1, 0]);
        });

        [[1.5], "1.5"].forEach(value => {
            expect(range(0, value, .5)).toStrictEqual([0, 0.5, 1]);
        });
    });

    it("should use one as the default value of `step` if the parameter is missing", () => {
        expect(range(2, 10)).toStrictEqual([2, 3, 4, 5, 6, 7, 8, 9]);
    });

    it("should convert the `step` parameter to number", () => {
        zeroesAsNumbers.forEach(value => {
            expect(range(-3, 3, value)).toStrictEqual([-3]);
            expect(range(3, 3, value)).toStrictEqual([]);
        });

        [[1], true, "1"].forEach(value => {
            expect(range(-1, 1, value)).toStrictEqual([-1, 0]);
        });

        [[.5], ".5"].forEach(value => {
            expect(range(0, 1.5, value)).toStrictEqual([0, 0.5, 1]);
        });
    });

    it("should return an empty array if called without parameters", () => {
        expect(range()).toStrictEqual([]);
    });
});
