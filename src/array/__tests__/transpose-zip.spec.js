import * as lamb from "../..";
import { wannabeEmptyArrays } from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("transpose / zip", function () {
    var a1 = [1, 2, 3, 4];
    var a2 = [5, 6, 7];
    var a3 = [8, 9];

    var r1 = [[1], [2], [3], [4]];
    var r2 = [[1, 5], [2, 6], [3, 7]];
    var r3 = [[1, 5, 8], [2, 6, 9]];
    var r4 = [[5, 8], [6, 9]];

    describe("transpose", function () {
        it("should transpose a matrix", function () {
            expect(lamb.transpose([])).toEqual([]);
            expect(lamb.transpose([1, 2, 3])).toEqual([]);
            expect(lamb.transpose(r1)).toEqual([a1]);
            expect(lamb.transpose(r2)).toEqual([[1, 2, 3], [5, 6, 7]]);
            expect(lamb.transpose(r3)).toEqual([[1, 2], [5, 6], [8, 9]]);
        });

        it("should work with array-like objects", function () {
            var fn = function () {
                return lamb.transpose(arguments);
            };

            expect(fn("abc", [1, 2, 3])).toEqual([["a", 1], ["b", 2], ["c", 3]]);
        });

        it("should build dense arrays when sparse ones are received", function () {
            // eslint-disable-next-line comma-spacing, no-sparse-arrays
            expect(lamb.transpose([[1, , 3], [4, 5, void 0], [6, 7, ,]])).toStrictArrayEqual([
                [1, 4, 6],
                [void 0, 5, 7],
                [3, void 0, void 0]
            ]);
        });

        it("should throw an exception when a value in the array-like is `nil`", function () {
            expect(function () { lamb.transpose([null, [1, 2, 3]]); }).toThrow();
            expect(function () { lamb.transpose([[1, 2, 3], null]); }).toThrow();
            expect(function () { lamb.transpose([void 0, [1, 2, 3]]); }).toThrow();
            expect(function () { lamb.transpose([[1, 2, 3], void 0]); }).toThrow();
        });

        it("should consider other non-array-like values contained in the main array-like as empty arrays", function () {
            wannabeEmptyArrays.forEach(function (value) {
                expect(lamb.transpose([[1, 2, 3], value])).toEqual([]);
                expect(lamb.transpose([value, [1, 2, 3]])).toEqual([]);
            });
        });
    });

    describe("zip", function () {
        it("should pair items with the same index in the received lists", function () {
            expect(lamb.zip(a1, a2)).toEqual(r2);
            expect(lamb.zip(a2, a3)).toEqual(r4);
            expect(lamb.zip([], a1)).toEqual([]);
        });

        it("should work with array-like objects", function () {
            expect(lamb.zip(a1, "abc")).toEqual([[1, "a"], [2, "b"], [3, "c"]]);
        });

        it("should build dense arrays when sparse ones are received", function () {
            expect(lamb.zip(a2, Array(4))).toStrictArrayEqual([[5, void 0], [6, void 0], [7, void 0]]);
        });
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", function () {
        expect(function () { lamb.transpose(null); }).toThrow();
        expect(function () { lamb.transpose(void 0); }).toThrow();
        expect(function () { lamb.zip(null); }).toThrow();
        expect(function () { lamb.zip(void 0); }).toThrow();
        expect(function () { lamb.zip([1, 2], null); }).toThrow();
        expect(function () { lamb.zip([1, 2], void 0); }).toThrow();
        expect(function () { lamb.zip([], null); }).toThrow();
        expect(function () { lamb.zip([], void 0); }).toThrow();

        expect(lamb.transpose).toThrow();
        expect(lamb.zip).toThrow();
    });

    it("should treat every other value as an empty array", function () {
        wannabeEmptyArrays.forEach(function (value) {
            expect(lamb.transpose(value)).toEqual([]);
            expect(lamb.zip(value, [1, 2])).toEqual([]);
            expect(lamb.zip([1, 2], value)).toEqual([]);
        });
    });
});
