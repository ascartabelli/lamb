import take from "../take";
import takeFrom from "../takeFrom";
import { wannabeEmptyArrays, zeroesAsIntegers } from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("take / takeFrom", () => {
    it("should retrieve the first `n` elements of an array or array-like object", () => {
        expect(takeFrom(["a", "b"], 1)).toStrictEqual(["a"]);
        expect(take(3)([1, 2, 3, 4])).toStrictEqual([1, 2, 3]);
    });

    it("should work with array-like objects", () => {
        expect(takeFrom("abcd", 2)).toStrictEqual(["a", "b"]);
        expect(take(2)("abcd")).toStrictEqual(["a", "b"]);
    });

    it("should accept a negative `n`", () => {
        expect(takeFrom([1, 2, 3, 4], -1)).toStrictEqual([1, 2, 3]);
        expect(take(-3)("abcd")).toStrictEqual(["a"]);
    });

    it("should return a copy of the source array when `n` is greater than or equal to the array-like length", () => {
        expect(takeFrom(["a", "b"], 3)).toStrictEqual(["a", "b"]);
        expect(takeFrom([1, 2, 3, 4], 4)).toStrictEqual([1, 2, 3, 4]);
        expect(take(10)([1, 2, 3, 4])).toStrictEqual([1, 2, 3, 4]);
    });

    it("should return an empty array when `n` is 0 or less or equal than the additive inverse of the array-like length", () => {
        expect(takeFrom([1, 2, 3, 4], 0)).toStrictEqual([]);
        expect(take(-4)([1, 2, 3, 4])).toStrictEqual([]);
        expect(take(-10)([1, 2, 3, 4])).toStrictEqual([]);
    });

    it("should convert to integer the value received as `n`", () => {
        const arr = [1, 2, 3, 4, 5];

        zeroesAsIntegers.forEach(value => {
            expect(take(value)(arr)).toStrictEqual([]);
            expect(takeFrom(arr, value)).toStrictEqual([]);
        });

        [[1], 1.5, 1.25, 1.75, true, "1"].forEach(value => {
            expect(take(value)(arr)).toStrictEqual([1]);
            expect(takeFrom(arr, value)).toStrictEqual([1]);
        });

        expect(take(new Date())(arr)).toStrictEqual(arr);
        expect(takeFrom(arr, new Date())).toStrictEqual(arr);

        expect(take()(arr)).toStrictEqual([]);
        expect(takeFrom(arr)).toStrictEqual([]);
    });

    it("should always return dense arrays", () => {
        /* eslint-disable no-sparse-arrays */
        expect(takeFrom([1, , 3], 2)).toStrictArrayEqual([1, void 0]);
        expect(take(2)([1, , 3])).toStrictArrayEqual([1, void 0]);
        /* eslint-enable no-sparse-arrays */
    });

    it("should throw an exception if called without the data argument or without arguments at all", () => {
        expect(takeFrom).toThrow();
        expect(take(1)).toThrow();
        expect(take()).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined`", () => {
        expect(() => { takeFrom(null, 0); }).toThrow();
        expect(() => { takeFrom(void 0, 0); }).toThrow();
        expect(() => { take(0)(null); }).toThrow();
        expect(() => { take(0)(void 0); }).toThrow();
    });

    it("should treat every other value as an empty array", () => {
        wannabeEmptyArrays.forEach(value => {
            expect(takeFrom(value, 0)).toStrictEqual([]);
            expect(take(0)(value)).toStrictEqual([]);
        });
    });
});
