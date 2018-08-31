import * as lamb from "../..";
import {
    nonStrings,
    nonStringsAsStrings,
    wannabeEmptyObjects
} from "../../__tests__/commons";

describe("getIn / getKey", function () {
    var obj = { foo: 1, bar: 2, baz: 3 };

    Object.defineProperty(obj, "qux", { value: 4 });

    it("should return the value of the given object property", function () {
        expect(lamb.getIn(obj, "bar")).toBe(2);
        expect(lamb.getKey("foo")(obj)).toBe(1);
    });

    it("should return `undefined` for a non-existent property", function () {
        expect(lamb.getIn(obj, "a")).toBeUndefined();
        expect(lamb.getKey("z")(obj)).toBeUndefined();
    });

    it("should be able to retrieve non-enumerable properties", function () {
        expect(lamb.getIn(obj, "qux")).toBe(4);
        expect(lamb.getKey("qux")(obj)).toBe(4);
    });

    it("should accept integers as keys and accept array-like objects", function () {
        var o = { 1: "a", 2: "b" };
        var arr = [1, 2, 3, 4];
        var s = "abcd";

        expect(lamb.getIn(o, 1)).toBe("a");
        expect(lamb.getKey(2)(o)).toBe("b");
        expect(lamb.getIn(arr, 1)).toBe(2);
        expect(lamb.getKey(2)(arr)).toBe(3);
        expect(lamb.getIn(s, 1)).toBe("b");
        expect(lamb.getKey(2)(s)).toBe("c");
    });

    it("should work with sparse arrays", function () {
        var sparseArr = Array(3);

        sparseArr[1] = 99;

        expect(lamb.getIn(sparseArr, 1)).toBe(99);
        expect(lamb.getIn(sparseArr, 2)).toBeUndefined();
        expect(lamb.getKey(1)(sparseArr)).toBe(99);
        expect(lamb.getKey(2)(sparseArr)).toBeUndefined();
    });

    it("should convert other values for the `key` parameter to string", function () {
        var values = lamb.range(0, nonStringsAsStrings.length, 1);
        var testObj = lamb.make(nonStringsAsStrings, values);

        nonStrings.forEach(function (key) {
            var value = values[nonStringsAsStrings.indexOf(String(key))];

            expect(lamb.getIn(testObj, key)).toBe(value);
            expect(lamb.getKey(key)(testObj)).toBe(value);
        });

        var idx = nonStringsAsStrings.indexOf("undefined");

        expect(lamb.getIn(testObj)).toBe(idx);
        expect(lamb.getKey()(testObj)).toBe(idx);
    });

    it("should throw an exception if called without the data argument", function () {
        expect(lamb.getIn).toThrow();
        expect(lamb.getKey("a")).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an object", function () {
        expect(function () { lamb.getIn(null, "a"); }).toThrow();
        expect(function () { lamb.getIn(void 0, "a"); }).toThrow();
        expect(function () { lamb.getKey("a")(null); }).toThrow();
        expect(function () { lamb.getKey("a")(void 0); }).toThrow();
    });

    it("should return convert to object every other value", function () {
        wannabeEmptyObjects.forEach(function (v) {
            expect(lamb.getIn(v, "a")).toBeUndefined();
            expect(lamb.getKey("a")(v)).toBeUndefined();
        });

        expect(lamb.getIn(/foo/, "lastIndex")).toBe(0);
        expect(lamb.getKey("lastIndex")(/foo/)).toBe(0);
    });
});
