import * as lamb from "../..";
import {
    nonStringsAsStrings,
    wannabeEmptyArrays,
    wannabeEmptyObjects
} from "../../__tests__/commons";

describe("pick / pickKeys", function () {
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

    it("should return an object having only the specified properties of the source object (if they exist)", function () {
        expect(lamb.pick(simpleObj, ["foo", "baz", "foobaz"])).toEqual({ foo: 1, baz: 3 });
        expect(lamb.pickKeys(["foo", "baz", "foobaz"])(simpleObj)).toEqual({ foo: 1, baz: 3 });
    });

    it("should include inherited properties", function () {
        expect(lamb.pick(simpleObj, ["foo", "bar"])).toEqual({ foo: 1, bar: 2 });
        expect(lamb.pickKeys(["foo", "bar"])(simpleObj)).toEqual({ foo: 1, bar: 2 });
    });

    it("should include properties with `undefined` values in the result", function () {
        expect(lamb.pick({ a: null, b: void 0 }, ["a", "b"])).toStrictEqual({ a: null, b: void 0 });
        expect(lamb.pickKeys(["a", "b"])({ a: null, b: void 0 })).toStrictEqual({ a: null, b: void 0 });
    });

    it("should accept arrays and array-like objects and integers as keys", function () {
        var result = {
            0: { name: "Jane", surname: "Doe" },
            2: { name: "Mario", surname: "Rossi" }
        };

        expect(lamb.pick(names, ["0", 2])).toEqual(result);
        expect(lamb.pickKeys(["0", 2])(names)).toEqual(result);
        expect(lamb.pick("bar", [0, 2])).toEqual({ 0: "b", 2: "r" });
        expect(lamb.pickKeys([0, 2])("bar")).toEqual({ 0: "b", 2: "r" });
    });

    it("should see unassigned or deleted indexes in sparse arrays as non-existing keys", function () {
        /* eslint-disable no-sparse-arrays */
        expect(lamb.pick([1, , 3], [0, 1])).toStrictEqual({ 0: 1 });
        expect(lamb.pickKeys([0, 1])([1, , 3])).toStrictEqual({ 0: 1 });
        /* eslint-enable no-sparse-arrays */
    });

    it("should see unassigned or deleted indexes in sparse arrays received as the `whitelist` as `undefined` values", function () {
        /* eslint-disable comma-spacing, no-sparse-arrays */
        expect(lamb.pick({ undefined: 1, a: 2, b: 3 }, ["a", ,])).toStrictEqual({ undefined: 1, a: 2 });
        expect(lamb.pickKeys(["a", ,])({ undefined: 1, a: 2, b: 3 })).toStrictEqual({ undefined: 1, a: 2 });
        /* eslint-enable comma-spacing, no-sparse-arrays */
    });

    it("should return an empty object if supplied with an empty list of keys", function () {
        expect(lamb.pick(simpleObj, [])).toEqual({});
        expect(lamb.pickKeys([])(simpleObj)).toEqual({});
    });

    it("should accept an array-like object as the `whitelist` parameter", function () {
        expect(lamb.pick({ a: 1, b: 2, c: 3 }, "ac")).toEqual({ a: 1, c: 3 });
        expect(lamb.pickKeys("ac")({ a: 1, b: 2, c: 3 })).toEqual({ a: 1, c: 3 });
    });

    it("should convert to string every value in the `whitelist` parameter", function () {
        var testObj = lamb.merge({ bar: "baz" }, oddObject);

        expect(lamb.pick(testObj, nonStringsAsStrings)).toEqual(oddObject);
        expect(lamb.pickKeys(nonStringsAsStrings)(testObj)).toEqual(oddObject);
    });

    it("should throw an exception if called without the main data argument", function () {
        expect(lamb.pick).toThrow();
        expect(lamb.pickKeys(["a", "b"])).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` in place of the `whitelist`", function () {
        expect(function () { lamb.pick({ a: 1 }, null); }).toThrow();
        expect(function () { lamb.pick({ a: 1 }, void 0); }).toThrow();
        expect(function () { lamb.pickKeys(null)({ a: 1 }); }).toThrow();
        expect(function () { lamb.pickKeys(void 0)({ a: 1 }); }).toThrow();
        expect(function () { lamb.pickKeys()({ a: 1 }); }).toThrow();
    });

    it("should treat other values for the `whitelist` parameter as an empty array and return an empty object", function () {
        wannabeEmptyArrays.forEach(function (value) {
            expect(lamb.pick({ a: 1, b: 2 }, value)).toEqual({});
            expect(lamb.pickKeys(value)({ a: 1, b: 2 })).toEqual({});
        });
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an object", function () {
        expect(function () { lamb.pick(null, ["a", "b"]); }).toThrow();
        expect(function () { lamb.pick(void 0, ["a", "b"]); }).toThrow();
        expect(function () { lamb.pickKeys(["a", "b"])(null); }).toThrow();
        expect(function () { lamb.pickKeys(["a", "b"])(void 0); }).toThrow();
    });

    it("should convert to object every other value", function () {
        wannabeEmptyObjects.forEach(function (v) {
            expect(lamb.pick(v, ["a"])).toEqual({});
            expect(lamb.pickKeys(["a"])(v)).toEqual({});
        });

        expect(lamb.pick(/foo/, ["lastIndex"])).toEqual({ lastIndex: 0 });
        expect(lamb.pickKeys(["lastIndex"])(/foo/)).toEqual({ lastIndex: 0 });
    });
});
