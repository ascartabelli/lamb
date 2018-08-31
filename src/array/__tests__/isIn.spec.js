import * as lamb from "../..";
import { wannabeEmptyArrays } from "../../__tests__/commons";

describe("contains / isIn", function () {
    var testArray = ["foo", NaN, 0, 12];

    it("should verify if a value is contained in an array using the \"SameValueZero\" comparison", function () {
        expect(lamb.contains(12)(testArray)).toBe(true);
        expect(lamb.isIn(testArray, 12)).toBe(true);
        expect(lamb.contains(NaN)(testArray)).toBe(true);
        expect(lamb.isIn(testArray, NaN)).toBe(true);
        expect(lamb.contains(0)(testArray)).toBe(true);
        expect(lamb.isIn(testArray, 0)).toBe(true);
        expect(lamb.contains(-0)(testArray)).toBe(true);
        expect(lamb.isIn(testArray, -0)).toBe(true);
        expect(lamb.contains(15)(testArray)).toBe(false);
        expect(lamb.isIn(testArray, 15)).toBe(false);

        expect(lamb.contains()([1, 3])).toBe(false);
        expect(lamb.contains()([1, 3, void 0])).toBe(true);
    });

    it("should work with array-like objects", function () {
        expect(lamb.contains("f")("foo")).toBe(true);
        expect(lamb.isIn("foo", "f")).toBe(true);
    });

    it("should consider deleted or unassigned indexes in sparse arrays as `undefined` values", function () {
        /* eslint-disable no-sparse-arrays */
        expect(lamb.contains(void 0)([1, , 3])).toBe(true);
        expect(lamb.isIn([1, , 3], void 0)).toBe(true);
        /* eslint-enable no-sparse-arrays */
    });

    it("should throw an exception if called without the data argument or without arguments at all", function () {
        expect(lamb.isIn).toThrow();
        expect(lamb.contains(1)).toThrow();
        expect(lamb.contains()).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined`", function () {
        expect(function () { lamb.isIn(null, 1); }).toThrow();
        expect(function () { lamb.isIn(void 0, 1); }).toThrow();
        expect(function () { lamb.contains(1)(null); }).toThrow();
        expect(function () { lamb.contains(1)(void 0); }).toThrow();
    });

    it("should treat every other value as an empty array and return false", function () {
        wannabeEmptyArrays.forEach(function (value) {
            expect(lamb.contains(1)(value)).toBe(false);
            expect(lamb.isIn(value, 1)).toBe(false);
        });
    });
});
