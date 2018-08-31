import * as lamb from "../..";
import { wannabeEmptyArrays } from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("flatMap / flatMapWith", function () {
    it("should behave like map if the mapping function returns a non-array value", function () {
        var double = function (n, idx, list) {
            expect(list).toBe(arr);
            expect(list[idx]).toBe(n);

            return n * 2;
        };
        var arr = [1, 2, 3, 4, 5];
        var result = [2, 4, 6, 8, 10];

        expect(lamb.flatMap(arr, double)).toEqual(result);
        expect(lamb.flatMapWith(double)(arr)).toEqual(result);
    });

    it("should concatenate arrays returned by the mapping function to the result", function () {
        var splitString = function (s) {
            return s.split("");
        };
        var arr = ["foo", "bar", "baz"];
        var result = ["f", "o", "o", "b", "a", "r", "b", "a", "z"];

        expect(lamb.flatMap(arr, splitString)).toEqual(result);
        expect(lamb.flatMapWith(splitString)(arr)).toEqual(result);
    });

    it("should keeps its behaviour consistent even if the received function returns mixed results", function () {
        var fn = function (n, idx, list) {
            expect(list).toBe(arr);
            expect(list[idx]).toBe(n);

            return n % 2 === 0 ? [n, n + 10] : n * 2;
        };
        var arr = [1, 2, 3, 4, 5];
        var result = [2, 2, 12, 6, 4, 14, 10];

        expect(lamb.flatMap(arr, fn)).toEqual(result);
        expect(lamb.flatMapWith(fn)(arr)).toEqual(result);
    });

    it("should not flatten nested arrays", function () {
        var splitString = function (s) {
            return String(s) === s ? s.split("") : [[s, "not a string"]];
        };
        var arr = ["foo", "bar", 5, "baz"];
        var result = ["f", "o", "o", "b", "a", "r", [5, "not a string"], "b", "a", "z"];

        expect(lamb.flatMap(arr, splitString)).toEqual(result);
        expect(lamb.flatMapWith(splitString)(arr)).toEqual(result);

        var arr2 = ["foo", ["bar", ["baz"]]];
        var result2 = ["foo", "bar", ["baz"]];

        expect(lamb.flatMap(arr2, lamb.identity)).toEqual(result2);
        expect(lamb.flatMapWith(lamb.identity)(arr2)).toEqual(result2);
    });

    it("should work on array-like objects", function () {
        var toUpperCase = lamb.generic(String.prototype.toUpperCase);
        var testString = "hello world";
        var result = ["H", "E", "L", "L", "O", " ", "W", "O", "R", "L", "D"];

        expect(lamb.flatMap(testString, toUpperCase)).toEqual(result);
        expect(lamb.flatMapWith(toUpperCase)(testString)).toEqual(result);
    });

    it("should always return dense arrays", function () {
        /* eslint-disable comma-spacing, no-sparse-arrays */
        var fn = function (v) { return [, v, ,]; };
        var arr = [1, , 3];
        /* eslint-enable comma-spacing, no-sparse-arrays */

        var result = [void 0, 1, void 0, void 0, void 0, void 0, void 0, 3, void 0];

        expect(lamb.flatMap(arr, fn)).toStrictArrayEqual(result);
        expect(lamb.flatMapWith(fn)(arr)).toStrictArrayEqual(result);
    });

    it("should throw an exception if not supplied with a mapper function", function () {
        expect(function () {lamb.flatMap([1, 2, 3]);}).toThrow();
        expect(function () {lamb.flatMapWith()([1, 2, 3]);}).toThrow();
    });

    it("should throw an exception if called without the data argument", function () {
        expect(lamb.flatMap).toThrow();
        expect(lamb.flatMapWith(lamb.identity)).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", function () {
        expect(function () { lamb.flatMap(null, lamb.identity); }).toThrow();
        expect(function () { lamb.flatMap(void 0, lamb.identity); }).toThrow();
        expect(function () { lamb.flatMapWith(lamb.identity)(null); }).toThrow();
        expect(function () { lamb.flatMapWith(lamb.identity)(void 0); }).toThrow();
    });

    it("should return an empty array for every other value", function () {
        wannabeEmptyArrays.forEach(function (value) {
            expect(lamb.flatMap(value, lamb.identity)).toEqual([]);
            expect(lamb.flatMapWith(lamb.identity)(value)).toEqual([]);
        });
    });
});
