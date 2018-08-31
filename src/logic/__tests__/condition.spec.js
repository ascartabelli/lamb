import * as lamb from "../..";
import { nonFunctions } from "../../__tests__/commons";
import { Foo, hasEvens, isVowel } from "./_commons";

describe("case / condition", function () {
    var halve = lamb.divideBy(2);
    var isGreaterThan5 = lamb.isGT(5);
    var halveIfGreaterThan5 = lamb.condition(isGreaterThan5, halve, lamb.identity);

    describe("case", function () {
        it("should call the received function if the predicate is satisfied by the same arguments", function () {
            expect(lamb.case(isGreaterThan5, halve)(10)).toBe(5);
        });

        it("should build a function that returns `undefined` if the predicate isn't satisfied", function () {
            expect(lamb.case(isGreaterThan5, halve)(3)).toBeUndefined();
        });
    });

    describe("condition", function () {
        it("should build a function that conditionally executes the received functions evaluating a predicate", function () {
            expect(halveIfGreaterThan5(3)).toBe(3);
            expect(halveIfGreaterThan5(10)).toBe(5);
        });

        it("should build a function throwing an exception if `falseFn` isn't a function or is missing", function () {
            nonFunctions.forEach(function (value) {
                expect(lamb.condition(lamb.always(false), lamb.always(99), value)).toThrow();
            });

            expect(lamb.condition(lamb.always(false), lamb.always(99))).toThrow();
        });
    });

    it("should pass all the received arguments to both the predicate and the chosen branching function", function () {
        var satisfiedPredicate = jest.fn().mockReturnValue(true);
        var notSatisfiedPredicate = jest.fn().mockReturnValue(false);

        var condA = lamb.condition(satisfiedPredicate, lamb.list, lamb.always([]));
        var condB = lamb.condition(notSatisfiedPredicate, lamb.always([]), lamb.list);
        var caseA = lamb.case(satisfiedPredicate, lamb.list);
        var caseB = lamb.case(notSatisfiedPredicate, lamb.always([]));

        expect(condA(1, 2, 3, 4)).toEqual([1, 2, 3, 4]);
        expect(condB(5, 6, 7)).toEqual([5, 6, 7]);
        expect(caseA(8, 9, 10)).toEqual([8, 9, 10]);
        expect(caseB(11, 12)).toBeUndefined();

        expect(satisfiedPredicate).toHaveBeenCalledTimes(2);
        expect(satisfiedPredicate.mock.calls[0]).toEqual([1, 2, 3, 4]);
        expect(satisfiedPredicate.mock.calls[1]).toEqual([8, 9, 10]);

        expect(notSatisfiedPredicate).toHaveBeenCalledTimes(2);
        expect(notSatisfiedPredicate.mock.calls[0]).toEqual([5, 6, 7]);
        expect(notSatisfiedPredicate.mock.calls[1]).toEqual([11, 12]);
    });

    it("should treat \"truthy\" and \"falsy\" values returned by predicates as booleans", function () {
        var condA = lamb.condition(hasEvens, lamb.always("yes"), lamb.always("no"));
        var condB = lamb.condition(isVowel, lamb.always("yes"), lamb.always("no"));
        var caseA = lamb.case(hasEvens, lamb.always("yes"));
        var caseB = lamb.case(isVowel, lamb.always("yes"));

        expect(condA([1, 2, 5, 7])).toBe("yes");
        expect(condA([1, 3, 5, 7])).toBe("no");
        expect(condB("a")).toBe("yes");
        expect(condB("b")).toBe("no");

        expect(caseA([1, 2, 5, 7])).toBe("yes");
        expect(caseA([1, 3, 5, 7])).toBeUndefined();
        expect(caseB("a")).toBe("yes");
        expect(caseB("b")).toBeUndefined();
    });

    it("should keep the functions' context", function () {
        expect(new Foo(55).getIfPositiveOrGetSafe()).toBe(55);
        expect(new Foo(-55).getIfPositiveOrGetSafe()).toBe(99);

        expect(new Foo(55).getIfPositiveOrUndefined()).toBe(55);
        expect(new Foo(-55).getIfPositiveOrUndefined()).toBeUndefined();
    });

    it("should build a function throwing an exception if the predicate isn't a function", function () {
        nonFunctions.forEach(function (value) {
            expect(lamb.condition(value, lamb.always(99))).toThrow();
            expect(lamb.case(value, lamb.always(99))).toThrow();
        });
    });

    it("should build a function throwing an exception if `trueFn` isn't a function or is missing", function () {
        nonFunctions.forEach(function (value) {
            expect(lamb.condition(lamb.always(true), value, lamb.always(99))).toThrow();
            expect(lamb.case(lamb.always(true), value)).toThrow();
        });

        expect(lamb.condition(lamb.always(true))).toThrow();
        expect(lamb.case(lamb.always(true))).toThrow();
    });

    it("should build a function throwing an exception if called without arguments", function () {
        expect(lamb.condition()).toThrow();
        expect(lamb.case()).toThrow();
    });
});
