import mean from "../mean";
import { wannabeEmptyArrays } from "../../__tests__/commons";

describe("mean", () => {
    it("should calculate the mean of an array of numbers", () => {
        expect(mean([1, 2, 3, 4, 5, 6, 7, 8, 9])).toBe(5);
        expect(mean([49, 7, 26, -4, 41, -12, 0.5, 21, -48, -43])).toBe(3.75);

        // no need to keep the sign here
        expect(mean([-0])).toBe(0);
    });

    it("should convert to Number the elements of the array", () => {
        expect(mean(["1", "2", "3", "4", "5", "6", "7", "8", "9"])).toBe(5);
    });

    it("should accept array-like objects", () => {
        expect(mean("123456789")).toBe(5);
    });

    it("should return `NaN` if supplied with an empty array", () => {
        expect(mean([])).toBe(NaN);
    });

    it("should throw an exception if called without arguments", () => {
        expect(mean).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", () => {
        expect(() => { mean(null); }).toThrow();
        expect(() => { mean(void 0); }).toThrow();
    });

    it("should treat every other value as an empty array", () => {
        wannabeEmptyArrays.forEach(value => {
            expect(mean(value)).toBe(NaN);
        });
    });
});
