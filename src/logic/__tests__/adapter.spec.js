import adapter from "../adapter";
import always from "../../core/always";
import casus from "../casus";
import compose from "../../core/compose";
import filter from "../../array/filter";
import invoke from "../../function/invoke";
import isType from "../../type/isType";
import { nonArrayLikes, nonFunctions } from "../../__tests__/commons";
import { Foo, isEven } from "./_commons";

describe("adapter", () => {
    it("should accept an array of functions and build another function that calls them one by one until a non-undefined value is returned", () => {
        const filterString = casus(
            isType("String"),
            compose(invoke("join", [""]), filter)
        );
        const filterAdapter = adapter([invoke("filter"), filterString]);

        expect(filterAdapter([1, 2, 3, 4, 5, 6], isEven)).toStrictEqual([2, 4, 6]);
        expect(filterAdapter("123456", isEven)).toBe("246");
        expect(filterAdapter({}, isEven)).toBeUndefined();

        const filterWithDefault = adapter([filterAdapter, always("Not implemented")]);

        expect(filterWithDefault([1, 2, 3, 4, 5, 6], isEven)).toStrictEqual([2, 4, 6]);
        expect(filterWithDefault("123456", isEven)).toBe("246");
        expect(filterWithDefault({}, isEven)).toBe("Not implemented");
    });

    it("should not modify the functions' context", () => {
        const obj = { value: 5, getValue: adapter([Foo.prototype.getValue]) };

        expect(obj.getValue()).toBe(5);
    });

    it("should not throw an exception if some parameter isn't a function if a previous function returned a non-undefined value", () => {
        nonFunctions.forEach(value => {
            expect(adapter([isEven, value])(2)).toBe(true);
        });
    });

    it("should build a function returning an exception if a parameter isn't a function and no previous function returned a non-unefined value", () => {
        const fn = v => (isEven(v) ? true : void 0);

        nonFunctions.forEach(value => {
            expect(() => { adapter([value, fn])(2); }).toThrow();
            expect(() => { adapter([fn, value])(3); }).toThrow();
        });
    });

    it("should return `undefined` if it receives an empty array", () => {
        expect(adapter([])()).toBeUndefined();
        expect(adapter([])(1, 2, 3)).toBeUndefined();
    });

    it("should throw an exception if the received parameter isn't an array", () => {
        nonArrayLikes.forEach(value => {
            expect(() => { adapter(value); }).toThrow();
        });

        expect(adapter).toThrow();
    });
});
