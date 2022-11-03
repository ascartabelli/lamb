import merge from "../merge";
import mergeOwn from "../mergeOwn";
import { wannabeEmptyObjects } from "../../__tests__/commons";

describe("merge / mergeOwn", () => {
    const baseFoo = Object.create(
        { a: 1 },
        { b: { value: 2, enumerable: true }, z: { value: 5 } }
    );
    const foo = Object.create(baseFoo, { c: { value: 3, enumerable: true } });
    const bar = { d: 4 };
    const fooEquivalent = { a: 1, b: 2, c: 3, z: 5 };

    // The "toStrictEqual" matcher would have checked only own enumerable properties
    afterEach(() => {
        for (const key in fooEquivalent) {
            expect(fooEquivalent[key]).toBe(foo[key]);
        }

        expect(bar).toStrictEqual({ d: 4 });
    });

    describe("merge", () => {
        it("should merge the enumerable properties of the provided sources into a new object without mutating them", () => {
            const newObj = merge(foo, bar);

            expect(newObj).toStrictEqual({ a: 1, b: 2, c: 3, d: 4 });
            expect(newObj.z).toBeUndefined();
        });
    });

    describe("mergeOwn", () => {
        it("should merge the enumerable own properties of the provided sources into a new object without mutating them", () => {
            const newObj = mergeOwn(foo, bar);

            expect(newObj).toStrictEqual({ c: 3, d: 4 });
            expect(newObj.a).toBeUndefined();
            expect(newObj.b).toBeUndefined();
            expect(newObj.z).toBeUndefined();
        });
    });

    it("should transform array-like objects in objects with numbered string as properties", () => {
        expect(merge([1, 2], { a: 2 })).toStrictEqual({ 0: 1, 1: 2, a: 2 });
        expect(mergeOwn([1, 2], { a: 2 })).toStrictEqual({ 0: 1, 1: 2, a: 2 });
        expect(merge("foo", { a: 2 })).toStrictEqual({ 0: "f", 1: "o", 2: "o", a: 2 });
        expect(mergeOwn("foo", { a: 2 })).toStrictEqual({ 0: "f", 1: "o", 2: "o", a: 2 });
    });

    it("should handle key homonymy by giving the last source precedence over the first one", () => {
        expect(merge({ a: 1, b: 3 }, { b: 5, c: 4 })).toStrictEqual({ a: 1, b: 5, c: 4 });
        expect(mergeOwn({ a: 1, b: 3 }, { b: 5, c: 4 })).toStrictEqual({ a: 1, b: 5, c: 4 });
    });

    it("should throw an exception if called with `nil` values", () => {
        expect(() => { merge({ a: 2 }, null); }).toThrow();
        expect(() => { merge(null, { a: 2 }); }).toThrow();
        expect(() => { merge({ a: 2 }, void 0); }).toThrow();
        expect(() => { merge(void 0, { a: 2 }); }).toThrow();

        expect(() => { mergeOwn({ a: 2 }, null); }).toThrow();
        expect(() => { mergeOwn(null, { a: 2 }); }).toThrow();
        expect(() => { mergeOwn({ a: 2 }, void 0); }).toThrow();
        expect(() => { mergeOwn(void 0, { a: 2 }); }).toThrow();

        expect(merge).toThrow();
        expect(mergeOwn).toThrow();
    });

    it("should consider other values as empty objects", () => {
        wannabeEmptyObjects.forEach(value => {
            expect(merge({ a: 2 }, value)).toStrictEqual({ a: 2 });
            expect(merge(value, { a: 2 })).toStrictEqual({ a: 2 });

            expect(mergeOwn({ a: 2 }, value)).toStrictEqual({ a: 2 });
            expect(mergeOwn(value, { a: 2 })).toStrictEqual({ a: 2 });
        });
    });
});
