import * as lamb from "../..";
import { nonStrings, wannabeEmptyArrays } from "../../__tests__/commons";

describe("pluckFrom / pluck", function () {
    var arr = [
        { bar: 1, baz: 2, qux: 3 },
        { bar: 34, baz: 22, qux: 73 },
        { bar: 45, baz: 21, qux: 83 },
        { bar: 65, baz: 92, qux: 39 }
    ];

    var lists = [[1, 2], [3, 4, 5], [6]];
    var s = "hello";

    it("should return an array of values taken from the given property of the source array elements", function () {
        expect(lamb.pluckFrom(arr, "baz")).toEqual([2, 22, 21, 92]);
        expect(lamb.pluck("baz")(arr)).toEqual([2, 22, 21, 92]);
        expect(lamb.pluckFrom(lists, "length")).toEqual([2, 3, 1]);
        expect(lamb.pluck("length")(lists)).toEqual([2, 3, 1]);
    });

    it("should work with array-like objects", function () {
        expect(lamb.pluckFrom(s, "length")).toEqual([1, 1, 1, 1, 1]);
        expect(lamb.pluck("length")(s)).toEqual([1, 1, 1, 1, 1]);
    });

    it("should return a list of undefined values if no property is specified or if the property doesn't exist", function () {
        var r = [void 0, void 0, void 0, void 0];

        nonStrings.forEach(function (value) {
            expect(lamb.pluckFrom(arr, value)).toEqual(r);
            expect(lamb.pluck(value)(arr)).toEqual(r);
        });

        expect(lamb.pluckFrom(arr, "foo")).toEqual(r);
        expect(lamb.pluck("foo")(arr)).toEqual(r);

        expect(lamb.pluckFrom(arr)).toEqual(r);
        expect(lamb.pluck()(arr)).toEqual(r);
    });

    it("should not skip deleted or unassigned indexes in the array-like and throw an exception", function () {
        var a = [, { bar: 2 }]; // eslint-disable-line no-sparse-arrays

        expect(function () { lamb.pluckFrom(a, "bar"); }).toThrow();
        expect(function () { lamb.pluck("bar")(a); }).toThrow();
    });

    it("should throw an exception if called without the data argument", function () {
        expect(lamb.pluckFrom).toThrow();
        expect(lamb.pluck("bar")).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", function () {
        expect(function () { lamb.pluckFrom(null, "bar"); }).toThrow();
        expect(function () { lamb.pluckFrom(void 0, "bar"); }).toThrow();
        expect(function () { lamb.pluck("bar")(null); }).toThrow();
        expect(function () { lamb.pluck("bar")(void 0); }).toThrow();
    });

    it("should treat every other value as an empty array", function () {
        wannabeEmptyArrays.forEach(function (value) {
            expect(lamb.pluckFrom(value, "bar")).toEqual([]);
            expect(lamb.pluck("bar")(value)).toEqual([]);
        });
    });
});
