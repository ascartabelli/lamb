import fromPairs from "../fromPairs";
import { wannabeEmptyArrays } from "../../__tests__/commons";

describe("fromPairs", () => {
    it("should build an object from a list of key / value pairs", () => {
        expect(fromPairs([["a", 1], ["b", 2], ["c", 3]])).toStrictEqual({ a: 1, b: 2, c: 3 });
    });

    it("should use the last key / value pair in case of duplicate keys", () => {
        expect(fromPairs([["a", 1], ["b", 2], ["a", 3]])).toStrictEqual({ a: 3, b: 2 });
    });

    it("should convert missing or non-string keys to strings and missing values to `undefined`", () => {
        /* eslint-disable comma-spacing, no-sparse-arrays */
        const pairs = [[1], [void 0, 2], [null, 3], ["z", ,]];
        const result = { 1: void 0, undefined: 2, null: 3, z: void 0 };

        expect(fromPairs(pairs)).toStrictEqual(result);
        expect(fromPairs([[, 4]])).toStrictEqual({ undefined: 4 });
        /* eslint-enable comma-spacing, no-sparse-arrays */
    });

    it("should return an empty object if supplied with an empty array", () => {
        expect(fromPairs([])).toStrictEqual({});
    });

    it("should accept array-like objects as pairs", () => {
        expect(fromPairs(["a1", "b2"])).toStrictEqual({ a: "1", b: "2" });
    });

    it("should try to retrieve pairs from array-like objects", () => {
        expect(fromPairs("foo")).toStrictEqual({ f: void 0, o: void 0 });
    });

    it("should throw an exception if any of the pairs is `nil`", () => {
        expect(() => { fromPairs([["a", 1], null, ["c", 3]]); }).toThrow();
        expect(() => { fromPairs([["a", 1], void 0, ["c", 3]]); }).toThrow();
    });

    it("should throw an exception if called without the data argument", () => {
        expect(fromPairs).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined`", () => {
        expect(() => { fromPairs(null); }).toThrow();
        expect(() => { fromPairs(void 0); }).toThrow();
    });

    it("should treat every other value as an empty array and return an empty object", () => {
        wannabeEmptyArrays.forEach(value => {
            expect(fromPairs(value)).toStrictEqual({});
        });
    });
});
