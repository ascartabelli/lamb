import getAt from "../getAt";
import getIndex from "../getIndex";
import head from "../head";
import last from "../last";
import { zeroesAsIntegers, wannabeEmptyArrays } from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("getIndex / getAt / head / last", () => {
    const arr = [1, 2, 3, 4, 5];
    const arrCopy = arr.slice();
    const s = "abcde";
    const sparseArr = [, , 3, ,]; // eslint-disable-line comma-spacing, no-sparse-arrays
    const sparseArrCopy = sparseArr.slice();

    afterEach(() => {
        expect(arr).toStrictArrayEqual(arrCopy);
        expect(sparseArr).toStrictArrayEqual(sparseArrCopy);
    });

    it("should retrieve the element at the given index in an array-like object", () => {
        const getThird = getAt(2);

        expect(getIndex(arr, 1)).toBe(2);
        expect(getIndex(s, 1)).toBe("b");
        expect(getThird(arr)).toBe(3);
        expect(getThird(s)).toBe("c");
        expect(head(arr)).toBe(1);
        expect(head(s)).toBe("a");
        expect(last(arr)).toBe(5);
        expect(last(s)).toBe("e");
    });

    it("should allow negative indexes", () => {
        expect(getIndex(arr, -2)).toBe(4);
        expect(getIndex(s, -2)).toBe("d");
        expect(getAt(-2)(arr)).toBe(4);
        expect(getAt(-2)(s)).toBe("d");
    });

    it("should work with sparse arrays", () => {
        expect(getIndex(sparseArr, 2)).toBe(3);
        expect(getIndex(sparseArr, -2)).toBe(3);
        expect(getAt(2)(sparseArr)).toBe(3);
        expect(getAt(-2)(sparseArr)).toBe(3);
        expect(head(sparseArr)).toBe(void 0);
        expect(last(sparseArr)).toBe(void 0);
    });

    it("should return `undefined` if the index is out of bounds", () => {
        expect(getIndex(arr, -6)).toBeUndefined();
        expect(getIndex(arr, 66)).toBeUndefined();

        expect(getAt(-6)(arr)).toBeUndefined();
        expect(getAt(66)(arr)).toBeUndefined();

        expect(head([])).toBeUndefined();
        expect(last([])).toBeUndefined();
    });

    it("should convert the `index` parameter to integer", () => {
        zeroesAsIntegers.forEach(value => {
            expect(getIndex(arr, value)).toBe(arr[0]);
            expect(getAt(value)(arr)).toBe(arr[0]);
        });

        [[1], 1.5, 1.25, 1.75, true, "1"].forEach(value => {
            expect(getIndex(arr, value)).toBe(arr[1]);
            expect(getAt(value)(arr)).toBe(arr[1]);
        });

        expect(getIndex(arr, new Date())).toBeUndefined();
        expect(getAt(new Date())(arr)).toBeUndefined();

        expect(getIndex(arr)).toBe(arr[0]);
        expect(getAt()(arr)).toBe(arr[0]);
    });

    it("should throw an exception if called without the data argument", () => {
        expect(getIndex).toThrow();
        expect(getAt(1)).toThrow();
        expect(head).toThrow();
        expect(last).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", () => {
        expect(() => { getIndex(null, 2); }).toThrow();
        expect(() => { getIndex(void 0, 2); }).toThrow();
        expect(() => { getAt(2)(null); }).toThrow();
        expect(() => { getAt(2)(void 0); }).toThrow();
        expect(() => { head(null); }).toThrow();
        expect(() => { last(void 0); }).toThrow();
    });

    it("should return `undefined` for any other value", () => {
        wannabeEmptyArrays.forEach(function (v) {
            expect(getIndex(v, 2)).toBeUndefined();
            expect(getAt(2)(v)).toBeUndefined();
            expect(head(v)).toBeUndefined();
            expect(last(v)).toBeUndefined();
        });
    });
});
