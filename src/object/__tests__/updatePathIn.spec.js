import add from "../../math/add";
import always from "../../core/always";
import invoke from "../../function/invoke";
import make from "../make";
import mapWith from "../../core/mapWith";
import merge from "../merge";
import multiplyBy from "../../math/multiplyBy";
import setKey from "../setKey";
import updatePath from "../updatePath";
import updatePathIn from "../updatePathIn";
import {
    nonFunctions,
    nonStrings,
    nonStringsAsStrings,
    wannabeEmptyObjects
} from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("updatePath / updatePathIn", () => {
    const obj = {
        a: 2,
        b: {
            a: { g: 10, h: 11 },
            b: [4, 5],
            c: "foo"
        },
        "c.d": { "e.f": 6 }
    };

    const sparseArr = Object.freeze([, 55, ,]); // eslint-disable-line comma-spacing, no-sparse-arrays

    obj.b.d = sparseArr;

    Object.defineProperty(obj.b, "w", {
        value: {
            x: 22,
            y: { z: 33 }
        }
    });

    const objCopy = JSON.parse(JSON.stringify(obj));

    objCopy.b.d = sparseArr;

    const double = multiplyBy(2);
    const inc = add(1);
    const toUpperCase = invoke("toUpperCase");

    afterEach(() => {
        expect(obj).toStrictEqual(objCopy);
        expect(obj.b.d).toStrictArrayEqual(objCopy.b.d);
    });

    it("should allow to update a nested property in a copy of the given object using the provided function", () => {
        const makeDoubles = jest.fn(mapWith(double));
        const newObjA = updatePathIn(obj, "b.b", makeDoubles, ".");
        const newObjB = updatePath("b.b", makeDoubles, ".")(obj);
        const r1 = {
            a: 2,
            b: {
                a: { g: 10, h: 11 },
                b: [8, 10],
                c: "foo",
                d: [, 55, ,] // eslint-disable-line comma-spacing, no-sparse-arrays
            },
            "c.d": { "e.f": 6 }
        };

        expect(newObjA).toStrictEqual(r1);
        expect(newObjB).toStrictEqual(r1);
        expect(makeDoubles).toHaveBeenCalledTimes(2);
        expect(makeDoubles).toHaveBeenNthCalledWith(1, obj.b.b);
        expect(makeDoubles).toHaveBeenNthCalledWith(2, obj.b.b);

        expect(newObjA.b.a).toBe(obj.b.a);
        expect(newObjA["c.d"]).toBe(obj["c.d"]);

        expect(newObjA.b.d).toStrictArrayEqual(r1.b.d);
        expect(newObjB.b.d).toStrictArrayEqual(r1.b.d);

        const r2 = {
            a: 3,
            b: {
                a: { g: 10, h: 11 },
                b: [4, 5],
                c: "foo",
                d: [, 55, ,] // eslint-disable-line comma-spacing, no-sparse-arrays
            },
            "c.d": { "e.f": 6 }
        };

        expect(updatePathIn(obj, "a", inc, ".")).toStrictEqual(r2);
        expect(updatePath("a", inc, ".")(obj)).toStrictEqual(r2);
    });

    it("should use the dot as the default separator", () => {
        const r = updatePath("b.a.g", double)(obj);

        expect(r).toStrictEqual({
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
        expect(updatePathIn(obj, "b.a.g", double)).toStrictEqual(r);
    });

    it("should ignore extra arguments passed to the built function in its partially applied form", () => {
        const r = updatePath("b.a.h", double)(obj, {});

        expect(r).toStrictEqual({
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

    it("should allow custom separators", () => {
        const r = updatePath("c.d->e.f", double, "->")(obj);

        expect(r).toStrictEqual({
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
        expect(updatePathIn(obj, "c.d->e.f", double, "->")).toStrictEqual(r);
    });

    it("should be possible to use a path with a single key", () => {
        const arr = [1, 2, 3];
        const o = { a: 1, b: 2 };

        expect(updatePathIn(arr, "1", inc)).toStrictEqual([1, 3, 3]);
        expect(updatePath("-1", inc)(arr)).toStrictEqual([1, 2, 4]);
        expect(updatePathIn(o, "b", inc)).toStrictEqual({ a: 1, b: 3 });
        expect(updatePath("a", inc)(o)).toStrictEqual({ a: 2, b: 2 });
    });

    it("should replace indexes when an array is found and the key is a string containing an integer", () => {
        const r = {
            a: 2,
            b: {
                a: { g: 10, h: 11 },
                b: [4, 10],
                c: "foo",
                d: [, 55, ,] // eslint-disable-line comma-spacing, no-sparse-arrays
            },
            "c.d": { "e.f": 6 }
        };

        expect(updatePath("b.b.1", double)(obj)).toStrictEqual(r);
        expect(updatePathIn(obj, "b.b.1", double)).toStrictEqual(r);
        expect(updatePath("1", double)([1, 2, 3])).toStrictEqual([1, 4, 3]);
        expect(updatePathIn([1, 2, 3], "1", double)).toStrictEqual([1, 4, 3]);
    });

    it("should allow using negative array indexes in path parts", () => {
        const arr = [1, 2, 3];
        const r1 = {
            a: 2,
            b: {
                a: { g: 10, h: 11 },
                b: [8, 5],
                c: "foo",
                d: [, 55, ,] // eslint-disable-line comma-spacing, no-sparse-arrays
            },
            "c.d": { "e.f": 6 }
        };
        const r2 = [1, 4, 3];

        expect(updatePath("b.b.-2", double)(obj)).toStrictEqual(r1);
        expect(updatePath("b.b.-3", double)(obj)).toStrictEqual(obj);
        expect(updatePath("-2", double)(arr)).toStrictEqual(r2);
        expect(updatePath("-4", double)(arr)).toStrictEqual(arr);
        expect(updatePathIn(obj, "b.b.-2", double)).toStrictEqual(r1);
        expect(updatePathIn(obj, "b.b.-3", double)).toStrictEqual(obj);
        expect(updatePathIn(arr, "-2", double)).toStrictEqual(r2);
        expect(updatePathIn(arr, "-4", double)).toStrictEqual(arr);
    });

    it("should allow to change values nested in an array", () => {
        const o = {
            data: [
                { id: 1, value: 10 },
                { id: 2, value: 20 },
                { id: 3, value: 30 }
            ]
        };
        const r = {
            data: [
                { id: 1, value: 10 },
                { id: 2, value: 21 },
                { id: 3, value: 30 }
            ]
        };

        expect(updatePath("data.1.value", inc)(o)).toStrictEqual(r);
        expect(updatePathIn(o, "data.1.value", inc)).toStrictEqual(r);
        expect(updatePath("data.-2.value", inc)(o)).toStrictEqual(r);
        expect(updatePathIn(o, "data.-2.value", inc)).toStrictEqual(r);
    });

    it("should build dense arrays when the path target is a sparse array index", () => {
        const expected1 = {
            a: 2,
            b: {
                a: { g: 10, h: 11 },
                b: [4, 5],
                c: "foo",
                d: [void 0, 99, void 0]
            },
            "c.d": { "e.f": 6 }
        };
        const expected2 = {
            a: 2,
            b: {
                a: { g: 10, h: 11 },
                b: [4, 5],
                c: "foo",
                d: [void 0, 55, 99]
            },
            "c.d": { "e.f": 6 }
        };
        const fn99 = always(99);

        ["b.d.1", "b.d.-2", "b.d.-1", "b.d.2"].forEach((path, idx) => {
            const r1 = updatePathIn(obj, path, fn99);
            const r2 = updatePath(path, fn99)(obj);
            const expected = idx < 2 ? expected1 : expected2;

            expect(r1).toStrictEqual(expected);
            expect(r1.b.d).toStrictArrayEqual(expected.b.d);

            expect(r2).toStrictEqual(expected);
            expect(r2.b.d).toStrictArrayEqual(expected.b.d);
        });
    });

    it("should build an object with numbered keys when an array-like object is found", () => {
        const r = {
            a: 2,
            b: {
                a: { g: 10, h: 11 },
                b: [4, 5],
                c: { 0: "m", 1: "o", 2: "o" },
                d: [, 55, ,] // eslint-disable-line comma-spacing, no-sparse-arrays
            },
            "c.d": { "e.f": 6 }
        };

        expect(updatePath("b.c.0", always("m"))(obj)).toStrictEqual(r);
        expect(updatePathIn(obj, "b.c.0", always("m"))).toStrictEqual(r);
    });

    it("should build an object with numbered keys when an array is found and the key is not a string containing an integer", () => {
        const r = {
            a: 2,
            b: {
                a: { g: 10, h: 11 },
                b: { 0: 4, 1: 5, z: 99 },
                c: "foo", d: [, 55, ,] // eslint-disable-line comma-spacing, no-sparse-arrays
            },
            "c.d": { "e.f": 6 }
        };

        obj.b.b.z = 1;

        expect(updatePath("b.b.z", always(99))(obj)).toStrictEqual(r);
        expect(updatePathIn(obj, "b.b.z", always(99))).toStrictEqual(r);
        delete obj.b.b.z;
    });

    it("should not add a new property if the given path doesn't exist on the source, and return a copy of the source instead", () => {
        const arr = [1];
        const newObjA = updatePathIn(obj, "b.a.z", always(99));
        const newObjB = updatePathIn(obj, "b.b.1.z", always(99));
        const newObjC = updatePath("xyz", always(99))(obj);
        const newObjD = updatePathIn(obj, "b.b.-10", always(99));
        const newObjE = updatePath("xyz", always(99))(arr);
        const newObjF = updatePath("x.y.z", always(99))(arr);
        const newObjG = updatePath("1", always(99))(arr);
        const newObjH = updatePath("-10", always(99))(arr);

        expect(newObjA).toStrictEqual(obj);
        expect(newObjA).not.toBe(obj);
        expect(newObjB).toStrictEqual(obj);
        expect(newObjB).not.toBe(obj);
        expect(newObjC).toStrictEqual(obj);
        expect(newObjC).not.toBe(obj);
        expect(newObjD).toStrictEqual(obj);
        expect(newObjD).not.toBe(obj);
        expect(newObjE).toStrictEqual(arr);
        expect(newObjE).not.toBe(arr);
        expect(newObjF).toStrictEqual(arr);
        expect(newObjF).not.toBe(arr);
        expect(newObjG).toStrictEqual(arr);
        expect(newObjG).not.toBe(arr);
        expect(newObjH).toStrictEqual(arr);
        expect(newObjH).not.toBe(arr);

        const o = { a: null };

        const newObjI = updatePath("a.b.c", always(99))(o);
        const newObjJ = updatePathIn(o, "a.b.c", always(99));

        expect(newObjI).toStrictEqual(o);
        expect(newObjI).not.toBe(o);
        expect(newObjJ).toStrictEqual(o);
        expect(newObjJ).not.toBe(o);
    });

    it("should not see a non-existing path when the target is undefined", () => {
        const fooObj = { a: { b: { c: 2, d: void 0 } } };
        const r = { a: { b: { c: 2, d: 99 } } };
        const fn99 = always(99);

        expect(updatePathIn(fooObj, "a.b.d", fn99)).toStrictEqual(r);
        expect(updatePath("a.b.d", fn99)(fooObj)).toStrictEqual(r);
    });

    it("should return a copy of the source object when a non enumerable property is part of the path or its target", () => {
        const fooObj = Object.create({}, {
            a: { enumerable: true, value: 1 },
            b: { value: { c: 2, d: { e: 3 } } }
        });

        expect(updatePathIn(fooObj, "b", setKey("c", 99))).toStrictEqual({ a: 1 });
        expect(updatePath("b", setKey("c", 99))(fooObj)).toStrictEqual({ a: 1 });
        expect(updatePathIn(fooObj, "b.c", always(99))).toStrictEqual({ a: 1 });
        expect(updatePath("b.d.e", always(99))(fooObj)).toStrictEqual({ a: 1 });
    });

    it("should accept integers as paths containing a single key", () => {
        expect(updatePath(1, always(99))([1, 2, 3])).toStrictEqual([1, 99, 3]);
        expect(updatePathIn([1, 2, 3], -1, always(99))).toStrictEqual([1, 2, 99]);
        expect(updatePath(2, always(99))([1, 2])).toStrictEqual([1, 2]);
    });

    it("should give priority to object keys over array indexes when a negative index is encountered", () => {
        const o = { a: ["abc", "def", "ghi"] };

        o.a["-1"] = "foo";

        const r = { a: { 0: "abc", 1: "def", 2: "ghi", "-1": 99 } };

        expect(updatePath("a.-1", always(99))(o)).toStrictEqual(r);
        expect(updatePathIn(o, "a.-1", always(99))).toStrictEqual(r);
    });

    it("should consider a negative integer to be an index if the property exists but it's not enumerable", () => {
        const o = { a: ["abc", "def", "ghi"] };

        Object.defineProperty(o.a, "-1", { value: 99 });

        const r = { a: ["abc", "def", "GHI"] };

        expect(updatePath("a.-1", toUpperCase)(o)).toStrictEqual(r);
        expect(updatePathIn(o, "a.-1", toUpperCase)).toStrictEqual(r);
    });

    it("should convert other values for the `path` parameter to string", () => {
        const values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        const testObj = make(nonStringsAsStrings, values);

        nonStrings.forEach(key => {
            const expected = merge(testObj, {});

            expected[String(key)] = 99;

            expect(updatePathIn(testObj, key, always(99), "_")).toStrictEqual(expected);
            expect(updatePath(key, always(99), "_")(testObj)).toStrictEqual(expected);
        });

        const fooObj = { a: 2, 1: { 5: 3 }, undefined: 4 };
        const r = { a: 2, 1: { 5: 99 }, undefined: 4 };

        expect(updatePathIn(fooObj, 1.5, always(99))).toStrictEqual(r);
        expect(updatePath(1.5, always(99))(fooObj)).toStrictEqual(r);
    });

    it("should throw an exception if the `updater` isn't a function or if is missing", () => {
        nonFunctions.forEach(value => {
            expect(() => { updatePathIn({ a: 2 }, "a", value); }).toThrow();
            expect(() => { updatePath("a", value)({ a: 2 }); }).toThrow();
        });

        expect(() => { updatePathIn({ a: 2 }, "a"); }).toThrow();
        expect(() => { updatePath("a")({ a: 2 }); }).toThrow();
    });

    it("should throw an exception if called without arguments", () => {
        expect(updatePathIn).toThrow();
        expect(updatePath()).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an object", () => {
        expect(() => { updatePathIn(null, "a", always(99)); }).toThrow();
        expect(() => { updatePathIn(void 0, "a", always(99)); }).toThrow();
        expect(() => { updatePath("a", always(99))(null); }).toThrow();
        expect(() => { updatePath("a", always(99))(void 0); }).toThrow();
    });

    it("should convert to object every other value", () => {
        wannabeEmptyObjects.forEach(value => {
            expect(updatePathIn(value, "a", always(99))).toStrictEqual({});
            expect(updatePath("a", always(99))(value)).toStrictEqual({});
            expect(updatePathIn(value, "a.b.c", always(99))).toStrictEqual({});
            expect(updatePath("a.b.c", always(99))(value)).toStrictEqual({});
        });
    });
});
