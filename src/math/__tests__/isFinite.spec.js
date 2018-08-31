import * as lamb from "../..";
import { nonNumbers } from "../../__tests__/commons";

describe("isFinite", function () {
    it("should verify whether the received value is a finite number", function () {
        expect(lamb.isFinite(0)).toBe(true);
        expect(lamb.isFinite(-2e64)).toBe(true);
        expect(lamb.isFinite(new Number(5))).toBe(true);
        expect(lamb.isFinite(Infinity)).toBe(false);
        expect(lamb.isFinite(-Infinity)).toBe(false);
        expect(lamb.isFinite(NaN)).toBe(false);
    });

    it("should return `false` for any non-number value and when it's called without arguments", function () {
        nonNumbers.forEach(function (value) {
            expect(lamb.isFinite(value)).toBe(false);
        });

        expect(lamb.isFinite()).toBe(false);
    });
});
