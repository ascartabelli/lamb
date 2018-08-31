import * as lamb from "../..";
import { wannabeEmptyArrays } from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("reverse", function () {
    it("should reverse a copy of an array-like object", function () {
        var arr = [1, 2, 3, 4, 5];
        var s = "hello";

        expect(lamb.reverse(arr)).toEqual([5, 4, 3, 2, 1]);
        expect(lamb.reverse(s)).toEqual(["o", "l", "l", "e", "h"]);
        expect(arr).toEqual([1, 2, 3, 4, 5]);
    });

    it("should always return dense arrays", function () {
        // eslint-disable-next-line no-sparse-arrays
        expect(lamb.reverse([1, , 3])).toStrictArrayEqual([3, void 0, 1]);
    });

    it("should throw an exception if called without arguments", function () {
        expect(lamb.reverse).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", function () {
        expect(function () { lamb.reverse(null); }).toThrow();
        expect(function () { lamb.reverse(void 0); }).toThrow();
    });

    it("should treat every other value as an empty array", function () {
        wannabeEmptyArrays.forEach(function (value) {
            expect(lamb.reverse(value)).toEqual([]);
        });
    });
});
