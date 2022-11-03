import isFinite from "../isFinite";
import { nonNumbers } from "../../__tests__/commons";

describe("isFinite", () => {
    it("should verify whether the received value is a finite number", () => {
        expect(isFinite(0)).toBe(true);
        expect(isFinite(-2e64)).toBe(true);
        expect(isFinite(new Number(5))).toBe(true);
        expect(isFinite(Infinity)).toBe(false);
        expect(isFinite(-Infinity)).toBe(false);
        expect(isFinite(NaN)).toBe(false);
    });

    it("should return `false` for any non-number value and when it's called without arguments", () => {
        nonNumbers.forEach(value => {
            expect(isFinite(value)).toBe(false);
        });

        expect(isFinite()).toBe(false);
    });
});
