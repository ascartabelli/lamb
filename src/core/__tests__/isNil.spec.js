import * as lamb from "../..";
import { nonNils } from "../../__tests__/commons";

describe("isNil", function () {
    it("should verify if the given value is null or undefined", function () {
        expect(lamb.isNil(null)).toBe(true);
        expect(lamb.isNil(void 0)).toBe(true);
    });

    it("should return true if called without arguments", function () {
        expect(lamb.isNil()).toBe(true);
    });

    it("should return false for every other value", function () {
        nonNils.forEach(function (value) {
            expect(lamb.isNil(value)).toBe(false);
        });
    });
});
