import * as lamb from "../..";
import { nonNulls } from "../../__tests__/commons";

describe("isNull", function () {
    it("should verify if the given value is null", function () {
        expect(lamb.isNull(null)).toBe(true);
    });

    it("should return false if called without arguments", function () {
        expect(lamb.isNull()).toBe(false);
    });

    it("should return false for every other value", function () {
        nonNulls.forEach(function (value) {
            expect(lamb.isNull(value)).toBe(false);
        });
    });
});
