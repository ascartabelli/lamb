import compose from "../compose";
import identity from "../identity";
import invoke from "../../function/invoke";
import map from "../map";
import mapWith from "../mapWith";
import { nonFunctions, wannabeEmptyArrays } from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("map / mapWith", () => {
    function double (n, idx, list) {
        expect(list[idx]).toBe(n);

        return n * 2;
    }

    const makeDoubles = mapWith(double);
    const numbers = [1, 2, 3, 4, 5];

    afterEach(() => {
        expect(numbers).toStrictEqual([1, 2, 3, 4, 5]);
    });

    it("should apply the provided function to the elements of the given array", () => {
        expect(map(numbers, double)).toStrictEqual([2, 4, 6, 8, 10]);
        expect(makeDoubles(numbers)).toStrictEqual([2, 4, 6, 8, 10]);
    });

    it("should work with array-like objects", () => {
        expect(map("12345", double)).toStrictEqual([2, 4, 6, 8, 10]);
        expect(makeDoubles("12345")).toStrictEqual([2, 4, 6, 8, 10]);
    });

    it("should not skip deleted or unassigned elements, unlike the native method", () => {
        // eslint-disable-next-line comma-spacing, no-sparse-arrays
        const sparseArr = [, "foo", ,];
        const safeUpperCase = compose(invoke("toUpperCase"), String);
        const result = ["UNDEFINED", "FOO", "UNDEFINED"];

        expect(map(sparseArr, safeUpperCase)).toStrictArrayEqual(result);
        expect(map(sparseArr, identity)).toStrictArrayEqual([void 0, "foo", void 0]);
        expect(mapWith(safeUpperCase)(sparseArr)).toStrictArrayEqual(result);
        expect(mapWith(identity)(sparseArr)).toStrictArrayEqual([void 0, "foo", void 0]);
    });

    it("should throw an exception if the iteratee isn't a function or is missing", () => {
        nonFunctions.forEach(value => {
            expect(() => { mapWith(value)(numbers); }).toThrow();
        });

        expect(() => { mapWith()(numbers); }).toThrow();
    });

    it("should throw an exception if called without the data argument", () => {
        expect(map).toThrow();
        expect(makeDoubles).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", () => {
        expect(() => { map(null, double); }).toThrow();
        expect(() => { map(void 0, double); }).toThrow();
        expect(() => { makeDoubles(null); }).toThrow();
        expect(() => { makeDoubles(void 0); }).toThrow();
    });

    it("should treat every other value as an empty array", () => {
        wannabeEmptyArrays.forEach(value => {
            expect(map(value, double)).toStrictEqual([]);
            expect(makeDoubles(value)).toStrictEqual([]);
        });
    });
});
