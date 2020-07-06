import * as lamb from "../..";
import {
    nonFunctions,
    nonStrings,
    nonStringsAsStrings,
    wannabeEmptyObjects
} from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("updatePath / updatePathIn", function () {
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

    var double = lamb.multiplyBy(2);
    var inc = lamb.add(1);
    var toUpperCase = lamb.invoke("toUpperCase");

    afterEach(function () {
        expect(obj).toEqual(objCopy);
        expect(obj.b.d).toStrictArrayEqual(objCopy.b.d);
    });

    it("should allow to update a nested property in a copy of the given object using the provided function", function () {
        var makeDoubles = jest.fn(lamb.mapWith(double));
        var newObjA = lamb.updatePathIn(obj, "b.b", makeDoubles, ".");
        var newObjB = lamb.updatePath("b.b", makeDoubles, ".")(obj);
        var r1 = {
            a: 2,
            b: {
                a: { g: 10, h: 11 },
                b: [8, 10],
                c: "foo",
                d: [, 55, ,] // eslint-disable-line comma-spacing, no-sparse-arrays
            },
            "c.d": { "e.f": 6 }
        };

        expect(newObjA).toEqual(r1);
        expect(newObjB).toEqual(r1);
        expect(makeDoubles).toHaveBeenCalledTimes(2);
        expect(makeDoubles.mock.calls[0].length).toBe(1);
        expect(makeDoubles.mock.calls[0][0]).toBe(obj.b.b);
        expect(makeDoubles.mock.calls[1].length).toBe(1);
        expect(makeDoubles.mock.calls[1][0]).toBe(obj.b.b);

        expect(newObjA.b.a).toBe(obj.b.a);
        expect(newObjA["c.d"]).toBe(obj["c.d"]);

        expect(newObjA.b.d).toStrictArrayEqual(r1.b.d);
        expect(newObjB.b.d).toStrictArrayEqual(r1.b.d);

        var r2 = {
            a: 3,
            b: {
                a: { g: 10, h: 11 },
                b: [4, 5],
                c: "foo",
                d: [, 55, ,] // eslint-disable-line comma-spacing, no-sparse-arrays
            },
            "c.d": { "e.f": 6 }
        };

        expect(lamb.updatePathIn(obj, "a", inc, ".")).toEqual(r2);
        expect(lamb.updatePath("a", inc, ".")(obj)).toEqual(r2);
    });

    it("should use the dot as the default separator", function () {
        var r = lamb.updatePath("b.a.g", double)(obj);

        expect(r).toEqual({
            a: 2,
            b: {
                a: { g: 20, h: 11 },
                b: [4, 5],
                c: "foo",
                d: [, 55, ,] // eslint-disable-line comma-spacing, no-sparse-arrays
            },
            "c.d": { "e.f": 6 }
        });
        expect(r.b.b).toBe(obj.b.b);
        expect(r["c.d"]).toBe(obj["c.d"]);
        expect(lamb.updatePathIn(obj, "b.a.g", double)).toEqual(r);
    });

    it("should ignore extra arguments passed to the built function in its partially applied form", function () {
        var r = lamb.updatePath("b.a.h", double)(obj, {});

        expect(r).toEqual({
            a: 2,
            b: {
                a: { g: 10, h: 22 },
                b: [4, 5],
                c: "foo",
                d: [, 55, ,] // eslint-disable-line comma-spacing, no-sparse-arrays
            },
            "c.d": { "e.f": 6 }
        });
    });

    it("should allow custom separators", function () {
        var r = lamb.updatePath("c.d->e.f", double, "->")(obj);

        expect(r).toEqual({
            a: 2,
            b: {
                a: { g: 10, h: 11 },
                b: [4, 5],
                c: "foo",
                d: [, 55, ,] // eslint-disable-line comma-spacing, no-sparse-arrays
            },
            "c.d": { "e.f": 12 }
        });

        expect(r.b).toBe(obj.b);
        expect(lamb.updatePathIn(obj, "c.d->e.f", double, "->")).toEqual(r);
    });

    it("should be possible to use a path with a single key", function () {
        var arr = [1, 2, 3];
        var o = { a: 1, b: 2 };

        expect(lamb.updatePathIn(arr, "1", inc)).toEqual([1, 3, 3]);
        expect(lamb.updatePath("-1", inc)(arr)).toEqual([1, 2, 4]);
        expect(lamb.updatePathIn(o, "b", inc)).toEqual({ a: 1, b: 3 });
        expect(lamb.updatePath("a", inc)(o)).toEqual({ a: 2, b: 2 });
    });

    it("should replace indexes when an array is found and the key is a string containing an integer", function () {
        var r = {
            a: 2,
            b: {
                a: { g: 10, h: 11 },
                b: [4, 10],
                c: "foo",
                d: [, 55, ,] // eslint-disable-line comma-spacing, no-sparse-arrays
            },
            "c.d": { "e.f": 6 }
        };

        expect(lamb.updatePath("b.b.1", double)(obj)).toEqual(r);
        expect(lamb.updatePathIn(obj, "b.b.1", double)).toEqual(r);
        expect(lamb.updatePath("1", double)([1, 2, 3])).toEqual([1, 4, 3]);
        expect(lamb.updatePathIn([1, 2, 3], "1", double)).toEqual([1, 4, 3]);
    });

    it("should allow using negative array indexes in path parts", function () {
        var arr = [1, 2, 3];
        var r1 = {
            a: 2,
            b: {
                a: { g: 10, h: 11 },
                b: [8, 5],
                c: "foo",
                d: [, 55, ,] // eslint-disable-line comma-spacing, no-sparse-arrays
            },
            "c.d": { "e.f": 6 }
        };
        var r2 = [1, 4, 3];

        expect(lamb.updatePath("b.b.-2", double)(obj)).toEqual(r1);
        expect(lamb.updatePath("b.b.-3", double)(obj)).toEqual(obj);
        expect(lamb.updatePath("-2", double)(arr)).toEqual(r2);
        expect(lamb.updatePath("-4", double)(arr)).toEqual(arr);
        expect(lamb.updatePathIn(obj, "b.b.-2", double)).toEqual(r1);
        expect(lamb.updatePathIn(obj, "b.b.-3", double)).toEqual(obj);
        expect(lamb.updatePathIn(arr, "-2", double)).toEqual(r2);
        expect(lamb.updatePathIn(arr, "-4", double)).toEqual(arr);
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
                { id: 2, value: 21 },
                { id: 3, value: 30 }
            ]
        };

        expect(lamb.updatePath("data.1.value", inc)(o)).toEqual(r);
        expect(lamb.updatePathIn(o, "data.1.value", inc)).toEqual(r);
        expect(lamb.updatePath("data.-2.value", inc)(o)).toEqual(r);
        expect(lamb.updatePathIn(o, "data.-2.value", inc)).toEqual(r);
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
        var fn99 = lamb.always(99);

        ["b.d.1", "b.d.-2", "b.d.-1", "b.d.2"].forEach(function (path, idx) {
            var r1 = lamb.updatePathIn(obj, path, fn99);
            var r2 = lamb.updatePath(path, fn99)(obj);
            var expected = idx < 2 ? expected1 : expected2;

            expect(r1).toEqual(expected);
            expect(r1.b.d).toStrictArrayEqual(expected.b.d);

            expect(r2).toEqual(expected);
            expect(r2.b.d).toStrictArrayEqual(expected.b.d);
        });
    });

    it("should build an object with numbered keys when an array-like object is found", function () {
        var r = {
            a: 2,
            b: {
                a: { g: 10, h: 11 },
                b: [4, 5],
                c: { 0: "m", 1: "o", 2: "o" },
                d: [, 55, ,] // eslint-disable-line comma-spacing, no-sparse-arrays
            },
            "c.d": { "e.f": 6 }
        };

        expect(lamb.updatePath("b.c.0", lamb.always("m"))(obj)).toEqual(r);
        expect(lamb.updatePathIn(obj, "b.c.0", lamb.always("m"))).toEqual(r);
    });

    it("should build an object with numbered keys when an array is found and the key is not a string containing an integer", function () {
        var r = {
            a: 2,
            b: {
                a: { g: 10, h: 11 },
                b: { 0: 4, 1: 5, z: 99 },
                c: "foo", d: [, 55, ,] // eslint-disable-line comma-spacing, no-sparse-arrays
            },
            "c.d": { "e.f": 6 }
        };

        obj.b.b.z = 1;

        expect(lamb.updatePath("b.b.z", lamb.always(99))(obj)).toEqual(r);
        expect(lamb.updatePathIn(obj, "b.b.z", lamb.always(99))).toEqual(r);
        delete obj.b.b.z;
    });

    it("should not add a new property if the given path doesn't exist on the source, and return a copy of the source instead", function () {
        var arr = [1];
        var newObjA = lamb.updatePathIn(obj, "b.a.z", lamb.always(99));
        var newObjB = lamb.updatePathIn(obj, "b.b.1.z", lamb.always(99));
        var newObjC = lamb.updatePath("xyz", lamb.always(99))(obj);
        var newObjD = lamb.updatePathIn(obj, "b.b.-10", lamb.always(99));
        var newObjE = lamb.updatePath("xyz", lamb.always(99))(arr);
        var newObjF = lamb.updatePath("x.y.z", lamb.always(99))(arr);
        var newObjG = lamb.updatePath("1", lamb.always(99))(arr);
        var newObjH = lamb.updatePath("-10", lamb.always(99))(arr);

        expect(newObjA).toEqual(obj);
        expect(newObjA).not.toBe(obj);
        expect(newObjB).toEqual(obj);
        expect(newObjB).not.toBe(obj);
        expect(newObjC).toEqual(obj);
        expect(newObjC).not.toBe(obj);
        expect(newObjD).toEqual(obj);
        expect(newObjD).not.toBe(obj);
        expect(newObjE).toEqual(arr);
        expect(newObjE).not.toBe(arr);
        expect(newObjF).toEqual(arr);
        expect(newObjF).not.toBe(arr);
        expect(newObjG).toEqual(arr);
        expect(newObjG).not.toBe(arr);
        expect(newObjH).toEqual(arr);
        expect(newObjH).not.toBe(arr);

        var o = { a: null };

        var newObjI = lamb.updatePath("a.b.c", lamb.always(99))(o);
        var newObjJ = lamb.updatePathIn(o, "a.b.c", lamb.always(99));

        expect(newObjI).toEqual(o);
        expect(newObjI).not.toBe(o);
        expect(newObjJ).toEqual(o);
        expect(newObjJ).not.toBe(o);
    });

    it("should not see a non-existing path when the target is undefined", function () {
        var fooObj = { a: { b: { c: 2, d: void 0 } } };
        var r = { a: { b: { c: 2, d: 99 } } };
        var fn99 = lamb.always(99);

        expect(lamb.updatePathIn(fooObj, "a.b.d", fn99)).toStrictEqual(r);
        expect(lamb.updatePath("a.b.d", fn99)(fooObj)).toStrictEqual(r);
    });

    it("should return a copy of the source object when a non enumerable property is part of the path or its target", function () {
        var fooObj = Object.create({}, {
            a: { enumerable: true, value: 1 },
            b: { value: { c: 2, d: { e: 3 } } }
        });

        expect(lamb.updatePathIn(fooObj, "b", lamb.setKey("c", 99))).toEqual({ a: 1 });
        expect(lamb.updatePath("b", lamb.setKey("c", 99))(fooObj)).toEqual({ a: 1 });
        expect(lamb.updatePathIn(fooObj, "b.c", lamb.always(99))).toEqual({ a: 1 });
        expect(lamb.updatePath("b.d.e", lamb.always(99))(fooObj)).toEqual({ a: 1 });
    });

    it("should accept integers as paths containing a single key", function () {
        expect(lamb.updatePath(1, lamb.always(99))([1, 2, 3])).toEqual([1, 99, 3]);
        expect(lamb.updatePathIn([1, 2, 3], -1, lamb.always(99))).toEqual([1, 2, 99]);
        expect(lamb.updatePath(2, lamb.always(99))([1, 2])).toEqual([1, 2]);
    });

    it("should give priority to object keys over array indexes when a negative index is encountered", function () {
        var o = { a: ["abc", "def", "ghi"] };

        o.a["-1"] = "foo";

        var r = { a: { 0: "abc", 1: "def", 2: "ghi", "-1": 99 } };

        expect(lamb.updatePath("a.-1", lamb.always(99))(o)).toEqual(r);
        expect(lamb.updatePathIn(o, "a.-1", lamb.always(99))).toEqual(r);
    });

    it("should consider a negative integer to be an index if the property exists but it's not enumerable", function () {
        var o = { a: ["abc", "def", "ghi"] };

        Object.defineProperty(o.a, "-1", { value: 99 });

        var r = { a: ["abc", "def", "GHI"] };

        expect(lamb.updatePath("a.-1", toUpperCase)(o)).toEqual(r);
        expect(lamb.updatePathIn(o, "a.-1", toUpperCase)).toEqual(r);
    });

    it("should convert other values for the `path` parameter to string", function () {
        var values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        var testObj = lamb.make(nonStringsAsStrings, values);

        nonStrings.forEach(function (key) {
            var expected = lamb.merge(testObj, {});

            expected[String(key)] = 99;

            expect(lamb.updatePathIn(testObj, key, lamb.always(99), "_")).toEqual(expected);
            expect(lamb.updatePath(key, lamb.always(99), "_")(testObj)).toEqual(expected);
        });

        var fooObj = { a: 2, 1: { 5: 3 }, undefined: 4 };
        var r = { a: 2, 1: { 5: 99 }, undefined: 4 };

        expect(lamb.updatePathIn(fooObj, 1.5, lamb.always(99))).toEqual(r);
        expect(lamb.updatePath(1.5, lamb.always(99))(fooObj)).toEqual(r);
    });

    it("should throw an exception if the `updater` isn't a function or if is missing", function () {
        nonFunctions.forEach(function (value) {
            expect(function () { lamb.updatePathIn({ a: 2 }, "a", value); }).toThrow();
            expect(function () { lamb.updatePath("a", value)({ a: 2 }); }).toThrow();
        });

        expect(function () { lamb.updatePathIn({ a: 2 }, "a"); }).toThrow();
        expect(function () { lamb.updatePath("a")({ a: 2 }); }).toThrow();
    });

    it("should throw an exception if called without arguments", function () {
        expect(lamb.updatePathIn).toThrow();
        expect(lamb.updatePath()).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an object", function () {
        expect(function () { lamb.updatePathIn(null, "a", lamb.always(99)); }).toThrow();
        expect(function () { lamb.updatePathIn(void 0, "a", lamb.always(99)); }).toThrow();
        expect(function () { lamb.updatePath("a", lamb.always(99))(null); }).toThrow();
        expect(function () { lamb.updatePath("a", lamb.always(99))(void 0); }).toThrow();
    });

    it("should convert to object every other value", function () {
        wannabeEmptyObjects.forEach(function (value) {
            expect(lamb.updatePathIn(value, "a", lamb.always(99))).toEqual({});
            expect(lamb.updatePath("a", lamb.always(99))(value)).toEqual({});
            expect(lamb.updatePathIn(value, "a.b.c", lamb.always(99))).toEqual({});
            expect(lamb.updatePath("a.b.c", lamb.always(99))(value)).toEqual({});
        });
    });
});
