import * as lamb from "../..";
import {
    nonStrings,
    nonStringsAsStrings,
    wannabeEmptyObjects
} from "../../__tests__/commons";

describe("pathSatisfies", function () {
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

    var isDefined = lamb.not(lamb.isUndefined);

    it("should verify if the provided path satisfies a predicate in the given object", function () {
        expect(lamb.pathSatisfies(lamb.is(2), "a")(obj)).toBe(true);
        expect(lamb.pathSatisfies(lamb.is(3), "b.a")(obj)).toBe(true);
        expect(lamb.pathSatisfies(Array.isArray, "b.b")(obj)).toBe(true);
        expect(lamb.pathSatisfies(lamb.is(99), "z")(obj)).toBe(false);
        expect(lamb.pathSatisfies(isDefined, "a.z")(obj)).toBe(false);
        expect(lamb.pathSatisfies(isDefined, "b.a.z")(obj)).toBe(false);
    });

    it("should pass an `undefined` value to the predicate if the path doesn't exist", function () {
        var isDefinedCheck = function (v) {
            expect(arguments.length).toBe(1);
            expect(v).toBeUndefined();

            return !lamb.isUndefined(v);
        };

        expect(lamb.pathSatisfies(isDefinedCheck, "a.z")(obj)).toBe(false);
        expect(lamb.pathSatisfies(isDefinedCheck, "b.a.z")(obj)).toBe(false);
    });

    it("should apply the function's calling context to the predicate", function () {
        var validator = {
            minAllowedValue: 3,
            maxAllowedValue: 10,
            hasValidValue: lamb.pathSatisfies(function (value) {
                return value >= this.minAllowedValue && value <= this.maxAllowedValue;
            }, "b.a")
        };

        expect(validator.hasValidValue(obj)).toBe(true);
        expect(validator.hasValidValue({ b: { a: 1 } })).toBe(false);
    });

    it("should be able to check paths with non-enumerable properties", function () {
        expect(lamb.pathSatisfies(lamb.is(10), "e")(obj)).toBe(true);
        expect(lamb.pathSatisfies(lamb.is(20), "f.g")(obj)).toBe(true);
    });

    it("should be able to check arrays and array-like objects", function () {
        expect(lamb.pathSatisfies(lamb.is(4), "b.b.0")(obj)).toBe(true);
        expect(lamb.pathSatisfies(lamb.is("f"), "b.c.0")(obj)).toBe(true);
    });

    it("should allow negative indexes in paths", function () {
        expect(lamb.pathSatisfies(lamb.is(5), "b.b.-1")(obj)).toBe(true);
        expect(lamb.pathSatisfies(lamb.is("f"), "b.c.-3")(obj)).toBe(true);
    });

    it("should pass an `undefined` value to the predicate for unassigned or deleted indexes in sparse arrays", function () {
        expect(lamb.pathSatisfies(lamb.isUndefined, "b.d.0")(obj)).toBe(true);
        expect(lamb.pathSatisfies(lamb.isUndefined, "b.d.-3")(obj)).toBe(true);

        /* eslint-disable no-sparse-arrays */
        expect(lamb.pathSatisfies(lamb.isUndefined, "1")([1, , 3])).toBe(true);
        expect(lamb.pathSatisfies(lamb.isUndefined, "-2")([1, , 3])).toBe(true);
        /* eslint-enable no-sparse-arrays */
    });

    it("should be able to check objects nested in arrays", function () {
        var o = {
            data: [
                { id: 1, value: 10 },
                { id: 2, value: 20 },
                { id: 3, value: 30 }
            ]
        };

        expect(lamb.pathSatisfies(lamb.is(20), "data.1.value")(o)).toBe(true);
        expect(lamb.pathSatisfies(lamb.is(30), "data.-1.value")(o)).toBe(true);
    });

    it("should give priority to object keys over array-like indexes when a negative index is encountered", function () {
        var o = { a: ["abc", new String("def"), "ghi"] };

        o.a["-1"] = "foo";
        o.a[1]["-2"] = "bar";
        Object.defineProperty(o.a, "-2", { value: 99 });

        expect(lamb.pathSatisfies(lamb.is("foo"), "a.-1")(o)).toBe(true);
        expect(lamb.pathSatisfies(lamb.is("bar"), "a.1.-2")(o)).toBe(true);
        expect(lamb.pathSatisfies(lamb.is(99), "a.-2")(o)).toBe(true);
    });

    it("should accept a custom path separator", function () {
        expect(lamb.pathSatisfies(lamb.is(4), "b->b->0", "->")(obj)).toBe(true);
        expect(lamb.pathSatisfies(lamb.is(6), "c.d/e.f", "/")(obj)).toBe(true);
    });

    it("should accept integers as paths containing a single key", function () {
        expect(lamb.pathSatisfies(lamb.is(2), 1)([1, 2])).toBe(true);
        expect(lamb.pathSatisfies(lamb.is(2), -1)([1, 2])).toBe(true);
        expect(lamb.pathSatisfies(lamb.is("a"), 1)({ 1: "a" })).toBe(true);
    });

    it("should convert other values for the `path` parameter to string", function () {
        var values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        var testObj = lamb.make(nonStringsAsStrings, values);

        nonStrings.forEach(function (key, idx) {
            expect(lamb.pathSatisfies(lamb.is(values[idx]), key, "_")(testObj)).toBe(true);
        });

        var fooObj = { a: 2, 1: { 5: 3 } };

        expect(lamb.pathSatisfies(lamb.is(3), 1.5)(fooObj)).toBe(true);
    });

    it("should throw an exception if called without arguments", function () {
        expect(lamb.pathSatisfies()).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an object", function () {
        expect(function () { lamb.pathSatisfies(lamb.is(99), "a")(null); }).toThrow();
        expect(function () { lamb.pathSatisfies(lamb.is(99), "a")(void 0); }).toThrow();
    });

    it("should convert to object every other value", function () {
        wannabeEmptyObjects.forEach(function (value) {
            expect(lamb.pathSatisfies(isDefined, "a")(value)).toBe(false);
        });

        expect(lamb.pathSatisfies(isDefined, "lastIndex")(/foo/)).toBe(true);
    });
});
