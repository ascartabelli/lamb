import * as lamb from "../..";
import { wannabeEmptyArrays } from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("init", function () {
    it("should return a copy of the given array-like object without the last element", function () {
        var arr = [1, 2, 3, 4, 5];

        expect(lamb.init(arr)).toEqual([1, 2, 3, 4]);
        expect(arr.length).toBe(5);
        expect(lamb.init("hello")).toEqual(["h", "e", "l", "l"]);
    });

    it("should return an empty array when called with an empty array or an array holding only one element", function () {
        expect(lamb.init([1])).toEqual([]);
        expect(lamb.init([])).toEqual([]);
    });

    it("should always return dense arrays", function () {
        // eslint-disable-next-line no-sparse-arrays
        expect(lamb.init([1, , 3, , 4])).toStrictArrayEqual([1, void 0, 3, void 0]);
        expect(lamb.init(Array(2))).toStrictArrayEqual([void 0]);
    });

    it("should throw an exception if called without arguments", function () {
        expect(lamb.init).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", function () {
        expect(function () { lamb.init(null); }).toThrow();
        expect(function () { lamb.init(void 0); }).toThrow();
    });

    it("should return an empty array for every other value", function () {
        wannabeEmptyArrays.forEach(function (value) {
            expect(lamb.init(value)).toEqual([]);
        });
    });
});
