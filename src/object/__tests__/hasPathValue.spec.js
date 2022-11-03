import hasPathValue from "../hasPathValue";
import make from "../make";
import {
    nonStrings,
    nonStringsAsStrings,
    wannabeEmptyObjects
} from "../../__tests__/commons";

describe("hasPathValue", () => {
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

    it("should verify if the given path points to the desired value", () => {
        expect(hasPathValue("a", 2)(obj)).toBe(true);
        expect(hasPathValue("b.a", 3)(obj)).toBe(true);
        expect(hasPathValue("b.b", obj.b.b)(obj)).toBe(true);
        expect(hasPathValue("b.e.a", 45)(obj)).toBe(true);
        expect(hasPathValue("a", "2")(obj)).toBe(false);
        expect(hasPathValue("b.a", -3)(obj)).toBe(false);
        expect(hasPathValue("b.b", [4, 5])(obj)).toBe(false);
        expect(hasPathValue("b.e.a", [45])(obj)).toBe(false);
    });

    it("should use the SameValueZero comparison", () => {
        expect(hasPathValue("c.a", 0)(obj)).toBe(true);
        expect(hasPathValue("c.a", -0)(obj)).toBe(true);
        expect(hasPathValue("c.b", NaN)(obj)).toBe(true);
    });

    it("should be able to verify non-enumerable properties", () => {
        expect(hasPathValue("e", 10)(obj)).toBe(true);
        expect(hasPathValue("f.g", 20)(obj)).toBe(true);
    });

    it("should be able to verify values in arrays and array-like objects", () => {
        expect(hasPathValue("b.b.0", 4)(obj)).toBe(true);
        expect(hasPathValue("b.c.0", "f")(obj)).toBe(true);
    });

    it("should allow negative indexes in paths", () => {
        expect(hasPathValue("b.b.-1", 5)(obj)).toBe(true);
        expect(hasPathValue("b.c.-3", "f")(obj)).toBe(true);
    });

    it("should return `false` for a non-existent property in a valid source", () => {
        expect(hasPathValue("b.a.z", void 0)(obj)).toBe(false);
        expect(hasPathValue("b.z.a", void 0)(obj)).toBe(false);
        expect(hasPathValue("b.b.2", void 0)(obj)).toBe(false);
        expect(hasPathValue("b.b.-3", void 0)(obj)).toBe(false);
        expect(hasPathValue("b.c.3", void 0)(obj)).toBe(false);
        expect(hasPathValue("b.c.-4", void 0)(obj)).toBe(false);
        expect(hasPathValue("b.e.z", void 0)(obj)).toBe(false);
    });

    it("should be able to check for `undefined` values in existing paths", () => {
        expect(hasPathValue("b.e.b", void 0)(obj)).toBe(true);
        expect(hasPathValue("b.e.b")(obj)).toBe(true);
        expect(hasPathValue("b.e.a", void 0)(obj)).toBe(false);
        expect(hasPathValue("b.e.a")(obj)).toBe(false);
    });

    it("should work with sparse arrays", () => {
        expect(hasPathValue("b.d.0", void 0)(obj)).toBe(true);
        expect(hasPathValue("b.d.-3", void 0)(obj)).toBe(true);
        expect(hasPathValue("b.d.1", 99)(obj)).toBe(true);
        expect(hasPathValue("b.d.-2", 99)(obj)).toBe(true);
    });

    it("should be able to verify values nested in arrays", () => {
        const o = {
            data: [
                { id: 1, value: 10 },
                { id: 2, value: 20 },
                { id: 3, value: 30 }
            ]
        };

        expect(hasPathValue("data.1.value", 20)(o)).toBe(true);
        expect(hasPathValue("data.-1.value", 30)(o)).toBe(true);
    });

    it("should give priority to object keys over array-like indexes when a negative index is encountered", () => {
        const o = { a: ["abc", new String("def"), "ghi"] };

        o.a["-1"] = "foo";
        o.a[1]["-2"] = "bar";
        Object.defineProperty(o.a, "-2", { value: 99 });

        expect(hasPathValue("a.-1", "foo")(o)).toBe(true);
        expect(hasPathValue("a.1.-2", "bar")(o)).toBe(true);
        expect(hasPathValue("a.-2", 99)(o)).toBe(true);
    });

    it("should accept a custom path separator", () => {
        expect(hasPathValue("b->b->0", 4, "->")(obj)).toBe(true);
        expect(hasPathValue("c.d/e.f", 6, "/")(obj)).toBe(true);
    });

    it("should accept integers as paths containing a single key", () => {
        expect(hasPathValue(1, 2)([1, 2])).toBe(true);
        expect(hasPathValue(-1, 2)([1, 2])).toBe(true);
        expect(hasPathValue(1, "a")({ 1: "a" })).toBe(true);
    });

    it("should convert other values for the `path` parameter to string", () => {
        const values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        const testObj = make(nonStringsAsStrings, values);

        nonStrings.forEach(key => {
            const value = values[nonStringsAsStrings.indexOf(String(key))];

            expect(hasPathValue(key, value, "_")(testObj)).toBe(true);
        });

        const fooObj = { a: 2, 1: { 5: 3 } };

        expect(hasPathValue(1.5, 3)(fooObj)).toBe(true);
    });

    it("should throw an exception if called without arguments", () => {
        expect(hasPathValue()).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an object", () => {
        expect(() => { hasPathValue("a", 99)(null); }).toThrow();
        expect(() => { hasPathValue("a", 99)(void 0); }).toThrow();
    });

    it("should convert to object every other value", () => {
        wannabeEmptyObjects.forEach(value => {
            expect(hasPathValue("a", 99)(value)).toBe(false);
        });

        expect(hasPathValue("lastIndex", 0)(/foo/)).toBe(true);
    });
});
