import difference from "../difference";
import uniques from "../uniques";
import { wannabeEmptyArrays } from "../../__tests__/commons";

describe("difference", () => {
    const a1 = [0, 1, 2, 3, 4, NaN];
    const a2 = [-0, 2, 3, 4, 5, NaN];
    const a3 = [4, 5, 1, 4, 5];
    const a4 = [6, 7];

    it("should return a new array with the items present only in the first of the two arrays", () => {
        const r = difference(a1, a4);

        expect(r).toStrictEqual(a1);
        expect(r).not.toBe(a1);
        expect(difference(a1, a3)).toStrictEqual([0, 2, 3, NaN]);
    });

    it("should use the \"SameValueZero\" comparison and keep the first encountered value in case of equality", () => {
        expect(difference(a1, a2)).toStrictEqual([1]);
        expect(difference([-0, 1, 0, 2], [1, 3, 2])).toStrictEqual([-0]);
    });

    it("should return an array without duplicates", () => {
        expect(difference(a3, a4)).toStrictEqual([4, 5, 1]);
        expect(difference(a3, a1)).toStrictEqual([5]);
    });

    it("should work with array-like objects", () => {
        expect(difference("abc", "bd")).toStrictEqual(["a", "c"]);
        expect(difference(["a", "b", "c"], "bd")).toStrictEqual(["a", "c"]);
        expect(difference("abc", ["b", "d"])).toStrictEqual(["a", "c"]);
    });

    it("should throw an exception if called without arguments", () => {
        expect(difference).toThrow();
    });

    it("should throw an exception when a parameter is `null` or `undefined`", () => {
        expect(() => { difference(null, a4); }).toThrow();
        expect(() => { difference(void 0, a4); }).toThrow();
        expect(() => { difference(a4, null); }).toThrow();
        expect(() => { difference(a4, void 0); }).toThrow();
        expect(() => { difference(a4); }).toThrow();
    });

    it("should treat every other value in the main parameter as an empty array", () => {
        wannabeEmptyArrays.forEach(value => {
            expect(difference(value, a4)).toStrictEqual([]);
        });
    });

    it("should treat every non-array-like value in the `other` parameter as an empty array", () => {
        wannabeEmptyArrays.forEach(value => {
            expect(difference(a1, value)).toStrictEqual(a1);
            expect(difference(wannabeEmptyArrays, value))
                .toStrictEqual(uniques(wannabeEmptyArrays));
        });
    });
});
