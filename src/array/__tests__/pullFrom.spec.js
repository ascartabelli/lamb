import * as lamb from "../..";
import { nonArrayLikes, wannabeEmptyArrays } from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("pull / pullFrom", function () {
    it("should create a copy of the given array without the specified values", function () {
        var arr = ["foo", "bar", "baz"];

        expect(lamb.pullFrom(arr, ["foo", "baz"])).toEqual(["bar"]);
        expect(lamb.pull(["foo", "baz"])(arr)).toEqual(["bar"]);

        var r1 = lamb.pullFrom(arr, []);
        var r2 = lamb.pull([])(arr);

        expect(r1).toEqual(arr);
        expect(r1).not.toBe(arr);
        expect(r2).toEqual(arr);
        expect(r2).not.toBe(arr);
        expect(arr).toEqual(["foo", "bar", "baz"]);
    });

    it("should use the \"SameValueZero\" comparison to perform the equality test", function () {
        var obj = { a: 1 };
        var arr = [1, 2];
        var mixed = ["bar", obj, arr, "5", 0, NaN, "foo", 5];
        var result = ["bar", "foo", 5];
        var values = [obj, arr, NaN, -0, "5"];

        expect(lamb.pullFrom(mixed, values)).toEqual(result);
        expect(lamb.pull(values)(mixed)).toEqual(result);
    });

    it("should accept array-like objects as the list we want to remove values from", function () {
        expect(lamb.pullFrom("hello", ["h", "l"])).toEqual(["e", "o"]);
        expect(lamb.pull(["h", "l"])("hello")).toEqual(["e", "o"]);
    });

    it("should accept array-like objects as the list of values we want to remove", function () {
        var arr = ["f", "b", "o", "o", "a", "r"];
        var result = ["f", "o", "o"];

        expect(lamb.pullFrom(arr, "bar")).toEqual(result);
        expect(lamb.pull("bar")(arr)).toEqual(result);
    });

    it("should consider non-array-likes received as the list of values as an empty array", function () {
        var arr = [1, 2, 3];

        nonArrayLikes.forEach(function (value) {
            var r1 = lamb.pullFrom(arr, value);
            var r2 = lamb.pull(value)(arr);

            expect(r1).toEqual(arr);
            expect(r1).not.toBe(arr);
            expect(r2).toEqual(arr);
            expect(r2).not.toBe(arr);
        });
    });

    /* eslint-disable no-sparse-arrays */

    it("should be able to remove non assigned indexes from sparse arrays", function () {
        expect(lamb.pullFrom([1, , 3, , 5], [void 0])).toStrictArrayEqual([1, 3, 5]);
        expect(lamb.pull([void 0])([1, , 3, , 5])).toStrictArrayEqual([1, 3, 5]);
    });

    it("should always return dense arrays", function () {
        expect(lamb.pullFrom([1, , 3, , 5], [3])).toStrictArrayEqual([1, void 0, void 0, 5]);
        expect(lamb.pull([3])([1, , 3, , 5])).toStrictArrayEqual([1, void 0, void 0, 5]);
    });

    it("should accept sparse arrays as the list of values to remove", function () {
        expect(lamb.pullFrom([1, , 3, , 5], [1, , 1])).toStrictArrayEqual([3, 5]);
        expect(lamb.pullFrom([1, void 0, 3, void 0, 5], [1, , 1])).toStrictArrayEqual([3, 5]);
        expect(lamb.pull([1, , 1])([1, , 3, , 5])).toStrictArrayEqual([3, 5]);
        expect(lamb.pull([1, void 0, 1])([1, , 3, , 5])).toStrictArrayEqual([3, 5]);
    });

    /* eslint-enable no-sparse-arrays */

    it("should throw an exception if called without arguments", function () {
        expect(lamb.pullFrom).toThrow();
        expect(lamb.pull()).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", function () {
        expect(function () { lamb.pullFrom(null, ["foo"]); }).toThrow();
        expect(function () { lamb.pullFrom(void 0, ["foo"]); }).toThrow();
        expect(function () { lamb.pull(["foo"])(null); }).toThrow();
        expect(function () { lamb.pull(["foo"])(void 0); }).toThrow();
    });

    it("should treat every other value as an empty array", function () {
        wannabeEmptyArrays.forEach(function (value) {
            expect(lamb.pullFrom(value, ["lastIndex", "getDay", "valueOf"])).toEqual([]);
            expect(lamb.pull(["lastIndex", "getDay", "valueOf"])(value)).toEqual([]);
        });
    });
});
