import isType from "../isType";
import { valuesList } from "../../__tests__/commons";

describe("isType", () => {
    it("should build a predicate that expects a value to check against the specified type", () => {
        const isArray = isType("Array");
        const isFunction = isType("Function");

        expect(isArray([1, 2, 3])).toBe(true);
        expect(isFunction(function () {})).toBe(true);
        expect(isArray({})).toBe(false);
        expect(isFunction(new Date())).toBe(false);
    });

    it("should build a function returning false for every value if called without arguments", () => {
        valuesList.forEach(value => {
            expect(isType()(value)).toBe(false);
        });
    });
});
