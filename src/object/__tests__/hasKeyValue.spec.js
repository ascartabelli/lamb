import * as lamb from "../..";
import {
    nonStrings,
    nonStringsAsStrings,
    wannabeEmptyObjects
} from "../../__tests__/commons";

describe("hasKeyValue", function () {
    var persons = [
        { name: "Jane", surname: "Doe" },
        { name: "John", surname: "Doe" },
        { name: "Mario", surname: "Rossi" }
    ];

    var isDoe = lamb.hasKeyValue("surname", "Doe");

    it("should build a function that checks if an object holds the desired key / value pair", function () {
        expect(lamb.hasKeyValue("a", 45)({ a: 45 })).toBe(true);
        expect(lamb.hasKeyValue("a", [45])({ a: 45 })).toBe(false);
        expect(persons.map(isDoe)).toEqual([true, true, false]);
    });

    it("should return `false` for a non-existent property", function () {
        expect(lamb.hasKeyValue("z", void 0)(persons[0])).toBe(false);
    });

    it("should be able to check for `undefined` values in existing keys", function () {
        var obj = { a: void 0, b: 5 };

        expect(lamb.hasKeyValue("a", void 0)(obj)).toBe(true);
        expect(lamb.hasKeyValue("a")(obj)).toBe(true);
        expect(lamb.hasKeyValue("b", void 0)(obj)).toBe(false);
        expect(lamb.hasKeyValue("b")(obj)).toBe(false);
    });

    it("should use the \"SameValueZero\" comparison", function () {
        var obj = { a: NaN, b: 0, c: -0 };

        expect(lamb.hasKeyValue("a", NaN)(obj)).toBe(true);
        expect(lamb.hasKeyValue("b", 0)(obj)).toBe(true);
        expect(lamb.hasKeyValue("b", -0)(obj)).toBe(true);
        expect(lamb.hasKeyValue("c", -0)(obj)).toBe(true);
        expect(lamb.hasKeyValue("c", 0)(obj)).toBe(true);
    });

    it("should accept integers as keys and accept array-like objects", function () {
        var o = { 1: "a", 2: "b" };
        var arr = [1, 2, 3, 4];
        var s = "abcd";

        expect(lamb.hasKeyValue(2, "b")(o)).toBe(true);
        expect(lamb.hasKeyValue(2, 3)(arr)).toBe(true);
        expect(lamb.hasKeyValue(2, "c")(s)).toBe(true);
    });

    it("should consider only defined indexes in sparse arrays", function () {
        /* eslint-disable no-sparse-arrays */
        expect(lamb.hasKeyValue("1", void 0)([1, , 3])).toBe(false);
        expect(lamb.hasKeyValue("-2", void 0)([1, , 3])).toBe(false);
        /* eslint-enable no-sparse-arrays */
    });

    it("should convert other values for the `key` parameter to string", function () {
        var testObj = lamb.make(
            nonStringsAsStrings,
            lamb.range(0, nonStringsAsStrings.length, 1)
        );

        nonStrings.forEach(function (key) {
            var value = nonStringsAsStrings.indexOf(String(key));

            expect(lamb.hasKeyValue(key, value)(testObj)).toBe(true);
        });

        expect(lamb.hasKeyValue()({ undefined: void 0 })).toBe(true);
    });

    it("should throw an exception if called without the data argument", function () {
        expect(lamb.hasKeyValue("foo", 2)).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an object", function () {
        expect(function () { lamb.hasKeyValue("a", 2)(null); }).toThrow();
        expect(function () { lamb.hasKeyValue("a", 2)(void 0); }).toThrow();
    });

    it("should convert to object every other value", function () {
        wannabeEmptyObjects.forEach(function (v) {
            expect(lamb.hasKeyValue("a", 2)(v)).toBe(false);
        });

        expect(lamb.hasKeyValue("lastIndex", 0)(/foo/)).toBe(true);
    });
});
