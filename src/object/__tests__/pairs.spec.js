import * as lamb from "../..";
import { wannabeEmptyObjects } from "../../__tests__/commons";

describe("ownPairs / pairs", function () {
    var baseFoo = Object.create({ a: 1 }, { b: { value: 2 } });
    var foo = Object.create(baseFoo, {
        c: { value: 3 },
        d: { value: 4, enumerable: true }
    });

    it("should convert an object in a list of key / value pairs", function () {
        var source = { a: 1, b: 2, c: 3 };
        var result = [["a", 1], ["b", 2], ["c", 3]];

        expect(lamb.ownPairs(source)).toEqual(result);
        expect(lamb.pairs(source)).toEqual(result);
    });

    it("should keep `undefined` values in the result", function () {
        var source = { a: null, b: void 0 };
        var result = [["a", null], ["b", void 0]];

        expect(lamb.ownPairs(source)).toStrictEqual(result);
        expect(lamb.pairs(source)).toStrictEqual(result);
    });

    it("should work with array-like objects", function () {
        var r1 = [["0", 1], ["1", 2], ["2", 3]];
        var r2 = [["0", "a"], ["1", "b"], ["2", "c"]];

        expect(lamb.ownPairs([1, 2, 3])).toEqual(r1);
        expect(lamb.ownPairs("abc")).toEqual(r2);
        expect(lamb.pairs([1, 2, 3])).toEqual(r1);
        expect(lamb.pairs("abc")).toEqual(r2);
    });

    it("should throw an exception if called without arguments", function () {
        expect(lamb.ownPairs).toThrow();
        expect(lamb.pairs).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined`", function () {
        expect(function () { lamb.ownPairs(null); }).toThrow();
        expect(function () { lamb.ownPairs(void 0); }).toThrow();
        expect(function () { lamb.pairs(null); }).toThrow();
        expect(function () { lamb.pairs(void 0); }).toThrow();
    });

    it("should consider other values as empty objects", function () {
        wannabeEmptyObjects.forEach(function (value) {
            expect(lamb.ownPairs(value)).toEqual([]);
            expect(lamb.pairs(value)).toEqual([]);
        });
    });

    describe("ownPairs", function () {
        it("should use only the own enumerable properties of the source object", function () {
            expect(lamb.ownPairs(foo)).toEqual([["d", 4]]);
        });
    });

    describe("pairs", function () {
        it("should use all the enumerable properties of the source object, inherited or not", function () {
            expect(lamb.pairs(foo)).toEqual([["d", 4], ["a", 1]]);
        });
    });
});
