import __ from "../../core/__";
import asPartial from "../asPartial";
import list from "../../array/list";
import { nonFunctions } from "../../__tests__/commons";

describe("asPartial", () => {
    const fooSubtract = jest.fn((a, b, c, d) => a - b - c - d);

    afterEach(() => {
        fooSubtract.mockClear();
    });

    it("should build a function that returns a partial application of the original one as long as it's called with placeholders", () => {
        const fn = asPartial(fooSubtract);

        expect(fn(__, 4, __, __)(__, 3, __)(5, __)(2)).toBe(-4);
        expect(fn(__)(__, __)(__)(5, __)(__, 3)(4, __)(2)).toBe(-4);
        expect(fn(__, 4, __, __)(__, 3, __)(5, __, __, __, 2, __, __)(99, 6)).toBe(-101);
        expect(fn(3, 2, 1, 0)).toBe(0);
        expect(fn(5, __, 3)(__)(__, __)(4, __)(2)).toBe(-4);
        expect(fn(__, 2, __, 0)(__, __)(3, __)(__)(1)).toBe(0);
        expect(fn(5, __, __, __)(4, 3, 2)).toBe(-4);
    });

    it("should be safe to call the partial application multiple times with different values for unfilled placeholders", () => {
        const fn = asPartial(fooSubtract)(__, 5, __, __);
        const minusTen1 = fn(__, 4, __)(__, 1);
        const minusTen2 = fn(__, 3, 2);
        const minusTen3 = fn(__, -5, 10);

        const numbers = [-1000, 6, 502, 856, 790, 547, 157, 750, 111, -419];
        const results = [-1010, -4, 492, 846, 780, 537, 147, 740, 101, -429];

        expect(numbers.map(minusTen1)).toStrictEqual(results);
        expect(numbers.map(minusTen2)).toStrictEqual(results);
        expect(numbers.map(minusTen3)).toStrictEqual(results);
    });

    it("should build a function that applies the original function when it's called without placeholders even if its arity isn't consumed", () => {
        const fn = asPartial(fooSubtract);

        expect(fn(5, __, 3)(4)).toBe(NaN);
        expect(fooSubtract).toHaveBeenCalledTimes(1);
        expect(fooSubtract).toHaveBeenCalledWith(5, 4, 3);
    });

    it("should pass all the received arguments, even if they exceed the original function's arity", () => {
        const fn = asPartial(fooSubtract);

        expect(fn(__, 4, __, 2)(5, 3, 6, 7, 8)).toBe(-4);
        expect(fooSubtract).toHaveBeenCalledTimes(1);
        expect(fooSubtract).toHaveBeenCalledWith(5, 4, 3, 2, 6, 7, 8);
    });

    it("should give an `undefined` value to unfilled placeholders", () => {
        const fn = asPartial(list)(__, 2, __, 3, __, 5, __);

        expect(fn(1)).toStrictEqual([1, 2, void 0, 3, void 0, 5, void 0]);
    });

    it("should preserve the function's context", () => {
        const fn = asPartial(function (a, b) {
            this.values.push(a - b);
        });

        const obj = {
            values: [1, 2, 3],
            foo: fn(4, __),
            bar: fn(__, 4)
        };

        obj.foo(5);
        expect(obj.values).toStrictEqual([1, 2, 3, -1]);

        obj.bar(5);
        expect(obj.values).toStrictEqual([1, 2, 3, -1, 1]);
    });

    it("should build a function throwing an exception if called without arguments or if `fn` isn't a function", () => {
        nonFunctions.forEach(value => {
            expect(asPartial(value)).toThrow();
        });

        expect(asPartial()).toThrow();
    });
});
