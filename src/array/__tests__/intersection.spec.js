import * as lamb from "../..";
import { wannabeEmptyArrays } from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("intersection", function () {
    var a1 = [0, 1, 2, 3, 4, NaN];
    var a2 = [-0, 2, 2, 3, 4, 5];
    var a3 = [4, 5, 1, NaN];
    var a4 = [6, 7];

    it("should return an array of every unique item present in all two given arrays", function () {
        expect(lamb.intersection(a2, a3)).toEqual([4, 5]);

        expect(lamb.intersection(
            a1,
            lamb.intersection(a2, a3)
        )).toEqual([4]);

        expect(lamb.intersection(
            lamb.intersection(a1, a2),
            a3
        )).toEqual([4]);

        expect(lamb.intersection(
            lamb.intersection(a1, a2),
            lamb.intersection(a3, a4)
        )).toEqual([]);
    });

    it("should use the SameValueZero comparison and put in the result the first value found when comparing `0` with `-0`", function () {
        expect(lamb.intersection(a1, a3)).toEqual([1, 4, NaN]);
        expect(lamb.intersection(a2, a1)).toEqual([-0, 2, 3, 4]);
        expect(Object.is(-0, lamb.intersection(a2, a1)[0])).toBe(true);
        expect(lamb.intersection(a1, a2)).toEqual([0, 2, 3, 4]);
        expect(Object.is(0, lamb.intersection(a1, a2)[0])).toBe(true);
    });

    it("should accept array-like objects", function () {
        expect(lamb.intersection(
            lamb.intersection("123", "23"),
            lamb.intersection("432", "321")
        )).toEqual(["2", "3"]);
        expect(lamb.intersection(
            ["1", "2"],
            lamb.intersection("23", "42")
        )).toEqual(["2"]);
    });

    it("should always return dense arrays", function () {
        /* eslint-disable no-sparse-arrays */

        expect(lamb.intersection(
            lamb.intersection([1, , 3], [void 0, 3]),
            [3, , 4]
        )).toStrictArrayEqual([void 0, 3]);

        /* eslint-enable no-sparse-arrays */

        expect(lamb.intersection(Array(2), Array(3))).toStrictArrayEqual([void 0]);
    });

    it("should throw an exception if any of the array-like is `null` or `undefined`", function () {
        expect(function () { lamb.intersection(null, [1, 2]); }).toThrow();
        expect(function () { lamb.intersection([1, 2], void 0); }).toThrow();

        expect(lamb.intersection).toThrow();
    });

    it("should treat other values as empty arrays", function () {
        wannabeEmptyArrays.forEach(function (value) {
            expect(lamb.intersection([2, 3], value)).toEqual([]);
            expect(lamb.intersection(value, [2, 3])).toEqual([]);
        });
    });
});
