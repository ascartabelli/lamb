import * as lamb from "../..";
import {
    nonStrings,
    nonStringsAsStrings,
    wannabeEmptyObjects
} from "../../__tests__/commons";

describe("getPath / getPathIn", function () {
    var obj = { a: 2, b: { a: 3, b: [4, 5], c: "foo" }, "c.d": { "e.f": 6 } };

    obj.b.d = Array(3);
    obj.b.d[1] = 99;

    Object.defineProperty(obj, "e", { value: 10 });
    obj.f = Object.create({}, { g: { value: 20 } });

    it("should retrieve a nested object property using the supplied path", function () {
        expect(lamb.getPath("a")(obj)).toBe(2);
        expect(lamb.getPath("b.a")(obj)).toBe(3);
        expect(lamb.getPath("b.b")(obj)).toBe(obj.b.b);
        expect(lamb.getPathIn(obj, "a")).toBe(2);
        expect(lamb.getPathIn(obj, "b.a")).toBe(3);
        expect(lamb.getPathIn(obj, "b.b")).toBe(obj.b.b);
    });

    it("should be able to access non-enumerable properties", function () {
        expect(lamb.getPath("e")(obj)).toBe(10);
        expect(lamb.getPathIn(obj, "e")).toBe(10);
        expect(lamb.getPath("f.g")(obj)).toBe(20);
        expect(lamb.getPathIn(obj, "f.g")).toBe(20);
    });

    it("should be able to retrieve values from arrays and array-like objects", function () {
        expect(lamb.getPath("b.b.0")(obj)).toBe(4);
        expect(lamb.getPath("b.c.0")(obj)).toBe("f");
        expect(lamb.getPathIn(obj, "b.b.0")).toBe(4);
        expect(lamb.getPathIn(obj, "b.c.0")).toBe("f");
    });

    it("should allow negative indexes", function () {
        expect(lamb.getPath("b.b.-1")(obj)).toBe(5);
        expect(lamb.getPathIn(obj, "b.b.-1")).toBe(5);
        expect(lamb.getPath("b.c.-3")(obj)).toBe("f");
        expect(lamb.getPathIn(obj, "b.c.-3")).toBe("f");
    });

    it("should work with sparse arrays", function () {
        expect(lamb.getPathIn(obj, "b.d.1")).toBe(99);
        expect(lamb.getPathIn(obj, "b.d.-2")).toBe(99);
        expect(lamb.getPath("b.d.1")(obj)).toBe(99);
        expect(lamb.getPath("b.d.-2")(obj)).toBe(99);
    });

    it("should be able to retrieve values nested in arrays", function () {
        var o = {
            data: [
                { id: 1, value: 10 },
                { id: 2, value: 20 },
                { id: 3, value: 30 }
            ]
        };

        expect(lamb.getPath("data.1.value")(o)).toBe(20);
        expect(lamb.getPathIn(o, "data.1.value")).toBe(20);
        expect(lamb.getPath("data.-1.value")(o)).toBe(30);
        expect(lamb.getPathIn(o, "data.-1.value")).toBe(30);
    });

    it("should give priority to object keys over array-like indexes when a negative index is encountered", function () {
        var o = { a: ["abc", new String("def"), "ghi"] };

        o.a["-1"] = "foo";
        o.a[1]["-2"] = "bar";

        Object.defineProperty(o.a, "-2", { value: 99 });

        expect(lamb.getPath("a.-1")(o)).toBe("foo");
        expect(lamb.getPathIn(o, "a.-1")).toBe("foo");
        expect(lamb.getPath("a.1.-2")(o)).toBe("bar");
        expect(lamb.getPathIn(o, "a.1.-2")).toBe("bar");
        expect(lamb.getPath("a.-2")(o)).toBe(99);
        expect(lamb.getPathIn(o, "a.-2")).toBe(99);
    });

    it("should accept a custom path separator", function () {
        expect(lamb.getPath("b->b->0", "->")(obj)).toBe(4);
        expect(lamb.getPath("c.d/e.f", "/")(obj)).toBe(6);
        expect(lamb.getPathIn(obj, "b->b->0", "->")).toBe(4);
        expect(lamb.getPathIn(obj, "c.d/e.f", "/")).toBe(6);
    });

    it("should return `undefined` for a non-existent path in a valid source", function () {
        expect(lamb.getPath("b.a.z")(obj)).toBeUndefined();
        expect(lamb.getPathIn(obj, "b.a.z")).toBeUndefined();
        expect(lamb.getPath("b.z.a")(obj)).toBeUndefined();
        expect(lamb.getPathIn(obj, "b.z.a")).toBeUndefined();
        expect(lamb.getPath("b.b.10")(obj)).toBeUndefined();
        expect(lamb.getPathIn(obj, "b.b.10")).toBeUndefined();
        expect(lamb.getPath("b.b.10.z")(obj)).toBeUndefined();
        expect(lamb.getPathIn(obj, "b.b.10.z")).toBeUndefined();
    });

    it("should accept integers as paths containing a single key", function () {
        expect(lamb.getPathIn([1, 2], 1)).toBe(2);
        expect(lamb.getPath(1)([1, 2])).toBe(2);
        expect(lamb.getPathIn([1, 2], -1)).toBe(2);
        expect(lamb.getPath(-1)([1, 2])).toBe(2);
        expect(lamb.getPathIn({ 1: "a" }, 1)).toBe("a");
        expect(lamb.getPath(1)({ 1: "a" })).toBe("a");
    });

    it("should convert other values for the `path` parameter to string", function () {
        var values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        var testObj = lamb.make(nonStringsAsStrings, values);

        nonStrings.forEach(function (key) {
            var value = values[nonStringsAsStrings.indexOf(String(key))];

            expect(lamb.getPathIn(testObj, key, "_")).toBe(value);
            expect(lamb.getPath(key, "_")(testObj)).toBe(value);
        });

        var fooObj = { a: 2, 1: { 5: 3 }, undefined: 4 };

        expect(lamb.getPathIn(fooObj, 1.5)).toBe(3);
        expect(lamb.getPath(1.5)(fooObj)).toBe(3);

        expect(lamb.getPathIn(fooObj)).toBe(4);
        expect(lamb.getPath()(fooObj)).toBe(4);
    });

    it("should throw an exception if called without arguments", function () {
        expect(lamb.getPathIn).toThrow();
        expect(lamb.getPath()).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an object", function () {
        expect(function () { lamb.getPathIn(null, "a"); }).toThrow();
        expect(function () { lamb.getPathIn(void 0, "a"); }).toThrow();
        expect(function () { lamb.getPath("a")(null); }).toThrow();
        expect(function () { lamb.getPath("a")(void 0); }).toThrow();
    });

    it("should convert to object every other value", function () {
        wannabeEmptyObjects.forEach(function (value) {
            expect(lamb.getPathIn(value, "a")).toBeUndefined();
            expect(lamb.getPath("a")(value)).toBeUndefined();
        });

        expect(lamb.getPathIn(/foo/, "lastIndex")).toBe(0);
        expect(lamb.getPath("lastIndex")(/foo/)).toBe(0);
    });
});
