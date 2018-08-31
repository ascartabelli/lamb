import * as lamb from "../..";
import { nonArrayLikes, nonFunctions, valuesList } from "../../__tests__/commons";
import {
    Foo,
    hasEvens,
    isEven,
    isGreaterThanTwo,
    isLessThanTen,
    isVowel
} from "./_commons";

describe("anyOf", function () {
    it("should return true if at least one of the given predicates is satisfied", function () {
        var check = lamb.anyOf([isEven, isGreaterThanTwo, isLessThanTen]);

        expect([33, 44, 5].map(check)).toEqual([true, true, true]);
    });

    it("should return false if none of the given predicates is satisfied", function () {
        var check = lamb.anyOf([isEven, isLessThanTen]);

        expect([33, 35, 55].map(check)).toEqual([false, false, false]);
    });

    it("should treat \"truthy\" and \"falsy\" values returned by predicates as booleans", function () {
        expect(lamb.anyOf([hasEvens])([1, 3, 5, 7])).toBe(false);
        expect(lamb.anyOf([hasEvens])([1, 2, 5, 7])).toBe(true);
        expect(lamb.anyOf([isVowel])("b")).toBe(false);
        expect(lamb.anyOf([isVowel])("a")).toBe(true);
    });

    it("should keep the predicate context", function () {
        expect(new Foo(5).isPositiveOrEven()).toBe(true);
        expect(new Foo(-5).isPositiveOrEven()).toBe(false);
    });

    it("should return `false` for any value if not supplied with predicates", function () {
        valuesList.forEach(function (value) {
            expect(lamb.anyOf([])(value)).toBe(false);
        });
    });

    it("should throw an exception if the received parameter isn't an array", function () {
        nonArrayLikes.forEach(function (value) {
            expect(function () { lamb.anyOf(value); }).toThrow();
        });

        expect(lamb.anyOf).toThrow();
    });

    it("should not throw an exception if some predicate isn't a function if a previous predicate satisfies the condition", function () {
        nonFunctions.forEach(function (value) {
            expect(lamb.anyOf([isEven, value])(2)).toBe(true);
        });
    });

    it("should build a function returning an exception if a predicate isn't a function and the condition isn't satisfied yet", function () {
        nonFunctions.forEach(function (value) {
            expect(function () { lamb.anyOf([value, isEven])(2); }).toThrow();
            expect(function () { lamb.anyOf([isEven, value])(3); }).toThrow();
        });
    });
});
