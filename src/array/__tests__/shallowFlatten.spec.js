import shallowFlatten from "../shallowFlatten";
import { wannabeEmptyArrays } from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("shallowFlatten", () => {
    it("should return a shallow flattened array", () => {
        const a1 = [[1, [2, [3, ["a", ["b", ["c"]]]]]]];
        const a2 = [1, 2, [3, 4, [5, 6]], 7, 8];

        expect(shallowFlatten(a1)).toStrictEqual([1, [2, [3, ["a", ["b", ["c"]]]]]]);
        expect(shallowFlatten(a2)).toStrictEqual([1, 2, 3, 4, [5, 6], 7, 8]);
    });

    it("shouldn't flatten an array that is a value in an object", () => {
        const input = ["a", "b", { c: ["d"] }];

        expect(shallowFlatten(input)).toStrictEqual(input);
    });

    it("should return an array copy of the source object if supplied with an array-like", () => {
        expect(shallowFlatten("foo")).toStrictEqual(["f", "o", "o"]);
    });

    it("should always return dense arrays", () => {
        /* eslint-disable no-sparse-arrays */
        const arr = [1, [2, , 4], , [6, , [8, , 10]]];
        const result = [1, 2, void 0, 4, void 0, 6, void 0, [8, , 10]];
        /* eslint-enable no-sparse-arrays */

        expect(shallowFlatten(arr)).toStrictArrayEqual(result);
    });

    it("should throw an exception if called without arguments", () => {
        expect(shallowFlatten).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", () => {
        expect(() => { shallowFlatten(null); }).toThrow();
        expect(() => { shallowFlatten(void 0); }).toThrow();
    });

    it("should treat every other value as an empty array", () => {
        wannabeEmptyArrays.forEach(value => {
            expect(shallowFlatten(value)).toStrictEqual([]);
        });
    });
});
