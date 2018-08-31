import * as lamb from "../..";
import { wannabeEmptyArrays } from "../../__tests__/commons";

describe("fromPairs", function () {
    it("should build an object from a list of key / value pairs", function () {
        expect(lamb.fromPairs([["a", 1], ["b", 2], ["c", 3]])).toEqual({ a: 1, b: 2, c: 3 });
    });

    it("should use the last key / value pair in case of duplicate keys", function () {
        expect(lamb.fromPairs([["a", 1], ["b", 2], ["a", 3]])).toEqual({ a: 3, b: 2 });
    });

    it("should convert missing or non-string keys to strings and missing values to `undefined`", function () {
        /* eslint-disable comma-spacing, no-sparse-arrays */
        var pairs = [[1], [void 0, 2], [null, 3], ["z", ,]];
        var result = { 1: void 0, undefined: 2, null: 3, z: void 0 };

        expect(lamb.fromPairs(pairs)).toStrictEqual(result);
        expect(lamb.fromPairs([[, 4]])).toStrictEqual({ undefined: 4 });
        /* eslint-enable comma-spacing, no-sparse-arrays */
    });

    it("should return an empty object if supplied with an empty array", function () {
        expect(lamb.fromPairs([])).toEqual({});
    });

    it("should accept array-like objects as pairs", function () {
        expect(lamb.fromPairs(["a1", "b2"])).toEqual({ a: "1", b: "2" });
    });

    it("should try to retrieve pairs from array-like objects", function () {
        expect(lamb.fromPairs("foo")).toEqual({ f: void 0, o: void 0 });
    });

    it("should throw an exception if any of the pairs is `nil`", function () {
        expect(function () { lamb.fromPairs([["a", 1], null, ["c", 3]]); }).toThrow();
        expect(function () { lamb.fromPairs([["a", 1], void 0, ["c", 3]]); }).toThrow();
    });

    it("should throw an exception if called without the data argument", function () {
        expect(lamb.fromPairs).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined`", function () {
        expect(function () { lamb.fromPairs(null); }).toThrow();
        expect(function () { lamb.fromPairs(void 0); }).toThrow();
    });

    it("should treat every other value as an empty array and return an empty object", function () {
        wannabeEmptyArrays.forEach(function (value) {
            expect(lamb.fromPairs(value)).toEqual({});
        });
    });
});
