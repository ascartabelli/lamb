import has from "../has";
import hasKey from "../hasKey";
import make from "../make";
import {
    nonStrings,
    nonStringsAsStrings,
    wannabeEmptyObjects
} from "../../__tests__/commons";

describe("has / hasKey", () => {
    const obj = { foo: "bar" };

    it("should check the existence of the property in an object", () => {
        expect(has(obj, "toString")).toBe(true);
        expect(has(obj, "foo")).toBe(true);
        expect(hasKey("toString")(obj)).toBe(true);
        expect(hasKey("foo")(obj)).toBe(true);
    });

    it("should return `false` for a non-existent property", () => {
        expect(has(obj, "baz")).toBe(false);
        expect(hasKey("baz")(obj)).toBe(false);
    });

    it("should accept integers as keys and accept array-like objects", () => {
        const o = { 1: "a", 2: "b" };
        const arr = [1, 2, 3, 4];
        const s = "abcd";

        expect(has(o, 2)).toBe(true);
        expect(has(arr, 2)).toBe(true);
        expect(has(s, 2)).toBe(true);
        expect(hasKey(2)(o)).toBe(true);
        expect(hasKey(2)(arr)).toBe(true);
        expect(hasKey(2)(s)).toBe(true);
    });

    it("should consider only defined indexes in sparse arrays", () => {
        const arr = [1, , 3]; // eslint-disable-line no-sparse-arrays

        expect(has(arr, 1)).toBe(false);
        expect(hasKey(1)(arr)).toBe(false);
    });

    it("should convert other values for the `key` parameter to string", () => {
        const testObj = make(nonStringsAsStrings, []);

        nonStrings.forEach(key => {
            expect(has(testObj, key)).toBe(true);
            expect(hasKey(key)(testObj)).toBe(true);
        });

        expect(has({ undefined: void 0 })).toBe(true);
        expect(hasKey()({ undefined: void 0 })).toBe(true);
    });

    it("should throw an exception if called without the data argument", () => {
        expect(has).toThrow();
        expect(hasKey("foo")).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an object", () => {
        expect(() => { has(null, "a"); }).toThrow();
        expect(() => { has(void 0, "a"); }).toThrow();
        expect(() => { hasKey("a")(null); }).toThrow();
        expect(() => { hasKey("a")(void 0); }).toThrow();
    });

    it("should convert to object every other value", () => {
        wannabeEmptyObjects.forEach(value => {
            expect(has(value, "a")).toBe(false);
            expect(hasKey("a")(value)).toBe(false);
        });

        expect(has(/foo/, "lastIndex")).toBe(true);
        expect(hasKey("lastIndex")(/foo/)).toBe(true);
    });
});
