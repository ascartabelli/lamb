import * as lamb from "../..";
import { nonNumbers } from "../../__tests__/commons";

describe("isSafeInteger", function () {
    it("shoud verify whether the received value is a \"safe integer\"", function () {
        expect(lamb.isSafeInteger(0)).toBe(true);
        expect(lamb.isSafeInteger(-2e10)).toBe(true);
        expect(lamb.isSafeInteger(new Number(5))).toBe(true);
        expect(lamb.isSafeInteger(Math.pow(2, 53) - 1)).toBe(true);
        expect(lamb.isSafeInteger(2.4)).toBe(false);
        expect(lamb.isSafeInteger(Math.pow(2, 53))).toBe(false);
        expect(lamb.isSafeInteger(-2e64)).toBe(false);
        expect(lamb.isSafeInteger(Infinity)).toBe(false);
        expect(lamb.isSafeInteger(-Infinity)).toBe(false);
        expect(lamb.isSafeInteger(NaN)).toBe(false);
    });

    it("should return `false` for any non-number value and when it's called without arguments", function () {
        nonNumbers.forEach(function (value) {
            expect(lamb.isSafeInteger(value)).toBe(false);
        });

        expect(lamb.isSafeInteger()).toBe(false);
    });
});
