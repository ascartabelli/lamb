import flatten from "../flatten";
import { wannabeEmptyArrays } from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("flatten", () => {
    it("should return a deep flattened array", () => {
        const a1 = [[1, [2, [3, 4, ["a", ["b", ["c"]]]]]]];
        const a2 = [1, 2, [3, 4, [5, 6]], 7, 8];

        expect(flatten(a1)).toStrictEqual([1, 2, 3, 4, "a", "b", "c"]);
        expect(flatten(a2)).toStrictEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    });

    it("shouldn't flatten an array that is a value in an object", () => {
        const input = [["a", ["b", [{ c: ["d"] }]]]];

        expect(flatten(input)).toStrictEqual(["a", "b", { c: ["d"] }]);
    });

    it("should return an array copy of the source object if supplied with an array-like", () => {
        expect(flatten("foo")).toStrictEqual(["f", "o", "o"]);
    });

    it("should always return dense arrays", () => {
        // eslint-disable-next-line no-sparse-arrays
        const arr = [1, [2, , 4], , [6, , [8, , 10]]];
        const result = [1, 2, void 0, 4, void 0, 6, void 0, 8, void 0, 10];

        expect(flatten(arr)).toStrictArrayEqual(result);
    });

    it("should throw an exception if called without arguments", () => {
        expect(flatten).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", () => {
        expect(() => { flatten(null); }).toThrow();
        expect(() => { flatten(void 0); }).toThrow();
    });

    it("should treat every other value as an empty array", () => {
        wannabeEmptyArrays.forEach(value => {
            expect(flatten(value)).toStrictEqual([]);
        });
    });
});
