import * as lamb from "../..";
import { wannabeEmptyArrays } from "../../__tests__/commons";

describe("make", function () {
    it("should build an object with the given keys and values lists", function () {
        expect(lamb.make(["a", "b", "c"], [1, 2, 3])).toEqual({ a: 1, b: 2, c: 3 });
    });

    it("should create undefined values if the keys list is longer", function () {
        expect(lamb.make(["a", "b", "c"], [1, 2])).toStrictEqual({ a: 1, b: 2, c: void 0 });
    });

    it("should ignore extra values if the keys list is shorter", function () {
        expect(lamb.make(["a", "b"], [1, 2, 3])).toEqual({ a: 1, b: 2 });
    });

    it("should convert non-string keys to strings", function () {
        expect(lamb.make([null, void 0, 2], [1, 2, 3])).toEqual({ null: 1, undefined: 2, 2: 3 });
    });

    it("should convert unassigned or deleted indexes in sparse arrays to `undefined` values", function () {
        /* eslint-disable no-sparse-arrays */
        expect(lamb.make(["a", "b", "c"], [1, , 3])).toStrictEqual({ a: 1, b: void 0, c: 3 });
        expect(lamb.make(["a", , "c"], [1, 2, 3])).toEqual({ a: 1, undefined: 2, c: 3 });
        /* eslint-enable no-sparse-arrays */
    });

    it("should accept array-like objects in both parameters", function () {
        expect(lamb.make("abcd", "1234")).toEqual({ a: "1", b: "2", c: "3", d: "4" });
    });

    it("should throw an exception if called without arguments", function () {
        expect(lamb.make).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` in the `keys` or in the `values` parameter", function () {
        expect(function () { lamb.make(null, []); }).toThrow();
        expect(function () { lamb.make(void 0, []); }).toThrow();
        expect(function () { lamb.make([], null); }).toThrow();
        expect(function () { lamb.make([], void 0); }).toThrow();
    });

    it("should consider other values for the `keys` parameter as empty arrays and return an empty object", function () {
        wannabeEmptyArrays.forEach(function (v) {
            expect(lamb.make(v, [])).toEqual({});
        });
    });

    it("should consider other values for the `values` parameter to be empty arrays", function () {
        wannabeEmptyArrays.forEach(function (v) {
            expect(lamb.make(["foo", "bar"], v)).toStrictEqual({ foo: void 0, bar: void 0 });
        });
    });
});
