import * as lamb from "../..";
import { nonUndefineds } from "../../__tests__/commons";

describe("isUndefined", function () {
    it("should verify if the given value is undefined", function () {
        expect(lamb.isUndefined(void 0)).toBe(true);
    });

    it("should return true if called without arguments", function () {
        expect(lamb.isUndefined()).toBe(true);
    });

    it("should return false for every other value", function () {
        nonUndefineds.forEach(function (value) {
            expect(lamb.isUndefined(value)).toBe(false);
        });
    });
});
