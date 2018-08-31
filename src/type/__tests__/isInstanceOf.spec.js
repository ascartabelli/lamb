import * as lamb from "../..";
import { nonFunctions } from "../../__tests__/commons";

describe("isInstanceOf", function () {
    it("should build a predicate to check if an object is an instance of the given constructor", function () {
        function SomeObjA () {}
        function SomeObjB () {}

        var a = new SomeObjA();
        var b = new SomeObjB();

        expect(lamb.isInstanceOf(SomeObjA)(a)).toBe(true);
        expect(lamb.isInstanceOf(Object)(a)).toBe(true);
        expect(lamb.isInstanceOf(SomeObjB)(a)).toBe(false);

        expect(lamb.isInstanceOf(SomeObjA)(b)).toBe(false);

        SomeObjB.prototype = new SomeObjA();
        var c = new SomeObjB();

        expect(lamb.isInstanceOf(SomeObjA)(b)).toBe(false);
        expect(lamb.isInstanceOf(SomeObjA)(c)).toBe(true);

        expect(lamb.isInstanceOf(Object)({})).toBe(true);
        expect(lamb.isInstanceOf(Object)(Object.create(null))).toBe(false);
        expect(lamb.isInstanceOf(String)("foo")).toBe(false);
        expect(lamb.isInstanceOf(Object)("foo")).toBe(false);
        expect(lamb.isInstanceOf(String)(new String("foo"))).toBe(true);
        expect(lamb.isInstanceOf(Object)(new String("foo"))).toBe(true);
    });

    it("should build a predicate throwing an exception if the constructor isn't a function or is missing", function () {
        nonFunctions.forEach(function (value) {
            expect(lamb.isInstanceOf(value)).toThrow();
        });

        expect(lamb.isInstanceOf()).toThrow();
    });
});
