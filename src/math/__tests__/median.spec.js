import * as lamb from "../..";
import { wannabeEmptyArrays } from "../../__tests__/commons";

describe("median", () => {
    var arr1 = [1];
    var arr2 = [9, 2];
    var arr3 = [12, 99, 4];
    var arr4 = [10, 2, 3, 1, 4, 5];
    var arr5 = [10, 2, 3, 1, 4, 5, 7];

    it("should calculate the median of an array of numbers", () => {
        expect(lamb.median(arr1)).toBe(1);
        expect(lamb.median(arr2)).toBe(5.5);
        expect(lamb.median(arr3)).toBe(12);
        expect(lamb.median(arr4)).toBe(3.5);
        expect(lamb.median(arr5)).toBe(4);
    });

    it("should convert to Number the elements of the array", () => {
        expect(lamb.median(["7", "3", "5", "6", "2"])).toBe(5);
        expect(lamb.median(["7", "3", "5", "6", "2", "9"])).toBe(5.5);
    });

    it("should accept array-like objects", () => {
        expect(lamb.median("73562")).toBe(5);
        expect(lamb.median("735629")).toBe(5.5);
    });

    it("should return `NaN` if the array is empty", () => {
        expect(lamb.median([])).toBe(NaN);
    });

    it("should throw an exception if called without arguments", () => {
        expect(lamb.median).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", () => {
        expect(() => { lamb.median(null); }).toThrow();
        expect(() => { lamb.median(void 0); }).toThrow();
    });

    it("should treat every other value as an empty array", () => {
        wannabeEmptyArrays.forEach(function (value) {
            expect(lamb.median(value)).toBe(NaN);
        });
    });
});
