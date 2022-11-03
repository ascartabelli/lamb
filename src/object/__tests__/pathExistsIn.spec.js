import make from "../make";
import pathExists from "../pathExists";
import pathExistsIn from "../pathExistsIn";
import {
    nonStrings,
    nonStringsAsStrings,
    wannabeEmptyObjects
} from "../../__tests__/commons";

describe("pathExists / pathExistsIn", () => {
    const obj = {
        a: 2,
        b: {
            a: 3,
            b: [4, 5],
            c: "foo",
            e: { a: 45, b: void 0 }
        },
        "c.d": { "e.f": 6 },
        c: { a: -0, b: NaN }
    };

    obj.b.d = Array(3);
    obj.b.d[1] = 99;

    Object.defineProperty(obj, "e", { value: 10 });
    obj.f = Object.create({}, { g: { value: 20 } });

    it("should verify if the provided path exists in the given object", () => {
        expect(pathExists("a")(obj)).toBe(true);
        expect(pathExists("b.a")(obj)).toBe(true);
        expect(pathExists("b.b")(obj)).toBe(true);
        expect(pathExists("b.e.a")(obj)).toBe(true);
        expect(pathExists("z")(obj)).toBe(false);
        expect(pathExists("a.z")(obj)).toBe(false);
        expect(pathExists("b.a.z")(obj)).toBe(false);

        expect(pathExistsIn(obj, "a")).toBe(true);
        expect(pathExistsIn(obj, "b.a")).toBe(true);
        expect(pathExistsIn(obj, "b.b")).toBe(true);
        expect(pathExistsIn(obj, "b.e.a")).toBe(true);
        expect(pathExistsIn(obj, "z")).toBe(false);
        expect(pathExistsIn(obj, "a.z")).toBe(false);
        expect(pathExistsIn(obj, "b.a.z")).toBe(false);
    });

    it("should see existent paths when checking properties holding `undefined` values", () => {
        expect(pathExists("b.e.b")(obj)).toBe(true);
        expect(pathExistsIn(obj, "b.e.b")).toBe(true);
    });

    it("should be able to check paths with non-enumerable properties", () => {
        expect(pathExists("e")(obj)).toBe(true);
        expect(pathExists("f.g")(obj)).toBe(true);

        expect(pathExistsIn(obj, "e")).toBe(true);
        expect(pathExistsIn(obj, "f.g")).toBe(true);
    });

    it("should be able to check arrays and array-like objects", () => {
        expect(pathExists("b.b.0")(obj)).toBe(true);
        expect(pathExists("b.c.0")(obj)).toBe(true);
        expect(pathExists("b.b.2")(obj)).toBe(false);
        expect(pathExists("b.c.3")(obj)).toBe(false);

        expect(pathExistsIn(obj, "b.b.0")).toBe(true);
        expect(pathExistsIn(obj, "b.c.0")).toBe(true);
        expect(pathExistsIn(obj, "b.b.2")).toBe(false);
        expect(pathExistsIn(obj, "b.c.3")).toBe(false);
    });

    it("should allow negative indexes in paths", () => {
        expect(pathExists("b.b.-1")(obj)).toBe(true);
        expect(pathExists("b.c.-3")(obj)).toBe(true);
        expect(pathExists("b.b.-3")(obj)).toBe(false);
        expect(pathExists("b.c.-4")(obj)).toBe(false);

        expect(pathExistsIn(obj, "b.b.-1")).toBe(true);
        expect(pathExistsIn(obj, "b.c.-3")).toBe(true);
        expect(pathExistsIn(obj, "b.b.-3")).toBe(false);
        expect(pathExistsIn(obj, "b.c.-4")).toBe(false);
    });

    it("should work with sparse arrays", () => {
        expect(pathExists("b.d.0")(obj)).toBe(true);
        expect(pathExists("b.d.1")(obj)).toBe(true);
        expect(pathExists("b.d.-2")(obj)).toBe(true);

        expect(pathExistsIn(obj, "b.d.0")).toBe(true);
        expect(pathExistsIn(obj, "b.d.1")).toBe(true);
        expect(pathExistsIn(obj, "b.d.-2")).toBe(true);
    });

    it("should be able to check objects nested in arrays", () => {
        const o = {
            data: [
                { id: 1, value: 10 },
                { id: 2, value: 20 },
                { id: 3, value: 30 }
            ]
        };

        expect(pathExists("data.1.value")(o)).toBe(true);
        expect(pathExists("data.-1.value")(o)).toBe(true);
        expect(pathExists("data.3.value")(o)).toBe(false);
        expect(pathExists("data.-4.value")(o)).toBe(false);

        expect(pathExistsIn(o, "data.1.value")).toBe(true);
        expect(pathExistsIn(o, "data.-1.value")).toBe(true);
        expect(pathExistsIn(o, "data.3.value")).toBe(false);
        expect(pathExistsIn(o, "data.-4.value")).toBe(false);
    });

    it("should give priority to object keys over array-like indexes when a negative index is encountered", () => {
        const o = { a: ["abc", new String("def"), "ghi"] };

        o.a["-1"] = "foo";
        o.a[1]["-2"] = "bar";
        Object.defineProperty(o.a, "-2", { value: 99 });

        expect(pathExists("a.-1")(o)).toBe(true);
        expect(pathExists("a.1.-2")(o)).toBe(true);
        expect(pathExists("a.-2")(o)).toBe(true);

        expect(pathExistsIn(o, "a.-1")).toBe(true);
        expect(pathExistsIn(o, "a.1.-2")).toBe(true);
        expect(pathExistsIn(o, "a.-2")).toBe(true);
    });

    it("should accept a custom path separator", () => {
        expect(pathExists("b->b->0", "->")(obj)).toBe(true);
        expect(pathExists("c.d/e.f", "/")(obj)).toBe(true);

        expect(pathExistsIn(obj, "b->b->0", "->")).toBe(true);
        expect(pathExistsIn(obj, "c.d/e.f", "/")).toBe(true);
    });

    it("should accept integers as paths containing a single key", () => {
        expect(pathExists(1)([1, 2])).toBe(true);
        expect(pathExists(-1)([1, 2])).toBe(true);
        expect(pathExists(1)({ 1: "a" })).toBe(true);

        expect(pathExistsIn([1, 2], 1)).toBe(true);
        expect(pathExistsIn([1, 2], -1)).toBe(true);
        expect(pathExistsIn({ 1: "a" }, 1)).toBe(true);
    });

    it("should convert other values for the `path` parameter to string", () => {
        const values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        const testObj = make(nonStringsAsStrings, values);

        nonStrings.forEach(key => {
            expect(pathExists(key, "_")(testObj)).toBe(true);
            expect(pathExistsIn(testObj, key, "_")).toBe(true);
        });

        const fooObj = { a: 2, 1: { 5: 3 } };

        expect(pathExists(1.5)(fooObj)).toBe(true);
        expect(pathExistsIn(fooObj, 1.5)).toBe(true);
    });

    it("should throw an exception if called without arguments", () => {
        expect(pathExists()).toThrow();
        expect(() => { pathExistsIn(); }).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an object", () => {
        expect(() => { pathExists("a")(null); }).toThrow();
        expect(() => { pathExists("a")(void 0); }).toThrow();

        expect(() => { pathExistsIn(null, "a"); }).toThrow();
        expect(() => { pathExistsIn(void 0, "a"); }).toThrow();
    });

    it("should convert to object every other value", () => {
        wannabeEmptyObjects.forEach(value => {
            expect(pathExists("a")(value)).toBe(false);
            expect(pathExistsIn(value, "a")).toBe(false);
        });

        expect(pathExists("lastIndex")(/foo/)).toBe(true);
        expect(pathExistsIn(/foo/, "lastIndex")).toBe(true);
    });
});
