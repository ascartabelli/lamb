import make from "../make";
import merge from "../merge";
import setIn from "../setIn";
import setKey from "../setKey";
import {
    nonStrings,
    nonStringsAsStrings,
    wannabeEmptyObjects
} from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("setIn / setKey", () => {
    const arr = [1, 2, 3];
    const sparseArr = [, 5, ,]; // eslint-disable-line comma-spacing, no-sparse-arrays
    const sparseArrCopy = sparseArr.slice();
    const baseFoo = Object.create({ a: arr }, { b: { value: 2, enumerable: true }, z: { value: 5 } });
    const foo = Object.create(baseFoo, { c: { value: 3, enumerable: true } });

    const fooEquivalent = { a: [1, 2, 3], b: 2, c: 3, z: 5 };

    afterEach(() => {
        // The "toStrictEqual" matcher would have checked only own enumerable properties
        for (const key in fooEquivalent) {
            expect(fooEquivalent[key]).toStrictEqual(foo[key]);
        }

        expect(foo.a).toBe(arr);
        expect(sparseArr).toStrictArrayEqual(sparseArrCopy);
    });

    it("should build a copy of the source object with all its enumerable properties and the desired key set to the provided value", () => {
        const newObjA = setIn(foo, "c", 99);
        const newObjB = setKey("a", ["a", "b"])(foo);

        expect(newObjA).toStrictEqual({ a: [1, 2, 3], b: 2, c: 99 });
        expect(newObjA.a).toBe(arr);
        expect(newObjA.z).toBeUndefined();
        expect(newObjB).toStrictEqual({ a: ["a", "b"], b: 2, c: 3 });
        expect(newObjB.a).not.toBe(arr);
        expect(newObjB.z).toBeUndefined();
    });

    it("should add a new property if the given key doesn't exist on the source or if it isn't enumerable", () => {
        const newObjA = setIn(foo, "z", 99);
        const newObjB = setKey("z", 0)(foo);

        expect(newObjA).toStrictEqual({ a: [1, 2, 3], b: 2, c: 3, z: 99 });
        expect(newObjB).toStrictEqual({ a: [1, 2, 3], b: 2, c: 3, z: 0 });
    });

    it("should transform array-like objects in objects with numbered string as properties", () => {
        expect(setIn([1, 2], "a", 99)).toStrictEqual({ 0: 1, 1: 2, a: 99 });
        expect(setKey("a", 99)([1, 2])).toStrictEqual({ 0: 1, 1: 2, a: 99 });
        expect(setIn("foo", "a", 99)).toStrictEqual({ 0: "f", 1: "o", 2: "o", a: 99 });
        expect(setKey("a", 99)("foo")).toStrictEqual({ 0: "f", 1: "o", 2: "o", a: 99 });
    });

    it("should accept integers as keys", () => {
        expect(setIn([1, 2], 1, 3)).toStrictEqual({ 0: 1, 1: 3 });
        expect(setKey(1, 3)([1, 2])).toStrictEqual({ 0: 1, 1: 3 });
    });

    it("should use only defined keys in sparse arrays", () => {
        const r1 = { 1: 99 };
        const r2 = { 1: 5, 2: 99 };

        expect(setIn(sparseArr, 1, 99)).toStrictEqual(r1);
        expect(setIn(sparseArr, 2, 99)).toStrictEqual(r2);
        expect(setKey(1, 99)(sparseArr)).toStrictEqual(r1);
        expect(setKey(2, 99)(sparseArr)).toStrictEqual(r2);
    });

    it("should convert other values for the `key` parameter to string", () => {
        const values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        const testObj = make(nonStringsAsStrings, values);

        nonStrings.forEach(key => {
            const expected = merge({}, testObj);

            expected[String(key)] = 99;

            expect(setIn(testObj, key, 99)).toStrictEqual(expected);
            expect(setKey(key, 99)(testObj)).toStrictEqual(expected);
        });

        expect(setIn({ a: 2 })).toStrictEqual({ a: 2, undefined: void 0 });
        expect(setKey()({ a: 2 })).toStrictEqual({ a: 2, undefined: void 0 });
    });

    it("should throw an exception if called without arguments", () => {
        expect(setIn).toThrow();
        expect(setKey()).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an object", () => {
        expect(() => { setIn(null, "a", 99); }).toThrow();
        expect(() => { setIn(void 0, "a", 99); }).toThrow();
        expect(() => { setKey("a", 99)(null); }).toThrow();
        expect(() => { setKey("a", 99)(void 0); }).toThrow();
    });

    it("should convert to object every other value", () => {
        wannabeEmptyObjects.forEach(value => {
            expect(setIn(value, "a", 99)).toStrictEqual({ a: 99 });
            expect(setKey("a", 99)(value)).toStrictEqual({ a: 99 });
        });
    });
});
