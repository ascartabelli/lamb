import * as lamb from "../..";
import { wannabeEmptyArrays } from "../../__tests__/commons";

describe("mean", () => {
    it("should calculate the mean of an array of numbers", () => {
        expect(lamb.mean([1, 2, 3, 4, 5, 6, 7, 8, 9])).toBe(5);
        expect(lamb.mean([49, 7, 26, -4, 41, -12, 0.5, 21, -48, -43])).toBe(3.75);

        // no need to keep the sign here
        expect(lamb.mean([-0])).toBe(0);
    });

    it("should convert to Number the elements of the array", () => {
        expect(lamb.mean(["1", "2", "3", "4", "5", "6", "7", "8", "9"])).toBe(5);
    });

    it("should accept array-like objects", () => {
        expect(lamb.mean("123456789")).toBe(5);
    });

    it("should return `NaN` if supplied with an empty array", () => {
        expect(lamb.mean([])).toBe(NaN);
    });

    it("should throw an exception if called without arguments", () => {
        expect(lamb.mean).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", () => {
        expect(() => { lamb.mean(null); }).toThrow();
        expect(() => { lamb.mean(void 0); }).toThrow();
    });

    it("should treat every other value as an empty array", () => {
        wannabeEmptyArrays.forEach(function (value) {
            expect(lamb.mean(value)).toBe(NaN);
        });
    });
});
