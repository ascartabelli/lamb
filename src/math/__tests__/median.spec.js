import median from "../median";
import { wannabeEmptyArrays } from "../../__tests__/commons";

describe("median", () => {
    const arr1 = [1];
    const arr2 = [9, 2];
    const arr3 = [12, 99, 4];
    const arr4 = [10, 2, 3, 1, 4, 5];
    const arr5 = [10, 2, 3, 1, 4, 5, 7];

    it("should calculate the median of an array of numbers", () => {
        expect(median(arr1)).toBe(1);
        expect(median(arr2)).toBe(5.5);
        expect(median(arr3)).toBe(12);
        expect(median(arr4)).toBe(3.5);
        expect(median(arr5)).toBe(4);
    });

    it("should convert to Number the elements of the array", () => {
        expect(median(["7", "3", "5", "6", "2"])).toBe(5);
        expect(median(["7", "3", "5", "6", "2", "9"])).toBe(5.5);
    });

    it("should accept array-like objects", () => {
        expect(median("73562")).toBe(5);
        expect(median("735629")).toBe(5.5);
    });

    it("should return `NaN` if the array is empty", () => {
        expect(median([])).toBe(NaN);
    });

    it("should throw an exception if called without arguments", () => {
        expect(median).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", () => {
        expect(() => { median(null); }).toThrow();
        expect(() => { median(void 0); }).toThrow();
    });

    it("should treat every other value as an empty array", () => {
        wannabeEmptyArrays.forEach(value => {
            expect(median(value)).toBe(NaN);
        });
    });
});
