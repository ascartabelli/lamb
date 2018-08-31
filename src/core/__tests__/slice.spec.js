import * as lamb from "../..";
import { wannabeEmptyArrays, zeroesAsIntegers } from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("slice / sliceAt", function () {
    var arr = [1, 2, 3, 4, 5, 6];
    var arrCopy = arr.slice();
    var s = "hello world";
    var users = [{ name: "Jane" }, { name: "John" }, { name: "Mario" }, { name: "Paolo" }];
    var usersCopy = [{ name: "Jane" }, { name: "John" }, { name: "Mario" }, { name: "Paolo" }];

    afterEach(function () {
        expect(arr).toEqual(arrCopy);
        expect(users).toEqual(usersCopy);
    });

    it("should return a copy of the desired portion of an array", function () {
        expect(lamb.slice(arr, 0, 3)).toEqual([1, 2, 3]);
        expect(lamb.sliceAt(0, 3)(arr)).toEqual([1, 2, 3]);

        var usersSliceA = lamb.slice(users, 1, 3);
        var usersSliceB = lamb.sliceAt(1, 3)(users);

        expect(usersSliceA).toEqual([{ name: "John" }, { name: "Mario" }]);
        expect(usersSliceA[0]).toBe(users[1]);
        expect(usersSliceA[1]).toBe(users[2]);
        expect(usersSliceB).toEqual([{ name: "John" }, { name: "Mario" }]);
        expect(usersSliceB[0]).toBe(users[1]);
        expect(usersSliceB[1]).toBe(users[2]);
    });

    it("should work on array-like objects", function () {
        expect(lamb.slice(s, 1, 3)).toEqual(["e", "l"]);
        expect(lamb.sliceAt(1, 3)(s)).toEqual(["e", "l"]);
    });

    it("should return an array copy of the array-like if the desired slice encompasses the whole array-like", function () {
        var r1 = lamb.slice(arr, 0, arr.length);
        var r2 = lamb.sliceAt(0, arr.length)(arr);

        expect(r1).toEqual(arrCopy);
        expect(r2).toEqual(arrCopy);
        expect(r1).not.toBe(arr);
        expect(r2).not.toBe(arr);
        expect(lamb.slice(s, 0, s.length)).toEqual(s.split(""));
        expect(lamb.sliceAt(0, s.length)(s)).toEqual(s.split(""));
    });

    it("should accept negative indexes in the `start` parameter", function () {
        expect(lamb.slice(arr, -3, 5)).toEqual([4, 5]);
        expect(lamb.slice(s, -5, 9)).toEqual(["w", "o", "r"]);

        expect(lamb.sliceAt(-3, 5)(arr)).toEqual([4, 5]);
        expect(lamb.sliceAt(-5, 9)(s)).toEqual(["w", "o", "r"]);
    });

    it("should accept negative indexes in the `end` parameter", function () {
        expect(lamb.slice(arr, 2, -2)).toEqual([3, 4]);
        expect(lamb.slice(s, 2, -2)).toEqual(["l", "l", "o", " ", "w", "o", "r"]);

        expect(lamb.sliceAt(2, -2)(arr)).toEqual([3, 4]);
        expect(lamb.sliceAt(2, -2)(s)).toEqual(["l", "l", "o", " ", "w", "o", "r"]);
    });

    it("should slice from the beginning of the array-like if the `start` parameter is less than or equal to the additive inverse of the array-like length", function () {
        expect(lamb.slice(arr, -20, 3)).toEqual([1, 2, 3]);
        expect(lamb.slice(arr, -arr.length, 3)).toEqual([1, 2, 3]);
        expect(lamb.slice(s, -20, 4)).toEqual(["h", "e", "l", "l"]);
        expect(lamb.slice(s, -s.length, 4)).toEqual(["h", "e", "l", "l"]);

        expect(lamb.sliceAt(-20, 3)(arr)).toEqual([1, 2, 3]);
        expect(lamb.sliceAt(-arr.length, 3)(arr)).toEqual([1, 2, 3]);
        expect(lamb.sliceAt(-20, 4)(s)).toEqual(["h", "e", "l", "l"]);
        expect(lamb.sliceAt(-s.length, 4)(s)).toEqual(["h", "e", "l", "l"]);
    });

    it("should slice to the end of the array-like if the `end` parameter is greater than its length", function () {
        expect(lamb.slice(arr, 3, 30)).toEqual([4, 5, 6]);
        expect(lamb.slice(s, 8, 40)).toEqual(["r", "l", "d"]);

        expect(lamb.sliceAt(3, 30)(arr)).toEqual([4, 5, 6]);
        expect(lamb.sliceAt(8, 40)(s)).toEqual(["r", "l", "d"]);
    });

    it("should return an empty array if `start` is greater than or equal to the length of the array-like", function () {
        expect(lamb.slice(arr, 6, 6)).toEqual([]);
        expect(lamb.slice(arr, 6, -1)).toEqual([]);
        expect(lamb.slice(arr, 7, -1)).toEqual([]);
        expect(lamb.slice(s, 11, 11)).toEqual([]);
        expect(lamb.slice(s, 11, -1)).toEqual([]);
        expect(lamb.slice(s, 12, -1)).toEqual([]);

        expect(lamb.sliceAt(6, 6)(arr)).toEqual([]);
        expect(lamb.sliceAt(6, -1)(arr)).toEqual([]);
        expect(lamb.sliceAt(7, -1)(arr)).toEqual([]);
        expect(lamb.sliceAt(11, 11)(s)).toEqual([]);
        expect(lamb.sliceAt(11, -1)(s)).toEqual([]);
        expect(lamb.sliceAt(12, -1)(s)).toEqual([]);
    });

    it("should return an empty array if `start` is greater than or equal to `end` (as natural indexes)", function () {
        expect(lamb.slice(arr, 4, 4)).toEqual([]);
        expect(lamb.slice(arr, 5, 4)).toEqual([]);
        expect(lamb.slice(arr, -5, -40)).toEqual([]);
        expect(lamb.slice(s, 4, 4)).toEqual([]);
        expect(lamb.slice(s, 5, 4)).toEqual([]);
        expect(lamb.slice(s, -5, -40)).toEqual([]);

        expect(lamb.sliceAt(4, 4)(arr)).toEqual([]);
        expect(lamb.sliceAt(5, 4)(arr)).toEqual([]);
        expect(lamb.sliceAt(-5, -40)(arr)).toEqual([]);
        expect(lamb.sliceAt(4, 4)(s)).toEqual([]);
        expect(lamb.sliceAt(5, 4)(s)).toEqual([]);
        expect(lamb.sliceAt(-5, -40)(s)).toEqual([]);
    });

    it("should convert to integer any value received as `start` or `end` following ECMA specifications", function () {
        // see https://www.ecma-international.org/ecma-262/7.0/#sec-tointeger

        expect(lamb.slice(arr, new Date(1), new Date(4))).toEqual([2, 3, 4]);
        expect(lamb.slice(arr, 1.8, 4.9)).toEqual([2, 3, 4]);
        expect(lamb.slice(arr, null, 3)).toEqual([1, 2, 3]);
        expect(lamb.slice(arr, 1, null)).toEqual([]);
        expect(lamb.slice(arr, "1.8", "4.9")).toEqual([2, 3, 4]);
        expect(lamb.slice(arr, false, true)).toEqual([1]);
        expect(lamb.slice(arr, [1.8], [4.9])).toEqual([2, 3, 4]);
        expect(lamb.slice(arr, ["1.8"], ["4.9"])).toEqual([2, 3, 4]);

        expect(lamb.slice(s, new Date(1), new Date(3))).toEqual(["e", "l"]);
        expect(lamb.slice(s, 1.8, 3.9)).toEqual(["e", "l"]);
        expect(lamb.slice(s, null, 3)).toEqual(["h", "e", "l"]);
        expect(lamb.slice(s, 1, null)).toEqual([]);
        expect(lamb.slice(s, "1.8", "4.9")).toEqual(["e", "l", "l"]);
        expect(lamb.slice(s, false, true)).toEqual(["h"]);
        expect(lamb.slice(s, [1.8], [4.9])).toEqual(["e", "l", "l"]);
        expect(lamb.slice(s, ["1.8"], ["4.9"])).toEqual(["e", "l", "l"]);

        expect(lamb.sliceAt(new Date(1), new Date(4))(arr)).toEqual([2, 3, 4]);
        expect(lamb.sliceAt(1.8, 4.9)(arr)).toEqual([2, 3, 4]);
        expect(lamb.sliceAt(null, 3)(arr)).toEqual([1, 2, 3]);
        expect(lamb.sliceAt(1, null)(arr)).toEqual([]);
        expect(lamb.sliceAt("1.8", "4.9")(arr)).toEqual([2, 3, 4]);
        expect(lamb.sliceAt(false, true)(arr)).toEqual([1]);
        expect(lamb.sliceAt([1.8], [4.9])(arr)).toEqual([2, 3, 4]);
        expect(lamb.sliceAt(["1.8"], ["4.9"])(arr)).toEqual([2, 3, 4]);

        expect(lamb.sliceAt(new Date(1), new Date(3))(s)).toEqual(["e", "l"]);
        expect(lamb.sliceAt(1.8, 3.9)(s)).toEqual(["e", "l"]);
        expect(lamb.sliceAt(null, 3)(s)).toEqual(["h", "e", "l"]);
        expect(lamb.sliceAt(1, null)(s)).toEqual([]);
        expect(lamb.sliceAt("1.8", "4.9")(s)).toEqual(["e", "l", "l"]);
        expect(lamb.sliceAt(false, true)(s)).toEqual(["h"]);
        expect(lamb.sliceAt([1.8], [4.9])(s)).toEqual(["e", "l", "l"]);
        expect(lamb.sliceAt(["1.8"], ["4.9"])(s)).toEqual(["e", "l", "l"]);

        expect(lamb.slice(arr, -4.8, -2.9)).toEqual([3, 4]);
        expect(lamb.slice(arr, "-4.8", "-2.9")).toEqual([3, 4]);
        expect(lamb.slice(arr, [-4.8], [-2.9])).toEqual([3, 4]);

        expect(lamb.slice(s, -4.8, -2.9)).toEqual(["o", "r"]);
        expect(lamb.slice(s, "-4.8", "-2.9")).toEqual(["o", "r"]);
        expect(lamb.slice(s, [-4.8], [-2.9])).toEqual(["o", "r"]);

        expect(lamb.sliceAt(-4.8, -2.9)(arr)).toEqual([3, 4]);
        expect(lamb.sliceAt("-4.8", "-2.9")(arr)).toEqual([3, 4]);
        expect(lamb.sliceAt([-4.8], [-2.9])(arr)).toEqual([3, 4]);

        expect(lamb.sliceAt(-4.8, -2.9)(s)).toEqual(["o", "r"]);
        expect(lamb.sliceAt("-4.8", "-2.9")(s)).toEqual(["o", "r"]);
        expect(lamb.sliceAt([-4.8], [-2.9])(s)).toEqual(["o", "r"]);

        zeroesAsIntegers.forEach(function (value) {
            expect(lamb.slice(arr, value, arr.length)).toEqual(arrCopy);
            expect(lamb.slice(s, value, s.length)).toEqual(s.split(""));
            expect(lamb.slice(arr, 0, value)).toEqual([]);
            expect(lamb.slice(s, 0, value)).toEqual([]);

            expect(lamb.sliceAt(value, arr.length)(arr)).toEqual(arrCopy);
            expect(lamb.sliceAt(value, s.length)(s)).toEqual(s.split(""));
            expect(lamb.sliceAt(0, value)(arr)).toEqual([]);
            expect(lamb.sliceAt(0, value)(s)).toEqual([]);
        });
    });

    it("should interpret as zeroes missing values in the `start` or `end` parameter", function () {
        expect(lamb.slice(arr, 0)).toEqual([]);
        expect(lamb.slice(s, 0)).toEqual([]);
        expect(lamb.sliceAt(0)(arr)).toEqual([]);
        expect(lamb.sliceAt(0)(s)).toEqual([]);

        expect(lamb.slice(arr)).toEqual([]);
        expect(lamb.sliceAt()(arr)).toEqual([]);
        expect(lamb.slice(s)).toEqual([]);
        expect(lamb.sliceAt()(s)).toEqual([]);
    });

    it("should return an array with `undefined` values in place of unassigned or deleted indexes if a sparse array is received", function () {
        // eslint-disable-next-line comma-spacing, no-sparse-arrays
        var aSparse = [, 1, 2, , 4, , ,]; // length === 7, same as aDense
        var aDense = [void 0, 1, 2, void 0, 4, void 0, void 0];
        var r1 = lamb.slice(aSparse, 0, aSparse.length);
        var r2 = lamb.sliceAt(0, aSparse.length)(aSparse);

        expect(r1).toStrictArrayEqual(aDense);
        expect(r1).not.toStrictArrayEqual(aSparse);
        expect(r2).toStrictArrayEqual(aDense);
        expect(r2).not.toStrictArrayEqual(aSparse);
    });

    it("should try, as native `slice` does, to retrieve elements from objects with a `length` property, but it should always build dense arrays", function () {
        var objs = [
            { length: 3, 0: 1, 1: 2, 2: 3 },
            { length: 3, 0: 1, 2: 3 },
            { length: "2", 0: 1, 1: 2, 2: 3 },
            { length: "-2", 0: 1, 1: 2, 2: 3 }
        ];

        var results = [ [2, 3], [void 0, 3], [2], [] ];

        objs.forEach(function (obj, idx) {
            expect(lamb.slice(obj, 1, 3)).toStrictArrayEqual(results[idx]);
            expect(lamb.sliceAt(1, 3)(obj)).toStrictArrayEqual(results[idx]);
        });

        var oSparse = { length: 2 };
        var rSparse = Array(2);
        var rDense = [void 0, void 0];

        expect(lamb.slice(oSparse, 0, oSparse.length)).toStrictArrayEqual(rDense);
        expect(lamb.slice(oSparse, 0, oSparse.length)).not.toStrictArrayEqual(rSparse);
        expect(lamb.sliceAt(0, oSparse.length)(oSparse)).toStrictArrayEqual(rDense);
        expect(lamb.sliceAt(0, oSparse.length)(oSparse)).not.toStrictArrayEqual(rSparse);
    });

    it("should work with array-like lengths up to 2^32 - 1", function () {
        var maxLen = Math.pow(2, 32) - 1;
        var maxIndex = maxLen - 1;
        var obj = { length: maxLen + 100 };

        obj[maxIndex] = 99;
        obj[maxIndex + 1] = 88;

        expect(lamb.slice(obj, -1, obj.length)).toEqual([99]);
        expect(lamb.sliceAt(-1, obj.length)(obj)).toEqual([99]);
    });

    it("should throw an exception if it receives `null` or `undefined` instead of an array-like or if it's called without parameters", function () {
        expect(function () { lamb.slice(null, 1, 2); }).toThrow();
        expect(function () { lamb.slice(void 0, 1, 2); }).toThrow();
        expect(function () { lamb.sliceAt(1, 2)(null); }).toThrow();
        expect(function () { lamb.sliceAt(1, 2)(void 0); }).toThrow();

        expect(lamb.slice).toThrow();
        expect(lamb.sliceAt()).toThrow();
    });

    it("should treat every other value as an empty array", function () {
        wannabeEmptyArrays.forEach(function (value) {
            expect(lamb.slice(value, 0, 2)).toEqual([]);
            expect(lamb.sliceAt(0, 2)(value)).toEqual([]);
        });
    });
});
