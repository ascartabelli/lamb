import make from "../make";
import merge from "../merge";
import setPath from "../setPath";
import setPathIn from "../setPathIn";
import { nonStrings, nonStringsAsStrings, wannabeEmptyObjects } from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("setPath / setPathIn", () => {
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

    afterEach(() => {
        expect(obj).toStrictEqual(objCopy);
        expect(obj.b.d).toStrictArrayEqual(objCopy.b.d);
    });

    it("should allow to set a nested property in a copy of the given object", () => {
        const r1 = setPath("a", 99, ".")(obj);
        const r2 = setPathIn(obj, "a", 99, ".");

        expect(r1).toStrictEqual({
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

        expect(r2).toStrictEqual(r1);
        expect(r2.b.d).toStrictArrayEqual(sparseArr);

        const r3 = setPath("b.c", "bar", ".")(obj);
        const r4 = setPathIn(obj, "b.c", "bar", ".");

        expect(r3).toStrictEqual({
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

        expect(r4).toStrictEqual(r3);
        expect(r4.b.d).toStrictArrayEqual(sparseArr);
    });

    it("should use the dot as the default separator", () => {
        const r = setPath("b.a.g", 99)(obj);

        expect(r).toStrictEqual({
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
        expect(setPathIn(obj, "b.a.g", 99)).toStrictEqual(r);
    });

    it("should ignore extra arguments passed to the built function in its partially applied form", () => {
        const r = setPath("b.c", "bar")(obj, {});

        expect(r).toStrictEqual({
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

    it("should allow custom separators", () => {
        const r = setPath("c.d->e.f", 99, "->")(obj);

        expect(r).toStrictEqual({
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
        expect(setPathIn(obj, "c.d->e.f", 99, "->")).toStrictEqual(r);
    });

    it("should add non-existent properties to existing objects", () => {
        const r1 = {
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
        const r2 = {
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
        const r3 = {
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

        expect(setPath("b.z", 99)(obj)).toStrictEqual(r1);
        expect(setPathIn(obj, "b.z", 99)).toStrictEqual(r1);
        expect(setPath("z.a", 99)(obj)).toStrictEqual(r2);
        expect(setPathIn(obj, "z.a", 99)).toStrictEqual(r2);
        expect(setPath("z.a.b", 99)(obj)).toStrictEqual(r3);
        expect(setPathIn(obj, "z.a.b", 99)).toStrictEqual(r3);

        const o = { a: null };
        const r4 = { a: { b: { c: 99 } } };

        expect(setPath("a.b.c", 99)(o)).toStrictEqual(r4);
        expect(setPathIn(o, "a.b.c", 99)).toStrictEqual(r4);
    });

    it("should treat non-enumerable properties encountered in a path as non-existent properties", () => {
        const r1 = {
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
        const r2 = {
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

        expect(setPathIn(obj, "b.w.z", 99)).toStrictEqual(r1);
        expect(setPath("b.w.z", 99)(obj)).toStrictEqual(r1);
        expect(setPathIn(obj, "b.w.y.z", 99)).toStrictEqual(r2);
        expect(setPath("b.w.y.z", 99)(obj)).toStrictEqual(r2);
    });

    it("should replace indexes when an array is found and the key is a string containing an integer", () => {
        const r = {
            a: 2,
            b: {
                a: { g: 10, h: 11 },
                b: [4, 99],
                c: "foo",
                d: [, 55, , ] // eslint-disable-line comma-spacing, no-sparse-arrays
            },
            "c.d": { "e.f": 6 }
        };

        expect(setPath("b.b.1", 99)(obj)).toStrictEqual(r);
        expect(setPathIn(obj, "b.b.1", 99)).toStrictEqual(r);
        expect(setPath("1", 99)([1, 2, 3])).toStrictEqual([1, 99, 3]);
        expect(setPathIn([1, 2, 3], "1", 99)).toStrictEqual([1, 99, 3]);
    });

    it("should allow using negative array indexes in path parts", () => {
        const r = {
            a: 2,
            b: {
                a: { g: 10, h: 11 },
                b: [99, 5],
                c: "foo",
                d: [, 55, , ] // eslint-disable-line comma-spacing, no-sparse-arrays
            },
            "c.d": { "e.f": 6 }
        };

        expect(setPath("b.b.-2", 99)(obj)).toStrictEqual(r);
        expect(setPathIn(obj, "b.b.-2", 99)).toStrictEqual(r);
        expect(setPath("-2", 99)([1, 2, 3])).toStrictEqual([1, 99, 3]);
        expect(setPathIn([1, 2, 3], "-2", 99)).toStrictEqual([1, 99, 3]);
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

        ["b.d.1", "b.d.-2", "b.d.-1", "b.d.2"].forEach((path, idx) => {
            const r1 = setPathIn(obj, path, 99);
            const r2 = setPath(path, 99)(obj);
            const expected = idx < 2 ? expected1 : expected2;

            expect(r1).toStrictEqual(expected);
            expect(r1.b.d).toStrictArrayEqual(expected.b.d);

            expect(r2).toStrictEqual(expected);
            expect(r2.b.d).toStrictArrayEqual(expected.b.d);
        });
    });

    it("should not add new elements to an array and behave like `setAt` which returns a copy of the array", () => {
        const r1 = setPath("b.b.2", 99)(obj);
        const r2 = setPathIn(obj, "b.b.2", 99);
        const r3 = {
            a: 2,
            b: {
                a: { g: 10, h: 11 },
                b: [4, 5],
                c: "foo",
                d: [void 0, 55, void 0]
            },
            "c.d": { "e.f": 6 }
        };

        expect(r1).toStrictEqual(obj);
        expect(r2).toStrictEqual(obj);
        expect(r1.b.b).not.toBe(obj.b.b);
        expect(r2.b.b).not.toBe(obj.b.b);

        expect(setPathIn(obj, "b.d.11", 99)).toStrictEqual(r3);
        expect(setPath("b.d.11", 99)(obj)).toStrictEqual(r3);
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
                { id: 2, value: 99 },
                { id: 3, value: 30 }
            ]
        };

        expect(setPath("data.1.value", 99)(o)).toStrictEqual(r);
        expect(setPathIn(o, "data.1.value", 99)).toStrictEqual(r);
        expect(setPath("data.-2.value", 99)(o)).toStrictEqual(r);
        expect(setPathIn(o, "data.-2.value", 99)).toStrictEqual(r);
    });

    it("should build an object with numbered keys when an array-like object is found", () => {
        const r = {
            a: 2,
            b: {
                a: { g: 10, h: 11 },
                b: [4, 5],
                c: { 0: "m", 1: "o", 2: "o" },
                d: sparseArr
            },
            "c.d": { "e.f": 6 }
        };

        expect(setPath("b.c.0", "m")(obj)).toStrictEqual(r);
        expect(setPathIn(obj, "b.c.0", "m")).toStrictEqual(r);
    });

    it("should build an object with numbered keys when an array is found and the key is not a string containing an integer", () => {
        const r = {
            a: 2,
            b: {
                a: { g: 10, h: 11 },
                b: { 0: 4, 1: 5, z: 99 },
                c: "foo",
                d: sparseArr
            },
            "c.d": { "e.f": 6 }
        };

        expect(setPath("b.b.z", 99)(obj)).toStrictEqual(r);
        expect(setPathIn(obj, "b.b.z", 99)).toStrictEqual(r);
    });

    it("should accept integers as paths containing a single key", () => {
        expect(setPath(1, 99)([1, 2, 3])).toStrictEqual([1, 99, 3]);
        expect(setPathIn([1, 2, 3], -1, 99)).toStrictEqual([1, 2, 99]);
        expect(setPath(2, 99)([1, 2])).toStrictEqual([1, 2]);
        expect(setPathIn({ a: 1 }, 1, 99)).toStrictEqual({ a: 1, 1: 99 });
    });

    it("should give priority to object keys over array indexes when a negative index is encountered", () => {
        const o = { a: ["abc", "def", "ghi"] };

        o.a["-1"] = "foo";

        const r = { a: { 0: "abc", 1: "def", 2: "ghi", "-1": 99 } };

        expect(setPath("a.-1", 99)(o)).toStrictEqual(r);
        expect(setPathIn(o, "a.-1", 99)).toStrictEqual(r);
    });

    it("should consider a negative integer to be an index if the property exists but it's not enumerable", () => {
        const o = { a: ["abc", "def", "ghi"] };

        Object.defineProperty(o.a, "-1", { value: 99 });

        const r = { a: ["abc", "def", "foo"] };

        expect(setPath("a.-1", "foo")(o)).toStrictEqual(r);
        expect(setPathIn(o, "a.-1", "foo")).toStrictEqual(r);
    });

    it("should convert other values for the `path` parameter to string", () => {
        const values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        const testObj = make(nonStringsAsStrings, values);

        nonStrings.forEach(key => {
            const expected = merge({}, testObj);

            expected[String(key)] = 99;

            expect(setPathIn(testObj, key, 99, "_")).toStrictEqual(expected);
            expect(setPath(key, 99, "_")(testObj)).toStrictEqual(expected);
        });

        expect(setPathIn({ a: 2 }, 1.5, 99)).toStrictEqual({ a: 2, 1: { 5: 99 } });
        expect(setPath(1.5, 99)({ a: 2 })).toStrictEqual({ a: 2, 1: { 5: 99 } });

        expect(setPathIn({ a: 2 })).toStrictEqual({ a: 2, undefined: void 0 });
        expect(setPath()({ a: 2 })).toStrictEqual({ a: 2, undefined: void 0 });
    });

    it("should throw an exception if called without arguments", () => {
        expect(setPathIn).toThrow();
        expect(setPath()).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an object", () => {
        expect(() => { setPathIn(null, "a", 99); }).toThrow();
        expect(() => { setPathIn(void 0, "a", 99); }).toThrow();
        expect(() => { setPath("a", 99)(null); }).toThrow();
        expect(() => { setPath("a", 99)(void 0); }).toThrow();
    });

    it("should convert to object every other value", () => {
        wannabeEmptyObjects.forEach(value => {
            expect(setPathIn(value, "a", 99)).toStrictEqual({ a: 99 });
            expect(setPath("a", 99)(value)).toStrictEqual({ a: 99 });
        });
    });
});
