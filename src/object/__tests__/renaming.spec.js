import always from "../../core/always";
import invoke from "../../function/invoke";
import keys from "../keys";
import make from "../make";
import rename from "../rename";
import renameIn from "../renameIn";
import renameWith from "../renameWith";
import { nonFunctions, wannabeEmptyObjects } from "../../__tests__/commons";

describe("renameIn / rename / renameWith", () => {
    const baseObj = { "": 0, a: 1, b: 2, c: 3, d: 4 };
    const obj = Object.create(baseObj, {
        e: { value: 5, enumerable: true },
        f: { value: 6 }
    });
    const objEquivalent = { "": 0, a: 1, b: 2, c: 3, d: 4, e: 5 };

    // The "toStrictEqual" matcher would have checked only own enumerable properties
    afterEach(() => {
        for (const key in objEquivalent) {
            expect(objEquivalent[key]).toStrictEqual(obj[key]);
        }

        expect(obj.f).toBe(6);
    });

    describe("renameWith", () => {
        it("should use the provided function to generate a keys' map for `rename`", () => {
            const person = { NAME: "John", SURNAME: "Doe" };
            const makeLowerKeysMap = jest.fn(source => {
                const sourceKeys = keys(source);

                return make(sourceKeys, sourceKeys.map(invoke("toLowerCase")));
            });

            expect(renameWith(makeLowerKeysMap)(person)).toStrictEqual({ name: "John", surname: "Doe" });
            expect(makeLowerKeysMap).toHaveBeenCalledTimes(1);
            expect(makeLowerKeysMap.mock.calls[0].length).toBe(1);
            expect(makeLowerKeysMap.mock.calls[0][0]).toBe(person);
        });

        it("should build a function throwing an exception if `fn` isn't a function or is missing", () => {
            nonFunctions.forEach(value => {
                expect(renameWith(value)).toThrow();
            });

            expect(renameWith()).toThrow();
        });
    });

    it("should rename the keys of the given object according to the provided keys' map", () => {
        const keysMap = { a: "w", b: "x", c: "y", d: "z" };
        const result = { "": 0, w: 1, x: 2, y: 3, z: 4, e: 5 };

        expect(renameIn(obj, keysMap)).toStrictEqual(result);
        expect(rename(keysMap)(obj)).toStrictEqual(result);
        expect(renameWith(always(keysMap))(obj)).toStrictEqual(result);
    });

    it("should be possible to use existing key names", () => {
        const keysMap = { c: "x", e: "b", b: "e" };
        const result = { "": 0, a: 1, e: 2, x: 3, d: 4, b: 5 };

        expect(renameIn(obj, keysMap)).toStrictEqual(result);
        expect(rename(keysMap)(obj)).toStrictEqual(result);
        expect(renameWith(always(keysMap))(obj)).toStrictEqual(result);
    });

    it("should not add non-existing keys", () => {
        const keysMap = { z: "x", y: "c" };
        const r1 = renameIn(obj, keysMap);
        const r2 = rename(keysMap)(obj);
        const r3 = renameWith(always(keysMap))(obj);

        expect(r1).toStrictEqual(objEquivalent);
        expect(r2).toStrictEqual(objEquivalent);
        expect(r3).toStrictEqual(objEquivalent);
        expect(r1).not.toBe(obj);
        expect(r2).not.toBe(obj);
        expect(r3).not.toBe(obj);
    });

    it("should give priority to the map and overwrite an existing key if necessary", () => {
        const keysMap = { a: "", b: "c" };
        const result = { "": 1, c: 2, d: 4, e: 5 };

        expect(renameIn(obj, keysMap)).toStrictEqual(result);
        expect(rename(keysMap)(obj)).toStrictEqual(result);
        expect(renameWith(always(keysMap))(obj)).toStrictEqual(result);
    });

    it("should return a copy of the source if the keys' map is empty or contains only non-enumerable properties", () => {
        const r1 = renameIn(obj, {});
        const r2 = rename({})(obj);
        const r3 = renameWith(always({}))(obj);
        const r4 = renameIn(obj, { f: "z" });
        const r5 = rename({ f: "z" })(obj);
        const r6 = renameWith(always({ f: "z" }))(obj);

        expect(r1).toStrictEqual(objEquivalent);
        expect(r2).toStrictEqual(objEquivalent);
        expect(r3).toStrictEqual(objEquivalent);
        expect(r4).toStrictEqual(objEquivalent);
        expect(r5).toStrictEqual(objEquivalent);
        expect(r6).toStrictEqual(objEquivalent);
        expect(r1).not.toBe(obj);
        expect(r2).not.toBe(obj);
        expect(r3).not.toBe(obj);
        expect(r4).not.toBe(obj);
        expect(r5).not.toBe(obj);
        expect(r6).not.toBe(obj);
    });

    it("should accept array-like objects as a source", () => {
        const arr = [1, 2, 3];
        const s = "foo";
        const keysMap = { 0: "a", 1: "b", 2: "c" };
        const r1 = { a: 1, b: 2, c: 3 };
        const r2 = { a: "f", b: "o", c: "o" };

        expect(renameIn(arr, keysMap)).toStrictEqual(r1);
        expect(renameIn(s, keysMap)).toStrictEqual(r2);
        expect(rename(keysMap)(arr)).toStrictEqual(r1);
        expect(rename(keysMap)(s)).toStrictEqual(r2);
        expect(renameWith(always(keysMap))(arr)).toStrictEqual(r1);
        expect(renameWith(always(keysMap))(s)).toStrictEqual(r2);
    });

    it("should not consider unassigned or deleted indexes when the source is a sparse array", () => {
        const arr = [1, , 3]; // eslint-disable-line no-sparse-arrays
        const keysMap = { 0: "a", 1: "b", 2: "c" };
        const result = { a: 1, c: 3 };

        expect(renameIn(arr, keysMap)).toStrictEqual(result);
        expect(rename(keysMap)(arr)).toStrictEqual(result);
        expect(renameWith(always(keysMap))(arr)).toStrictEqual(result);
    });

    it("should accept array-like objects as key maps", () => {
        const arr = [1, 2, 3];
        const s = "bar";
        const someObj = { 0: "a", 1: "b", 2: "c" };
        const r1 = { 1: "a", 2: "b", 3: "c" };
        const r2 = { b: "a", a: "b", r: "c" };

        expect(renameIn(someObj, arr)).toStrictEqual(r1);
        expect(renameIn(someObj, s)).toStrictEqual(r2);
        expect(rename(arr)(someObj)).toStrictEqual(r1);
        expect(rename(s)(someObj)).toStrictEqual(r2);
        expect(renameWith(always(arr))(someObj)).toStrictEqual(r1);
        expect(renameWith(always(s))(someObj)).toStrictEqual(r2);
    });

    it("should not consider unassigned or deleted indexes when a sparse array is supplied as a key map", () => {
        const someObj = { 0: "a", 1: "b", 2: "c" };
        const arrKeyMap = [1, , 3]; // eslint-disable-line no-sparse-arrays
        const result = { 1: "a", 3: "c" };

        expect(renameIn(someObj, arrKeyMap)).toStrictEqual(result);
        expect(rename(arrKeyMap)(someObj)).toStrictEqual(result);
        expect(renameWith(always(arrKeyMap))(someObj)).toStrictEqual(result);
    });

    it("should return a copy of the source object for any other value passed as the keys' map", () => {
        wannabeEmptyObjects.forEach(value => {
            const r1 = renameIn(obj, value);
            const r2 = rename(value)(obj);
            const r3 = renameWith(always(value))(obj);

            expect(r1).toStrictEqual(objEquivalent);
            expect(r2).toStrictEqual(objEquivalent);
            expect(r3).toStrictEqual(objEquivalent);
            expect(r1).not.toBe(obj);
            expect(r2).not.toBe(obj);
            expect(r3).not.toBe(obj);
        });
    });

    it("should throw an exception if called without the source or the keys' map", () => {
        expect(renameIn).toThrow();
        expect(rename()).toThrow();
        expect(renameWith(always({}))).toThrow();
    });

    it("should throw an exception if the source is `null` or `undefined`", () => {
        expect(() => { renameIn(null, {}); }).toThrow();
        expect(() => { renameIn(void 0, {}); }).toThrow();
        expect(() => { rename({})(null); }).toThrow();
        expect(() => { rename({})(void 0); }).toThrow();
        expect(() => { renameWith(always({}))(null); }).toThrow();
        expect(() => { renameWith(always({}))(void 0); }).toThrow();
    });

    it("should return an empty object for any other value passed as the source object", () => {
        wannabeEmptyObjects.forEach(value => {
            expect(renameIn(value, { 0: 9 })).toStrictEqual({});
            expect(rename({ 0: 9 })(value)).toStrictEqual({});
            expect(renameWith(always({ 0: 9 }))(value)).toStrictEqual({});
        });
    });
});
