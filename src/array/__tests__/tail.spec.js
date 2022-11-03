import tail from "../tail";
import { wannabeEmptyArrays } from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("tail", () => {
    it("should return a copy of the given array-like object without the first element", () => {
        const arr = [1, 2, 3, 4, 5];

        expect(tail(arr)).toStrictEqual([2, 3, 4, 5]);
        expect(arr.length).toBe(5);
        expect(tail("shell")).toStrictEqual(["h", "e", "l", "l"]);
    });

    it("should return an empty array when called with an empty array or an array holding only one element", () => {
        expect(tail([1])).toStrictEqual([]);
        expect(tail([])).toStrictEqual([]);
    });

    it("should always return dense arrays", () => {
        // eslint-disable-next-line comma-spacing, no-sparse-arrays
        expect(tail([1, , 3, ,])).toStrictArrayEqual([void 0, 3, void 0]);
        expect(tail(Array(2))).toStrictArrayEqual([void 0]);
        expect(tail(Array(1))).toStrictArrayEqual([]);
    });

    it("should throw an exception if called without arguments", () => {
        expect(tail).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined`", () => {
        expect(() => { tail(null); }).toThrow();
        expect(() => { tail(void 0); }).toThrow();
    });

    it("should treat every other value as an empty array", () => {
        wannabeEmptyArrays.forEach(value => {
            expect(tail(value)).toStrictEqual([]);
        });
    });
});
