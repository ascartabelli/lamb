import isNull from "../isNull";
import { nonNulls } from "../../__tests__/commons";

describe("isNull", () => {
    it("should verify if the given value is null", () => {
        expect(isNull(null)).toBe(true);
    });

    it("should return false if called without arguments", () => {
        expect(isNull()).toBe(false);
    });

    it("should return false for every other value", () => {
        nonNulls.forEach(value => {
            expect(isNull(value)).toBe(false);
        });
    });
});
