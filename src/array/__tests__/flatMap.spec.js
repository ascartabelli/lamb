import flatMap from "../flatMap";
import flatMapWith from "../flatMapWith";
import generic from "../../core/generic";
import identity from "../../core/identity";
import { wannabeEmptyArrays } from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("flatMap / flatMapWith", () => {
    it("should behave like map if the mapping function returns a non-array value", () => {
        function double (n, idx, list) {
            expect(list).toBe(arr);
            expect(list[idx]).toBe(n);

            return n * 2;
        }

        const arr = [1, 2, 3, 4, 5];
        const result = [2, 4, 6, 8, 10];

        expect(flatMap(arr, double)).toStrictEqual(result);
        expect(flatMapWith(double)(arr)).toStrictEqual(result);
    });

    it("should concatenate arrays returned by the mapping function to the result", () => {
        const splitString = s =>s.split("");
        const arr = ["foo", "bar", "baz"];
        const result = ["f", "o", "o", "b", "a", "r", "b", "a", "z"];

        expect(flatMap(arr, splitString)).toStrictEqual(result);
        expect(flatMapWith(splitString)(arr)).toStrictEqual(result);
    });

    it("should keeps its behaviour consistent even if the received function returns mixed results", () => {
        function fn (n, idx, list) {
            expect(list).toBe(arr);
            expect(list[idx]).toBe(n);

            return n % 2 === 0 ? [n, n + 10] : n * 2;
        }

        const arr = [1, 2, 3, 4, 5];
        const result = [2, 2, 12, 6, 4, 14, 10];

        expect(flatMap(arr, fn)).toStrictEqual(result);
        expect(flatMapWith(fn)(arr)).toStrictEqual(result);
    });

    it("should not flatten nested arrays", () => {
        const splitString = s => (String(s) === s ? s.split("") : [[s, "not a string"]]);
        const arr = ["foo", "bar", 5, "baz"];
        const result = ["f", "o", "o", "b", "a", "r", [5, "not a string"], "b", "a", "z"];

        expect(flatMap(arr, splitString)).toStrictEqual(result);
        expect(flatMapWith(splitString)(arr)).toStrictEqual(result);

        const arr2 = ["foo", ["bar", ["baz"]]];
        const result2 = ["foo", "bar", ["baz"]];

        expect(flatMap(arr2, identity)).toStrictEqual(result2);
        expect(flatMapWith(identity)(arr2)).toStrictEqual(result2);
    });

    it("should work on array-like objects", () => {
        const toUpperCase = generic(String.prototype.toUpperCase);
        const testString = "hello world";
        const result = ["H", "E", "L", "L", "O", " ", "W", "O", "R", "L", "D"];

        expect(flatMap(testString, toUpperCase)).toStrictEqual(result);
        expect(flatMapWith(toUpperCase)(testString)).toStrictEqual(result);
    });

    it("should always return dense arrays", () => {
        /* eslint-disable comma-spacing, no-sparse-arrays */
        const fn = v => [, v, ,];
        const arr = [1, , 3];
        /* eslint-enable comma-spacing, no-sparse-arrays */

        const result = [void 0, 1, void 0, void 0, void 0, void 0, void 0, 3, void 0];

        expect(flatMap(arr, fn)).toStrictArrayEqual(result);
        expect(flatMapWith(fn)(arr)).toStrictArrayEqual(result);
    });

    it("should throw an exception if not supplied with a mapper function", () => {
        expect(() => { flatMap([1, 2, 3]); }).toThrow();
        expect(() => { flatMapWith()([1, 2, 3]); }).toThrow();
    });

    it("should throw an exception if called without the data argument", () => {
        expect(flatMap).toThrow();
        expect(flatMapWith(identity)).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", () => {
        expect(() => { flatMap(null, identity); }).toThrow();
        expect(() => { flatMap(void 0, identity); }).toThrow();
        expect(() => { flatMapWith(identity)(null); }).toThrow();
        expect(() => { flatMapWith(identity)(void 0); }).toThrow();
    });

    it("should return an empty array for every other value", () => {
        wannabeEmptyArrays.forEach(value => {
            expect(flatMap(value, identity)).toStrictEqual([]);
            expect(flatMapWith(identity)(value)).toStrictEqual([]);
        });
    });
});
