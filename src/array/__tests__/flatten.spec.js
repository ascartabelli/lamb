import * as lamb from "../..";
import { wannabeEmptyArrays } from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("flatten", function () {
    it("should return a deep flattened array", function () {
        var a1 = [[1, [2, [3, 4, ["a", ["b", ["c"]]]]]]];
        var a2 = [1, 2, [3, 4, [5, 6]], 7, 8];

        expect(lamb.flatten(a1)).toEqual([1, 2, 3, 4, "a", "b", "c"]);
        expect(lamb.flatten(a2)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    });

    it("shouldn't flatten an array that is a value in an object", function () {
        var input = [["a", ["b", [{ c: ["d"] }]]]];

        expect(lamb.flatten(input)).toEqual(["a", "b", { c: ["d"] }]);
    });

    it("should return an array copy of the source object if supplied with an array-like", function () {
        expect(lamb.flatten("foo")).toEqual(["f", "o", "o"]);
    });

    it("should always return dense arrays", function () {
        // eslint-disable-next-line no-sparse-arrays
        var arr = [1, [2, , 4], , [6, , [8, , 10]]];
        var result = [1, 2, void 0, 4, void 0, 6, void 0, 8, void 0, 10];

        expect(lamb.flatten(arr)).toStrictArrayEqual(result);
    });

    it("should throw an exception if called without arguments", function () {
        expect(lamb.flatten).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", function () {
        expect(function () { lamb.flatten(null); }).toThrow();
        expect(function () { lamb.flatten(void 0); }).toThrow();
    });

    it("should treat every other value as an empty array", function () {
        wannabeEmptyArrays.forEach(function (value) {
            expect(lamb.flatten(value)).toEqual([]);
        });
    });
});
