import isSafeInteger from "../isSafeInteger";
import { nonNumbers } from "../../__tests__/commons";

describe("isSafeInteger", () => {
    it("shoud verify whether the received value is a \"safe integer\"", () => {
        expect(isSafeInteger(0)).toBe(true);
        expect(isSafeInteger(-2e10)).toBe(true);
        expect(isSafeInteger(new Number(5))).toBe(true);
        expect(isSafeInteger(Math.pow(2, 53) - 1)).toBe(true);
        expect(isSafeInteger(2.4)).toBe(false);
        expect(isSafeInteger(Math.pow(2, 53))).toBe(false);
        expect(isSafeInteger(-2e64)).toBe(false);
        expect(isSafeInteger(Infinity)).toBe(false);
        expect(isSafeInteger(-Infinity)).toBe(false);
        expect(isSafeInteger(NaN)).toBe(false);
    });

    it("should return `false` for any non-number value and when it's called without arguments", () => {
        nonNumbers.forEach(value => {
            expect(isSafeInteger(value)).toBe(false);
        });

        expect(isSafeInteger()).toBe(false);
    });
});
