import * as lamb from "../..";
import {
    nonStrings,
    nonStringsAsStrings,
    wannabeEmptyObjects
} from "../../__tests__/commons";

describe("has / hasKey", function () {
    var obj = { foo: "bar" };

    it("should check the existence of the property in an object", function () {
        expect(lamb.has(obj, "toString")).toBe(true);
        expect(lamb.has(obj, "foo")).toBe(true);
        expect(lamb.hasKey("toString")(obj)).toBe(true);
        expect(lamb.hasKey("foo")(obj)).toBe(true);
    });

    it("should return `false` for a non-existent property", function () {
        expect(lamb.has(obj, "baz")).toBe(false);
        expect(lamb.hasKey("baz")(obj)).toBe(false);
    });

    it("should accept integers as keys and accept array-like objects", function () {
        var o = { 1: "a", 2: "b" };
        var arr = [1, 2, 3, 4];
        var s = "abcd";

        expect(lamb.has(o, 2)).toBe(true);
        expect(lamb.has(arr, 2)).toBe(true);
        expect(lamb.has(s, 2)).toBe(true);
        expect(lamb.hasKey(2)(o)).toBe(true);
        expect(lamb.hasKey(2)(arr)).toBe(true);
        expect(lamb.hasKey(2)(s)).toBe(true);
    });

    it("should consider only defined indexes in sparse arrays", function () {
        var arr = [1, , 3]; // eslint-disable-line no-sparse-arrays

        expect(lamb.has(arr, 1)).toBe(false);
        expect(lamb.hasKey(1)(arr)).toBe(false);
    });

    it("should convert other values for the `key` parameter to string", function () {
        var testObj = lamb.make(nonStringsAsStrings, []);

        nonStrings.forEach(function (key) {
            expect(lamb.has(testObj, key)).toBe(true);
            expect(lamb.hasKey(key)(testObj)).toBe(true);
        });

        expect(lamb.has({ undefined: void 0 })).toBe(true);
        expect(lamb.hasKey()({ undefined: void 0 })).toBe(true);
    });

    it("should throw an exception if called without the data argument", function () {
        expect(lamb.has).toThrow();
        expect(lamb.hasKey("foo")).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an object", function () {
        expect(function () { lamb.has(null, "a"); }).toThrow();
        expect(function () { lamb.has(void 0, "a"); }).toThrow();
        expect(function () { lamb.hasKey("a")(null); }).toThrow();
        expect(function () { lamb.hasKey("a")(void 0); }).toThrow();
    });

    it("should convert to object every other value", function () {
        wannabeEmptyObjects.forEach(function (v) {
            expect(lamb.has(v, "a")).toBe(false);
            expect(lamb.hasKey("a")(v)).toBe(false);
        });

        expect(lamb.has(/foo/, "lastIndex")).toBe(true);
        expect(lamb.hasKey("lastIndex")(/foo/)).toBe(true);
    });
});
