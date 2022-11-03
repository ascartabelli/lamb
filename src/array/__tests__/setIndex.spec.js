import setAt from "../setAt";
import setIndex from "../setIndex";
import { wannabeEmptyArrays, zeroesAsIntegers } from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("setIndex / setAt", () => {
    const arr = [1, 2, 3, 4, 5];
    const arrCopy = arr.slice();
    const s = "abcde";
    const sparseArr = [, , 3, ,]; // eslint-disable-line comma-spacing, no-sparse-arrays
    const sparseArrCopy = sparseArr.slice();
    const sparseArrAsDense = [void 0, void 0, 3, void 0];

    afterEach(() => {
        expect(arr).toStrictArrayEqual(arrCopy);
        expect(sparseArr).toStrictArrayEqual(sparseArrCopy);
    });

    it("should allow to set a value in a copy of the given array-like object", () => {
        const r1 = [1, 2, 99, 4, 5];
        const r2 = ["z", "b", "c", "d", "e"];

        expect(setIndex(arr, 2, 99)).toStrictEqual(r1);
        expect(setAt(2, 99)(arr)).toStrictEqual(r1);
        expect(setIndex(s, 0, "z")).toStrictEqual(r2);
        expect(setAt(0, "z")(s)).toStrictEqual(r2);
    });

    it("should allow negative indexes", () => {
        const newArr = setIndex(arr, -1, 99);
        const newArr2 = setAt(-5, 99)(arr);

        expect(newArr).toStrictEqual([1, 2, 3, 4, 99]);
        expect(newArr2).toStrictEqual([99, 2, 3, 4, 5]);
    });

    it("should always return dense arrays", () => {
        const r1 = [void 0, void 0, 99, void 0];
        const r2 = [void 0, void 0, 3, 99];

        expect(setIndex(sparseArr, 2, 99)).toStrictArrayEqual(r1);
        expect(setIndex(sparseArr, -2, 99)).toStrictArrayEqual(r1);
        expect(setIndex(sparseArr, -1, 99)).toStrictArrayEqual(r2);
        expect(setIndex(sparseArr, 3, 99)).toStrictArrayEqual(r2);
        expect(setAt(2, 99)(sparseArr)).toStrictArrayEqual(r1);
        expect(setAt(-2, 99)(sparseArr)).toStrictArrayEqual(r1);
        expect(setAt(-1, 99)(sparseArr)).toStrictArrayEqual(r2);
        expect(setAt(3, 99)(sparseArr)).toStrictArrayEqual(r2);
    });

    it("should return an array copy of the array-like if the index is out of bounds", () => {
        const newArr = setIndex(arr, 5, 99);
        const newArr2 = setAt(-6, 99)(arr);
        const newS = setAt(10, 99)(s);
        const newSparseArr = setIndex(sparseArr, 5, 99);
        const newSparseArr2 = setAt(5, 99)(sparseArr);

        expect(newArr).toStrictEqual([1, 2, 3, 4, 5]);
        expect(newArr2).toStrictEqual([1, 2, 3, 4, 5]);
        expect(newArr).not.toBe(arr);
        expect(newArr2).not.toBe(arr);
        expect(newS).toStrictEqual(["a", "b", "c", "d", "e"]);
        expect(newSparseArr).toStrictEqual(sparseArrAsDense);
        expect(newSparseArr).not.toBe(sparseArr);
        expect(newSparseArr2).toStrictEqual(sparseArrAsDense);
        expect(newSparseArr2).not.toBe(sparseArr);
    });

    it("should convert the `index` parameter to integer", () => {
        const r1 = [99, 2, 3, 4, 5];
        const r2 = [1, 99, 3, 4, 5];
        const r3 = [void 0, 2, 3, 4, 5];

        zeroesAsIntegers.forEach(value => {
            expect(setIndex(arr, value, 99)).toStrictEqual(r1);
            expect(setAt(value, 99)(arr)).toStrictEqual(r1);
        });

        [[1], 1.5, 1.25, 1.75, true, "1"].forEach(value => {
            expect(setIndex(arr, value, 99)).toStrictEqual(r2);
            expect(setAt(value, 99)(arr)).toStrictEqual(r2);
        });

        expect(setIndex(arr, new Date(), 99)).toStrictEqual(arr);
        expect(setAt(new Date(), 99)(arr)).toStrictEqual(arr);

        expect(setIndex(arr)).toStrictEqual(r3);
        expect(setAt()(arr)).toStrictEqual(r3);
    });

    it("should throw an exception if called without the data argument", () => {
        expect(setIndex).toThrow();
        expect(setAt(1, 1)).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", () => {
        expect(() => { setAt(0, 99)(null); }).toThrow();
        expect(() => { setAt(0, 99)(void 0); }).toThrow();
        expect(() => { setIndex(null, 0, 99); }).toThrow();
        expect(() => { setIndex(void 0, 0, 99); }).toThrow();
    });

    it("should return an empty array for every other value", () => {
        wannabeEmptyArrays.forEach(value => {
            expect(setIndex(value, 2, 99)).toStrictEqual([]);
            expect(setAt(2, 99)(value)).toStrictEqual([]);
        });
    });
});
