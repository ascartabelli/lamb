import * as lamb from "../..";
import {
    nonFunctions,
    nonStrings,
    nonStringsAsStrings,
    wannabeEmptyObjects
} from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("updateIn / updateKey", function () {
    var arr = [1, 2, 3];
    var sparseArr = [, 5, ,]; // eslint-disable-line comma-spacing, no-sparse-arrays
    var sparseArrCopy = sparseArr.slice();
    var baseFoo = Object.create({ a: arr }, { b: { value: 2, enumerable: true }, z: { value: 5 } });
    var foo = Object.create(baseFoo, { c: { value: 3, enumerable: true } });

    var fooEquivalent = { a: [1, 2, 3], b: 2, c: 3, z: 5 };
    var fooEnumerables = { a: [1, 2, 3], b: 2, c: 3 };

    // The "toEqual" matcher would have checked only own enumerable properties
    afterEach(function () {
        for (var key in fooEquivalent) {
            expect(fooEquivalent[key]).toEqual(foo[key]);
        }

        expect(foo.a).toBe(arr);
        expect(sparseArr).toStrictArrayEqual(sparseArrCopy);
    });

    it("should build a copy of the source object with all its enumerable properties and the desired key updated according to the received function", function () {
        var makeDoubles = jest.fn(lamb.mapWith(function (n) { return n * 2; }));
        var newObjA = lamb.updateIn(foo, "a", makeDoubles);
        var newObjB = lamb.updateKey("a", makeDoubles)(foo);
        var result = { a: [2, 4, 6], b: 2, c: 3 };

        expect(newObjA).toEqual(result);
        expect(newObjB).toEqual(result);
        expect(makeDoubles).toHaveBeenCalledTimes(2);
        expect(makeDoubles.mock.calls[0].length).toBe(1);
        expect(makeDoubles.mock.calls[0][0]).toBe(arr);
        expect(makeDoubles.mock.calls[1].length).toBe(1);
        expect(makeDoubles.mock.calls[1][0]).toBe(arr);

        var o = { a: 1, b: void 0 };

        expect(lamb.updateIn(o, "b", lamb.always(99))).toEqual({ a: 1, b: 99 });
        expect(lamb.updateKey("b", lamb.always(99))(o)).toEqual({ a: 1, b: 99 });
    });

    it("should transform array-like objects in objects with numbered string as properties", function () {
        var fn = lamb.always(99);

        expect(lamb.updateIn([1, 2], "1", fn)).toEqual({ 0: 1, 1: 99 });
        expect(lamb.updateKey("1", fn)([1, 2])).toEqual({ 0: 1, 1: 99 });
        expect(lamb.updateIn("foo", "1", fn)).toEqual({ 0: "f", 1: 99, 2: "o" });
        expect(lamb.updateKey("1", fn)("foo")).toEqual({ 0: "f", 1: 99, 2: "o" });
    });

    it("should not add a new property if the given key doesn't exist on the source, and return a copy of the source instead", function () {
        var newObjA = lamb.updateIn(foo, "xyz", lamb.always(99));
        var newObjB = lamb.updateKey("xyz", lamb.always(99))(foo);
        var newObjC = lamb.updateKey("xyz", lamb.always(99))([1]);

        expect(newObjA).toEqual(fooEnumerables);
        expect(newObjA).not.toBe(foo);
        expect(newObjB).toEqual(fooEnumerables);
        expect(newObjB).not.toBe(foo);
        expect(newObjC).toEqual({ 0: 1 });
    });

    it("should not allow to update a non-enumerable property, and return a copy of the source instead, as with non-existent keys", function () {
        var newObjA = lamb.updateIn(foo, "z", lamb.always(99));
        var newObjB = lamb.updateKey("z", lamb.always(99))(foo);

        expect(newObjA).toEqual(fooEnumerables);
        expect(newObjA).not.toBe(foo);
        expect(newObjB).toEqual(fooEnumerables);
        expect(newObjB).not.toBe(foo);
    });

    it("should check the validity of the destination key before trying to apply the received function to it", function () {
        var o = { a: 1 };
        var toUpperCase = lamb.invoker("toUpperCase");

        expect(lamb.updateIn(o, "z", toUpperCase)).toEqual({ a: 1 });
        expect(lamb.updateKey("z", toUpperCase)(o)).toEqual({ a: 1 });
    });

    it("should accept integers as keys", function () {
        var inc = function (n) { return ++n; };

        expect(lamb.updateIn([1, 2], 1, inc)).toEqual({ 0: 1, 1: 3 });
        expect(lamb.updateKey(1, inc)([1, 2])).toEqual({ 0: 1, 1: 3 });
    });

    it("should use only defined keys in sparse arrays", function () {
        var fn99 = lamb.always(99);
        var r1 = { 1: 99 };
        var r2 = { 1: 5 };

        expect(lamb.updateIn(sparseArr, 1, fn99)).toStrictEqual(r1);
        expect(lamb.updateIn(sparseArr, 2, fn99)).toStrictEqual(r2);
        expect(lamb.updateKey(1, fn99)(sparseArr)).toStrictEqual(r1);
        expect(lamb.updateKey(2, fn99)(sparseArr)).toStrictEqual(r2);
    });

    it("should convert other values for the `key` parameter to string", function () {
        var values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        var testObj = lamb.make(nonStringsAsStrings, values);

        nonStrings.forEach(function (key) {
            var expected = lamb.merge(testObj, {});

            expected[String(key)] = 99;

            expect(lamb.updateIn(testObj, key, lamb.always(99))).toEqual(expected);
            expect(lamb.updateKey(key, lamb.always(99))(testObj)).toEqual(expected);
        });
    });

    it("should throw an exception if the `updater` isn't a function or if is missing", function () {
        nonFunctions.forEach(function (value) {
            expect(function () { lamb.updateIn({ a: 2 }, "a", value); }).toThrow();
            expect(function () { lamb.updateKey("a", value)({ a: 2 }); }).toThrow();
        });

        expect(function () { lamb.updateIn({ a: 2 }, "a"); }).toThrow();
        expect(function () { lamb.updateKey("a")({ a: 2 }); }).toThrow();
    });

    it("should throw an exception if called without arguments", function () {
        expect(lamb.updateIn).toThrow();
        expect(lamb.updateKey()).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an object", function () {
        expect(function () { lamb.updateIn(null, "a", lamb.always(99)); }).toThrow();
        expect(function () { lamb.updateIn(void 0, "a", lamb.always(99)); }).toThrow();
        expect(function () { lamb.updateKey("a", lamb.always(99))(null); }).toThrow();
        expect(function () { lamb.updateKey("a", lamb.always(99))(void 0); }).toThrow();
    });

    it("should convert to object every other value", function () {
        wannabeEmptyObjects.forEach(function (value) {
            expect(lamb.updateIn(value, "a", lamb.always(99))).toEqual({});
            expect(lamb.updateKey("a", lamb.always(99))(value)).toEqual({});
        });
    });
});
