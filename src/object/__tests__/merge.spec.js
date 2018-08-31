import * as lamb from "../..";
import { wannabeEmptyObjects } from "../../__tests__/commons";

describe("merge / mergeOwn", function () {
    var baseFoo = Object.create({ a: 1 }, { b: { value: 2, enumerable: true }, z: { value: 5 } });
    var foo = Object.create(baseFoo, { c: { value: 3, enumerable: true } });
    var bar = { d: 4 };
    var fooEquivalent = { a: 1, b: 2, c: 3, z: 5 };

    // The "toEqual" matcher would have checked only own enumerable properties
    afterEach(function () {
        for (var key in fooEquivalent) {
            expect(fooEquivalent[key]).toBe(foo[key]);
        }

        expect(bar).toEqual({ d: 4 });
    });

    describe("merge", function () {
        it("should merge the enumerable properties of the provided sources into a new object without mutating them", function () {
            var newObj = lamb.merge(foo, bar);

            expect(newObj).toEqual({ a: 1, b: 2, c: 3, d: 4 });
            expect(newObj.z).toBeUndefined();
        });
    });

    describe("mergeOwn", function () {
        it("should merge the enumerable own properties of the provided sources into a new object without mutating them", function () {
            var newObj = lamb.mergeOwn(foo, bar);

            expect(newObj).toEqual({ c: 3, d: 4 });
            expect(newObj.a).toBeUndefined();
            expect(newObj.b).toBeUndefined();
            expect(newObj.z).toBeUndefined();
        });
    });

    it("should transform array-like objects in objects with numbered string as properties", function () {
        expect(lamb.merge([1, 2], { a: 2 })).toEqual({ 0: 1, 1: 2, a: 2 });
        expect(lamb.mergeOwn([1, 2], { a: 2 })).toEqual({ 0: 1, 1: 2, a: 2 });
        expect(lamb.merge("foo", { a: 2 })).toEqual({ 0: "f", 1: "o", 2: "o", a: 2 });
        expect(lamb.mergeOwn("foo", { a: 2 })).toEqual({ 0: "f", 1: "o", 2: "o", a: 2 });
    });

    it("should handle key homonymy by giving the last source precedence over the first one", function () {
        expect(lamb.merge({ a: 1, b: 3 }, { b: 5, c: 4 })).toEqual({ a: 1, b: 5, c: 4 });
        expect(lamb.mergeOwn({ a: 1, b: 3 }, { b: 5, c: 4 })).toEqual({ a: 1, b: 5, c: 4 });
    });

    it("should throw an exception if called with `nil` values", function () {
        expect(function () { lamb.merge({ a: 2 }, null); }).toThrow();
        expect(function () { lamb.merge(null, { a: 2 }); }).toThrow();
        expect(function () { lamb.merge({ a: 2 }, void 0); }).toThrow();
        expect(function () { lamb.merge(void 0, { a: 2 }); }).toThrow();

        expect(function () { lamb.mergeOwn({ a: 2 }, null); }).toThrow();
        expect(function () { lamb.mergeOwn(null, { a: 2 }); }).toThrow();
        expect(function () { lamb.mergeOwn({ a: 2 }, void 0); }).toThrow();
        expect(function () { lamb.mergeOwn(void 0, { a: 2 }); }).toThrow();

        expect(lamb.merge).toThrow();
        expect(lamb.mergeOwn).toThrow();
    });

    it("should consider other values as empty objects", function () {
        wannabeEmptyObjects.forEach(function (value) {
            expect(lamb.merge({ a: 2 }, value)).toEqual({ a: 2 });
            expect(lamb.merge(value, { a: 2 })).toEqual({ a: 2 });

            expect(lamb.mergeOwn({ a: 2 }, value)).toEqual({ a: 2 });
            expect(lamb.mergeOwn(value, { a: 2 })).toEqual({ a: 2 });
        });
    });
});
