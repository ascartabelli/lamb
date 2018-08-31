import * as lamb from "../..";
import { nonStrings, wannabeEmptyArrays } from "../../__tests__/commons";

describe("pluck / pluckKey", function () {
    var arr = [
        { bar: 1, baz: 2, qux: 3 },
        { bar: 34, baz: 22, qux: 73 },
        { bar: 45, baz: 21, qux: 83 },
        { bar: 65, baz: 92, qux: 39 }
    ];

    var lists = [[1, 2], [3, 4, 5], [6]];
    var s = "hello";

    it("should return an array of values taken from the given property of the source array elements", function () {
        expect(lamb.pluck(arr, "baz")).toEqual([2, 22, 21, 92]);
        expect(lamb.pluckKey("baz")(arr)).toEqual([2, 22, 21, 92]);
        expect(lamb.pluck(lists, "length")).toEqual([2, 3, 1]);
        expect(lamb.pluckKey("length")(lists)).toEqual([2, 3, 1]);
    });

    it("should work with array-like objects", function () {
        expect(lamb.pluck(s, "length")).toEqual([1, 1, 1, 1, 1]);
        expect(lamb.pluckKey("length")(s)).toEqual([1, 1, 1, 1, 1]);
    });

    it("should return a list of undefined values if no property is specified or if the property doesn't exist", function () {
        var r = [void 0, void 0, void 0, void 0];

        nonStrings.forEach(function (value) {
            expect(lamb.pluck(arr, value)).toEqual(r);
            expect(lamb.pluckKey(value)(arr)).toEqual(r);
        });

        expect(lamb.pluck(arr, "foo")).toEqual(r);
        expect(lamb.pluckKey("foo")(arr)).toEqual(r);

        expect(lamb.pluck(arr)).toEqual(r);
        expect(lamb.pluckKey()(arr)).toEqual(r);
    });

    it("should not skip deleted or unassigned indexes in the array-like and throw an exception", function () {
        var a = [, { bar: 2 }]; // eslint-disable-line no-sparse-arrays

        expect(function () { lamb.pluck(a, "bar"); }).toThrow();
        expect(function () { lamb.pluckKey("bar")(a); }).toThrow();
    });

    it("should throw an exception if called without the data argument", function () {
        expect(lamb.pluck).toThrow();
        expect(lamb.pluckKey("bar")).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", function () {
        expect(function () { lamb.pluck(null, "bar"); }).toThrow();
        expect(function () { lamb.pluck(void 0, "bar"); }).toThrow();
        expect(function () { lamb.pluckKey("bar")(null); }).toThrow();
        expect(function () { lamb.pluckKey("bar")(void 0); }).toThrow();
    });

    it("should treat every other value as an empty array", function () {
        wannabeEmptyArrays.forEach(function (value) {
            expect(lamb.pluck(value, "bar")).toEqual([]);
            expect(lamb.pluckKey("bar")(value)).toEqual([]);
        });
    });
});
