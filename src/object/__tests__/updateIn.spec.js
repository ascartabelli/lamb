import always from "../../core/always";
import invoke from "../../function/invoke";
import make from "../make";
import mapWith from "../../core/mapWith";
import merge from "../merge";
import updateIn from "../updateIn";
import updateKey from "../updateKey";
import {
    nonFunctions,
    nonStrings,
    nonStringsAsStrings,
    wannabeEmptyObjects
} from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("updateIn / updateKey", () => {
    const arr = [1, 2, 3];
    const sparseArr = [, 5, ,]; // eslint-disable-line comma-spacing, no-sparse-arrays
    const sparseArrCopy = sparseArr.slice();
    const baseFoo = Object.create({ a: arr }, { b: { value: 2, enumerable: true }, z: { value: 5 } });
    const foo = Object.create(baseFoo, { c: { value: 3, enumerable: true } });

    const fooEquivalent = { a: [1, 2, 3], b: 2, c: 3, z: 5 };
    const fooEnumerables = { a: [1, 2, 3], b: 2, c: 3 };

    // The "toStrictEqual" matcher would have checked only own enumerable properties
    afterEach(() => {
        for (const key in fooEquivalent) {
            expect(fooEquivalent[key]).toStrictEqual(foo[key]);
        }

        expect(foo.a).toBe(arr);
        expect(sparseArr).toStrictArrayEqual(sparseArrCopy);
    });

    it("should build a copy of the source object with all its enumerable properties and the desired key updated according to the received function", () => {
        const makeDoubles = jest.fn(mapWith(n => n * 2));
        const newObjA = updateIn(foo, "a", makeDoubles);
        const newObjB = updateKey("a", makeDoubles)(foo);
        const result = { a: [2, 4, 6], b: 2, c: 3 };

        expect(newObjA).toStrictEqual(result);
        expect(newObjB).toStrictEqual(result);
        expect(makeDoubles).toHaveBeenCalledTimes(2);
        expect(makeDoubles).toHaveBeenNthCalledWith(1, arr);
        expect(makeDoubles).toHaveBeenNthCalledWith(2, arr);

        const o = { a: 1, b: void 0 };

        expect(updateIn(o, "b", always(99))).toStrictEqual({ a: 1, b: 99 });
        expect(updateKey("b", always(99))(o)).toStrictEqual({ a: 1, b: 99 });
    });

    it("should transform array-like objects in objects with numbered string as properties", () => {
        const fn = always(99);

        expect(updateIn([1, 2], "1", fn)).toStrictEqual({ 0: 1, 1: 99 });
        expect(updateKey("1", fn)([1, 2])).toStrictEqual({ 0: 1, 1: 99 });
        expect(updateIn("foo", "1", fn)).toStrictEqual({ 0: "f", 1: 99, 2: "o" });
        expect(updateKey("1", fn)("foo")).toStrictEqual({ 0: "f", 1: 99, 2: "o" });
    });

    it("should not add a new property if the given key doesn't exist on the source, and return a copy of the source instead", () => {
        const newObjA = updateIn(foo, "xyz", always(99));
        const newObjB = updateKey("xyz", always(99))(foo);
        const newObjC = updateKey("xyz", always(99))([1]);

        expect(newObjA).toStrictEqual(fooEnumerables);
        expect(newObjA).not.toBe(foo);
        expect(newObjB).toStrictEqual(fooEnumerables);
        expect(newObjB).not.toBe(foo);
        expect(newObjC).toStrictEqual({ 0: 1 });
    });

    it("should not allow to update a non-enumerable property, and return a copy of the source instead, as with non-existent keys", () => {
        const newObjA = updateIn(foo, "z", always(99));
        const newObjB = updateKey("z", always(99))(foo);

        expect(newObjA).toStrictEqual(fooEnumerables);
        expect(newObjA).not.toBe(foo);
        expect(newObjB).toStrictEqual(fooEnumerables);
        expect(newObjB).not.toBe(foo);
    });

    it("should check the validity of the destination key before trying to apply the received function to it", () => {
        const o = { a: 1 };
        const toUpperCase = invoke("toUpperCase");

        expect(updateIn(o, "z", toUpperCase)).toStrictEqual({ a: 1 });
        expect(updateKey("z", toUpperCase)(o)).toStrictEqual({ a: 1 });
    });

    it("should accept integers as keys", () => {
        const inc = n => ++n;

        expect(updateIn([1, 2], 1, inc)).toStrictEqual({ 0: 1, 1: 3 });
        expect(updateKey(1, inc)([1, 2])).toStrictEqual({ 0: 1, 1: 3 });
    });

    it("should use only defined keys in sparse arrays", () => {
        const fn99 = always(99);
        const r1 = { 1: 99 };
        const r2 = { 1: 5 };

        expect(updateIn(sparseArr, 1, fn99)).toStrictEqual(r1);
        expect(updateIn(sparseArr, 2, fn99)).toStrictEqual(r2);
        expect(updateKey(1, fn99)(sparseArr)).toStrictEqual(r1);
        expect(updateKey(2, fn99)(sparseArr)).toStrictEqual(r2);
    });

    it("should convert other values for the `key` parameter to string", () => {
        const values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        const testObj = make(nonStringsAsStrings, values);

        nonStrings.forEach(key => {
            const expected = merge(testObj, {});

            expected[String(key)] = 99;

            expect(updateIn(testObj, key, always(99))).toStrictEqual(expected);
            expect(updateKey(key, always(99))(testObj)).toStrictEqual(expected);
        });
    });

    it("should throw an exception if the `updater` isn't a function or if is missing", () => {
        nonFunctions.forEach(value => {
            expect(() => { updateIn({ a: 2 }, "a", value); }).toThrow();
            expect(() => { updateKey("a", value)({ a: 2 }); }).toThrow();
        });

        expect(() => { updateIn({ a: 2 }, "a"); }).toThrow();
        expect(() => { updateKey("a")({ a: 2 }); }).toThrow();
    });

    it("should throw an exception if called without arguments", () => {
        expect(updateIn).toThrow();
        expect(updateKey()).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an object", () => {
        expect(() => { updateIn(null, "a", always(99)); }).toThrow();
        expect(() => { updateIn(void 0, "a", always(99)); }).toThrow();
        expect(() => { updateKey("a", always(99))(null); }).toThrow();
        expect(() => { updateKey("a", always(99))(void 0); }).toThrow();
    });

    it("should convert to object every other value", () => {
        wannabeEmptyObjects.forEach(value => {
            expect(updateIn(value, "a", always(99))).toStrictEqual({});
            expect(updateKey("a", always(99))(value)).toStrictEqual({});
        });
    });
});
