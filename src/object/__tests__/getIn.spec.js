import getIn from "../getIn";
import getKey from "../getKey";
import make from "../make";
import range from "../../math/range";
import {
    nonStrings,
    nonStringsAsStrings,
    wannabeEmptyObjects
} from "../../__tests__/commons";

describe("getIn / getKey", () => {
    const obj = { foo: 1, bar: 2, baz: 3 };

    Object.defineProperty(obj, "qux", { value: 4 });

    it("should return the value of the given object property", () => {
        expect(getIn(obj, "bar")).toBe(2);
        expect(getKey("foo")(obj)).toBe(1);
    });

    it("should return `undefined` for a non-existent property", () => {
        expect(getIn(obj, "a")).toBeUndefined();
        expect(getKey("z")(obj)).toBeUndefined();
    });

    it("should be able to retrieve non-enumerable properties", () => {
        expect(getIn(obj, "qux")).toBe(4);
        expect(getKey("qux")(obj)).toBe(4);
    });

    it("should accept integers as keys and accept array-like objects", () => {
        const o = { 1: "a", 2: "b" };
        const arr = [1, 2, 3, 4];
        const s = "abcd";

        expect(getIn(o, 1)).toBe("a");
        expect(getKey(2)(o)).toBe("b");
        expect(getIn(arr, 1)).toBe(2);
        expect(getKey(2)(arr)).toBe(3);
        expect(getIn(s, 1)).toBe("b");
        expect(getKey(2)(s)).toBe("c");
    });

    it("should work with sparse arrays", () => {
        const sparseArr = Array(3);

        sparseArr[1] = 99;

        expect(getIn(sparseArr, 1)).toBe(99);
        expect(getIn(sparseArr, 2)).toBeUndefined();
        expect(getKey(1)(sparseArr)).toBe(99);
        expect(getKey(2)(sparseArr)).toBeUndefined();
    });

    it("should convert other values for the `key` parameter to string", () => {
        const values = range(0, nonStringsAsStrings.length, 1);
        const testObj = make(nonStringsAsStrings, values);

        nonStrings.forEach(key => {
            const value = values[nonStringsAsStrings.indexOf(String(key))];

            expect(getIn(testObj, key)).toBe(value);
            expect(getKey(key)(testObj)).toBe(value);
        });

        const idx = nonStringsAsStrings.indexOf("undefined");

        expect(getIn(testObj)).toBe(idx);
        expect(getKey()(testObj)).toBe(idx);
    });

    it("should throw an exception if called without the data argument", () => {
        expect(getIn).toThrow();
        expect(getKey("a")).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an object", () => {
        expect(() => { getIn(null, "a"); }).toThrow();
        expect(() => { getIn(void 0, "a"); }).toThrow();
        expect(() => { getKey("a")(null); }).toThrow();
        expect(() => { getKey("a")(void 0); }).toThrow();
    });

    it("should return convert to object every other value", () => {
        wannabeEmptyObjects.forEach(value => {
            expect(getIn(value, "a")).toBeUndefined();
            expect(getKey("a")(value)).toBeUndefined();
        });

        expect(getIn(/foo/, "lastIndex")).toBe(0);
        expect(getKey("lastIndex")(/foo/)).toBe(0);
    });
});
