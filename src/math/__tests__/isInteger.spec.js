import * as lamb from "../..";
import { nonNumbers } from "../../__tests__/commons";

describe("isInteger", function () {
    it("should verify whether the received value is an integer", function () {
        expect(lamb.isInteger(0)).toBe(true);
        expect(lamb.isInteger(-2e64)).toBe(true);
        expect(lamb.isInteger(new Number(5))).toBe(true);
        expect(lamb.isInteger(2.4)).toBe(false);
        expect(lamb.isInteger(Infinity)).toBe(false);
        expect(lamb.isInteger(-Infinity)).toBe(false);
        expect(lamb.isInteger(NaN)).toBe(false);
    });

    it("should return `false` for any non-number value and when it's called without arguments", function () {
        nonNumbers.forEach(function (value) {
            expect(lamb.isInteger(value)).toBe(false);
        });

        expect(lamb.isInteger()).toBe(false);
    });
});
