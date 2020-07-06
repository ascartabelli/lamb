import * as lamb from "../..";
import { nonArrayLikes, nonFunctions } from "../../__tests__/commons";
import { Foo, isEven } from "./_commons";

describe("adapter", function () {
    it("should accept an array of functions and build another function that calls them one by one until a non-undefined value is returned", function () {
        var filterString = lamb.casus(
            lamb.isType("String"),
            lamb.compose(lamb.invoke("join", [""]), lamb.filter)
        );
        var filterAdapter = lamb.adapter([lamb.invoke("filter"), filterString]);

        expect(filterAdapter([1, 2, 3, 4, 5, 6], isEven)).toEqual([2, 4, 6]);
        expect(filterAdapter("123456", isEven)).toBe("246");
        expect(filterAdapter({}, isEven)).toBeUndefined();

        var filterWithDefault = lamb.adapter([filterAdapter, lamb.always("Not implemented")]);

        expect(filterWithDefault([1, 2, 3, 4, 5, 6], isEven)).toEqual([2, 4, 6]);
        expect(filterWithDefault("123456", isEven)).toBe("246");
        expect(filterWithDefault({}, isEven)).toBe("Not implemented");
    });

    it("should not modify the functions' context", function () {
        var obj = { value: 5, getValue: lamb.adapter([Foo.prototype.getValue]) };

        expect(obj.getValue()).toBe(5);
    });

    it("should not throw an exception if some parameter isn't a function if a previous function returned a non-undefined value", function () {
        nonFunctions.forEach(function (value) {
            expect(lamb.adapter([isEven, value])(2)).toBe(true);
        });
    });

    it("should build a function returning an exception if a parameter isn't a function and no previous function returned a non-unefined value", function () {
        var fn = function (v) { return isEven(v) ? true : void 0; };

        nonFunctions.forEach(function (value) {
            expect(function () { lamb.adapter([value, fn])(2); }).toThrow();
            expect(function () { lamb.adapter([fn, value])(3); }).toThrow();
        });
    });

    it("should return `undefined` if it receives an empty array", function () {
        expect(lamb.adapter([])()).toBeUndefined();
        expect(lamb.adapter([])(1, 2, 3)).toBeUndefined();
    });

    it("should throw an exception if the received parameter isn't an array", function () {
        nonArrayLikes.forEach(function (value) {
            expect(function () { lamb.adapter(value); }).toThrow();
        });

        expect(lamb.adapter).toThrow();
    });
});
