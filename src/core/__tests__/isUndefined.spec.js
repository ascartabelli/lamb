import isUndefined from "../isUndefined";
import { nonUndefineds } from "../../__tests__/commons";

describe("isUndefined", () => {
    it("should verify if the given value is undefined", () => {
        expect(isUndefined(void 0)).toBe(true);
    });

    it("should return true if called without arguments", () => {
        expect(isUndefined()).toBe(true);
    });

    it("should return false for every other value", () => {
        nonUndefineds.forEach(value => {
            expect(isUndefined(value)).toBe(false);
        });
    });
});
