import * as lamb from "../..";
import { wannabeEmptyArrays } from "../../__tests__/commons";

describe("difference", () => {
    const a1 = [0, 1, 2, 3, 4, NaN];
    const a2 = [-0, 2, 3, 4, 5, NaN];
    const a3 = [4, 5, 1, 4, 5];
    const a4 = [6, 7];

    it("should return a new array with the items present only in the first of the two arrays", () => {
        const r = lamb.difference(a1, a4);

        expect(r).toStrictEqual(a1);
        expect(r).not.toBe(a1);
        expect(lamb.difference(a1, a3)).toStrictEqual([0, 2, 3, NaN]);
    });

    it("should use the \"SameValueZero\" comparison and keep the first encountered value in case of equality", () => {
        expect(lamb.difference(a1, a2)).toStrictEqual([1]);
        expect(lamb.difference([-0, 1, 0, 2], [1, 3, 2])).toStrictEqual([-0]);
    });

    it("should return an array without duplicates", () => {
        expect(lamb.difference(a3, a4)).toStrictEqual([4, 5, 1]);
        expect(lamb.difference(a3, a1)).toStrictEqual([5]);
    });

    it("should work with array-like objects", () => {
        expect(lamb.difference("abc", "bd")).toStrictEqual(["a", "c"]);
        expect(lamb.difference(["a", "b", "c"], "bd")).toStrictEqual(["a", "c"]);
        expect(lamb.difference("abc", ["b", "d"])).toStrictEqual(["a", "c"]);
    });

    it("should throw an exception if called without arguments", () => {
        expect(lamb.difference).toThrow();
    });

    it("should throw an exception when a parameter is `null` or `undefined`", () => {
        expect(() => { lamb.difference(null, a4); }).toThrow();
        expect(() => { lamb.difference(void 0, a4); }).toThrow();
        expect(() => { lamb.difference(a4, null); }).toThrow();
        expect(() => { lamb.difference(a4, void 0); }).toThrow();
        expect(() => { lamb.difference(a4); }).toThrow();
    });

    it("should treat every other value in the main parameter as an empty array", () => {
        wannabeEmptyArrays.forEach(value => {
            expect(lamb.difference(value, a4)).toStrictEqual([]);
        });
    });

    it("should treat every non-array-like value in the `other` parameter as an empty array", () => {
        wannabeEmptyArrays.forEach(value => {
            expect(lamb.difference(a1, value)).toStrictEqual(a1);
            expect(lamb.difference(wannabeEmptyArrays, value))
                .toStrictEqual(lamb.uniques(wannabeEmptyArrays));
        });
    });
});
