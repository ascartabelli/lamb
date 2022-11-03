import init from "../init";
import { wannabeEmptyArrays } from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("init", () => {
    it("should return a copy of the given array-like object without the last element", () => {
        const arr = [1, 2, 3, 4, 5];

        expect(init(arr)).toEqual([1, 2, 3, 4]);
        expect(arr.length).toBe(5);
        expect(init("hello")).toEqual(["h", "e", "l", "l"]);
    });

    it("should return an empty array when called with an empty array or an array holding only one element", () => {
        expect(init([1])).toEqual([]);
        expect(init([])).toEqual([]);
    });

    it("should always return dense arrays", () => {
        // eslint-disable-next-line no-sparse-arrays
        expect(init([1, , 3, , 4])).toStrictArrayEqual([1, void 0, 3, void 0]);
        expect(init(Array(2))).toStrictArrayEqual([void 0]);
    });

    it("should throw an exception if called without arguments", () => {
        expect(init).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", () => {
        expect(() => { init(null); }).toThrow();
        expect(() => { init(void 0); }).toThrow();
    });

    it("should return an empty array for every other value", () => {
        wannabeEmptyArrays.forEach(value => {
            expect(init(value)).toEqual([]);
        });
    });
});
