import allOf from "../allOf";
import { nonArrayLikes, nonFunctions, valuesList } from "../../__tests__/commons";
import {
    Foo,
    hasEvens,
    isEven,
    isGreaterThanTwo,
    isLessThanTen,
    isVowel
} from "./_commons";

describe("allOf", () => {
    it("should return true if all the given predicates are satisfied", () => {
        const check = allOf([isEven, isGreaterThanTwo, isLessThanTen]);

        expect([4, 6, 8].map(check)).toStrictEqual([true, true, true]);
    });

    it("should return false if one the given predicates isn't satisfied", () => {
        const check = allOf([isEven, isGreaterThanTwo, isLessThanTen]);

        expect([2, 3, 16].map(check)).toStrictEqual([false, false, false]);
    });

    it("should treat \"truthy\" and \"falsy\" values returned by predicates as booleans", () => {
        expect(allOf([hasEvens])([1, 3, 5, 7])).toBe(false);
        expect(allOf([hasEvens])([1, 2, 5, 7])).toBe(true);
        expect(allOf([isVowel])("b")).toBe(false);
        expect(allOf([isVowel])("a")).toBe(true);
    });

    it("should keep the predicate context", () => {
        expect(new Foo(6).isPositiveEven()).toBe(true);
        expect(new Foo(5).isPositiveEven()).toBe(false);
    });

    it("should return `true` for any value if not supplied with predicates because of vacuous truth", () => {
        valuesList.forEach(value => {
            expect(allOf([])(value)).toBe(true);
        });
    });

    it("should throw an exception if the received parameter isn't an array", () => {
        nonArrayLikes.forEach(value => {
            expect(() => { allOf(value); }).toThrow();
        });

        expect(allOf).toThrow();
    });

    it("should build a function returning an exception if any given predicate isn't a function", () => {
        nonFunctions.forEach(value => {
            expect(() => { allOf([value, isEven])(2); }).toThrow();
            expect(() => { allOf([isEven, value])(2); }).toThrow();
        });
    });
});
