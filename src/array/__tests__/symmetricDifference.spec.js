import symmetricDifference from "../symmetricDifference";
import uniques from "../uniques";
import { wannabeEmptyArrays } from "../../__tests__/commons";

describe("symmetricDifference", () => {
    const a1 = [0, 1, 2, 3, 2, 4, NaN];
    const a2 = [-0, 2, 3, 4, 5, NaN];
    const a3 = [1, 3, 4, 5];
    const a4 = [6, 7];

    it("should return the symmetric difference of two arrays", () => {
        const r = symmetricDifference(a1, a3);

        expect(r).not.toBe(a1);
        expect(r).not.toBe(a3);
        expect(r).toStrictEqual([0, 2, NaN, 5]);
    });

    it("should use the \"SameValueZero\" comparison and keep the first encountered value in case of equality", () => {
        expect(symmetricDifference(a1, a2)).toStrictEqual([1, 5]);
        expect(symmetricDifference([-0, 1, 0, 2], [1, 3, 2])).toStrictEqual([-0, 3]);
    });

    it("should return an empty array if the items in both parameters are considered equivalent", () => {
        expect(symmetricDifference([], [])).toStrictEqual([]);
        expect(symmetricDifference(a1.concat(5), a2.concat(1))).toStrictEqual([]);
    });

    it("should work with array-like objects", () => {
        expect(symmetricDifference("abc", "bd")).toStrictEqual(["a", "c", "d"]);
        expect(symmetricDifference(["a", "b", "c"], "bd")).toStrictEqual(["a", "c", "d"]);
        expect(symmetricDifference("abc", ["b", "d"])).toStrictEqual(["a", "c", "d"]);
    });

    it("should throw an exception if called without arguments", () => {
        expect(symmetricDifference).toThrow();
    });

    it("should throw an exception when a parameter is `null` or `undefined`", () => {
        expect(() => { symmetricDifference(null, a4); }).toThrow();
        expect(() => { symmetricDifference(void 0, a4); }).toThrow();
        expect(() => { symmetricDifference(a4, null); }).toThrow();
        expect(() => { symmetricDifference(a4, void 0); }).toThrow();
        expect(() => { symmetricDifference(a4); }).toThrow();
    });

    it("should treat every other value in the main parameter as an empty array", () => {
        wannabeEmptyArrays.forEach(value => {
            expect(symmetricDifference(value, a4)).toStrictEqual(a4);
        });
    });

    it("should treat every non-array-like value in the `other` parameter as an empty array", () => {
        wannabeEmptyArrays.forEach(value => {
            expect(symmetricDifference(a1, value)).toStrictEqual(uniques(a1));
            expect(symmetricDifference(wannabeEmptyArrays, value))
                .toStrictEqual(uniques(wannabeEmptyArrays));
        });
    });
});
