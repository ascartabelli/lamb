import * as lamb from "../..";
import { valuesList } from "../../__tests__/commons";

describe("isType", function () {
    it("should build a predicate that expects a value to check against the specified type", function () {
        var isArray = lamb.isType("Array");
        var isFunction = lamb.isType("Function");

        expect(isArray([1, 2, 3])).toBe(true);
        expect(isFunction(function () {})).toBe(true);
        expect(isArray({})).toBe(false);
        expect(isFunction(new Date())).toBe(false);
    });

    it("should build a function returning false for every value if called without arguments", function () {
        valuesList.forEach(function (value) {
            expect(lamb.isType()(value)).toBe(false);
        });
    });
});
