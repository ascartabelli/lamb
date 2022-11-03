import intersection from "../intersection";
import { wannabeEmptyArrays } from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("intersection", () => {
    const a1 = [0, 1, 2, 3, 4, NaN];
    const a2 = [-0, 2, 2, 3, 4, 5];
    const a3 = [4, 5, 1, NaN];
    const a4 = [6, 7];

    it("should return an array of every unique item present in all two given arrays", () => {
        expect(intersection(a2, a3)).toStrictEqual([4, 5]);

        expect(intersection(
            a1,
            intersection(a2, a3)
        )).toStrictEqual([4]);

        expect(intersection(
            intersection(a1, a2),
            a3
        )).toStrictEqual([4]);

        expect(intersection(
            intersection(a1, a2),
            intersection(a3, a4)
        )).toStrictEqual([]);
    });

    it("should use the SameValueZero comparison and put in the result the first value found when comparing `0` with `-0`", () => {
        expect(intersection(a1, a3)).toStrictEqual([1, 4, NaN]);
        expect(intersection(a2, a1)).toStrictEqual([-0, 2, 3, 4]);
        expect(Object.is(-0, intersection(a2, a1)[0])).toBe(true);
        expect(intersection(a1, a2)).toStrictEqual([0, 2, 3, 4]);
        expect(Object.is(0, intersection(a1, a2)[0])).toBe(true);
    });

    it("should accept array-like objects", () => {
        expect(intersection(
            intersection("123", "23"),
            intersection("432", "321")
        )).toStrictEqual(["2", "3"]);
        expect(intersection(
            ["1", "2"],
            intersection("23", "42")
        )).toStrictEqual(["2"]);
    });

    it("should always return dense arrays", () => {
        /* eslint-disable no-sparse-arrays */

        expect(intersection(
            intersection([1, , 3], [void 0, 3]),
            [3, , 4]
        )).toStrictArrayEqual([void 0, 3]);

        /* eslint-enable no-sparse-arrays */

        expect(intersection(Array(2), Array(3))).toStrictArrayEqual([void 0]);
    });

    it("should throw an exception if any of the array-like is `null` or `undefined`", () => {
        expect(() => { intersection(null, [1, 2]); }).toThrow();
        expect(() => { intersection(void 0, [1, 2]); }).toThrow();
        expect(() => { intersection([1, 2], void 0); }).toThrow();
        expect(() => { intersection([1, 2], null); }).toThrow();

        expect(intersection).toThrow();
    });

    it("should treat other values as empty arrays", () => {
        wannabeEmptyArrays.forEach(value => {
            expect(intersection([2, 3], value)).toStrictEqual([]);
            expect(intersection(value, [2, 3])).toStrictEqual([]);
        });
    });
});
