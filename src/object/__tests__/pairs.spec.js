import ownPairs from "../ownPairs";
import pairs from "../pairs";
import { wannabeEmptyObjects } from "../../__tests__/commons";

describe("ownPairs / pairs", () => {
    const baseFoo = Object.create({ a: 1 }, { b: { value: 2 } });
    const foo = Object.create(baseFoo, {
        c: { value: 3 },
        d: { value: 4, enumerable: true }
    });

    it("should convert an object in a list of key / value pairs", () => {
        const source = { a: 1, b: 2, c: 3 };
        const result = [["a", 1], ["b", 2], ["c", 3]];

        expect(ownPairs(source)).toStrictEqual(result);
        expect(pairs(source)).toStrictEqual(result);
    });

    it("should keep `undefined` values in the result", () => {
        const source = { a: null, b: void 0 };
        const result = [["a", null], ["b", void 0]];

        expect(ownPairs(source)).toStrictEqual(result);
        expect(pairs(source)).toStrictEqual(result);
    });

    it("should work with array-like objects", () => {
        const r1 = [["0", 1], ["1", 2], ["2", 3]];
        const r2 = [["0", "a"], ["1", "b"], ["2", "c"]];

        expect(ownPairs([1, 2, 3])).toStrictEqual(r1);
        expect(ownPairs("abc")).toStrictEqual(r2);
        expect(pairs([1, 2, 3])).toStrictEqual(r1);
        expect(pairs("abc")).toStrictEqual(r2);
    });

    it("should throw an exception if called without arguments", () => {
        expect(ownPairs).toThrow();
        expect(pairs).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined`", () => {
        expect(() => { ownPairs(null); }).toThrow();
        expect(() => { ownPairs(void 0); }).toThrow();
        expect(() => { pairs(null); }).toThrow();
        expect(() => { pairs(void 0); }).toThrow();
    });

    it("should consider other values as empty objects", () => {
        wannabeEmptyObjects.forEach(value => {
            expect(ownPairs(value)).toStrictEqual([]);
            expect(pairs(value)).toStrictEqual([]);
        });
    });

    describe("ownPairs", () => {
        it("should use only the own enumerable properties of the source object", () => {
            expect(ownPairs(foo)).toStrictEqual([["d", 4]]);
        });
    });

    describe("pairs", () => {
        it("should use all the enumerable properties of the source object, inherited or not", () => {
            expect(pairs(foo)).toStrictEqual([["d", 4], ["a", 1]]);
        });
    });
});
