import * as lamb from "../..";
import { wannabeEmptyArrays } from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("tail", function () {
    it("should return a copy of the given array-like object without the first element", function () {
        var arr = [1, 2, 3, 4, 5];

        expect(lamb.tail(arr)).toEqual([2, 3, 4, 5]);
        expect(arr.length).toBe(5);
        expect(lamb.tail("shell")).toEqual(["h", "e", "l", "l"]);
    });

    it("should return an empty array when called with an empty array or an array holding only one element", function () {
        expect(lamb.tail([1])).toEqual([]);
        expect(lamb.tail([])).toEqual([]);
    });

    it("should always return dense arrays", function () {
        // eslint-disable-next-line comma-spacing, no-sparse-arrays
        expect(lamb.tail([1, , 3, ,])).toStrictArrayEqual([void 0, 3, void 0]);
        expect(lamb.tail(Array(2))).toStrictArrayEqual([void 0]);
        expect(lamb.tail(Array(1))).toStrictArrayEqual([]);
    });

    it("should throw an exception if called without arguments", function () {
        expect(lamb.tail).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined`", function () {
        expect(function () { lamb.tail(null); }).toThrow();
        expect(function () { lamb.tail(void 0); }).toThrow();
    });

    it("should treat every other value as an empty array", function () {
        wannabeEmptyArrays.forEach(function (value) {
            expect(lamb.tail(value)).toEqual([]);
        });
    });
});
