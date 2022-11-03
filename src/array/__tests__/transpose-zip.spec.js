import transpose from "../transpose";
import zip from "../zip";
import { wannabeEmptyArrays } from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("transpose / zip", () => {
    const a1 = [1, 2, 3, 4];
    const a2 = [5, 6, 7];
    const a3 = [8, 9];

    const r1 = [[1], [2], [3], [4]];
    const r2 = [[1, 5], [2, 6], [3, 7]];
    const r3 = [[1, 5, 8], [2, 6, 9]];
    const r4 = [[5, 8], [6, 9]];

    describe("transpose", () => {
        it("should transpose a matrix", () => {
            expect(transpose([])).toStrictEqual([]);
            expect(transpose([1, 2, 3])).toStrictEqual([]);
            expect(transpose(r1)).toStrictEqual([a1]);
            expect(transpose(r2)).toStrictEqual([[1, 2, 3], [5, 6, 7]]);
            expect(transpose(r3)).toStrictEqual([[1, 2], [5, 6], [8, 9]]);
        });

        it("should work with array-like objects", () => {
            function fn () {
                return transpose(arguments);
            }

            expect(fn("abc", [1, 2, 3])).toStrictEqual([["a", 1], ["b", 2], ["c", 3]]);
        });

        it("should build dense arrays when sparse ones are received", () => {
            // eslint-disable-next-line comma-spacing, no-sparse-arrays
            expect(transpose([[1, , 3], [4, 5, void 0], [6, 7, ,]])).toStrictArrayEqual([
                [1, 4, 6],
                [void 0, 5, 7],
                [3, void 0, void 0]
            ]);
        });

        it("should throw an exception when a value in the array-like is `nil`", () => {
            expect(() => { transpose([null, [1, 2, 3]]); }).toThrow();
            expect(() => { transpose([[1, 2, 3], null]); }).toThrow();
            expect(() => { transpose([void 0, [1, 2, 3]]); }).toThrow();
            expect(() => { transpose([[1, 2, 3], void 0]); }).toThrow();
        });

        it("should consider other non-array-like values contained in the main array-like as empty arrays", () => {
            wannabeEmptyArrays.forEach(value => {
                expect(transpose([[1, 2, 3], value])).toStrictEqual([]);
                expect(transpose([value, [1, 2, 3]])).toStrictEqual([]);
            });
        });
    });

    describe("zip", () => {
        it("should pair items with the same index in the received lists", () => {
            expect(zip(a1, a2)).toStrictEqual(r2);
            expect(zip(a2, a3)).toStrictEqual(r4);
            expect(zip([], a1)).toStrictEqual([]);
        });

        it("should work with array-like objects", () => {
            expect(zip(a1, "abc")).toStrictEqual([[1, "a"], [2, "b"], [3, "c"]]);
        });

        it("should build dense arrays when sparse ones are received", () => {
            expect(zip(a2, Array(4))).toStrictArrayEqual([[5, void 0], [6, void 0], [7, void 0]]);
        });
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", () => {
        expect(() => { transpose(null); }).toThrow();
        expect(() => { transpose(void 0); }).toThrow();
        expect(() => { zip(null); }).toThrow();
        expect(() => { zip(void 0); }).toThrow();
        expect(() => { zip([1, 2], null); }).toThrow();
        expect(() => { zip([1, 2], void 0); }).toThrow();
        expect(() => { zip([], null); }).toThrow();
        expect(() => { zip([], void 0); }).toThrow();

        expect(transpose).toThrow();
        expect(zip).toThrow();
    });

    it("should treat every other value as an empty array", () => {
        wannabeEmptyArrays.forEach(value => {
            expect(transpose(value)).toStrictEqual([]);
            expect(zip(value, [1, 2])).toStrictEqual([]);
            expect(zip([1, 2], value)).toStrictEqual([]);
        });
    });
});
