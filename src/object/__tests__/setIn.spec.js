import * as lamb from "../..";
import {
    nonStrings,
    nonStringsAsStrings,
    wannabeEmptyObjects
} from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("setIn / setKey", function () {
    var arr = [1, 2, 3];
    var sparseArr = [, 5, ,]; // eslint-disable-line comma-spacing, no-sparse-arrays
    var sparseArrCopy = sparseArr.slice();
    var baseFoo = Object.create({ a: arr }, { b: { value: 2, enumerable: true }, z: { value: 5 } });
    var foo = Object.create(baseFoo, { c: { value: 3, enumerable: true } });

    var fooEquivalent = { a: [1, 2, 3], b: 2, c: 3, z: 5 };

    afterEach(function () {
        // The "toEqual" matcher would have checked only own enumerable properties
        for (var key in fooEquivalent) {
            expect(fooEquivalent[key]).toEqual(foo[key]);
        }

        expect(foo.a).toBe(arr);
        expect(sparseArr).toStrictArrayEqual(sparseArrCopy);
    });

    it("should build a copy of the source object with all its enumerable properties and the desired key set to the provided value", function () {
        var newObjA = lamb.setIn(foo, "c", 99);
        var newObjB = lamb.setKey("a", ["a", "b"])(foo);

        expect(newObjA).toEqual({ a: [1, 2, 3], b: 2, c: 99 });
        expect(newObjA.a).toBe(arr);
        expect(newObjA.z).toBeUndefined();
        expect(newObjB).toEqual({ a: ["a", "b"], b: 2, c: 3 });
        expect(newObjB.a).not.toBe(arr);
        expect(newObjB.z).toBeUndefined();
    });

    it("should add a new property if the given key doesn't exist on the source or if it isn't enumerable", function () {
        var newObjA = lamb.setIn(foo, "z", 99);
        var newObjB = lamb.setKey("z", 0)(foo);

        expect(newObjA).toEqual({ a: [1, 2, 3], b: 2, c: 3, z: 99 });
        expect(newObjB).toEqual({ a: [1, 2, 3], b: 2, c: 3, z: 0 });
    });

    it("should transform array-like objects in objects with numbered string as properties", function () {
        expect(lamb.setIn([1, 2], "a", 99)).toEqual({ 0: 1, 1: 2, a: 99 });
        expect(lamb.setKey("a", 99)([1, 2])).toEqual({ 0: 1, 1: 2, a: 99 });
        expect(lamb.setIn("foo", "a", 99)).toEqual({ 0: "f", 1: "o", 2: "o", a: 99 });
        expect(lamb.setKey("a", 99)("foo")).toEqual({ 0: "f", 1: "o", 2: "o", a: 99 });
    });

    it("should accept integers as keys", function () {
        expect(lamb.setIn([1, 2], 1, 3)).toEqual({ 0: 1, 1: 3 });
        expect(lamb.setKey(1, 3)([1, 2])).toEqual({ 0: 1, 1: 3 });
    });

    it("should use only defined keys in sparse arrays", function () {
        var r1 = { 1: 99 };
        var r2 = { 1: 5, 2: 99 };

        expect(lamb.setIn(sparseArr, 1, 99)).toStrictEqual(r1);
        expect(lamb.setIn(sparseArr, 2, 99)).toStrictEqual(r2);
        expect(lamb.setKey(1, 99)(sparseArr)).toStrictEqual(r1);
        expect(lamb.setKey(2, 99)(sparseArr)).toStrictEqual(r2);
    });

    it("should convert other values for the `key` parameter to string", function () {
        var values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        var testObj = lamb.make(nonStringsAsStrings, values);

        nonStrings.forEach(function (key) {
            var expected = lamb.merge({}, testObj);

            expected[String(key)] = 99;

            expect(lamb.setIn(testObj, key, 99)).toEqual(expected);
            expect(lamb.setKey(key, 99)(testObj)).toEqual(expected);
        });

        expect(lamb.setIn({ a: 2 })).toStrictEqual({ a: 2, undefined: void 0 });
        expect(lamb.setKey()({ a: 2 })).toStrictEqual({ a: 2, undefined: void 0 });
    });

    it("should throw an exception if called without arguments", function () {
        expect(lamb.setIn).toThrow();
        expect(lamb.setKey()).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an object", function () {
        expect(function () { lamb.setIn(null, "a", 99); }).toThrow();
        expect(function () { lamb.setIn(void 0, "a", 99); }).toThrow();
        expect(function () { lamb.setKey("a", 99)(null); }).toThrow();
        expect(function () { lamb.setKey("a", 99)(void 0); }).toThrow();
    });

    it("should convert to object every other value", function () {
        wannabeEmptyObjects.forEach(function (value) {
            expect(lamb.setIn(value, "a", 99)).toEqual({ a: 99 });
            expect(lamb.setKey("a", 99)(value)).toEqual({ a: 99 });
        });
    });
});
