import * as lamb from "../..";
import { wannabeEmptyObjects } from "../../__tests__/commons";

describe("ownValues / values", function () {
    var baseFoo = Object.create({ a: 1 }, { b: { value: 2 } });
    var foo = Object.create(baseFoo, {
        c: { value: 3 },
        d: { value: 4, enumerable: true }
    });

    it("should return an array of values of the given object properties", function () {
        var source = { a: 1, b: 2, c: 3 };
        var result = [1, 2, 3];

        expect(lamb.ownValues(source)).toEqual(result);
        expect(lamb.values(source)).toEqual(result);
    });

    it("should accept array-like objects, returning an array copy of their values", function () {
        expect(lamb.ownValues([1, 2, 3])).toEqual([1, 2, 3]);
        expect(lamb.ownValues("abc")).toEqual(["a", "b", "c"]);
        expect(lamb.values([1, 2, 3])).toEqual([1, 2, 3]);
        expect(lamb.values("abc")).toEqual(["a", "b", "c"]);
    });

    it("should keep `undefined` values in the result", function () {
        var source = { a: null, b: void 0 };
        var result = [null, void 0];

        expect(lamb.ownValues(source)).toStrictEqual(result);
        expect(lamb.values(source)).toStrictEqual(result);
    });

    it("should throw an exception if called without arguments", function () {
        expect(lamb.ownValues).toThrow();
        expect(lamb.values).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined`", function () {
        expect(function () { lamb.ownValues(null); }).toThrow();
        expect(function () { lamb.ownValues(void 0); }).toThrow();
        expect(function () { lamb.values(null); }).toThrow();
        expect(function () { lamb.values(void 0); }).toThrow();
    });

    it("should consider other values as empty objects", function () {
        wannabeEmptyObjects.forEach(function (value) {
            expect(lamb.ownValues(value)).toEqual([]);
            expect(lamb.values(value)).toEqual([]);
        });
    });

    describe("ownValues", function () {
        it("should pick only from the own enumerable properties of the given object", function () {
            expect(lamb.ownValues(foo)).toEqual([4]);
        });
    });

    describe("values", function () {
        it("should pick all the enumerable properties of the given object", function () {
            expect(lamb.values(foo)).toEqual([4, 1]);
        });
    });
});
