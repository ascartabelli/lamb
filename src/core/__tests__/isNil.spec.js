import isNil from "../isNil";
import { nonNils } from "../../__tests__/commons";

describe("isNil", () => {
    it("should verify if the given value is null or undefined", () => {
        expect(isNil(null)).toBe(true);
        expect(isNil(void 0)).toBe(true);
    });

    it("should return true if called without arguments", () => {
        expect(isNil()).toBe(true);
    });

    it("should return false for every other value", () => {
        nonNils.forEach(value => {
            expect(isNil(value)).toBe(false);
        });
    });
});
