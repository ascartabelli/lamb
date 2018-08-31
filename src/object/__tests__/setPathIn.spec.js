import * as lamb from "../..";
import { nonStrings, nonStringsAsStrings, wannabeEmptyObjects } from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("setPath / setPathIn", function () {
    var obj = {
        a: 2,
        b: {
            a: { g: 10, h: 11 },
            b: [4, 5],
            c: "foo"
        },
        "c.d": { "e.f": 6 }
    };

    var sparseArr = Object.freeze([, 55, ,]); // eslint-disable-line comma-spacing, no-sparse-arrays

    obj.b.d = sparseArr;

    Object.defineProperty(obj.b, "w", {
        value: {
            x: 22,
            y: { z: 33 }
        }
    });

    var objCopy = JSON.parse(JSON.stringify(obj));

    objCopy.b.d = sparseArr;

    afterEach(function () {
        expect(obj).toEqual(objCopy);
        expect(obj.b.d).toStrictArrayEqual(objCopy.b.d);
    });

    it("should allow to set a nested property in a copy of the given object", function () {
        var r1 = lamb.setPath("a", 99, ".")(obj);
        var r2 = lamb.setPathIn(obj, "a", 99, ".");

        expect(r1).toEqual({
            a: 99,
            b: {
                a: { g: 10, h: 11 },
                b: [4, 5],
                c: "foo",
                d: sparseArr
            },
            "c.d": { "e.f": 6 }
        });

        expect(r1.b).toBe(obj.b);
        expect(r1["c.d"]).toBe(obj["c.d"]);
        expect(r1.b.d).toStrictArrayEqual(sparseArr);

        expect(r2).toEqual(r1);
        expect(r2.b.d).toStrictArrayEqual(sparseArr);

        var r3 = lamb.setPath("b.c", "bar", ".")(obj);
        var r4 = lamb.setPathIn(obj, "b.c", "bar", ".");

        expect(r3).toEqual({
            a: 2,
            b: {
                a: { g: 10, h: 11 },
                b: [4, 5],
                c: "bar",
                d: sparseArr
            },
            "c.d": { "e.f": 6 }
        });

        expect(r3.b.a).toBe(obj.b.a);
        expect(r3.b.b).toBe(obj.b.b);
        expect(r3["c.d"]).toBe(obj["c.d"]);
        expect(r3.b.d).toStrictArrayEqual(sparseArr);

        expect(r4).toEqual(r3);
        expect(r4.b.d).toStrictArrayEqual(sparseArr);
    });

    it("should use the dot as the default separator", function () {
        var r = lamb.setPath("b.a.g", 99)(obj);

        expect(r).toEqual({
            a: 2,
            b: {
                a: { g: 99, h: 11 },
                b: [4, 5],
                c: "foo",
                d: sparseArr
            },
            "c.d": { "e.f": 6 }
        });
        expect(r.b.b).toBe(obj.b.b);
        expect(r["c.d"]).toBe(obj["c.d"]);
        expect(lamb.setPathIn(obj, "b.a.g", 99)).toEqual(r);
    });

    it("should ignore extra arguments passed to the built function in its partially applied form", function () {
        var r = lamb.setPath("b.c", "bar")(obj, {});

        expect(r).toEqual({
            a: 2,
            b: {
                a: { g: 10, h: 11 },
                b: [4, 5],
                c: "bar",
                d: sparseArr
            },
            "c.d": { "e.f": 6 }
        });
    });

    it("should allow custom separators", function () {
        var r = lamb.setPath("c.d->e.f", 99, "->")(obj);

        expect(r).toEqual({
            a: 2,
            b: {
                a: { g: 10, h: 11 },
                b: [4, 5],
                c: "foo",
                d: [, 55, , ] // eslint-disable-line comma-spacing, no-sparse-arrays
            },
            "c.d": { "e.f": 99 }
        });
        expect(r.b).toBe(obj.b);
        expect(lamb.setPathIn(obj, "c.d->e.f", 99, "->")).toEqual(r);
    });

    it("should add non-existent properties to existing objects", function () {
        var r1 = {
            a: 2,
            b: {
                a: { g: 10, h: 11 },
                b: [4, 5],
                c: "foo",
                d: [, 55, , ], // eslint-disable-line comma-spacing, no-sparse-arrays
                z: 99
            },
            "c.d": { "e.f": 6 }
        };
        var r2 = {
            a: 2,
            b: {
                a: { g: 10, h: 11 },
                b: [4, 5],
                c: "foo",
                d: [, 55, , ] // eslint-disable-line comma-spacing, no-sparse-arrays
            },
            "c.d": { "e.f": 6 },
            z: { a: 99 }
        };
        var r3 = {
            a: 2,
            b: {
                a: { g: 10, h: 11 },
                b: [4, 5],
                c: "foo",
                d: [, 55, , ] // eslint-disable-line comma-spacing, no-sparse-arrays
            },
            "c.d": { "e.f": 6 },
            z: { a: { b: 99 } }
        };

        expect(lamb.setPath("b.z", 99)(obj)).toEqual(r1);
        expect(lamb.setPathIn(obj, "b.z", 99)).toEqual(r1);
        expect(lamb.setPath("z.a", 99)(obj)).toEqual(r2);
        expect(lamb.setPathIn(obj, "z.a", 99)).toEqual(r2);
        expect(lamb.setPath("z.a.b", 99)(obj)).toEqual(r3);
        expect(lamb.setPathIn(obj, "z.a.b", 99)).toEqual(r3);

        var o = { a: null };
        var r4 = { a: { b: { c: 99 } } };

        expect(lamb.setPath("a.b.c", 99)(o)).toEqual(r4);
        expect(lamb.setPathIn(o, "a.b.c", 99)).toEqual(r4);
    });

    it("should treat non-enumerable properties encountered in a path as non-existent properties", function () {
        var r1 = {
            a: 2,
            b: {
                a: { g: 10, h: 11 },
                b: [4, 5],
                c: "foo",
                d: [, 55, , ], // eslint-disable-line comma-spacing, no-sparse-arrays
                w: { z: 99 }
            },
            "c.d": { "e.f": 6 }
        };
        var r2 = {
            a: 2,
            b: {
                a: { g: 10, h: 11 },
                b: [4, 5],
                c: "foo",
                d: [, 55, , ], // eslint-disable-line comma-spacing, no-sparse-arrays
                w: { y: { z: 99 } }
            },
            "c.d": { "e.f": 6 }
        };

        expect(lamb.setPathIn(obj, "b.w.z", 99)).toEqual(r1);
        expect(lamb.setPath("b.w.z", 99)(obj)).toEqual(r1);
        expect(lamb.setPathIn(obj, "b.w.y.z", 99)).toEqual(r2);
        expect(lamb.setPath("b.w.y.z", 99)(obj)).toEqual(r2);
    });

    it("should replace indexes when an array is found and the key is a string containing an integer", function () {
        var r = {
            a: 2,
            b: {
                a: { g: 10, h: 11 },
                b: [4, 99],
                c: "foo",
                d: [, 55, , ] // eslint-disable-line comma-spacing, no-sparse-arrays
            },
            "c.d": { "e.f": 6 }
        };

        expect(lamb.setPath("b.b.1", 99)(obj)).toEqual(r);
        expect(lamb.setPathIn(obj, "b.b.1", 99)).toEqual(r);
        expect(lamb.setPath("1", 99)([1, 2, 3])).toEqual([1, 99, 3]);
        expect(lamb.setPathIn([1, 2, 3], "1", 99)).toEqual([1, 99, 3]);
    });

    it("should allow using negative array indexes in path parts", function () {
        var r = {
            a: 2,
            b: {
                a: { g: 10, h: 11 },
                b: [99, 5],
                c: "foo",
                d: [, 55, , ] // eslint-disable-line comma-spacing, no-sparse-arrays
            },
            "c.d": { "e.f": 6 }
        };

        expect(lamb.setPath("b.b.-2", 99)(obj)).toEqual(r);
        expect(lamb.setPathIn(obj, "b.b.-2", 99)).toEqual(r);
        expect(lamb.setPath("-2", 99)([1, 2, 3])).toEqual([1, 99, 3]);
        expect(lamb.setPathIn([1, 2, 3], "-2", 99)).toEqual([1, 99, 3]);
    });

    it("should build dense arrays when the path target is a sparse array index", function () {
        var expected1 = {
            a: 2,
            b: {
                a: { g: 10, h: 11 },
                b: [4, 5],
                c: "foo",
                d: [void 0, 99, void 0]
            },
            "c.d": { "e.f": 6 }
        };
        var expected2 = {
            a: 2,
            b: {
                a: { g: 10, h: 11 },
                b: [4, 5],
                c: "foo",
                d: [void 0, 55, 99]
            },
            "c.d": { "e.f": 6 }
        };

        ["b.d.1", "b.d.-2", "b.d.-1", "b.d.2"].forEach(function (path, idx) {
            var r1 = lamb.setPathIn(obj, path, 99);
            var r2 = lamb.setPath(path, 99)(obj);
            var expected = idx < 2 ? expected1 : expected2;

            expect(r1).toEqual(expected);
            expect(r1.b.d).toStrictArrayEqual(expected.b.d);

            expect(r2).toEqual(expected);
            expect(r2.b.d).toStrictArrayEqual(expected.b.d);
        });
    });

    it("should not add new elements to an array and behave like `setAt` which returns a copy of the array", function () {
        var r1 = lamb.setPath("b.b.2", 99)(obj);
        var r2 = lamb.setPathIn(obj, "b.b.2", 99);
        var r3 = {
            a: 2,
            b: {
                a: { g: 10, h: 11 },
                b: [4, 5],
                c: "foo",
                d: [void 0, 55, void 0]
            },
            "c.d": { "e.f": 6 }
        };

        expect(r1).toEqual(obj);
        expect(r2).toEqual(obj);
        expect(r1.b.b).not.toBe(obj.b.b);
        expect(r2.b.b).not.toBe(obj.b.b);

        expect(lamb.setPathIn(obj, "b.d.11", 99)).toEqual(r3);
        expect(lamb.setPath("b.d.11", 99)(obj)).toEqual(r3);
    });

    it("should allow to change values nested in an array", function () {
        var o = {
            data: [
                { id: 1, value: 10 },
                { id: 2, value: 20 },
                { id: 3, value: 30 }
            ]
        };
        var r = {
            data: [
                { id: 1, value: 10 },
                { id: 2, value: 99 },
                { id: 3, value: 30 }
            ]
        };

        expect(lamb.setPath("data.1.value", 99)(o)).toEqual(r);
        expect(lamb.setPathIn(o, "data.1.value", 99)).toEqual(r);
        expect(lamb.setPath("data.-2.value", 99)(o)).toEqual(r);
        expect(lamb.setPathIn(o, "data.-2.value", 99)).toEqual(r);
    });

    it("should build an object with numbered keys when an array-like object is found", function () {
        var r = {
            a: 2,
            b: {
                a: { g: 10, h: 11 },
                b: [4, 5],
                c: { 0: "m", 1: "o", 2: "o" },
                d: sparseArr
            },
            "c.d": { "e.f": 6 }
        };

        expect(lamb.setPath("b.c.0", "m")(obj)).toEqual(r);
        expect(lamb.setPathIn(obj, "b.c.0", "m")).toEqual(r);
    });

    it("should build an object with numbered keys when an array is found and the key is not a string containing an integer", function () {
        var r = {
            a: 2,
            b: {
                a: { g: 10, h: 11 },
                b: { 0: 4, 1: 5, z: 99 },
                c: "foo",
                d: sparseArr
            },
            "c.d": { "e.f": 6 }
        };

        expect(lamb.setPath("b.b.z", 99)(obj)).toEqual(r);
        expect(lamb.setPathIn(obj, "b.b.z", 99)).toEqual(r);
    });

    it("should accept integers as paths containing a single key", function () {
        expect(lamb.setPath(1, 99)([1, 2, 3])).toEqual([1, 99, 3]);
        expect(lamb.setPathIn([1, 2, 3], -1, 99)).toEqual([1, 2, 99]);
        expect(lamb.setPath(2, 99)([1, 2])).toEqual([1, 2]);
        expect(lamb.setPathIn({ a: 1 }, 1, 99)).toEqual({ a: 1, 1: 99 });
    });

    it("should give priority to object keys over array indexes when a negative index is encountered", function () {
        var o = { a: ["abc", "def", "ghi"] };

        o.a["-1"] = "foo";

        var r = { a: { 0: "abc", 1: "def", 2: "ghi", "-1": 99 } };

        expect(lamb.setPath("a.-1", 99)(o)).toEqual(r);
        expect(lamb.setPathIn(o, "a.-1", 99)).toEqual(r);
    });

    it("should consider a negative integer to be an index if the property exists but it's not enumerable", function () {
        var o = { a: ["abc", "def", "ghi"] };

        Object.defineProperty(o.a, "-1", { value: 99 });

        var r = { a: ["abc", "def", "foo"] };

        expect(lamb.setPath("a.-1", "foo")(o)).toEqual(r);
        expect(lamb.setPathIn(o, "a.-1", "foo")).toEqual(r);
    });

    it("should convert other values for the `path` parameter to string", function () {
        var values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        var testObj = lamb.make(nonStringsAsStrings, values);

        nonStrings.forEach(function (key) {
            var expected = lamb.merge({}, testObj);

            expected[String(key)] = 99;

            expect(lamb.setPathIn(testObj, key, 99, "_")).toEqual(expected);
            expect(lamb.setPath(key, 99, "_")(testObj)).toEqual(expected);
        });

        expect(lamb.setPathIn({ a: 2 }, 1.5, 99)).toEqual({ a: 2, 1: { 5: 99 } });
        expect(lamb.setPath(1.5, 99)({ a: 2 })).toEqual({ a: 2, 1: { 5: 99 } });

        expect(lamb.setPathIn({ a: 2 })).toEqual({ a: 2, undefined: void 0 });
        expect(lamb.setPath()({ a: 2 })).toEqual({ a: 2, undefined: void 0 });
    });

    it("should throw an exception if called without arguments", function () {
        expect(lamb.setPathIn).toThrow();
        expect(lamb.setPath()).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an object", function () {
        expect(function () { lamb.setPathIn(null, "a", 99); }).toThrow();
        expect(function () { lamb.setPathIn(void 0, "a", 99); }).toThrow();
        expect(function () { lamb.setPath("a", 99)(null); }).toThrow();
        expect(function () { lamb.setPath("a", 99)(void 0); }).toThrow();
    });

    it("should convert to object every other value", function () {
        wannabeEmptyObjects.forEach(function (value) {
            expect(lamb.setPathIn(value, "a", 99)).toEqual({ a: 99 });
            expect(lamb.setPath("a", 99)(value)).toEqual({ a: 99 });
        });
    });
});
