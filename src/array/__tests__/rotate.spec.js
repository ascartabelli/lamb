import rotate from "../rotate";
import rotateBy from "../rotateBy";
import { wannabeEmptyArrays, zeroesAsIntegers } from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("rotate / rotateBy", () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    afterEach(() => {
        expect(arr).toStrictEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });

    it("should rotate the values of the array by the desired amount", () => {
        const r1 = [10, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        const r2 = [7, 8, 9, 10, 1, 2, 3, 4, 5, 6];

        expect(rotate(arr, 1)).toStrictEqual(r1);
        expect(rotateBy(1)(arr)).toStrictEqual(r1);
        expect(rotate(arr, 4)).toStrictEqual(r2);
        expect(rotateBy(4)(arr)).toStrictEqual(r2);
        expect(rotate([1], 1)).toStrictEqual([1]);
        expect(rotateBy(1)([1])).toStrictEqual([1]);
    });

    it("should return a copy of the source array if the `amount` is zero or equal to the array length or its additive inverse", () => {
        expect(rotate(arr, 0)).toStrictEqual(arr);
        expect(rotateBy(0)(arr)).toStrictEqual(arr);
        expect(rotate(arr, 10)).toStrictEqual(arr);
        expect(rotateBy(10)(arr)).toStrictEqual(arr);
        expect(rotate(arr, -10)).toStrictEqual(arr);
        expect(rotateBy(-10)(arr)).toStrictEqual(arr);
    });

    it("should accept values greater than the array length or less than its additive inverse and continue \"rotating\" values", () => {
        const r1 = [8, 9, 10, 1, 2, 3, 4, 5, 6, 7];
        const r2 = [5, 6, 7, 8, 9, 10, 1, 2, 3, 4];

        expect(rotate(arr, 13)).toStrictEqual(r1);
        expect(rotateBy(13)(arr)).toStrictEqual(r1);
        expect(rotate(arr, -14)).toStrictEqual(r2);
        expect(rotateBy(-14)(arr)).toStrictEqual(r2);
    });

    it("should convert to integer the value received as `amount`", () => {
        const d = new Date();
        const r1 = [10, 1, 2, 3, 4, 5, 6, 7, 8, 9];

        [[1], 1.5, 1.25, 1.75, true, "1"].forEach(value => {
            expect(rotate(arr, value)).toStrictEqual(r1);
            expect(rotateBy(value)(arr)).toStrictEqual(r1);
        });

        expect(rotate(arr, d)).toStrictEqual(rotate(arr, d % arr.length));
        expect(rotateBy(d)(arr)).toStrictEqual(rotate(arr, d % arr.length));

        zeroesAsIntegers.forEach(value => {
            expect(rotate(arr, value)).toStrictEqual(arr);
            expect(rotateBy(value)(arr)).toStrictEqual(arr);
        });

        expect(rotate(arr)).toStrictEqual(arr);
        expect(rotateBy()(arr)).toStrictEqual(arr);
    });

    it("should work with array-like objects", () => {
        const s = "123456789";
        const r = ["7", "8", "9", "1", "2", "3", "4", "5", "6"];

        expect(rotate(s, 3)).toStrictEqual(r);
        expect(rotateBy(3)(s)).toStrictEqual(r);
    });

    it("should always return dense arrays", () => {
        // eslint-disable-next-line comma-spacing, no-sparse-arrays
        const sparse = [1, , 3, ,];
        const r = [void 0, 3, void 0, 1];

        expect(rotate(sparse, 3)).toStrictArrayEqual(r);
        expect(rotateBy(3)(sparse)).toStrictArrayEqual(r);
    });

    it("should throw an exception if called without an array-like", () => {
        expect(rotate).toThrow();
        expect(rotateBy(10)).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined`", () => {
        expect(() => { rotate(null, 3); }).toThrow();
        expect(() => { rotateBy(3)(null); }).toThrow();
        expect(() => { rotate(void 0, 5); }).toThrow();
        expect(() => { rotateBy(3)(void 0); }).toThrow();
    });

    it("should treat every other value as an empty array", () => {
        wannabeEmptyArrays.forEach(value => {
            expect(rotate(value, 2)).toStrictEqual([]);
            expect(rotateBy(1)(value)).toStrictEqual([]);
        });
    });
});
