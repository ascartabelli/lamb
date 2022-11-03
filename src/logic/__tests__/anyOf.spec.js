import anyOf from "../anyOf";
import { nonArrayLikes, nonFunctions, valuesList } from "../../__tests__/commons";
import {
    Foo,
    hasEvens,
    isEven,
    isGreaterThanTwo,
    isLessThanTen,
    isVowel
} from "./_commons";

describe("anyOf", () => {
    it("should return true if at least one of the given predicates is satisfied", () => {
        const check = anyOf([isEven, isGreaterThanTwo, isLessThanTen]);

        expect([33, 44, 5].map(check)).toStrictEqual([true, true, true]);
    });

    it("should return false if none of the given predicates is satisfied", () => {
        const check = anyOf([isEven, isLessThanTen]);

        expect([33, 35, 55].map(check)).toStrictEqual([false, false, false]);
    });

    it("should treat \"truthy\" and \"falsy\" values returned by predicates as booleans", () => {
        expect(anyOf([hasEvens])([1, 3, 5, 7])).toBe(false);
        expect(anyOf([hasEvens])([1, 2, 5, 7])).toBe(true);
        expect(anyOf([isVowel])("b")).toBe(false);
        expect(anyOf([isVowel])("a")).toBe(true);
    });

    it("should keep the predicate context", () => {
        expect(new Foo(5).isPositiveOrEven()).toBe(true);
        expect(new Foo(-5).isPositiveOrEven()).toBe(false);
    });

    it("should return `false` for any value if not supplied with predicates", () => {
        valuesList.forEach(value => {
            expect(anyOf([])(value)).toBe(false);
        });
    });

    it("should throw an exception if the received parameter isn't an array", () => {
        nonArrayLikes.forEach(value => {
            expect(() => { anyOf(value); }).toThrow();
        });

        expect(anyOf).toThrow();
    });

    it("should not throw an exception if some predicate isn't a function if a previous predicate satisfies the condition", () => {
        nonFunctions.forEach(value => {
            expect(anyOf([isEven, value])(2)).toBe(true);
        });
    });

    it("should build a function returning an exception if a predicate isn't a function and the condition isn't satisfied yet", () => {
        nonFunctions.forEach(value => {
            expect(() => { anyOf([value, isEven])(2); }).toThrow();
            expect(() => { anyOf([isEven, value])(3); }).toThrow();
        });
    });
});
