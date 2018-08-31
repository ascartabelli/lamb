import * as lamb from "../..";
import {
    nonStrings,
    nonStringsAsStrings,
    wannabeEmptyObjects
} from "../../__tests__/commons";

describe("hasPathValue", function () {
    var obj = {
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

    it("should verify if the given path points to the desired value", function () {
        expect(lamb.hasPathValue("a", 2)(obj)).toBe(true);
        expect(lamb.hasPathValue("b.a", 3)(obj)).toBe(true);
        expect(lamb.hasPathValue("b.b", obj.b.b)(obj)).toBe(true);
        expect(lamb.hasPathValue("b.e.a", 45)(obj)).toBe(true);
        expect(lamb.hasPathValue("a", "2")(obj)).toBe(false);
        expect(lamb.hasPathValue("b.a", -3)(obj)).toBe(false);
        expect(lamb.hasPathValue("b.b", [4, 5])(obj)).toBe(false);
        expect(lamb.hasPathValue("b.e.a", [45])(obj)).toBe(false);
    });

    it("should use the SameValueZero comparison", function () {
        expect(lamb.hasPathValue("c.a", 0)(obj)).toBe(true);
        expect(lamb.hasPathValue("c.a", -0)(obj)).toBe(true);
        expect(lamb.hasPathValue("c.b", NaN)(obj)).toBe(true);
    });

    it("should be able to verify non-enumerable properties", function () {
        expect(lamb.hasPathValue("e", 10)(obj)).toBe(true);
        expect(lamb.hasPathValue("f.g", 20)(obj)).toBe(true);
    });

    it("should be able to verify values in arrays and array-like objects", function () {
        expect(lamb.hasPathValue("b.b.0", 4)(obj)).toBe(true);
        expect(lamb.hasPathValue("b.c.0", "f")(obj)).toBe(true);
    });

    it("should allow negative indexes in paths", function () {
        expect(lamb.hasPathValue("b.b.-1", 5)(obj)).toBe(true);
        expect(lamb.hasPathValue("b.c.-3", "f")(obj)).toBe(true);
    });

    it("should return `false` for a non-existent property in a valid source", function () {
        expect(lamb.hasPathValue("b.a.z", void 0)(obj)).toBe(false);
        expect(lamb.hasPathValue("b.z.a", void 0)(obj)).toBe(false);
        expect(lamb.hasPathValue("b.b.2", void 0)(obj)).toBe(false);
        expect(lamb.hasPathValue("b.b.-3", void 0)(obj)).toBe(false);
        expect(lamb.hasPathValue("b.c.3", void 0)(obj)).toBe(false);
        expect(lamb.hasPathValue("b.c.-4", void 0)(obj)).toBe(false);
        expect(lamb.hasPathValue("b.e.z", void 0)(obj)).toBe(false);
    });

    it("should be able to check for `undefined` values in existing paths", function () {
        expect(lamb.hasPathValue("b.e.b", void 0)(obj)).toBe(true);
        expect(lamb.hasPathValue("b.e.b")(obj)).toBe(true);
        expect(lamb.hasPathValue("b.e.a", void 0)(obj)).toBe(false);
        expect(lamb.hasPathValue("b.e.a")(obj)).toBe(false);
    });

    it("should work with sparse arrays", function () {
        expect(lamb.hasPathValue("b.d.0", void 0)(obj)).toBe(true);
        expect(lamb.hasPathValue("b.d.-3", void 0)(obj)).toBe(true);
        expect(lamb.hasPathValue("b.d.1", 99)(obj)).toBe(true);
        expect(lamb.hasPathValue("b.d.-2", 99)(obj)).toBe(true);
    });

    it("should be able to verify values nested in arrays", function () {
        var o = {
            data: [
                { id: 1, value: 10 },
                { id: 2, value: 20 },
                { id: 3, value: 30 }
            ]
        };

        expect(lamb.hasPathValue("data.1.value", 20)(o)).toBe(true);
        expect(lamb.hasPathValue("data.-1.value", 30)(o)).toBe(true);
    });

    it("should give priority to object keys over array-like indexes when a negative index is encountered", function () {
        var o = { a: ["abc", new String("def"), "ghi"] };

        o.a["-1"] = "foo";
        o.a[1]["-2"] = "bar";
        Object.defineProperty(o.a, "-2", { value: 99 });

        expect(lamb.hasPathValue("a.-1", "foo")(o)).toBe(true);
        expect(lamb.hasPathValue("a.1.-2", "bar")(o)).toBe(true);
        expect(lamb.hasPathValue("a.-2", 99)(o)).toBe(true);
    });

    it("should accept a custom path separator", function () {
        expect(lamb.hasPathValue("b->b->0", 4, "->")(obj)).toBe(true);
        expect(lamb.hasPathValue("c.d/e.f", 6, "/")(obj)).toBe(true);
    });

    it("should accept integers as paths containing a single key", function () {
        expect(lamb.hasPathValue(1, 2)([1, 2])).toBe(true);
        expect(lamb.hasPathValue(-1, 2)([1, 2])).toBe(true);
        expect(lamb.hasPathValue(1, "a")({ 1: "a" })).toBe(true);
    });

    it("should convert other values for the `path` parameter to string", function () {
        var values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        var testObj = lamb.make(nonStringsAsStrings, values);

        nonStrings.forEach(function (key) {
            var value = values[nonStringsAsStrings.indexOf(String(key))];

            expect(lamb.hasPathValue(key, value, "_")(testObj)).toBe(true);
        });

        var fooObj = { a: 2, 1: { 5: 3 } };

        expect(lamb.hasPathValue(1.5, 3)(fooObj)).toBe(true);
    });

    it("should throw an exception if called without arguments", function () {
        expect(lamb.hasPathValue()).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an object", function () {
        expect(function () { lamb.hasPathValue("a", 99)(null); }).toThrow();
        expect(function () { lamb.hasPathValue("a", 99)(void 0); }).toThrow();
    });

    it("should convert to object every other value", function () {
        wannabeEmptyObjects.forEach(function (value) {
            expect(lamb.hasPathValue("a", 99)(value)).toBe(false);
        });

        expect(lamb.hasPathValue("lastIndex", 0)(/foo/)).toBe(true);
    });
});
