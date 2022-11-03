import enumerables from "../enumerables";
import { wannabeEmptyObjects } from "../../__tests__/commons";

describe("enumerables", () => {
    it("should build an array with all the enumerables keys of an object", () => {
        const baseFoo = Object.create({ a: 1 }, { b: { value: 2 } });
        const foo = Object.create(baseFoo, {
            c: { value: 3 },
            d: { value: 4, enumerable: true }
        });

        expect(enumerables(foo)).toStrictEqual(["d", "a"]);
    });

    it("should work with arrays and array-like objects", () => {
        expect(enumerables([1, 2, 3])).toStrictEqual(["0", "1", "2"]);
        expect(enumerables("abc")).toStrictEqual(["0", "1", "2"]);
    });

    it("should retrieve only defined keys in sparse arrays", () => {
        // eslint-disable-next-line comma-spacing, no-sparse-arrays
        expect(enumerables([, 5, 6, ,])).toStrictEqual(["1", "2"]);
    });

    it("should throw an exception if called without arguments", () => {
        expect(enumerables).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined`", () => {
        expect(() => { enumerables(null); }).toThrow();
        expect(() => { enumerables(void 0); }).toThrow();
    });

    it("should consider other values as empty objects", () => {
        wannabeEmptyObjects.forEach(value => {
            expect(enumerables(value)).toStrictEqual([]);
        });
    });
});
