import * as lamb from "../..";
import {
    nonStrings,
    nonStringsAsStrings,
    wannabeEmptyObjects
} from "../../__tests__/commons";

describe("pathExists / pathExistsIn", function () {
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

    it("should verify if the provided path exists in the given object", function () {
        expect(lamb.pathExists("a")(obj)).toBe(true);
        expect(lamb.pathExists("b.a")(obj)).toBe(true);
        expect(lamb.pathExists("b.b")(obj)).toBe(true);
        expect(lamb.pathExists("b.e.a")(obj)).toBe(true);
        expect(lamb.pathExists("z")(obj)).toBe(false);
        expect(lamb.pathExists("a.z")(obj)).toBe(false);
        expect(lamb.pathExists("b.a.z")(obj)).toBe(false);

        expect(lamb.pathExistsIn(obj, "a")).toBe(true);
        expect(lamb.pathExistsIn(obj, "b.a")).toBe(true);
        expect(lamb.pathExistsIn(obj, "b.b")).toBe(true);
        expect(lamb.pathExistsIn(obj, "b.e.a")).toBe(true);
        expect(lamb.pathExistsIn(obj, "z")).toBe(false);
        expect(lamb.pathExistsIn(obj, "a.z")).toBe(false);
        expect(lamb.pathExistsIn(obj, "b.a.z")).toBe(false);
    });

    it("should see existent paths when checking properties holding `undefined` values", function () {
        expect(lamb.pathExists("b.e.b")(obj)).toBe(true);
        expect(lamb.pathExistsIn(obj, "b.e.b")).toBe(true);
    });

    it("should be able to check paths with non-enumerable properties", function () {
        expect(lamb.pathExists("e")(obj)).toBe(true);
        expect(lamb.pathExists("f.g")(obj)).toBe(true);

        expect(lamb.pathExistsIn(obj, "e")).toBe(true);
        expect(lamb.pathExistsIn(obj, "f.g")).toBe(true);
    });

    it("should be able to check arrays and array-like objects", function () {
        expect(lamb.pathExists("b.b.0")(obj)).toBe(true);
        expect(lamb.pathExists("b.c.0")(obj)).toBe(true);
        expect(lamb.pathExists("b.b.2")(obj)).toBe(false);
        expect(lamb.pathExists("b.c.3")(obj)).toBe(false);

        expect(lamb.pathExistsIn(obj, "b.b.0")).toBe(true);
        expect(lamb.pathExistsIn(obj, "b.c.0")).toBe(true);
        expect(lamb.pathExistsIn(obj, "b.b.2")).toBe(false);
        expect(lamb.pathExistsIn(obj, "b.c.3")).toBe(false);
    });

    it("should allow negative indexes in paths", function () {
        expect(lamb.pathExists("b.b.-1")(obj)).toBe(true);
        expect(lamb.pathExists("b.c.-3")(obj)).toBe(true);
        expect(lamb.pathExists("b.b.-3")(obj)).toBe(false);
        expect(lamb.pathExists("b.c.-4")(obj)).toBe(false);

        expect(lamb.pathExistsIn(obj, "b.b.-1")).toBe(true);
        expect(lamb.pathExistsIn(obj, "b.c.-3")).toBe(true);
        expect(lamb.pathExistsIn(obj, "b.b.-3")).toBe(false);
        expect(lamb.pathExistsIn(obj, "b.c.-4")).toBe(false);
    });

    it("should work with sparse arrays", function () {
        expect(lamb.pathExists("b.d.0")(obj)).toBe(true);
        expect(lamb.pathExists("b.d.1")(obj)).toBe(true);
        expect(lamb.pathExists("b.d.-2")(obj)).toBe(true);

        expect(lamb.pathExistsIn(obj, "b.d.0")).toBe(true);
        expect(lamb.pathExistsIn(obj, "b.d.1")).toBe(true);
        expect(lamb.pathExistsIn(obj, "b.d.-2")).toBe(true);
    });

    it("should be able to check objects nested in arrays", function () {
        var o = {
            data: [
                { id: 1, value: 10 },
                { id: 2, value: 20 },
                { id: 3, value: 30 }
            ]
        };

        expect(lamb.pathExists("data.1.value")(o)).toBe(true);
        expect(lamb.pathExists("data.-1.value")(o)).toBe(true);
        expect(lamb.pathExists("data.3.value")(o)).toBe(false);
        expect(lamb.pathExists("data.-4.value")(o)).toBe(false);

        expect(lamb.pathExistsIn(o, "data.1.value")).toBe(true);
        expect(lamb.pathExistsIn(o, "data.-1.value")).toBe(true);
        expect(lamb.pathExistsIn(o, "data.3.value")).toBe(false);
        expect(lamb.pathExistsIn(o, "data.-4.value")).toBe(false);
    });

    it("should give priority to object keys over array-like indexes when a negative index is encountered", function () {
        var o = { a: ["abc", new String("def"), "ghi"] };

        o.a["-1"] = "foo";
        o.a[1]["-2"] = "bar";
        Object.defineProperty(o.a, "-2", { value: 99 });

        expect(lamb.pathExists("a.-1")(o)).toBe(true);
        expect(lamb.pathExists("a.1.-2")(o)).toBe(true);
        expect(lamb.pathExists("a.-2")(o)).toBe(true);

        expect(lamb.pathExistsIn(o, "a.-1")).toBe(true);
        expect(lamb.pathExistsIn(o, "a.1.-2")).toBe(true);
        expect(lamb.pathExistsIn(o, "a.-2")).toBe(true);
    });

    it("should accept a custom path separator", function () {
        expect(lamb.pathExists("b->b->0", "->")(obj)).toBe(true);
        expect(lamb.pathExists("c.d/e.f", "/")(obj)).toBe(true);

        expect(lamb.pathExistsIn(obj, "b->b->0", "->")).toBe(true);
        expect(lamb.pathExistsIn(obj, "c.d/e.f", "/")).toBe(true);
    });

    it("should accept integers as paths containing a single key", function () {
        expect(lamb.pathExists(1)([1, 2])).toBe(true);
        expect(lamb.pathExists(-1)([1, 2])).toBe(true);
        expect(lamb.pathExists(1)({ 1: "a" })).toBe(true);

        expect(lamb.pathExistsIn([1, 2], 1)).toBe(true);
        expect(lamb.pathExistsIn([1, 2], -1)).toBe(true);
        expect(lamb.pathExistsIn({ 1: "a" }, 1)).toBe(true);
    });

    it("should convert other values for the `path` parameter to string", function () {
        var values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        var testObj = lamb.make(nonStringsAsStrings, values);

        nonStrings.forEach(function (key) {
            expect(lamb.pathExists(key, "_")(testObj)).toBe(true);
            expect(lamb.pathExistsIn(testObj, key, "_")).toBe(true);
        });

        var fooObj = { a: 2, 1: { 5: 3 } };

        expect(lamb.pathExists(1.5)(fooObj)).toBe(true);
        expect(lamb.pathExistsIn(fooObj, 1.5)).toBe(true);
    });

    it("should throw an exception if called without arguments", function () {
        expect(lamb.pathExists()).toThrow();
        expect(function () { lamb.pathExistsIn(); }).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an object", function () {
        expect(function () { lamb.pathExists("a")(null); }).toThrow();
        expect(function () { lamb.pathExists("a")(void 0); }).toThrow();

        expect(function () { lamb.pathExistsIn(null, "a"); }).toThrow();
        expect(function () { lamb.pathExistsIn(void 0, "a"); }).toThrow();
    });

    it("should convert to object every other value", function () {
        wannabeEmptyObjects.forEach(function (value) {
            expect(lamb.pathExists("a")(value)).toBe(false);
            expect(lamb.pathExistsIn(value, "a")).toBe(false);
        });

        expect(lamb.pathExists("lastIndex")(/foo/)).toBe(true);
        expect(lamb.pathExistsIn(/foo/, "lastIndex")).toBe(true);
    });
});
