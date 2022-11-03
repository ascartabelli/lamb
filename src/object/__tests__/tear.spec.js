import tear from "../tear";
import tearOwn from "../tearOwn";
import { wannabeEmptyObjects } from "../../__tests__/commons";

describe("tear / tearOwn", () => {
    const baseFoo = Object.create({ a: 1 }, { b: { value: 2 } });
    const foo = Object.create(baseFoo, {
        c: { value: 3 },
        d: { value: 4, enumerable: true }
    });

    it("should transform an object in two lists, one containing its keys, the other containing the corresponding values", () => {
        expect(tear({ a: 1, b: 2, c: 3 })).toStrictEqual([["a", "b", "c"], [1, 2, 3]]);
        expect(tearOwn({ a: 1, b: 2, c: 3 })).toStrictEqual([["a", "b", "c"], [1, 2, 3]]);
    });

    it("should work with array-like objects", () => {
        const r1 = [["0", "1", "2"], [1, 2, 3]];
        const r2 = [["0", "1", "2"], ["a", "b", "c"]];

        expect(tear([1, 2, 3])).toStrictEqual(r1);
        expect(tear("abc")).toStrictEqual(r2);
        expect(tearOwn([1, 2, 3])).toStrictEqual(r1);
        expect(tearOwn("abc")).toStrictEqual(r2);
    });

    it("should keep `undefined` values in the result", () => {
        const source = { a: null, b: void 0 };
        const result = [["a", "b"], [null, void 0]];

        expect(tear(source)).toStrictEqual(result);
        expect(tearOwn(source)).toStrictEqual(result);
    });

    it("should throw an exception if called without arguments", () => {
        expect(tear).toThrow();
        expect(tearOwn).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined`", () => {
        expect(() => { tear(null); }).toThrow();
        expect(() => { tear(void 0); }).toThrow();
        expect(() => { tearOwn(null); }).toThrow();
        expect(() => { tearOwn(void 0); }).toThrow();
    });

    it("should consider other values as empty objects", () => {
        wannabeEmptyObjects.forEach(function (value) {
            expect(tear(value)).toStrictEqual([[], []]);
            expect(tearOwn(value)).toStrictEqual([[], []]);
        });
    });

    describe("tear", () => {
        it("should use all the enumerable properties of the source object, inherited or not", () => {
            expect(tear(foo)).toStrictEqual([["d", "a"], [4, 1]]);
        });
    });

    describe("tearOwn", () => {
        it("should use only the own enumerable properties of the source object", () => {
            expect(tearOwn(foo)).toStrictEqual([["d"], [4]]);
        });
    });
});
