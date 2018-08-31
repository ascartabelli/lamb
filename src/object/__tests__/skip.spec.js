import * as lamb from "../..";
import {
    nonStringsAsStrings,
    wannabeEmptyArrays,
    wannabeEmptyObjects
} from "../../__tests__/commons";

describe("skip / skipKeys", function () {
    var baseSimpleObj = { bar: 2 };
    var simpleObj = Object.create(baseSimpleObj, {
        foo: { value: 1, enumerable: true },
        baz: { value: 3, enumerable: true }
    });

    var names = [
        { name: "Jane", surname: "Doe" },
        { name: "John", surname: "Doe" },
        { name: "Mario", surname: "Rossi" },
        { name: "Paolo", surname: "Bianchi" }
    ];

    var oddObject = {};

    nonStringsAsStrings.forEach(function (key, idx) {
        oddObject[key] = idx;
    });

    it("should return a copy of the given object without the specified properties", function () {
        expect(lamb.skip(simpleObj, ["bar", "baz"])).toEqual({ foo: 1 });
        expect(lamb.skipKeys(["bar", "baz"])(simpleObj)).toEqual({ foo: 1 });
    });

    it("should include inherited properties", function () {
        expect(lamb.skip(simpleObj, ["foo"])).toEqual({ bar: 2, baz: 3 });
        expect(lamb.skipKeys(["foo"])(simpleObj)).toEqual({ bar: 2, baz: 3 });
    });

    it("should include properties with `undefined` values in the result", function () {
        expect(lamb.skip({ a: null, b: void 0 }, ["c"])).toEqual({ a: null, b: void 0 });
        expect(lamb.skipKeys(["c"])({ a: null, b: void 0 })).toEqual({ a: null, b: void 0 });
    });

    it("should accept arrays and array-like objects and integers as keys", function () {
        var result = {
            0: { name: "Jane", surname: "Doe" },
            2: { name: "Mario", surname: "Rossi" }
        };

        expect(lamb.skip(names, ["1", 3])).toEqual(result);
        expect(lamb.skipKeys(["1", 3])(names)).toEqual(result);
        expect(lamb.skip("bar", [0, 2])).toEqual({ 1: "a" });
        expect(lamb.skipKeys([0, 2])("bar")).toEqual({ 1: "a" });
    });

    it("should see unassigned or deleted indexes in sparse arrays as non-existing keys", function () {
        /* eslint-disable no-sparse-arrays */
        expect(lamb.skip([1, , 3], [2])).toEqual({ 0: 1 });
        expect(lamb.skipKeys([2])([1, , 3])).toEqual({ 0: 1 });
        /* eslint-enable no-sparse-arrays */
    });

    it("should see unassigned or deleted indexes in sparse arrays received as the `blacklist` as `undefined` values", function () {
        /* eslint-disable comma-spacing, no-sparse-arrays */
        expect(lamb.skip({ undefined: 1, a: 2, b: 3 }, ["a", ,])).toEqual({ b: 3 });
        expect(lamb.skipKeys(["a", ,])({ undefined: 1, a: 2, b: 3 })).toEqual({ b: 3 });
        /* eslint-enable comma-spacing, no-sparse-arrays */
    });

    it("should return a copy of the source object if supplied with an empty list of keys", function () {
        var r1 = lamb.skip(simpleObj, []);
        var r2 = lamb.skipKeys([])(simpleObj);

        expect(r1).toEqual({ foo: 1, bar: 2, baz: 3 });
        expect(r1).not.toBe(simpleObj);
        expect(r2).toEqual({ foo: 1, bar: 2, baz: 3 });
        expect(r2).not.toBe(simpleObj);
    });

    it("should accept an array-like object as the `blacklist` parameter", function () {
        expect(lamb.skip({ a: 1, b: 2, c: 3 }, "ac")).toEqual({ b: 2 });
        expect(lamb.skipKeys("ac")({ a: 1, b: 2, c: 3 })).toEqual({ b: 2 });
    });

    it("should convert to string every value in the `blacklist` parameter", function () {
        var testObj = lamb.merge({ bar: "baz" }, oddObject);

        expect(lamb.skip(testObj, nonStringsAsStrings)).toEqual({ bar: "baz" });
        expect(lamb.skipKeys(nonStringsAsStrings)(testObj)).toEqual({ bar: "baz" });
    });

    it("should throw an exception if called without the main data argument", function () {
        expect(lamb.skip).toThrow();
        expect(lamb.skipKeys(["a", "b"])).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` in place of the `blacklist`", function () {
        expect(function () { lamb.skip({ a: 1 }, null); }).toThrow();
        expect(function () { lamb.skip({ a: 1 }, void 0); }).toThrow();
        expect(function () { lamb.skipKeys(null)({ a: 1 }); }).toThrow();
        expect(function () { lamb.skipKeys(void 0)({ a: 1 }); }).toThrow();
        expect(function () { lamb.skipKeys()({ a: 1 }); }).toThrow();
    });

    it("should treat other values for the `blacklist` parameter as an empty array and return a copy of the source object", function () {
        wannabeEmptyArrays.forEach(function (value) {
            var r1 = lamb.skip(simpleObj, value);
            var r2 = lamb.skipKeys(value)(simpleObj);

            expect(r1).toEqual({ foo: 1, bar: 2, baz: 3 });
            expect(r1).not.toBe(simpleObj);
            expect(r2).toEqual({ foo: 1, bar: 2, baz: 3 });
            expect(r2).not.toBe(simpleObj);
        });
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an object", function () {
        expect(function () { lamb.skip(null, ["a", "b"]); }).toThrow();
        expect(function () { lamb.skip(void 0, ["a", "b"]); }).toThrow();
        expect(function () { lamb.skipKeys(["a", "b"])(null); }).toThrow();
        expect(function () { lamb.skipKeys(["a", "b"])(void 0); }).toThrow();
    });

    it("should convert to object every other value", function () {
        wannabeEmptyObjects.forEach(function (v) {
            expect(lamb.skip(v, ["a"])).toEqual({});
            expect(lamb.skipKeys(["a"])(v)).toEqual({});
        });

        expect(lamb.skip(/foo/, ["lastIndex"])).toEqual({});
        expect(lamb.skipKeys(["lastIndex"])(/foo/)).toEqual({});
    });
});
