import * as lamb from "../..";
import { wannabeEmptyObjects } from "../../__tests__/commons";

describe("tear / tearOwn", function () {
    var baseFoo = Object.create({ a: 1 }, { b: { value: 2 } });
    var foo = Object.create(baseFoo, {
        c: { value: 3 },
        d: { value: 4, enumerable: true }
    });

    it("should transform an object in two lists, one containing its keys, the other containing the corresponding values", function () {
        expect(lamb.tear({ a: 1, b: 2, c: 3 })).toEqual([["a", "b", "c"], [1, 2, 3]]);
        expect(lamb.tearOwn({ a: 1, b: 2, c: 3 })).toEqual([["a", "b", "c"], [1, 2, 3]]);
    });

    it("should work with array-like objects", function () {
        var r1 = [["0", "1", "2"], [1, 2, 3]];
        var r2 = [["0", "1", "2"], ["a", "b", "c"]];

        expect(lamb.tear([1, 2, 3])).toEqual(r1);
        expect(lamb.tear("abc")).toEqual(r2);
        expect(lamb.tearOwn([1, 2, 3])).toEqual(r1);
        expect(lamb.tearOwn("abc")).toEqual(r2);
    });

    it("should keep `undefined` values in the result", function () {
        var source = { a: null, b: void 0 };
        var result = [["a", "b"], [null, void 0]];

        expect(lamb.tear(source)).toStrictEqual(result);
        expect(lamb.tearOwn(source)).toStrictEqual(result);
    });

    it("should throw an exception if called without arguments", function () {
        expect(lamb.tear).toThrow();
        expect(lamb.tearOwn).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined`", function () {
        expect(function () { lamb.tear(null); }).toThrow();
        expect(function () { lamb.tear(void 0); }).toThrow();
        expect(function () { lamb.tearOwn(null); }).toThrow();
        expect(function () { lamb.tearOwn(void 0); }).toThrow();
    });

    it("should consider other values as empty objects", function () {
        wannabeEmptyObjects.forEach(function (value) {
            expect(lamb.tear(value)).toEqual([[], []]);
            expect(lamb.tearOwn(value)).toEqual([[], []]);
        });
    });

    describe("tear", function () {
        it("should use all the enumerable properties of the source object, inherited or not", function () {
            expect(lamb.tear(foo)).toEqual([["d", "a"], [4, 1]]);
        });
    });

    describe("tearOwn", function () {
        it("should use only the own enumerable properties of the source object", function () {
            expect(lamb.tearOwn(foo)).toEqual([["d"], [4]]);
        });
    });
});
