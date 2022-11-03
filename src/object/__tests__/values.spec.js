import ownValues from "../ownValues";
import values from "../values";
import { wannabeEmptyObjects } from "../../__tests__/commons";

describe("ownValues / values", () => {
    const baseFoo = Object.create({ a: 1 }, { b: { value: 2 } });
    const foo = Object.create(baseFoo, {
        c: { value: 3 },
        d: { value: 4, enumerable: true }
    });

    it("should return an array of values of the given object properties", () => {
        const source = { a: 1, b: 2, c: 3 };
        const result = [1, 2, 3];

        expect(ownValues(source)).toStrictEqual(result);
        expect(values(source)).toStrictEqual(result);
    });

    it("should accept array-like objects, returning an array copy of their values", () => {
        expect(ownValues([1, 2, 3])).toStrictEqual([1, 2, 3]);
        expect(ownValues("abc")).toStrictEqual(["a", "b", "c"]);
        expect(values([1, 2, 3])).toStrictEqual([1, 2, 3]);
        expect(values("abc")).toStrictEqual(["a", "b", "c"]);
    });

    it("should keep `undefined` values in the result", () => {
        const source = { a: null, b: void 0 };
        const result = [null, void 0];

        expect(ownValues(source)).toStrictEqual(result);
        expect(values(source)).toStrictEqual(result);
    });

    it("should throw an exception if called without arguments", () => {
        expect(ownValues).toThrow();
        expect(values).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined`", () => {
        expect(() => { ownValues(null); }).toThrow();
        expect(() => { ownValues(void 0); }).toThrow();
        expect(() => { values(null); }).toThrow();
        expect(() => { values(void 0); }).toThrow();
    });

    it("should consider other values as empty objects", () => {
        wannabeEmptyObjects.forEach(value => {
            expect(ownValues(value)).toStrictEqual([]);
            expect(values(value)).toStrictEqual([]);
        });
    });

    describe("ownValues", () => {
        it("should pick only from the own enumerable properties of the given object", () => {
            expect(ownValues(foo)).toStrictEqual([4]);
        });
    });

    describe("values", () => {
        it("should pick all the enumerable properties of the given object", () => {
            expect(values(foo)).toStrictEqual([4, 1]);
        });
    });
});
