import getPath from "../getPath";
import getPathIn from "../getPathIn";
import make from "../make";
import {
    nonStrings,
    nonStringsAsStrings,
    wannabeEmptyObjects
} from "../../__tests__/commons";

describe("getPath / getPathIn", () => {
    const obj = { a: 2, b: { a: 3, b: [4, 5], c: "foo" }, "c.d": { "e.f": 6 } };

    obj.b.d = Array(3);
    obj.b.d[1] = 99;

    Object.defineProperty(obj, "e", { value: 10 });
    obj.f = Object.create({}, { g: { value: 20 } });

    it("should retrieve a nested object property using the supplied path", () => {
        expect(getPath("a")(obj)).toBe(2);
        expect(getPath("b.a")(obj)).toBe(3);
        expect(getPath("b.b")(obj)).toBe(obj.b.b);
        expect(getPathIn(obj, "a")).toBe(2);
        expect(getPathIn(obj, "b.a")).toBe(3);
        expect(getPathIn(obj, "b.b")).toBe(obj.b.b);
    });

    it("should be able to access non-enumerable properties", () => {
        expect(getPath("e")(obj)).toBe(10);
        expect(getPathIn(obj, "e")).toBe(10);
        expect(getPath("f.g")(obj)).toBe(20);
        expect(getPathIn(obj, "f.g")).toBe(20);
    });

    it("should be able to retrieve values from arrays and array-like objects", () => {
        expect(getPath("b.b.0")(obj)).toBe(4);
        expect(getPath("b.c.0")(obj)).toBe("f");
        expect(getPathIn(obj, "b.b.0")).toBe(4);
        expect(getPathIn(obj, "b.c.0")).toBe("f");
    });

    it("should allow negative indexes", () => {
        expect(getPath("b.b.-1")(obj)).toBe(5);
        expect(getPathIn(obj, "b.b.-1")).toBe(5);
        expect(getPath("b.c.-3")(obj)).toBe("f");
        expect(getPathIn(obj, "b.c.-3")).toBe("f");
    });

    it("should work with sparse arrays", () => {
        expect(getPathIn(obj, "b.d.1")).toBe(99);
        expect(getPathIn(obj, "b.d.-2")).toBe(99);
        expect(getPath("b.d.1")(obj)).toBe(99);
        expect(getPath("b.d.-2")(obj)).toBe(99);
    });

    it("should be able to retrieve values nested in arrays", () => {
        const o = {
            data: [
                { id: 1, value: 10 },
                { id: 2, value: 20 },
                { id: 3, value: 30 }
            ]
        };

        expect(getPath("data.1.value")(o)).toBe(20);
        expect(getPathIn(o, "data.1.value")).toBe(20);
        expect(getPath("data.-1.value")(o)).toBe(30);
        expect(getPathIn(o, "data.-1.value")).toBe(30);
    });

    it("should give priority to object keys over array-like indexes when a negative index is encountered", () => {
        const o = { a: ["abc", new String("def"), "ghi"] };

        o.a["-1"] = "foo";
        o.a[1]["-2"] = "bar";

        Object.defineProperty(o.a, "-2", { value: 99 });

        expect(getPath("a.-1")(o)).toBe("foo");
        expect(getPathIn(o, "a.-1")).toBe("foo");
        expect(getPath("a.1.-2")(o)).toBe("bar");
        expect(getPathIn(o, "a.1.-2")).toBe("bar");
        expect(getPath("a.-2")(o)).toBe(99);
        expect(getPathIn(o, "a.-2")).toBe(99);
    });

    it("should accept a custom path separator", () => {
        expect(getPath("b->b->0", "->")(obj)).toBe(4);
        expect(getPath("c.d/e.f", "/")(obj)).toBe(6);
        expect(getPathIn(obj, "b->b->0", "->")).toBe(4);
        expect(getPathIn(obj, "c.d/e.f", "/")).toBe(6);
    });

    it("should return `undefined` for a non-existent path in a valid source", () => {
        expect(getPath("b.a.z")(obj)).toBeUndefined();
        expect(getPathIn(obj, "b.a.z")).toBeUndefined();
        expect(getPath("b.z.a")(obj)).toBeUndefined();
        expect(getPathIn(obj, "b.z.a")).toBeUndefined();
        expect(getPath("b.b.10")(obj)).toBeUndefined();
        expect(getPathIn(obj, "b.b.10")).toBeUndefined();
        expect(getPath("b.b.10.z")(obj)).toBeUndefined();
        expect(getPathIn(obj, "b.b.10.z")).toBeUndefined();
    });

    it("should accept integers as paths containing a single key", () => {
        expect(getPathIn([1, 2], 1)).toBe(2);
        expect(getPath(1)([1, 2])).toBe(2);
        expect(getPathIn([1, 2], -1)).toBe(2);
        expect(getPath(-1)([1, 2])).toBe(2);
        expect(getPathIn({ 1: "a" }, 1)).toBe("a");
        expect(getPath(1)({ 1: "a" })).toBe("a");
    });

    it("should convert other values for the `path` parameter to string", () => {
        const values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        const testObj = make(nonStringsAsStrings, values);

        nonStrings.forEach(key => {
            const value = values[nonStringsAsStrings.indexOf(String(key))];

            expect(getPathIn(testObj, key, "_")).toBe(value);
            expect(getPath(key, "_")(testObj)).toBe(value);
        });

        const fooObj = { a: 2, 1: { 5: 3 }, undefined: 4 };

        expect(getPathIn(fooObj, 1.5)).toBe(3);
        expect(getPath(1.5)(fooObj)).toBe(3);

        expect(getPathIn(fooObj)).toBe(4);
        expect(getPath()(fooObj)).toBe(4);
    });

    it("should throw an exception if called without arguments", () => {
        expect(getPathIn).toThrow();
        expect(getPath()).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an object", () => {
        expect(() => { getPathIn(null, "a"); }).toThrow();
        expect(() => { getPathIn(void 0, "a"); }).toThrow();
        expect(() => { getPath("a")(null); }).toThrow();
        expect(() => { getPath("a")(void 0); }).toThrow();
    });

    it("should convert to object every other value", () => {
        wannabeEmptyObjects.forEach(value => {
            expect(getPathIn(value, "a")).toBeUndefined();
            expect(getPath("a")(value)).toBeUndefined();
        });

        expect(getPathIn(/foo/, "lastIndex")).toBe(0);
        expect(getPath("lastIndex")(/foo/)).toBe(0);
    });
});
