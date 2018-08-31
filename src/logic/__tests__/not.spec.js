import * as lamb from "../..";
import { nonFunctions } from "../../__tests__/commons";
import { Foo, isEven } from "./_commons";

describe("not", function () {
    it("should reverse the truthiness of the given predicate", function () {
        var isOdd = lamb.not(isEven);

        expect(isOdd(3)).toBe(true);
    });

    it("should keep the predicate context", function () {
        expect(new Foo(4).isOdd()).toBe(false);
        expect(new Foo(5).isOdd()).toBe(true);
    });

    it("should build a function returning an exception if the given predicate is missing or isn't a function", function () {
        nonFunctions.forEach(function (value) {
            expect(lamb.not(value)).toThrow();
        });

        expect(lamb.not()).toThrow();
    });
});
