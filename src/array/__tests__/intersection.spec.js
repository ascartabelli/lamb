import * as lamb from "../..";
import { wannabeEmptyArrays } from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("intersection", () => {
    const a1 = [0, 1, 2, 3, 4, NaN];
    const a2 = [-0, 2, 2, 3, 4, 5];
    const a3 = [4, 5, 1, NaN];
    const a4 = [6, 7];

    it("should return an array of every unique item present in all two given arrays", () => {
        expect(lamb.intersection(a2, a3)).toStrictEqual([4, 5]);

        expect(lamb.intersection(
            a1,
            lamb.intersection(a2, a3)
        )).toStrictEqual([4]);

        expect(lamb.intersection(
            lamb.intersection(a1, a2),
            a3
        )).toStrictEqual([4]);

        expect(lamb.intersection(
            lamb.intersection(a1, a2),
            lamb.intersection(a3, a4)
        )).toStrictEqual([]);
    });

    it("should use the SameValueZero comparison and put in the result the first value found when comparing `0` with `-0`", () => {
        expect(lamb.intersection(a1, a3)).toStrictEqual([1, 4, NaN]);
        expect(lamb.intersection(a2, a1)).toStrictEqual([-0, 2, 3, 4]);
        expect(Object.is(-0, lamb.intersection(a2, a1)[0])).toBe(true);
        expect(lamb.intersection(a1, a2)).toStrictEqual([0, 2, 3, 4]);
        expect(Object.is(0, lamb.intersection(a1, a2)[0])).toBe(true);
    });

    it("should accept array-like objects", () => {
        expect(lamb.intersection(
            lamb.intersection("123", "23"),
            lamb.intersection("432", "321")
        )).toStrictEqual(["2", "3"]);
        expect(lamb.intersection(
            ["1", "2"],
            lamb.intersection("23", "42")
        )).toStrictEqual(["2"]);
    });

    it("should always return dense arrays", () => {
        /* eslint-disable no-sparse-arrays */

        expect(lamb.intersection(
            lamb.intersection([1, , 3], [void 0, 3]),
            [3, , 4]
        )).toStrictArrayEqual([void 0, 3]);

        /* eslint-enable no-sparse-arrays */

        expect(lamb.intersection(Array(2), Array(3))).toStrictArrayEqual([void 0]);
    });

    it("should throw an exception if any of the array-like is `null` or `undefined`", () => {
        expect(() => { lamb.intersection(null, [1, 2]); }).toThrow();
        expect(() => { lamb.intersection(void 0, [1, 2]); }).toThrow();
        expect(() => { lamb.intersection([1, 2], void 0); }).toThrow();
        expect(() => { lamb.intersection([1, 2], null); }).toThrow();

        expect(lamb.intersection).toThrow();
    });

    it("should treat other values as empty arrays", () => {
        wannabeEmptyArrays.forEach(value => {
            expect(lamb.intersection([2, 3], value)).toStrictEqual([]);
            expect(lamb.intersection(value, [2, 3])).toStrictEqual([]);
        });
    });
});
