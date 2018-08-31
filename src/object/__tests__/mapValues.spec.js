import * as lamb from "../..";
import { wannabeEmptyObjects } from "../../__tests__/commons";

describe("mapValues / mapValuesWith", function () {
    var baseFoo = Object.create({ a: 1 }, { b: { value: 2, enumerable: true }, z: { value: 5 } });
    var foo = Object.create(baseFoo, { c: { value: 3, enumerable: true } });

    var fooEquivalent = { a: 1, b: 2, c: 3, z: 5 };

    var inc = lamb.add(1);

    // The "toEqual" matcher would have checked only own enumerable properties
    afterEach(function () {
        for (var key in fooEquivalent) {
            expect(fooEquivalent[key]).toBe(foo[key]);
        }
    });

    it("should create a new object by applying the received function to the values of the source one", function () {
        var times3 = lamb.multiplyBy(3);
        var r = { a: 3, b: 6, c: 9 };

        expect(lamb.mapValues(foo, times3)).toEqual(r);
        expect(lamb.mapValuesWith(times3)(foo)).toEqual(r);
    });

    it("should use all the enumerable properties of the source object, inherited or not", function () {
        var r = { a: 2, b: 3, c: 4 };

        expect(lamb.mapValues(foo, inc)).toEqual(r);
        expect(lamb.mapValuesWith(inc)(foo)).toEqual(r);
    });

    it("should pass the key value, its name and the object being traversed to the mapping function", function () {
        var deductFive = function (v, k, o) {
            expect(o).toBe(foo);
            expect(o[k]).toBe(v);

            return v - 5;
        };
        var r = { a: -4, b: -3, c: -2 };

        expect(lamb.mapValues(foo, deductFive)).toEqual(r);
        expect(lamb.mapValuesWith(deductFive)(foo)).toEqual(r);
    });

    it("should work with array-like objects", function () {
        var a = [97, 97, 98];
        var s = "abc";
        var r1 = { 0: 98, 1: 98, 2: 99 };
        var r2 = { 0: "A", 1: "B", 2: "C" };

        var toUpperCase = lamb.invoker("toUpperCase");

        expect(lamb.mapValues(a, inc)).toEqual(r1);
        expect(lamb.mapValuesWith(inc)(a)).toEqual(r1);

        expect(lamb.mapValues(s, toUpperCase)).toEqual(r2);
        expect(lamb.mapValuesWith(toUpperCase)(s)).toEqual(r2);
    });

    it("should throw an exception if called without arguments", function () {
        expect(lamb.mapValues).toThrow();
        expect(lamb.mapValuesWith()).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an object", function () {
        expect(function () { lamb.mapValues(null, inc); }).toThrow();
        expect(function () { lamb.mapValues(void 0, inc); }).toThrow();
        expect(function () { lamb.mapValuesWith(inc)(null); }).toThrow();
        expect(function () { lamb.mapValuesWith(inc)(void 0); }).toThrow();
    });

    it("should consider other values as empty objects", function () {
        wannabeEmptyObjects.forEach(function (value) {
            expect(lamb.mapValues(value, inc)).toEqual({});
            expect(lamb.mapValuesWith(inc)(value)).toEqual({});
        });
    });

    it("should throw an exception if `fn` isn't a function or if it's missing", function () {
        expect(function () { lamb.mapValues(foo); }).toThrow();
        expect(function () { lamb.mapValuesWith()(foo); }).toThrow();
    });
});
