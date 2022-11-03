import not from "../not";
import { nonFunctions } from "../../__tests__/commons";
import { Foo, isEven } from "./_commons";

describe("not", () => {
    it("should reverse the truthiness of the given predicate", () => {
        const isOdd = not(isEven);

        expect(isOdd(3)).toBe(true);
    });

    it("should keep the predicate context", () => {
        expect(new Foo(4).isOdd()).toBe(false);
        expect(new Foo(5).isOdd()).toBe(true);
    });

    it("should build a function returning an exception if the given predicate is missing or isn't a function", () => {
        nonFunctions.forEach(value => {
            expect(not(value)).toThrow();
        });

        expect(not()).toThrow();
    });
});
