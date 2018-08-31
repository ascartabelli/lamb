import * as lamb from "../..";
import { wannabeNaNs } from "../../__tests__/commons";

describe("clamp / clampWithin", function () {
    it("should clamp a number within the given limits", function () {
        expect(lamb.clamp(0, -5, 5)).toBe(0);
        expect(lamb.clamp(-5, -5, 5)).toBe(-5);
        expect(lamb.clamp(5, -5, 5)).toBe(5);
        expect(lamb.clamp(-6, -5, 5)).toBe(-5);
        expect(lamb.clamp(6, -5, 5)).toBe(5);
        expect(lamb.clamp(5, 5, 5)).toBe(5);
        expect(Object.is(lamb.clamp(-0, 0, 0), -0)).toBe(true);
        expect(Object.is(lamb.clamp(0, -0, 0), 0)).toBe(true);
        expect(Object.is(lamb.clamp(0, 0, -0), 0)).toBe(true);

        expect(lamb.clampWithin(-5, 5)(0)).toBe(0);
        expect(lamb.clampWithin(-5, 5)(-5)).toBe(-5);
        expect(lamb.clampWithin(-5, 5)(5)).toBe(5);
        expect(lamb.clampWithin(-5, 5)(-6)).toBe(-5);
        expect(lamb.clampWithin(-5, 5)(6)).toBe(5);
        expect(lamb.clampWithin(5, 5)(5)).toBe(5);
        expect(Object.is(lamb.clampWithin(0, 0)(-0), -0)).toBe(true);
        expect(Object.is(lamb.clampWithin(-0, 0)(0), 0)).toBe(true);
        expect(Object.is(lamb.clampWithin(0, -0)(0), 0)).toBe(true);
    });

    it("should return `NaN` if `min` is greater than `max`", function () {
        expect(lamb.clamp(5, 10, 7)).toEqual(NaN);
        expect(lamb.clampWithin(10, 7)(5)).toEqual(NaN);
    });

    it("should convert all expected arguments to `Number`, received or not", function () {
        var d1 = new Date(2015, 1, 1);
        var d2 = new Date(2016, 1, 1);
        var d3 = new Date(2017, 1, 1);

        expect(lamb.clamp(d1, d2, d3)).toBe(+d2);
        expect(lamb.clamp([97], [98], [99])).toBe(98);
        expect(lamb.clamp("5", "3", "4")).toBe(4);
        expect(lamb.clamp("5", "3", "4")).toBe(4);
        expect(lamb.clamp(true, false, true)).toBe(1);
        expect(lamb.clamp(null, -1, 1)).toBe(0);
        expect(lamb.clamp(-1, null, 2)).toBe(0);
        expect(lamb.clamp(5, -1, null)).toBe(0);

        expect(lamb.clampWithin(d2, d3)(d1)).toBe(+d2);
        expect(lamb.clampWithin([98], [99])([97])).toBe(98);
        expect(lamb.clampWithin(false, true)(true)).toBe(1);
        expect(lamb.clampWithin(-1, 1)(null)).toBe(0);
        expect(lamb.clampWithin(null, 2)(-1)).toBe(0);
        expect(lamb.clampWithin(-1, null)(5)).toBe(0);

        wannabeNaNs.forEach(function (value) {
            expect(lamb.clamp(value, 99, 100)).toEqual(NaN);
            expect(lamb.clamp(99, value, 100)).toBe(99);
            expect(lamb.clamp(99, value, 98)).toBe(98);
            expect(lamb.clamp(99, 98, value)).toBe(99);
            expect(lamb.clamp(99, 100, value)).toBe(100);

            expect(lamb.clampWithin(99, 100)(value)).toEqual(NaN);
            expect(lamb.clampWithin(value, 100)(99)).toBe(99);
            expect(lamb.clampWithin(value, 98)(99)).toBe(98);
            expect(lamb.clampWithin(98, value)(99)).toBe(99);
            expect(lamb.clampWithin(100, value)(99)).toBe(100);
        });

        expect(lamb.clamp(5, 10)).toBe(10);
        expect(lamb.clamp(-5, void 0, 10)).toBe(-5);
        expect(lamb.clamp()).toEqual(NaN);

        expect(lamb.clampWithin(10)(5)).toBe(10);
        expect(lamb.clampWithin(void 0, 10)(-5)).toBe(-5);
        expect(lamb.clampWithin()()).toEqual(NaN);
    });
});
