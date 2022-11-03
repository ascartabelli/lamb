import pull from "../pull";
import pullFrom from "../pullFrom";
import { nonArrayLikes, wannabeEmptyArrays } from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("pull / pullFrom", () => {
    it("should create a copy of the given array without the specified values", () => {
        const arr = ["foo", "bar", "baz"];

        expect(pullFrom(arr, ["foo", "baz"])).toStrictEqual(["bar"]);
        expect(pull(["foo", "baz"])(arr)).toStrictEqual(["bar"]);

        const r1 = pullFrom(arr, []);
        const r2 = pull([])(arr);

        expect(r1).toStrictEqual(arr);
        expect(r1).not.toBe(arr);
        expect(r2).toStrictEqual(arr);
        expect(r2).not.toBe(arr);
        expect(arr).toStrictEqual(["foo", "bar", "baz"]);
    });

    it("should use the \"SameValueZero\" comparison to perform the equality test", () => {
        const obj = { a: 1 };
        const arr = [1, 2];
        const mixed = ["bar", obj, arr, "5", 0, NaN, "foo", 5];
        const result = ["bar", "foo", 5];
        const values = [obj, arr, NaN, -0, "5"];

        expect(pullFrom(mixed, values)).toStrictEqual(result);
        expect(pull(values)(mixed)).toStrictEqual(result);
    });

    it("should accept array-like objects as the list we want to remove values from", () => {
        expect(pullFrom("hello", ["h", "l"])).toStrictEqual(["e", "o"]);
        expect(pull(["h", "l"])("hello")).toStrictEqual(["e", "o"]);
    });

    it("should accept array-like objects as the list of values we want to remove", () => {
        const arr = ["f", "b", "o", "o", "a", "r"];
        const result = ["f", "o", "o"];

        expect(pullFrom(arr, "bar")).toStrictEqual(result);
        expect(pull("bar")(arr)).toStrictEqual(result);
    });

    it("should consider non-array-likes received as the list of values as an empty array", () => {
        const arr = [1, 2, 3];

        nonArrayLikes.forEach(value => {
            const r1 = pullFrom(arr, value);
            const r2 = pull(value)(arr);

            expect(r1).toStrictEqual(arr);
            expect(r1).not.toBe(arr);
            expect(r2).toStrictEqual(arr);
            expect(r2).not.toBe(arr);
        });
    });

    /* eslint-disable no-sparse-arrays */

    it("should be able to remove non assigned indexes from sparse arrays", () => {
        expect(pullFrom([1, , 3, , 5], [void 0])).toStrictArrayEqual([1, 3, 5]);
        expect(pull([void 0])([1, , 3, , 5])).toStrictArrayEqual([1, 3, 5]);
    });

    it("should always return dense arrays", () => {
        expect(pullFrom([1, , 3, , 5], [3])).toStrictArrayEqual([1, void 0, void 0, 5]);
        expect(pull([3])([1, , 3, , 5])).toStrictArrayEqual([1, void 0, void 0, 5]);
    });

    it("should accept sparse arrays as the list of values to remove", () => {
        expect(pullFrom([1, , 3, , 5], [1, , 1])).toStrictArrayEqual([3, 5]);
        expect(pullFrom([1, void 0, 3, void 0, 5], [1, , 1])).toStrictArrayEqual([3, 5]);
        expect(pull([1, , 1])([1, , 3, , 5])).toStrictArrayEqual([3, 5]);
        expect(pull([1, void 0, 1])([1, , 3, , 5])).toStrictArrayEqual([3, 5]);
    });

    /* eslint-enable no-sparse-arrays */

    it("should throw an exception if called without arguments", () => {
        expect(pullFrom).toThrow();
        expect(pull()).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", () => {
        expect(() => { pullFrom(null, ["foo"]); }).toThrow();
        expect(() => { pullFrom(void 0, ["foo"]); }).toThrow();
        expect(() => { pull(["foo"])(null); }).toThrow();
        expect(() => { pull(["foo"])(void 0); }).toThrow();
    });

    it("should treat every other value as an empty array", () => {
        wannabeEmptyArrays.forEach(value => {
            expect(pullFrom(value, ["lastIndex", "getDay", "valueOf"])).toStrictEqual([]);
            expect(pull(["lastIndex", "getDay", "valueOf"])(value)).toStrictEqual([]);
        });
    });
});
