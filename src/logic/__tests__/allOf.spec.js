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

describe("allOf", function () {
    it("should return true if all the given predicates are satisfied", function () {
        var check = lamb.allOf([isEven, isGreaterThanTwo, isLessThanTen]);

        expect([4, 6, 8].map(check)).toEqual([true, true, true]);
    });

    it("should return false if one the given predicates isn't satisfied", function () {
        var check = lamb.allOf([isEven, isGreaterThanTwo, isLessThanTen]);

        expect([2, 3, 16].map(check)).toEqual([false, false, false]);
    });

    it("should treat \"truthy\" and \"falsy\" values returned by predicates as booleans", function () {
        expect(lamb.allOf([hasEvens])([1, 3, 5, 7])).toBe(false);
        expect(lamb.allOf([hasEvens])([1, 2, 5, 7])).toBe(true);
        expect(lamb.allOf([isVowel])("b")).toBe(false);
        expect(lamb.allOf([isVowel])("a")).toBe(true);
    });

    it("should keep the predicate context", function () {
        expect(new Foo(6).isPositiveEven()).toBe(true);
        expect(new Foo(5).isPositiveEven()).toBe(false);
    });

    it("should return `true` for any value if not supplied with predicates because of vacuous truth", function () {
        valuesList.forEach(function (value) {
            expect(lamb.allOf([])(value)).toBe(true);
        });
    });

    it("should throw an exception if the received parameter isn't an array", function () {
        nonArrayLikes.forEach(function (value) {
            expect(function () { lamb.allOf(value); }).toThrow();
        });

        expect(lamb.allOf).toThrow();
    });

    it("should build a function returning an exception if any given predicate isn't a function", function () {
        nonFunctions.forEach(function (value) {
            expect(function () { lamb.allOf([value, isEven])(2); }).toThrow();
            expect(function () { lamb.allOf([isEven, value])(2); }).toThrow();
        });
    });
});
