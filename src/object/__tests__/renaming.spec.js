import * as lamb from "../..";
import { nonFunctions, wannabeEmptyObjects } from "../../__tests__/commons";

describe("renameIn / rename / renameWith", function () {
    var baseObj = { "": 0, a: 1, b: 2, c: 3, d: 4 };
    var obj = Object.create(baseObj, {
        e: { value: 5, enumerable: true },
        f: { value: 6 }
    });
    var objEquivalent = { "": 0, a: 1, b: 2, c: 3, d: 4, e: 5 };

    // The "toEqual" matcher would have checked only own enumerable properties
    afterEach(function () {
        for (var key in objEquivalent) {
            expect(objEquivalent[key]).toEqual(obj[key]);
        }

        expect(obj.f).toBe(6);
    });

    describe("renameWith", function () {
        it("should use the provided function to generate a keys' map for `rename`", function () {
            var person = { NAME: "John", SURNAME: "Doe" };
            var makeLowerKeysMap = jest.fn(function (source) {
                var sourceKeys = lamb.keys(source);

                return lamb.make(sourceKeys, sourceKeys.map(lamb.invoker("toLowerCase")));
            });

            expect(lamb.renameWith(makeLowerKeysMap)(person)).toEqual({ name: "John", surname: "Doe" });
            expect(makeLowerKeysMap).toHaveBeenCalledTimes(1);
            expect(makeLowerKeysMap.mock.calls[0].length).toBe(1);
            expect(makeLowerKeysMap.mock.calls[0][0]).toBe(person);
        });

        it("should build a function throwing an exception if `fn` isn't a function or is missing", function () {
            nonFunctions.forEach(function (value) {
                expect(lamb.renameWith(value)).toThrow();
            });

            expect(lamb.renameWith()).toThrow();
        });
    });

    it("should rename the keys of the given object according to the provided keys' map", function () {
        var keysMap = { a: "w", b: "x", c: "y", d: "z" };
        var result = { "": 0, w: 1, x: 2, y: 3, z: 4, e: 5 };

        expect(lamb.renameIn(obj, keysMap)).toEqual(result);
        expect(lamb.rename(keysMap)(obj)).toEqual(result);
        expect(lamb.renameWith(lamb.always(keysMap))(obj)).toEqual(result);
    });

    it("should be possible to use existing key names", function () {
        var keysMap = { c: "x", e: "b", b: "e" };
        var result = { "": 0, a: 1, e: 2, x: 3, d: 4, b: 5 };

        expect(lamb.renameIn(obj, keysMap)).toEqual(result);
        expect(lamb.rename(keysMap)(obj)).toEqual(result);
        expect(lamb.renameWith(lamb.always(keysMap))(obj)).toEqual(result);
    });

    it("should not add non-existing keys", function () {
        var keysMap = { z: "x", y: "c" };
        var r1 = lamb.renameIn(obj, keysMap);
        var r2 = lamb.rename(keysMap)(obj);
        var r3 = lamb.renameWith(lamb.always(keysMap))(obj);

        expect(r1).toEqual(objEquivalent);
        expect(r2).toEqual(objEquivalent);
        expect(r3).toEqual(objEquivalent);
        expect(r1).not.toBe(obj);
        expect(r2).not.toBe(obj);
        expect(r3).not.toBe(obj);
    });

    it("should give priority to the map and overwrite an existing key if necessary", function () {
        var keysMap = { a: "", b: "c" };
        var result = { "": 1, c: 2, d: 4, e: 5 };

        expect(lamb.renameIn(obj, keysMap)).toEqual(result);
        expect(lamb.rename(keysMap)(obj)).toEqual(result);
        expect(lamb.renameWith(lamb.always(keysMap))(obj)).toEqual(result);
    });

    it("should return a copy of the source if the keys' map is empty or contains only non-enumerable properties", function () {
        var r1 = lamb.renameIn(obj, {});
        var r2 = lamb.rename({})(obj);
        var r3 = lamb.renameWith(lamb.always({}))(obj);
        var r4 = lamb.renameIn(obj, { f: "z" });
        var r5 = lamb.rename({ f: "z" })(obj);
        var r6 = lamb.renameWith(lamb.always({ f: "z" }))(obj);

        expect(r1).toEqual(objEquivalent);
        expect(r2).toEqual(objEquivalent);
        expect(r3).toEqual(objEquivalent);
        expect(r4).toEqual(objEquivalent);
        expect(r5).toEqual(objEquivalent);
        expect(r6).toEqual(objEquivalent);
        expect(r1).not.toBe(obj);
        expect(r2).not.toBe(obj);
        expect(r3).not.toBe(obj);
        expect(r4).not.toBe(obj);
        expect(r5).not.toBe(obj);
        expect(r6).not.toBe(obj);
    });

    it("should accept array-like objects as a source", function () {
        var arr = [1, 2, 3];
        var s = "foo";
        var keysMap = { 0: "a", 1: "b", 2: "c" };
        var r1 = { a: 1, b: 2, c: 3 };
        var r2 = { a: "f", b: "o", c: "o" };

        expect(lamb.renameIn(arr, keysMap)).toEqual(r1);
        expect(lamb.renameIn(s, keysMap)).toEqual(r2);
        expect(lamb.rename(keysMap)(arr)).toEqual(r1);
        expect(lamb.rename(keysMap)(s)).toEqual(r2);
        expect(lamb.renameWith(lamb.always(keysMap))(arr)).toEqual(r1);
        expect(lamb.renameWith(lamb.always(keysMap))(s)).toEqual(r2);
    });

    it("should not consider unassigned or deleted indexes when the source is a sparse array", function () {
        var arr = [1, , 3]; // eslint-disable-line no-sparse-arrays
        var keysMap = { 0: "a", 1: "b", 2: "c" };
        var result = { a: 1, c: 3 };

        expect(lamb.renameIn(arr, keysMap)).toStrictEqual(result);
        expect(lamb.rename(keysMap)(arr)).toStrictEqual(result);
        expect(lamb.renameWith(lamb.always(keysMap))(arr)).toStrictEqual(result);
    });

    it("should accept array-like objects as key maps", function () {
        var arr = [1, 2, 3];
        var s = "bar";
        var someObj = { 0: "a", 1: "b", 2: "c" };
        var r1 = { 1: "a", 2: "b", 3: "c" };
        var r2 = { b: "a", a: "b", r: "c" };

        expect(lamb.renameIn(someObj, arr)).toEqual(r1);
        expect(lamb.renameIn(someObj, s)).toEqual(r2);
        expect(lamb.rename(arr)(someObj)).toEqual(r1);
        expect(lamb.rename(s)(someObj)).toEqual(r2);
        expect(lamb.renameWith(lamb.always(arr))(someObj)).toEqual(r1);
        expect(lamb.renameWith(lamb.always(s))(someObj)).toEqual(r2);
    });

    it("should not consider unassigned or deleted indexes when a sparse array is supplied as a key map", function () {
        var someObj = { 0: "a", 1: "b", 2: "c" };
        var arrKeyMap = [1, , 3]; // eslint-disable-line no-sparse-arrays
        var result = { 1: "a", 3: "c" };

        expect(lamb.renameIn(someObj, arrKeyMap)).toStrictEqual(result);
        expect(lamb.rename(arrKeyMap)(someObj)).toStrictEqual(result);
        expect(lamb.renameWith(lamb.always(arrKeyMap))(someObj)).toStrictEqual(result);
    });

    it("should return a copy of the source object for any other value passed as the keys' map", function () {
        wannabeEmptyObjects.forEach(function (value) {
            var r1 = lamb.renameIn(obj, value);
            var r2 = lamb.rename(value)(obj);
            var r3 = lamb.renameWith(lamb.always(value))(obj);

            expect(r1).toEqual(objEquivalent);
            expect(r2).toEqual(objEquivalent);
            expect(r3).toEqual(objEquivalent);
            expect(r1).not.toBe(obj);
            expect(r2).not.toBe(obj);
            expect(r3).not.toBe(obj);
        });
    });

    it("should throw an exception if called without the source or the keys' map", function () {
        expect(lamb.renameIn).toThrow();
        expect(lamb.rename()).toThrow();
        expect(lamb.renameWith(lamb.always({}))).toThrow();
    });

    it("should throw an exception if the source is `null` or `undefined`", function () {
        expect(function () { lamb.renameIn(null, {}); }).toThrow();
        expect(function () { lamb.renameIn(void 0, {}); }).toThrow();
        expect(function () { lamb.rename({})(null); }).toThrow();
        expect(function () { lamb.rename({})(void 0); }).toThrow();
        expect(function () { lamb.renameWith(lamb.always({}))(null); }).toThrow();
        expect(function () { lamb.renameWith(lamb.always({}))(void 0); }).toThrow();
    });

    it("should return an empty object for any other value passed as the source object", function () {
        wannabeEmptyObjects.forEach(function (value) {
            expect(lamb.renameIn(value, { 0: 9 })).toEqual({});
            expect(lamb.rename({ 0: 9 })(value)).toEqual({});
            expect(lamb.renameWith(lamb.always({ 0: 9 }))(value)).toEqual({});
        });
    });
});
