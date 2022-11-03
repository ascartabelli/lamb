import always from "../../core/always";
import updateAt from "../updateAt";
import updateIndex from "../updateIndex";
import {
    nonFunctions,
    wannabeEmptyArrays,
    zeroesAsIntegers
} from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("updateIndex / updateAt", () => {
    const arr = [1, 2, 3, 4, 5];
    const arrCopy = arr.slice();
    const fn99 = always(99);
    const s = "abcde";
    const sparseArr = [, , 3, ,]; // eslint-disable-line comma-spacing, no-sparse-arrays
    const sparseArrCopy = sparseArr.slice();
    const sparseArrAsDense = [void 0, void 0, 3, void 0];

    afterEach(() => {
        expect(arr).toStrictArrayEqual(arrCopy);
        expect(sparseArr).toStrictArrayEqual(sparseArrCopy);
    });

    it("should allow to update a value in a copy of the given array-like object with the provided function", () => {
        const inc = jest.fn(n => n + 1);

        expect(updateIndex(arr, 2, inc)).toStrictEqual([1, 2, 4, 4, 5]);
        expect(updateAt(2, inc)(arr)).toStrictEqual([1, 2, 4, 4, 5]);
        expect(inc).toHaveBeenCalledTimes(2);
        expect(inc).toHaveBeenNthCalledWith(1, 3);
        expect(inc).toHaveBeenNthCalledWith(2, 3);
        expect(updateIndex(s, 0, always("z"))).toStrictEqual(["z", "b", "c", "d", "e"]);
        expect(updateAt(0, always("z"))(s)).toStrictEqual(["z", "b", "c", "d", "e"]);
        expect(updateAt(1, fn99)([1, void 0, 3])).toStrictEqual([1, 99, 3]);
    });

    it("should allow negative indexes", () => {
        const newArr = updateIndex(arr, -1, fn99);
        const newArr2 = updateAt(-5, fn99)(arr);

        expect(newArr).toStrictEqual([1, 2, 3, 4, 99]);
        expect(newArr2).toStrictEqual([99, 2, 3, 4, 5]);
    });

    it("should always return dense arrays", () => {
        const r1 = [void 0, void 0, 99, void 0];
        const r2 = [void 0, void 0, 3, 99];

        expect(updateIndex(sparseArr, 2, fn99)).toStrictArrayEqual(r1);
        expect(updateIndex(sparseArr, -2, fn99)).toStrictArrayEqual(r1);
        expect(updateIndex(sparseArr, -1, fn99)).toStrictArrayEqual(r2);
        expect(updateIndex(sparseArr, 3, fn99)).toStrictArrayEqual(r2);
        expect(updateAt(2, fn99)(sparseArr)).toStrictArrayEqual(r1);
        expect(updateAt(-2, fn99)(sparseArr)).toStrictArrayEqual(r1);
        expect(updateAt(-1, fn99)(sparseArr)).toStrictArrayEqual(r2);
        expect(updateAt(3, fn99)(sparseArr)).toStrictArrayEqual(r2);
    });

    it("should return an array copy of the array-like if the index is out of bounds", () => {
        const newArr = updateIndex(arr, 5, fn99);
        const newArr2 = updateAt(-6, fn99)(arr);
        const newS = updateAt(10, fn99)(s);
        const newSparseArr = updateIndex(sparseArr, 5, fn99);
        const newSparseArr2 = updateAt(5, fn99)(sparseArr);

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

        zeroesAsIntegers.forEach(value => {
            expect(updateIndex(arr, value, fn99)).toStrictEqual(r1);
            expect(updateAt(value, fn99)(arr)).toStrictEqual(r1);
        });

        [[1], 1.5, 1.25, 1.75, true, "1"].forEach(value => {
            expect(updateIndex(arr, value, fn99)).toStrictEqual(r2);
            expect(updateAt(value, fn99)(arr)).toStrictEqual(r2);
        });

        expect(updateIndex(arr, new Date(), fn99)).toStrictEqual(arr);
        expect(updateAt(new Date(), fn99)(arr)).toStrictEqual(arr);
    });

    it("should throw an exception if the `updater` isn't a function or if is missing", () => {
        nonFunctions.forEach(value => {
            expect(() => { updateIndex(arr, 0, value); }).toThrow();
            expect(() => { updateAt(0, value)(arr); }).toThrow();
        });

        expect(() => { updateIndex(arr, 0); }).toThrow();
        expect(() => { updateAt(0)(arr); }).toThrow();
    });

    it("should throw an exception if called without the data argument", () => {
        expect(updateIndex).toThrow();
        expect(updateAt(1, fn99)).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", () => {
        expect(() => { updateIndex(null, 0, fn99); }).toThrow();
        expect(() => { updateIndex(void 0, 0, fn99); }).toThrow();
        expect(() => { updateAt(0, fn99)(null); }).toThrow();
        expect(() => { updateAt(0, fn99)(void 0); }).toThrow();
    });

    it("should return an empty array for every other value", () => {
        wannabeEmptyArrays.forEach(value => {
            expect(updateIndex(value, 2, fn99)).toStrictEqual([]);
            expect(updateAt(2, fn99)(value)).toStrictEqual([]);
        });
    });
});
