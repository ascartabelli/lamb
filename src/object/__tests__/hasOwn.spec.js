import hasOwn from "../hasOwn";
import hasOwnKey from "../hasOwnKey";
import make from "../make";
import {
    nonStrings,
    nonStringsAsStrings,
    wannabeEmptyObjects
} from "../../__tests__/commons";

describe("hasOwn / hasOwnKey", () => {
    const obj = { foo: "bar" };

    it("should check the existence of an owned property in an object", () => {
        expect(hasOwn(obj, "toString")).toBe(false);
        expect(hasOwn(obj, "foo")).toBe(true);
        expect(hasOwnKey("toString")(obj)).toBe(false);
        expect(hasOwnKey("foo")(obj)).toBe(true);
    });

    it("should return `false` for a non-existent property", () => {
        expect(hasOwn(obj, "baz")).toBe(false);
        expect(hasOwnKey("baz")(obj)).toBe(false);
    });

    it("should accept integers as keys and accept array-like objects", () => {
        const o = { 1: "a", 2: "b" };
        const arr = [1, 2, 3, 4];
        const s = "abcd";

        expect(hasOwn(o, 2)).toBe(true);
        expect(hasOwn(arr, 2)).toBe(true);
        expect(hasOwn(s, 2)).toBe(true);
        expect(hasOwnKey(2)(o)).toBe(true);
        expect(hasOwnKey(2)(arr)).toBe(true);
        expect(hasOwnKey(2)(s)).toBe(true);
    });

    it("should consider only defined indexes in sparse arrays", () => {
        const arr = [1, , 3]; // eslint-disable-line no-sparse-arrays

        expect(hasOwn(arr, 1)).toBe(false);
        expect(hasOwnKey(1)(arr)).toBe(false);
    });

    it("should convert other values for the `key` parameter to string", () => {
        const testObj = make(nonStringsAsStrings, []);

        nonStrings.forEach(key => {
            expect(hasOwn(testObj, key)).toBe(true);
            expect(hasOwnKey(key)(testObj)).toBe(true);
        });

        expect(hasOwn({ undefined: void 0 })).toBe(true);
        expect(hasOwnKey()({ undefined: void 0 })).toBe(true);
    });

    it("should throw an exception if called without the data argument", () => {
        expect(hasOwn).toThrow();
        expect(hasOwnKey("foo")).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an object", () => {
        expect(() => { hasOwn(null, "a"); }).toThrow();
        expect(() => { hasOwn(void 0, "a"); }).toThrow();
        expect(() => { hasOwnKey("a")(null); }).toThrow();
        expect(() => { hasOwnKey("a")(void 0); }).toThrow();
    });

    it("should return convert to object every other value", () => {
        wannabeEmptyObjects.forEach(value => {
            expect(hasOwn(value, "a")).toBe(false);
            expect(hasOwnKey("a")(value)).toBe(false);
        });

        expect(hasOwn(/foo/, "lastIndex")).toBe(true);
        expect(hasOwnKey("lastIndex")(/foo/)).toBe(true);
    });
});
