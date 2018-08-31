import * as lamb from "../..";
import { nonFunctions } from "../../__tests__/commons";
import { Foo, hasEvens, isEven } from "./_commons";

describe("unless / when", function () {
    var increment = lamb.add(1);
    var incArray = lamb.mapWith(increment);
    var a1 = [1, 3, 5];
    var a2 = [1, 4, 5];

    it("should build a function that conditionally applies its `fn` parameter to the received value depending on the evaluation of a predicate", function () {
        expect(lamb.unless(isEven, increment)(5)).toBe(6);
        expect(lamb.when(isEven, increment)(4)).toBe(5);
    });

    it("should build a function returning the received value when the desired condition is not met", function () {
        expect(lamb.unless(isEven, increment)(6)).toBe(6);
        expect(lamb.when(isEven, increment)(5)).toBe(5);
    });

    it("should treat \"truthy\" and \"falsy\" values returned by predicates as booleans", function () {
        expect(lamb.unless(hasEvens, incArray)(a1)).toEqual([2, 4, 6]);
        expect(lamb.unless(hasEvens, incArray)(a2)).toBe(a2);
        expect(lamb.when(hasEvens, incArray)(a1)).toBe(a1);
        expect(lamb.when(hasEvens, incArray)(a2)).toEqual([2, 5, 6]);
    });

    it("should build a unary function and ignore extra arguments", function () {
        var incMock = jest.fn(increment);
        var isEvenMock = jest.fn(isEven);
        var incUnlessEven = lamb.unless(isEvenMock, incMock);
        var incWhenEven = lamb.when(isEvenMock, incMock);

        expect(incUnlessEven.length).toBe(1);
        expect(incUnlessEven(5, 6, 7)).toBe(6);
        expect(incUnlessEven(6, 7, 8)).toBe(6);

        expect(incWhenEven.length).toBe(1);
        expect(incWhenEven(4, 5)).toBe(5);
        expect(incWhenEven(5, 6)).toBe(5);

        expect(isEvenMock).toHaveBeenCalledTimes(4);
        expect(isEvenMock.mock.calls[0]).toEqual([5]);
        expect(isEvenMock.mock.calls[1]).toEqual([6]);
        expect(isEvenMock.mock.calls[2]).toEqual([4]);
        expect(isEvenMock.mock.calls[3]).toEqual([5]);

        expect(incMock).toHaveBeenCalledTimes(2);
        expect(incMock.mock.calls[0]).toEqual([5]);
        expect(incMock.mock.calls[1]).toEqual([4]);
    });

    it("should keep the functions' context", function () {
        var positiveFoo = new Foo(33);
        var negativeFoo = new Foo(-33);

        expect(positiveFoo.getWhenPositiveOrElse(88)).toBe(33);
        expect(negativeFoo.getWhenPositiveOrElse(88)).toBe(88);
        expect(positiveFoo.getUnlessIsPositiveOrElse(-88)).toBe(-88);
        expect(negativeFoo.getUnlessIsPositiveOrElse(-88)).toBe(-33);
    });

    it("should build a function throwing an exception if the predicate isn't a function", function () {
        nonFunctions.forEach(function (value) {
            expect(function () { lamb.unless(value, increment)(5); }).toThrow();
            expect(function () { lamb.when(value, increment)(2); }).toThrow();
        });
    });

    it("should not throw an exception if the transformer isn't a function and the conditions aren't met", function () {
        nonFunctions.forEach(function (value) {
            expect(lamb.unless(isEven, value)(2)).toBe(2);
            expect(lamb.when(isEven, value)(5)).toBe(5);
        });
    });

    it("should build a function throwing an exception if the transformer isn't a function and the conditions are met", function () {
        nonFunctions.forEach(function (value) {
            expect(function () { lamb.unless(isEven, value)(5); }).toThrow();
            expect(function () { lamb.when(isEven, value)(2); }).toThrow();
        });
    });

    it("should build a function throwing an exception if called without arguments", function () {
        expect(lamb.unless()).toThrow();
        expect(lamb.when()).toThrow();
    });
});
