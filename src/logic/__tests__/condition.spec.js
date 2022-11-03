import always from "../../core/always";
import casus from "../casus";
import condition from "../condition";
import divideBy from "../../math/divideBy";
import identity from "../../core/identity";
import isGT from "../isGT";
import list from "../../array/list";
import { nonFunctions } from "../../__tests__/commons";
import { Foo, hasEvens, isVowel } from "./_commons";

describe("case / condition", () => {
    const halve = divideBy(2);
    const isGreaterThan5 = isGT(5);
    const halveIfGreaterThan5 = condition(isGreaterThan5, halve, identity);

    describe("case", () => {
        it("should call the received function if the predicate is satisfied by the same arguments", () => {
            expect(casus(isGreaterThan5, halve)(10)).toBe(5);
        });

        it("should build a function that returns `undefined` if the predicate isn't satisfied", () => {
            expect(casus(isGreaterThan5, halve)(3)).toBeUndefined();
        });
    });

    describe("condition", () => {
        it("should build a function that conditionally executes the received functions evaluating a predicate", () => {
            expect(halveIfGreaterThan5(3)).toBe(3);
            expect(halveIfGreaterThan5(10)).toBe(5);
        });

        it("should build a function throwing an exception if `falseFn` isn't a function or is missing", () => {
            nonFunctions.forEach(value => {
                expect(condition(always(false), always(99), value)).toThrow();
            });

            expect(condition(always(false), always(99))).toThrow();
        });
    });

    it("should pass all the received arguments to both the predicate and the chosen branching function", () => {
        const satisfiedPredicate = jest.fn().mockReturnValue(true);
        const notSatisfiedPredicate = jest.fn().mockReturnValue(false);

        const condA = condition(satisfiedPredicate, list, always([]));
        const condB = condition(notSatisfiedPredicate, always([]), list);
        const caseA = casus(satisfiedPredicate, list);
        const caseB = casus(notSatisfiedPredicate, always([]));

        expect(condA(1, 2, 3, 4)).toStrictEqual([1, 2, 3, 4]);
        expect(condB(5, 6, 7)).toStrictEqual([5, 6, 7]);
        expect(caseA(8, 9, 10)).toStrictEqual([8, 9, 10]);
        expect(caseB(11, 12)).toBeUndefined();

        expect(satisfiedPredicate).toHaveBeenCalledTimes(2);
        expect(satisfiedPredicate).toHaveBeenNthCalledWith(1, 1, 2, 3, 4);
        expect(satisfiedPredicate).toHaveBeenNthCalledWith(2, 8, 9, 10);

        expect(notSatisfiedPredicate).toHaveBeenCalledTimes(2);
        expect(notSatisfiedPredicate).toHaveBeenNthCalledWith(1, 5, 6, 7);
        expect(notSatisfiedPredicate).toHaveBeenNthCalledWith(2, 11, 12);
    });

    it("should treat \"truthy\" and \"falsy\" values returned by predicates as booleans", () => {
        const condA = condition(hasEvens, always("yes"), always("no"));
        const condB = condition(isVowel, always("yes"), always("no"));
        const caseA = casus(hasEvens, always("yes"));
        const caseB = casus(isVowel, always("yes"));

        expect(condA([1, 2, 5, 7])).toBe("yes");
        expect(condA([1, 3, 5, 7])).toBe("no");
        expect(condB("a")).toBe("yes");
        expect(condB("b")).toBe("no");

        expect(caseA([1, 2, 5, 7])).toBe("yes");
        expect(caseA([1, 3, 5, 7])).toBeUndefined();
        expect(caseB("a")).toBe("yes");
        expect(caseB("b")).toBeUndefined();
    });

    it("should keep the functions' context", () => {
        expect(new Foo(55).getIfPositiveOrGetSafe()).toBe(55);
        expect(new Foo(-55).getIfPositiveOrGetSafe()).toBe(99);

        expect(new Foo(55).getIfPositiveOrUndefined()).toBe(55);
        expect(new Foo(-55).getIfPositiveOrUndefined()).toBeUndefined();
    });

    it("should build a function throwing an exception if the predicate isn't a function", () => {
        nonFunctions.forEach(value => {
            expect(condition(value, always(99))).toThrow();
            expect(casus(value, always(99))).toThrow();
        });
    });

    it("should build a function throwing an exception if `trueFn` isn't a function or is missing", () => {
        nonFunctions.forEach(value => {
            expect(condition(always(true), value, always(99))).toThrow();
            expect(casus(always(true), value)).toThrow();
        });

        expect(condition(always(true))).toThrow();
        expect(casus(always(true))).toThrow();
    });

    it("should build a function throwing an exception if called without arguments", () => {
        expect(condition()).toThrow();
        expect(casus()).toThrow();
    });
});
