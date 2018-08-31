import * as lamb from "../..";
import { nonFunctions } from "../../__tests__/commons";

describe("asPartial", function () {
    var fooSubtract = jest.fn(function (a, b, c, d) {
        return a - b - c - d;
    });
    var __ = lamb.__;

    afterEach(function () {
        fooSubtract.mockClear();
    });

    it("should build a function that returns a partial application of the original one as long as it's called with placeholders", function () {
        var fn = lamb.asPartial(fooSubtract);

        expect(fn(__, 4, __, __)(__, 3, __)(5, __)(2)).toBe(-4);
        expect(fn(__)(__, __)(__)(5, __)(__, 3)(4, __)(2)).toBe(-4);
        expect(fn(__, 4, __, __)(__, 3, __)(5, __, __, __, 2, __, __)(99, 6)).toBe(-101);
        expect(fn(3, 2, 1, 0)).toBe(0);
        expect(fn(5, __, 3)(__)(__, __)(4, __)(2)).toBe(-4);
        expect(fn(__, 2, __, 0)(__, __)(3, __)(__)(1)).toBe(0);
        expect(fn(5, __, __, __)(4, 3, 2)).toBe(-4);
    });

    it("should be safe to call the partial application multiple times with different values for unfilled placeholders", function () {
        var fn = lamb.asPartial(fooSubtract)(__, 5, __, __);
        var minusTen1 = fn(__, 4, __)(__, 1);
        var minusTen2 = fn(__, 3, 2);
        var minusTen3 = fn(__, -5, 10);

        var numbers = [-1000, 6, 502, 856, 790, 547, 157, 750, 111, -419];
        var results = [-1010, -4, 492, 846, 780, 537, 147, 740, 101, -429];

        expect(numbers.map(minusTen1)).toEqual(results);
        expect(numbers.map(minusTen2)).toEqual(results);
        expect(numbers.map(minusTen3)).toEqual(results);
    });

    it("should build a function that applies the original function when it's called without placeholders even if its arity isn't consumed", function () {
        var fn = lamb.asPartial(fooSubtract);

        expect(fn(5, __, 3)(4)).toEqual(NaN);
        expect(fooSubtract).toHaveBeenCalledTimes(1);
        expect(fooSubtract.mock.calls[0]).toEqual([5, 4, 3]);
    });

    it("should pass all the received arguments, even if they exceed the original function's arity", function () {
        var fn = lamb.asPartial(fooSubtract);

        expect(fn(__, 4, __, 2)(5, 3, 6, 7, 8)).toBe(-4);
        expect(fooSubtract).toHaveBeenCalledTimes(1);
        expect(fooSubtract.mock.calls[0]).toEqual([5, 4, 3, 2, 6, 7, 8]);
    });

    it("should give an `undefined` value to unfilled placeholders", function () {
        var fn = lamb.asPartial(lamb.list)(__, 2, __, 3, __, 5, __);

        expect(fn(1)).toEqual([1, 2, void 0, 3, void 0, 5, void 0]);
    });

    it("should preserve the function's context", function () {
        var fn = lamb.asPartial(function (a, b) {
            this.values.push(a - b);
        });

        var obj = {
            values: [1, 2, 3],
            foo: fn(4, __),
            bar: fn(__, 4)
        };

        obj.foo(5);
        expect(obj.values).toEqual([1, 2, 3, -1]);

        obj.bar(5);
        expect(obj.values).toEqual([1, 2, 3, -1, 1]);
    });

    it("should build a function throwing an exception if called without arguments or if `fn` isn't a function", function () {
        nonFunctions.forEach(function (value) {
            expect(lamb.asPartial(value)).toThrow();
        });

        expect(lamb.asPartial()).toThrow();
    });
});
