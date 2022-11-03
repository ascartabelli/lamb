import contains from "../contains";
import isIn from "../isIn";
import { wannabeEmptyArrays } from "../../__tests__/commons";

describe("contains / isIn", () => {
    const testArray = ["foo", NaN, 0, 12];

    it("should verify if a value is contained in an array using the \"SameValueZero\" comparison", () => {
        expect(contains(12)(testArray)).toBe(true);
        expect(isIn(testArray, 12)).toBe(true);
        expect(contains(NaN)(testArray)).toBe(true);
        expect(isIn(testArray, NaN)).toBe(true);
        expect(contains(0)(testArray)).toBe(true);
        expect(isIn(testArray, 0)).toBe(true);
        expect(contains(-0)(testArray)).toBe(true);
        expect(isIn(testArray, -0)).toBe(true);
        expect(contains(15)(testArray)).toBe(false);
        expect(isIn(testArray, 15)).toBe(false);

        expect(contains()([1, 3])).toBe(false);
        expect(contains()([1, 3, void 0])).toBe(true);
    });

    it("should work with array-like objects", () => {
        expect(contains("f")("foo")).toBe(true);
        expect(isIn("foo", "f")).toBe(true);
    });

    it("should consider deleted or unassigned indexes in sparse arrays as `undefined` values", () => {
        /* eslint-disable no-sparse-arrays */
        expect(contains(void 0)([1, , 3])).toBe(true);
        expect(isIn([1, , 3], void 0)).toBe(true);
        /* eslint-enable no-sparse-arrays */
    });

    it("should throw an exception if called without the data argument or without arguments at all", () => {
        expect(isIn).toThrow();
        expect(contains(1)).toThrow();
        expect(contains()).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined`", () => {
        expect(() => { isIn(null, 1); }).toThrow();
        expect(() => { isIn(void 0, 1); }).toThrow();
        expect(() => { contains(1)(null); }).toThrow();
        expect(() => { contains(1)(void 0); }).toThrow();
    });

    it("should treat every other value as an empty array and return false", () => {
        wannabeEmptyArrays.forEach(value => {
            expect(contains(1)(value)).toBe(false);
            expect(isIn(value, 1)).toBe(false);
        });
    });
});
