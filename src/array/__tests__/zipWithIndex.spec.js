import * as lamb from "../..";
import { wannabeEmptyArrays } from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("zipWithIndex", function () {
    it("should pair the received values with their index", function () {
        expect(lamb.zipWithIndex([])).toEqual([]);
        expect(lamb.zipWithIndex([1, 2, 3, 4])).toEqual([[1, 0], [2, 1], [3, 2], [4, 3]]);
    });

    it("should work with array-like objects", function () {
        expect(lamb.zipWithIndex("abcd")).toEqual([["a", 0], ["b", 1], ["c", 2], ["d", 3]]);
    });

    it("should not skip deleted or unassigned indexes in sparse arrays", function () {
        // eslint-disable-next-line comma-spacing, no-sparse-arrays
        expect(lamb.zipWithIndex([1, , 3, ,])).toStrictArrayEqual([
            [1, 0],
            [void 0, 1],
            [3, 2],
            [void 0, 3]
        ]);
    });

    it("should throw an error if no arguments are supplied", function () {
        expect(lamb.zipWithIndex).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", function () {
        expect(function () { lamb.zipWithIndex(null); }).toThrow();
        expect(function () { lamb.zipWithIndex(void 0); }).toThrow();
    });

    it("should treat every other value as an empty array", function () {
        wannabeEmptyArrays.forEach(function (value) {
            expect(lamb.zipWithIndex(value)).toEqual([]);
        });
    });
});
