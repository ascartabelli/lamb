import hasKeyValue from "../hasKeyValue";
import make from "../make";
import range from "../../math/range";
import {
    nonStrings,
    nonStringsAsStrings,
    wannabeEmptyObjects
} from "../../__tests__/commons";

describe("hasKeyValue", () => {
    const persons = [
        { name: "Jane", surname: "Doe" },
        { name: "John", surname: "Doe" },
        { name: "Mario", surname: "Rossi" }
    ];

    const isDoe = hasKeyValue("surname", "Doe");

    it("should build a function that checks if an object holds the desired key / value pair", () => {
        expect(hasKeyValue("a", 45)({ a: 45 })).toBe(true);
        expect(hasKeyValue("a", [45])({ a: 45 })).toBe(false);
        expect(persons.map(isDoe)).toStrictEqual([true, true, false]);
    });

    it("should return `false` for a non-existent property", () => {
        expect(hasKeyValue("z", void 0)(persons[0])).toBe(false);
    });

    it("should be able to check for `undefined` values in existing keys", () => {
        const obj = { a: void 0, b: 5 };

        expect(hasKeyValue("a", void 0)(obj)).toBe(true);
        expect(hasKeyValue("a")(obj)).toBe(true);
        expect(hasKeyValue("b", void 0)(obj)).toBe(false);
        expect(hasKeyValue("b")(obj)).toBe(false);
    });

    it("should use the \"SameValueZero\" comparison", () => {
        const obj = { a: NaN, b: 0, c: -0 };

        expect(hasKeyValue("a", NaN)(obj)).toBe(true);
        expect(hasKeyValue("b", 0)(obj)).toBe(true);
        expect(hasKeyValue("b", -0)(obj)).toBe(true);
        expect(hasKeyValue("c", -0)(obj)).toBe(true);
        expect(hasKeyValue("c", 0)(obj)).toBe(true);
    });

    it("should accept integers as keys and accept array-like objects", () => {
        const o = { 1: "a", 2: "b" };
        const arr = [1, 2, 3, 4];
        const s = "abcd";

        expect(hasKeyValue(2, "b")(o)).toBe(true);
        expect(hasKeyValue(2, 3)(arr)).toBe(true);
        expect(hasKeyValue(2, "c")(s)).toBe(true);
    });

    it("should consider only defined indexes in sparse arrays", () => {
        /* eslint-disable no-sparse-arrays */
        expect(hasKeyValue("1", void 0)([1, , 3])).toBe(false);
        expect(hasKeyValue("-2", void 0)([1, , 3])).toBe(false);
        /* eslint-enable no-sparse-arrays */
    });

    it("should convert other values for the `key` parameter to string", () => {
        const testObj = make(
            nonStringsAsStrings,
            range(0, nonStringsAsStrings.length, 1)
        );

        nonStrings.forEach(key => {
            const value = nonStringsAsStrings.indexOf(String(key));

            expect(hasKeyValue(key, value)(testObj)).toBe(true);
        });

        expect(hasKeyValue()({ undefined: void 0 })).toBe(true);
    });

    it("should throw an exception if called without the data argument", () => {
        expect(hasKeyValue("foo", 2)).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an object", () => {
        expect(() => { hasKeyValue("a", 2)(null); }).toThrow();
        expect(() => { hasKeyValue("a", 2)(void 0); }).toThrow();
    });

    it("should convert to object every other value", () => {
        wannabeEmptyObjects.forEach(value => {
            expect(hasKeyValue("a", 2)(value)).toBe(false);
        });

        expect(hasKeyValue("lastIndex", 0)(/foo/)).toBe(true);
    });
});
