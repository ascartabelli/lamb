import clamp from "../clamp";
import clampWithin from "../clampWithin";
import { wannabeNaNs } from "../../__tests__/commons";

describe("clamp / clampWithin", () => {
    it("should clamp a number within the given limits", () => {
        expect(clamp(0, -5, 5)).toBe(0);
        expect(clamp(-5, -5, 5)).toBe(-5);
        expect(clamp(5, -5, 5)).toBe(5);
        expect(clamp(-6, -5, 5)).toBe(-5);
        expect(clamp(6, -5, 5)).toBe(5);
        expect(clamp(5, 5, 5)).toBe(5);
        expect(Object.is(clamp(-0, 0, 0), -0)).toBe(true);
        expect(Object.is(clamp(0, -0, 0), 0)).toBe(true);
        expect(Object.is(clamp(0, 0, -0), 0)).toBe(true);

        expect(clampWithin(-5, 5)(0)).toBe(0);
        expect(clampWithin(-5, 5)(-5)).toBe(-5);
        expect(clampWithin(-5, 5)(5)).toBe(5);
        expect(clampWithin(-5, 5)(-6)).toBe(-5);
        expect(clampWithin(-5, 5)(6)).toBe(5);
        expect(clampWithin(5, 5)(5)).toBe(5);
        expect(Object.is(clampWithin(0, 0)(-0), -0)).toBe(true);
        expect(Object.is(clampWithin(-0, 0)(0), 0)).toBe(true);
        expect(Object.is(clampWithin(0, -0)(0), 0)).toBe(true);
    });

    it("should return `NaN` if `min` is greater than `max`", () => {
        expect(clamp(5, 10, 7)).toBe(NaN);
        expect(clampWithin(10, 7)(5)).toBe(NaN);
    });

    it("should convert all expected arguments to `Number`, received or not", () => {
        const d1 = new Date(2015, 1, 1);
        const d2 = new Date(2016, 1, 1);
        const d3 = new Date(2017, 1, 1);

        expect(clamp(d1, d2, d3)).toBe(+d2);
        expect(clamp([97], [98], [99])).toBe(98);
        expect(clamp("5", "3", "4")).toBe(4);
        expect(clamp("5", "3", "4")).toBe(4);
        expect(clamp(true, false, true)).toBe(1);
        expect(clamp(null, -1, 1)).toBe(0);
        expect(clamp(-1, null, 2)).toBe(0);
        expect(clamp(5, -1, null)).toBe(0);

        expect(clampWithin(d2, d3)(d1)).toBe(+d2);
        expect(clampWithin([98], [99])([97])).toBe(98);
        expect(clampWithin(false, true)(true)).toBe(1);
        expect(clampWithin(-1, 1)(null)).toBe(0);
        expect(clampWithin(null, 2)(-1)).toBe(0);
        expect(clampWithin(-1, null)(5)).toBe(0);

        wannabeNaNs.forEach(value => {
            expect(clamp(value, 99, 100)).toBe(NaN);
            expect(clamp(99, value, 100)).toBe(99);
            expect(clamp(99, value, 98)).toBe(98);
            expect(clamp(99, 98, value)).toBe(99);
            expect(clamp(99, 100, value)).toBe(100);

            expect(clampWithin(99, 100)(value)).toBe(NaN);
            expect(clampWithin(value, 100)(99)).toBe(99);
            expect(clampWithin(value, 98)(99)).toBe(98);
            expect(clampWithin(98, value)(99)).toBe(99);
            expect(clampWithin(100, value)(99)).toBe(100);
        });

        expect(clamp(5, 10)).toBe(10);
        expect(clamp(-5, void 0, 10)).toBe(-5);
        expect(clamp()).toBe(NaN);

        expect(clampWithin(10)(5)).toBe(10);
        expect(clampWithin(void 0, 10)(-5)).toBe(-5);
        expect(clampWithin()()).toBe(NaN);
    });
});
