import * as lamb from "../..";
import {
    nonStrings,
    nonStringsAsStrings,
    wannabeEmptyObjects
} from "../../__tests__/commons";

describe("hasOwn / hasOwnKey", function () {
    var obj = { foo: "bar" };

    it("should check the existence of an owned property in an object", function () {
        expect(lamb.hasOwn(obj, "toString")).toBe(false);
        expect(lamb.hasOwn(obj, "foo")).toBe(true);
        expect(lamb.hasOwnKey("toString")(obj)).toBe(false);
        expect(lamb.hasOwnKey("foo")(obj)).toBe(true);
    });

    it("should return `false` for a non-existent property", function () {
        expect(lamb.hasOwn(obj, "baz")).toBe(false);
        expect(lamb.hasOwnKey("baz")(obj)).toBe(false);
    });

    it("should accept integers as keys and accept array-like objects", function () {
        var o = { 1: "a", 2: "b" };
        var arr = [1, 2, 3, 4];
        var s = "abcd";

        expect(lamb.hasOwn(o, 2)).toBe(true);
        expect(lamb.hasOwn(arr, 2)).toBe(true);
        expect(lamb.hasOwn(s, 2)).toBe(true);
        expect(lamb.hasOwnKey(2)(o)).toBe(true);
        expect(lamb.hasOwnKey(2)(arr)).toBe(true);
        expect(lamb.hasOwnKey(2)(s)).toBe(true);
    });

    it("should consider only defined indexes in sparse arrays", function () {
        var arr = [1, , 3]; // eslint-disable-line no-sparse-arrays

        expect(lamb.hasOwn(arr, 1)).toBe(false);
        expect(lamb.hasOwnKey(1)(arr)).toBe(false);
    });

    it("should convert other values for the `key` parameter to string", function () {
        var testObj = lamb.make(nonStringsAsStrings, []);

        nonStrings.forEach(function (key) {
            expect(lamb.hasOwn(testObj, key)).toBe(true);
            expect(lamb.hasOwnKey(key)(testObj)).toBe(true);
        });

        expect(lamb.hasOwn({ undefined: void 0 })).toBe(true);
        expect(lamb.hasOwnKey()({ undefined: void 0 })).toBe(true);
    });

    it("should throw an exception if called without the data argument", function () {
        expect(lamb.hasOwn).toThrow();
        expect(lamb.hasOwnKey("foo")).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an object", function () {
        expect(function () { lamb.hasOwn(null, "a"); }).toThrow();
        expect(function () { lamb.hasOwn(void 0, "a"); }).toThrow();
        expect(function () { lamb.hasOwnKey("a")(null); }).toThrow();
        expect(function () { lamb.hasOwnKey("a")(void 0); }).toThrow();
    });

    it("should return convert to object every other value", function () {
        wannabeEmptyObjects.forEach(function (v) {
            expect(lamb.hasOwn(v, "a")).toBe(false);
            expect(lamb.hasOwnKey("a")(v)).toBe(false);
        });

        expect(lamb.hasOwn(/foo/, "lastIndex")).toBe(true);
        expect(lamb.hasOwnKey("lastIndex")(/foo/)).toBe(true);
    });
});
