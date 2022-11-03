import isInstanceOf from "../isInstanceOf";
import { nonFunctions } from "../../__tests__/commons";

describe("isInstanceOf", () => {
    it("should build a predicate to check if an object is an instance of the given constructor", () => {
        function SomeObjA () {}
        function SomeObjB () {}

        const a = new SomeObjA();
        const b = new SomeObjB();

        expect(isInstanceOf(SomeObjA)(a)).toBe(true);
        expect(isInstanceOf(Object)(a)).toBe(true);
        expect(isInstanceOf(SomeObjB)(a)).toBe(false);

        expect(isInstanceOf(SomeObjA)(b)).toBe(false);

        SomeObjB.prototype = new SomeObjA();
        const c = new SomeObjB();

        expect(isInstanceOf(SomeObjA)(b)).toBe(false);
        expect(isInstanceOf(SomeObjA)(c)).toBe(true);

        expect(isInstanceOf(Object)({})).toBe(true);
        expect(isInstanceOf(Object)(Object.create(null))).toBe(false);
        expect(isInstanceOf(String)("foo")).toBe(false);
        expect(isInstanceOf(Object)("foo")).toBe(false);
        expect(isInstanceOf(String)(new String("foo"))).toBe(true);
        expect(isInstanceOf(Object)(new String("foo"))).toBe(true);
    });

    it("should build a predicate throwing an exception if the constructor isn't a function or is missing", () => {
        nonFunctions.forEach(value => {
            expect(isInstanceOf(value)).toThrow();
        });

        expect(isInstanceOf()).toThrow();
    });
});
