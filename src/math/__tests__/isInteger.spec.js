import isInteger from "../isInteger";
import { nonNumbers } from "../../__tests__/commons";

describe("isInteger", () => {
    it("should verify whether the received value is an integer", () => {
        expect(isInteger(0)).toBe(true);
        expect(isInteger(-2e64)).toBe(true);
        expect(isInteger(new Number(5))).toBe(true);
        expect(isInteger(2.4)).toBe(false);
        expect(isInteger(Infinity)).toBe(false);
        expect(isInteger(-Infinity)).toBe(false);
        expect(isInteger(NaN)).toBe(false);
    });

    it("should return `false` for any non-number value and when it's called without arguments", () => {
        nonNumbers.forEach(value => {
            expect(isInteger(value)).toBe(false);
        });

        expect(isInteger()).toBe(false);
    });
});
