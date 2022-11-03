import drop from "../drop";
import dropFrom from "../dropFrom";
import { wannabeEmptyArrays, zeroesAsIntegers } from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("drop / dropFrom", () => {
    it("should drop the first `n` elements of an array or array-like object", () => {
        expect(dropFrom(["a", "b"], 1)).toStrictEqual(["b"]);
        expect(drop(3)([1, 2, 3, 4])).toStrictEqual([4]);
    });

    it("should work with array-like objects", () => {
        expect(dropFrom("abcd", 2)).toStrictEqual(["c", "d"]);
        expect(drop(2)("abcd")).toStrictEqual(["c", "d"]);
    });

    it("should accept a negative `n`", () => {
        expect(dropFrom([1, 2, 3, 4], -1)).toStrictEqual([4]);
        expect(drop(-3)("abcd")).toStrictEqual(["b", "c", "d"]);
    });

    it("should return a copy of the source array when `n` is 0 or less or equal than the additive inverse of the array-like length", () => {
        expect(dropFrom(["a", "b"], 0)).toStrictEqual(["a", "b"]);
        expect(dropFrom([1, 2, 3, 4], -4)).toStrictEqual([1, 2, 3, 4]);
        expect(drop(-10)([1, 2, 3, 4])).toStrictEqual([1, 2, 3, 4]);
    });

    it("should return an empty array when `n` is greater than or equal to the array-like length", () => {
        expect(dropFrom([1, 2, 3, 4], 4)).toStrictEqual([]);
        expect(dropFrom([1, 2, 3, 4], 5)).toStrictEqual([]);
        expect(drop(10)([1, 2, 3, 4])).toStrictEqual([]);
    });

    it("should convert to integer the value received as `n`", () => {
        const arr = [1, 2, 3, 4, 5];

        zeroesAsIntegers.forEach(value => {
            expect(drop(value)(arr)).toStrictEqual(arr);
            expect(dropFrom(arr, value)).toStrictEqual(arr);
        });

        [[1], 1.5, 1.25, 1.75, true, "1"].forEach(value => {
            expect(drop(value)(arr)).toStrictEqual([2, 3, 4, 5]);
            expect(dropFrom(arr, value)).toStrictEqual([2, 3, 4, 5]);
        });

        expect(drop(new Date())(arr)).toStrictEqual([]);
        expect(dropFrom(arr, new Date())).toStrictEqual([]);

        expect(drop()(arr)).toStrictEqual(arr);
        expect(dropFrom(arr)).toStrictEqual(arr);
    });

    it("should always return dense arrays", () => {
        /* eslint-disable no-sparse-arrays */
        expect(dropFrom([1, , 3], 1)).toStrictArrayEqual([void 0, 3]);
        expect(drop(1)([1, , 3])).toStrictArrayEqual([void 0, 3]);
        /* eslint-enable no-sparse-arrays */
    });

    it("should throw an exception if called without the data argument or without arguments at all", () => {
        expect(dropFrom).toThrow();
        expect(drop(1)).toThrow();
        expect(drop()).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined`", () => {
        expect(() => { dropFrom(null, 0); }).toThrow();
        expect(() => { dropFrom(void 0, 0); }).toThrow();
        expect(() => { drop(0)(null); }).toThrow();
        expect(() => { drop(0)(void 0); }).toThrow();
    });

    it("should treat every other value as an empty array", () => {
        wannabeEmptyArrays.forEach(value => {
            expect(dropFrom(value, 0)).toStrictEqual([]);
            expect(drop(0)(value)).toStrictEqual([]);
        });
    });
});
