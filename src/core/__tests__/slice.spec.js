import slice from "../slice";
import sliceAt from "../sliceAt";
import { wannabeEmptyArrays, zeroesAsIntegers } from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("slice / sliceAt", () => {
    const arr = [1, 2, 3, 4, 5, 6];
    const arrCopy = arr.slice();
    const s = "hello world";
    const users = [
        { name: "Jane" },
        { name: "John" },
        { name: "Mario" },
        { name: "Paolo" }
    ];
    const usersCopy = [
        { name: "Jane" },
        { name: "John" },
        { name: "Mario" },
        { name: "Paolo" }
    ];

    afterEach(() => {
        expect(arr).toStrictEqual(arrCopy);
        expect(users).toStrictEqual(usersCopy);
    });

    it("should return a copy of the desired portion of an array", () => {
        expect(slice(arr, 0, 3)).toStrictEqual([1, 2, 3]);
        expect(sliceAt(0, 3)(arr)).toStrictEqual([1, 2, 3]);

        const usersSliceA = slice(users, 1, 3);
        const usersSliceB = sliceAt(1, 3)(users);

        expect(usersSliceA).toStrictEqual([{ name: "John" }, { name: "Mario" }]);
        expect(usersSliceA[0]).toBe(users[1]);
        expect(usersSliceA[1]).toBe(users[2]);
        expect(usersSliceB).toStrictEqual([{ name: "John" }, { name: "Mario" }]);
        expect(usersSliceB[0]).toBe(users[1]);
        expect(usersSliceB[1]).toBe(users[2]);
    });

    it("should work on array-like objects", () => {
        expect(slice(s, 1, 3)).toStrictEqual(["e", "l"]);
        expect(sliceAt(1, 3)(s)).toStrictEqual(["e", "l"]);
    });

    it("should return an array copy of the array-like if the desired slice encompasses the whole array-like", () => {
        const r1 = slice(arr, 0, arr.length);
        const r2 = sliceAt(0, arr.length)(arr);

        expect(r1).toStrictEqual(arrCopy);
        expect(r2).toStrictEqual(arrCopy);
        expect(r1).not.toBe(arr);
        expect(r2).not.toBe(arr);
        expect(slice(s, 0, s.length)).toStrictEqual(s.split(""));
        expect(sliceAt(0, s.length)(s)).toStrictEqual(s.split(""));
    });

    it("should accept negative indexes in the `start` parameter", () => {
        expect(slice(arr, -3, 5)).toStrictEqual([4, 5]);
        expect(slice(s, -5, 9)).toStrictEqual(["w", "o", "r"]);

        expect(sliceAt(-3, 5)(arr)).toStrictEqual([4, 5]);
        expect(sliceAt(-5, 9)(s)).toStrictEqual(["w", "o", "r"]);
    });

    it("should accept negative indexes in the `end` parameter", () => {
        expect(slice(arr, 2, -2)).toStrictEqual([3, 4]);
        expect(slice(s, 2, -2)).toStrictEqual(["l", "l", "o", " ", "w", "o", "r"]);

        expect(sliceAt(2, -2)(arr)).toStrictEqual([3, 4]);
        expect(sliceAt(2, -2)(s)).toStrictEqual(["l", "l", "o", " ", "w", "o", "r"]);
    });

    it("should slice from the beginning of the array-like if the `start` parameter is less than or equal to the additive inverse of the array-like length", () => {
        expect(slice(arr, -20, 3)).toStrictEqual([1, 2, 3]);
        expect(slice(arr, -arr.length, 3)).toStrictEqual([1, 2, 3]);
        expect(slice(s, -20, 4)).toStrictEqual(["h", "e", "l", "l"]);
        expect(slice(s, -s.length, 4)).toStrictEqual(["h", "e", "l", "l"]);

        expect(sliceAt(-20, 3)(arr)).toStrictEqual([1, 2, 3]);
        expect(sliceAt(-arr.length, 3)(arr)).toStrictEqual([1, 2, 3]);
        expect(sliceAt(-20, 4)(s)).toStrictEqual(["h", "e", "l", "l"]);
        expect(sliceAt(-s.length, 4)(s)).toStrictEqual(["h", "e", "l", "l"]);
    });

    it("should slice to the end of the array-like if the `end` parameter is greater than its length", () => {
        expect(slice(arr, 3, 30)).toStrictEqual([4, 5, 6]);
        expect(slice(s, 8, 40)).toStrictEqual(["r", "l", "d"]);

        expect(sliceAt(3, 30)(arr)).toStrictEqual([4, 5, 6]);
        expect(sliceAt(8, 40)(s)).toStrictEqual(["r", "l", "d"]);
    });

    it("should return an empty array if `start` is greater than or equal to the length of the array-like", () => {
        expect(slice(arr, 6, 6)).toStrictEqual([]);
        expect(slice(arr, 6, -1)).toStrictEqual([]);
        expect(slice(arr, 7, -1)).toStrictEqual([]);
        expect(slice(s, 11, 11)).toStrictEqual([]);
        expect(slice(s, 11, -1)).toStrictEqual([]);
        expect(slice(s, 12, -1)).toStrictEqual([]);

        expect(sliceAt(6, 6)(arr)).toStrictEqual([]);
        expect(sliceAt(6, -1)(arr)).toStrictEqual([]);
        expect(sliceAt(7, -1)(arr)).toStrictEqual([]);
        expect(sliceAt(11, 11)(s)).toStrictEqual([]);
        expect(sliceAt(11, -1)(s)).toStrictEqual([]);
        expect(sliceAt(12, -1)(s)).toStrictEqual([]);
    });

    it("should return an empty array if `start` is greater than or equal to `end` (as natural indexes)", () => {
        expect(slice(arr, 4, 4)).toStrictEqual([]);
        expect(slice(arr, 5, 4)).toStrictEqual([]);
        expect(slice(arr, -5, -40)).toStrictEqual([]);
        expect(slice(s, 4, 4)).toStrictEqual([]);
        expect(slice(s, 5, 4)).toStrictEqual([]);
        expect(slice(s, -5, -40)).toStrictEqual([]);

        expect(sliceAt(4, 4)(arr)).toStrictEqual([]);
        expect(sliceAt(5, 4)(arr)).toStrictEqual([]);
        expect(sliceAt(-5, -40)(arr)).toStrictEqual([]);
        expect(sliceAt(4, 4)(s)).toStrictEqual([]);
        expect(sliceAt(5, 4)(s)).toStrictEqual([]);
        expect(sliceAt(-5, -40)(s)).toStrictEqual([]);
    });

    it("should convert to integer any value received as `start` or `end` following ECMA specifications", () => {
        // see https://www.ecma-international.org/ecma-262/7.0/#sec-tointeger

        expect(slice(arr, new Date(1), new Date(4))).toStrictEqual([2, 3, 4]);
        expect(slice(arr, 1.8, 4.9)).toStrictEqual([2, 3, 4]);
        expect(slice(arr, null, 3)).toStrictEqual([1, 2, 3]);
        expect(slice(arr, 1, null)).toStrictEqual([]);
        expect(slice(arr, "1.8", "4.9")).toStrictEqual([2, 3, 4]);
        expect(slice(arr, false, true)).toStrictEqual([1]);
        expect(slice(arr, [1.8], [4.9])).toStrictEqual([2, 3, 4]);
        expect(slice(arr, ["1.8"], ["4.9"])).toStrictEqual([2, 3, 4]);

        expect(slice(s, new Date(1), new Date(3))).toStrictEqual(["e", "l"]);
        expect(slice(s, 1.8, 3.9)).toStrictEqual(["e", "l"]);
        expect(slice(s, null, 3)).toStrictEqual(["h", "e", "l"]);
        expect(slice(s, 1, null)).toStrictEqual([]);
        expect(slice(s, "1.8", "4.9")).toStrictEqual(["e", "l", "l"]);
        expect(slice(s, false, true)).toStrictEqual(["h"]);
        expect(slice(s, [1.8], [4.9])).toStrictEqual(["e", "l", "l"]);
        expect(slice(s, ["1.8"], ["4.9"])).toStrictEqual(["e", "l", "l"]);

        expect(sliceAt(new Date(1), new Date(4))(arr)).toStrictEqual([2, 3, 4]);
        expect(sliceAt(1.8, 4.9)(arr)).toStrictEqual([2, 3, 4]);
        expect(sliceAt(null, 3)(arr)).toStrictEqual([1, 2, 3]);
        expect(sliceAt(1, null)(arr)).toStrictEqual([]);
        expect(sliceAt("1.8", "4.9")(arr)).toStrictEqual([2, 3, 4]);
        expect(sliceAt(false, true)(arr)).toStrictEqual([1]);
        expect(sliceAt([1.8], [4.9])(arr)).toStrictEqual([2, 3, 4]);
        expect(sliceAt(["1.8"], ["4.9"])(arr)).toStrictEqual([2, 3, 4]);

        expect(sliceAt(new Date(1), new Date(3))(s)).toStrictEqual(["e", "l"]);
        expect(sliceAt(1.8, 3.9)(s)).toStrictEqual(["e", "l"]);
        expect(sliceAt(null, 3)(s)).toStrictEqual(["h", "e", "l"]);
        expect(sliceAt(1, null)(s)).toStrictEqual([]);
        expect(sliceAt("1.8", "4.9")(s)).toStrictEqual(["e", "l", "l"]);
        expect(sliceAt(false, true)(s)).toStrictEqual(["h"]);
        expect(sliceAt([1.8], [4.9])(s)).toStrictEqual(["e", "l", "l"]);
        expect(sliceAt(["1.8"], ["4.9"])(s)).toStrictEqual(["e", "l", "l"]);

        expect(slice(arr, -4.8, -2.9)).toStrictEqual([3, 4]);
        expect(slice(arr, "-4.8", "-2.9")).toStrictEqual([3, 4]);
        expect(slice(arr, [-4.8], [-2.9])).toStrictEqual([3, 4]);

        expect(slice(s, -4.8, -2.9)).toStrictEqual(["o", "r"]);
        expect(slice(s, "-4.8", "-2.9")).toStrictEqual(["o", "r"]);
        expect(slice(s, [-4.8], [-2.9])).toStrictEqual(["o", "r"]);

        expect(sliceAt(-4.8, -2.9)(arr)).toStrictEqual([3, 4]);
        expect(sliceAt("-4.8", "-2.9")(arr)).toStrictEqual([3, 4]);
        expect(sliceAt([-4.8], [-2.9])(arr)).toStrictEqual([3, 4]);

        expect(sliceAt(-4.8, -2.9)(s)).toStrictEqual(["o", "r"]);
        expect(sliceAt("-4.8", "-2.9")(s)).toStrictEqual(["o", "r"]);
        expect(sliceAt([-4.8], [-2.9])(s)).toStrictEqual(["o", "r"]);

        zeroesAsIntegers.forEach(value => {
            expect(slice(arr, value, arr.length)).toStrictEqual(arrCopy);
            expect(slice(s, value, s.length)).toStrictEqual(s.split(""));
            expect(slice(arr, 0, value)).toStrictEqual([]);
            expect(slice(s, 0, value)).toStrictEqual([]);

            expect(sliceAt(value, arr.length)(arr)).toStrictEqual(arrCopy);
            expect(sliceAt(value, s.length)(s)).toStrictEqual(s.split(""));
            expect(sliceAt(0, value)(arr)).toStrictEqual([]);
            expect(sliceAt(0, value)(s)).toStrictEqual([]);
        });
    });

    it("should interpret as zeroes missing values in the `start` or `end` parameter", () => {
        expect(slice(arr, 0)).toStrictEqual([]);
        expect(slice(s, 0)).toStrictEqual([]);
        expect(sliceAt(0)(arr)).toStrictEqual([]);
        expect(sliceAt(0)(s)).toStrictEqual([]);

        expect(slice(arr)).toStrictEqual([]);
        expect(sliceAt()(arr)).toStrictEqual([]);
        expect(slice(s)).toStrictEqual([]);
        expect(sliceAt()(s)).toStrictEqual([]);
    });

    it("should return an array with `undefined` values in place of unassigned or deleted indexes if a sparse array is received", () => {
        // eslint-disable-next-line comma-spacing, no-sparse-arrays
        const aSparse = [, 1, 2, , 4, , ,]; // length === 7, same as aDense
        const aDense = [void 0, 1, 2, void 0, 4, void 0, void 0];
        const r1 = slice(aSparse, 0, aSparse.length);
        const r2 = sliceAt(0, aSparse.length)(aSparse);

        expect(r1).toStrictArrayEqual(aDense);
        expect(r1).not.toStrictArrayEqual(aSparse);
        expect(r2).toStrictArrayEqual(aDense);
        expect(r2).not.toStrictArrayEqual(aSparse);
    });

    it("should try, as native `slice` does, to retrieve elements from objects with a `length` property, but it should always build dense arrays", () => {
        const objs = [
            { length: 3, 0: 1, 1: 2, 2: 3 },
            { length: 3, 0: 1, 2: 3 },
            { length: "2", 0: 1, 1: 2, 2: 3 },
            { length: "-2", 0: 1, 1: 2, 2: 3 }
        ];

        const results = [ [2, 3], [void 0, 3], [2], [] ];

        objs.forEach((obj, idx) => {
            expect(slice(obj, 1, 3)).toStrictArrayEqual(results[idx]);
            expect(sliceAt(1, 3)(obj)).toStrictArrayEqual(results[idx]);
        });

        const oSparse = { length: 2 };
        const rSparse = Array(2);
        const rDense = [void 0, void 0];

        expect(slice(oSparse, 0, oSparse.length)).toStrictArrayEqual(rDense);
        expect(slice(oSparse, 0, oSparse.length)).not.toStrictArrayEqual(rSparse);
        expect(sliceAt(0, oSparse.length)(oSparse)).toStrictArrayEqual(rDense);
        expect(sliceAt(0, oSparse.length)(oSparse)).not.toStrictArrayEqual(rSparse);
    });

    it("should work with array-like lengths up to 2^32 - 1", () => {
        const maxLen = Math.pow(2, 32) - 1;
        const maxIndex = maxLen - 1;
        const obj = { length: maxLen + 100 };

        obj[maxIndex] = 99;
        obj[maxIndex + 1] = 88;

        expect(slice(obj, -1, obj.length)).toStrictEqual([99]);
        expect(sliceAt(-1, obj.length)(obj)).toStrictEqual([99]);
    });

    it("should throw an exception if it receives `null` or `undefined` instead of an array-like or if it's called without parameters", () => {
        expect(() => { slice(null, 1, 2); }).toThrow();
        expect(() => { slice(void 0, 1, 2); }).toThrow();
        expect(() => { sliceAt(1, 2)(null); }).toThrow();
        expect(() => { sliceAt(1, 2)(void 0); }).toThrow();

        expect(slice).toThrow();
        expect(sliceAt()).toThrow();
    });

    it("should treat every other value as an empty array", () => {
        wannabeEmptyArrays.forEach(value => {
            expect(slice(value, 0, 2)).toStrictEqual([]);
            expect(sliceAt(0, 2)(value)).toStrictEqual([]);
        });
    });
});
