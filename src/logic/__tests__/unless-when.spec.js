import add from "../../math/add";
import mapWith from "../../core/mapWith";
import unless from "../unless";
import when from "../when";
import { nonFunctions } from "../../__tests__/commons";
import { Foo, hasEvens, isEven } from "./_commons";

describe("unless / when", () => {
    const increment = add(1);
    const incArray = mapWith(increment);
    const a1 = [1, 3, 5];
    const a2 = [1, 4, 5];

    it("should build a function that conditionally applies its `fn` parameter to the received value depending on the evaluation of a predicate", () => {
        expect(unless(isEven, increment)(5)).toBe(6);
        expect(when(isEven, increment)(4)).toBe(5);
    });

    it("should build a function returning the received value when the desired condition is not met", () => {
        expect(unless(isEven, increment)(6)).toBe(6);
        expect(when(isEven, increment)(5)).toBe(5);
    });

    it("should treat \"truthy\" and \"falsy\" values returned by predicates as booleans", () => {
        expect(unless(hasEvens, incArray)(a1)).toStrictEqual([2, 4, 6]);
        expect(unless(hasEvens, incArray)(a2)).toBe(a2);
        expect(when(hasEvens, incArray)(a1)).toBe(a1);
        expect(when(hasEvens, incArray)(a2)).toStrictEqual([2, 5, 6]);
    });

    it("should build a unary function and ignore extra arguments", () => {
        const incMock = jest.fn(increment);
        const isEvenMock = jest.fn(isEven);
        const incUnlessEven = unless(isEvenMock, incMock);
        const incWhenEven = when(isEvenMock, incMock);

        expect(incUnlessEven.length).toBe(1);
        expect(incUnlessEven(5, 6, 7)).toBe(6);
        expect(incUnlessEven(6, 7, 8)).toBe(6);

        expect(incWhenEven.length).toBe(1);
        expect(incWhenEven(4, 5)).toBe(5);
        expect(incWhenEven(5, 6)).toBe(5);

        expect(isEvenMock).toHaveBeenCalledTimes(4);
        expect(isEvenMock).toHaveBeenNthCalledWith(1, 5);
        expect(isEvenMock).toHaveBeenNthCalledWith(2, 6);
        expect(isEvenMock).toHaveBeenNthCalledWith(3, 4);
        expect(isEvenMock).toHaveBeenNthCalledWith(4, 5);

        expect(incMock).toHaveBeenCalledTimes(2);
        expect(incMock).toHaveBeenNthCalledWith(1, 5);
        expect(incMock).toHaveBeenNthCalledWith(2, 4);
    });

    it("should keep the functions' context", () => {
        const positiveFoo = new Foo(33);
        const negativeFoo = new Foo(-33);

        expect(positiveFoo.getWhenPositiveOrElse(88)).toBe(33);
        expect(negativeFoo.getWhenPositiveOrElse(88)).toBe(88);
        expect(positiveFoo.getUnlessIsPositiveOrElse(-88)).toBe(-88);
        expect(negativeFoo.getUnlessIsPositiveOrElse(-88)).toBe(-33);
    });

    it("should build a function throwing an exception if the predicate isn't a function", () => {
        nonFunctions.forEach(value => {
            expect(() => { unless(value, increment)(5); }).toThrow();
            expect(() => { when(value, increment)(2); }).toThrow();
        });
    });

    it("should not throw an exception if the transformer isn't a function and the conditions aren't met", () => {
        nonFunctions.forEach(value => {
            expect(unless(isEven, value)(2)).toBe(2);
            expect(when(isEven, value)(5)).toBe(5);
        });
    });

    it("should build a function throwing an exception if the transformer isn't a function and the conditions are met", () => {
        nonFunctions.forEach(value => {
            expect(() => { unless(isEven, value)(5); }).toThrow();
            expect(() => { when(isEven, value)(2); }).toThrow();
        });
    });

    it("should build a function throwing an exception if called without arguments", () => {
        expect(unless()).toThrow();
        expect(when()).toThrow();
    });
});
