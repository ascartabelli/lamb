import zipWithIndex from "../zipWithIndex";
import { wannabeEmptyArrays } from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("zipWithIndex", () => {
    it("should pair the received values with their index", () => {
        expect(zipWithIndex([])).toStrictEqual([]);
        expect(zipWithIndex([1, 2, 3, 4])).toStrictEqual([[1, 0], [2, 1], [3, 2], [4, 3]]);
    });

    it("should work with array-like objects", () => {
        expect(zipWithIndex("abcd")).toStrictEqual([["a", 0], ["b", 1], ["c", 2], ["d", 3]]);
    });

    it("should not skip deleted or unassigned indexes in sparse arrays", () => {
        // eslint-disable-next-line comma-spacing, no-sparse-arrays
        expect(zipWithIndex([1, , 3, ,])).toStrictArrayEqual([
            [1, 0],
            [void 0, 1],
            [3, 2],
            [void 0, 3]
        ]);
    });

    it("should throw an error if no arguments are supplied", () => {
        expect(zipWithIndex).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", () => {
        expect(() => { zipWithIndex(null); }).toThrow();
        expect(() => { zipWithIndex(void 0); }).toThrow();
    });

    it("should treat every other value as an empty array", () => {
        wannabeEmptyArrays.forEach(value => {
            expect(zipWithIndex(value)).toStrictEqual([]);
        });
    });
});
