import make from "../make";
import { wannabeEmptyArrays } from "../../__tests__/commons";

describe("make", () => {
    it("should build an object with the given keys and values lists", () => {
        expect(make(["a", "b", "c"], [1, 2, 3])).toStrictEqual({ a: 1, b: 2, c: 3 });
    });

    it("should create undefined values if the keys list is longer", () => {
        expect(make(["a", "b", "c"], [1, 2])).toStrictEqual({ a: 1, b: 2, c: void 0 });
    });

    it("should ignore extra values if the keys list is shorter", () => {
        expect(make(["a", "b"], [1, 2, 3])).toStrictEqual({ a: 1, b: 2 });
    });

    it("should convert non-string keys to strings", () => {
        expect(make([null, void 0, 2], [1, 2, 3])).toStrictEqual({ null: 1, undefined: 2, 2: 3 });
    });

    it("should convert unassigned or deleted indexes in sparse arrays to `undefined` values", () => {
        /* eslint-disable no-sparse-arrays */
        expect(make(["a", "b", "c"], [1, , 3])).toStrictEqual({ a: 1, b: void 0, c: 3 });
        expect(make(["a", , "c"], [1, 2, 3])).toStrictEqual({ a: 1, undefined: 2, c: 3 });
        /* eslint-enable no-sparse-arrays */
    });

    it("should accept array-like objects in both parameters", () => {
        expect(make("abcd", "1234")).toStrictEqual({ a: "1", b: "2", c: "3", d: "4" });
    });

    it("should throw an exception if called without arguments", () => {
        expect(make).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` in the `keys` or in the `values` parameter", () => {
        expect(() => { make(null, []); }).toThrow();
        expect(() => { make(void 0, []); }).toThrow();
        expect(() => { make([], null); }).toThrow();
        expect(() => { make([], void 0); }).toThrow();
    });

    it("should consider other values for the `keys` parameter as empty arrays and return an empty object", () => {
        wannabeEmptyArrays.forEach(value => {
            expect(make(value, [])).toStrictEqual({});
        });
    });

    it("should consider other values for the `values` parameter to be empty arrays", () => {
        wannabeEmptyArrays.forEach(value => {
            expect(make(["foo", "bar"], value)).toStrictEqual({ foo: void 0, bar: void 0 });
        });
    });
});
