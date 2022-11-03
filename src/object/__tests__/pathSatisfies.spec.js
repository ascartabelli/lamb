import is from "../../logic/is";
import isUndefined from "../../core/isUndefined";
import make from "../make";
import not from "../../logic/not";
import pathSatisfies from "../pathSatisfies";
import {
    nonStrings,
    nonStringsAsStrings,
    wannabeEmptyObjects
} from "../../__tests__/commons";

describe("pathSatisfies", () => {
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

    const isDefined = not(isUndefined);

    it("should verify if the provided path satisfies a predicate in the given object", () => {
        expect(pathSatisfies(is(2), "a")(obj)).toBe(true);
        expect(pathSatisfies(is(3), "b.a")(obj)).toBe(true);
        expect(pathSatisfies(Array.isArray, "b.b")(obj)).toBe(true);
        expect(pathSatisfies(is(99), "z")(obj)).toBe(false);
        expect(pathSatisfies(isDefined, "a.z")(obj)).toBe(false);
        expect(pathSatisfies(isDefined, "b.a.z")(obj)).toBe(false);
    });

    it("should pass an `undefined` value to the predicate if the path doesn't exist", () => {
        function isDefinedCheck (v) {
            expect(arguments.length).toBe(1);
            expect(v).toBeUndefined();

            return !isUndefined(v);
        }

        expect(pathSatisfies(isDefinedCheck, "a.z")(obj)).toBe(false);
        expect(pathSatisfies(isDefinedCheck, "b.a.z")(obj)).toBe(false);
    });

    it("should apply the function's calling context to the predicate", () => {
        const validator = {
            minAllowedValue: 3,
            maxAllowedValue: 10,
            hasValidValue: pathSatisfies(function (value) {
                return value >= this.minAllowedValue && value <= this.maxAllowedValue;
            }, "b.a")
        };

        expect(validator.hasValidValue(obj)).toBe(true);
        expect(validator.hasValidValue({ b: { a: 1 } })).toBe(false);
    });

    it("should be able to check paths with non-enumerable properties", () => {
        expect(pathSatisfies(is(10), "e")(obj)).toBe(true);
        expect(pathSatisfies(is(20), "f.g")(obj)).toBe(true);
    });

    it("should be able to check arrays and array-like objects", () => {
        expect(pathSatisfies(is(4), "b.b.0")(obj)).toBe(true);
        expect(pathSatisfies(is("f"), "b.c.0")(obj)).toBe(true);
    });

    it("should allow negative indexes in paths", () => {
        expect(pathSatisfies(is(5), "b.b.-1")(obj)).toBe(true);
        expect(pathSatisfies(is("f"), "b.c.-3")(obj)).toBe(true);
    });

    it("should pass an `undefined` value to the predicate for unassigned or deleted indexes in sparse arrays", () => {
        expect(pathSatisfies(isUndefined, "b.d.0")(obj)).toBe(true);
        expect(pathSatisfies(isUndefined, "b.d.-3")(obj)).toBe(true);

        /* eslint-disable no-sparse-arrays */
        expect(pathSatisfies(isUndefined, "1")([1, , 3])).toBe(true);
        expect(pathSatisfies(isUndefined, "-2")([1, , 3])).toBe(true);
        /* eslint-enable no-sparse-arrays */
    });

    it("should be able to check objects nested in arrays", () => {
        const o = {
            data: [
                { id: 1, value: 10 },
                { id: 2, value: 20 },
                { id: 3, value: 30 }
            ]
        };

        expect(pathSatisfies(is(20), "data.1.value")(o)).toBe(true);
        expect(pathSatisfies(is(30), "data.-1.value")(o)).toBe(true);
    });

    it("should give priority to object keys over array-like indexes when a negative index is encountered", () => {
        const o = { a: ["abc", new String("def"), "ghi"] };

        o.a["-1"] = "foo";
        o.a[1]["-2"] = "bar";
        Object.defineProperty(o.a, "-2", { value: 99 });

        expect(pathSatisfies(is("foo"), "a.-1")(o)).toBe(true);
        expect(pathSatisfies(is("bar"), "a.1.-2")(o)).toBe(true);
        expect(pathSatisfies(is(99), "a.-2")(o)).toBe(true);
    });

    it("should accept a custom path separator", () => {
        expect(pathSatisfies(is(4), "b->b->0", "->")(obj)).toBe(true);
        expect(pathSatisfies(is(6), "c.d/e.f", "/")(obj)).toBe(true);
    });

    it("should accept integers as paths containing a single key", () => {
        expect(pathSatisfies(is(2), 1)([1, 2])).toBe(true);
        expect(pathSatisfies(is(2), -1)([1, 2])).toBe(true);
        expect(pathSatisfies(is("a"), 1)({ 1: "a" })).toBe(true);
    });

    it("should convert other values for the `path` parameter to string", () => {
        const values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        const testObj = make(nonStringsAsStrings, values);

        nonStrings.forEach((key, idx) => {
            expect(pathSatisfies(is(values[idx]), key, "_")(testObj)).toBe(true);
        });

        const fooObj = { a: 2, 1: { 5: 3 } };

        expect(pathSatisfies(is(3), 1.5)(fooObj)).toBe(true);
    });

    it("should throw an exception if called without arguments", () => {
        expect(pathSatisfies()).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an object", () => {
        expect(() => { pathSatisfies(is(99), "a")(null); }).toThrow();
        expect(() => { pathSatisfies(is(99), "a")(void 0); }).toThrow();
    });

    it("should convert to object every other value", () => {
        wannabeEmptyObjects.forEach(value => {
            expect(pathSatisfies(isDefined, "a")(value)).toBe(false);
        });

        expect(pathSatisfies(isDefined, "lastIndex")(/foo/)).toBe(true);
    });
});
