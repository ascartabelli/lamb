import insert from "../insert";
import insertAt from "../insertAt";
import { wannabeEmptyArrays, zeroesAsIntegers } from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("insert / insertAt", () => {
    const arr = [1, 2, 3, 4, 5];
    const result1 = [1, 2, 3, 99, 4, 5];
    const result2 = [99, 1, 2, 3, 4, 5];
    const result3 = [1, 2, 3, 4, 5, 99];

    afterEach(() => {
        expect(arr).toStrictEqual([1, 2, 3, 4, 5]);
    });

    it("should allow to insert an element in a copy of an array at the specified index", () => {
        const r1 = insert(arr, 3, 99);
        const r2 = insertAt(3, 99)(arr);

        expect(r1).toStrictEqual(result1);
        expect(r2).toStrictEqual(result1);
        expect(r1).not.toBe(arr);
        expect(r2).not.toBe(arr);
    });

    it("should insert the element at the end of the array if the provided index is greater than its length", () => {
        expect(insert(arr, 99, 99)).toStrictEqual(result3);
        expect(insertAt(99, 99)(arr)).toStrictEqual(result3);
    });

    it("should allow the use of negative indexes", () => {
        expect(insert(arr, -2, 99)).toStrictEqual(result1);
        expect(insertAt(-2, 99)(arr)).toStrictEqual(result1);
    });

    it("should insert the element at the start of the array if provided with a negative index which is out of bounds", () => {
        expect(insert(arr, -99, 99)).toStrictEqual(result2);
        expect(insertAt(-99, 99)(arr)).toStrictEqual(result2);
    });

    it("should convert the index to integer following ECMA specifications", () => {
        // see https://www.ecma-international.org/ecma-262/7.0/#sec-tointeger

        zeroesAsIntegers.forEach(value => {
            expect(insert(arr, value, 99)).toStrictEqual(result2);
            expect(insertAt(value, 99)(arr)).toStrictEqual(result2);
        });

        [[3], -2, 3.6, 3.2, -2.8, -2.2, "-2", "3"].forEach(value => {
            expect(insert(arr, value, 99)).toStrictEqual(result1);
            expect(insertAt(value, 99)(arr)).toStrictEqual(result1);
        });

        expect(insert(arr, new Date(), 99)).toStrictEqual(result3);
        expect(insertAt(new Date(), 99)(arr)).toStrictEqual(result3);
    });

    it("should work with array-like objects", () => {
        const s = "12345";

        expect(insert(s, -2, "99")).toStrictEqual(result1.map(String));
        expect(insertAt(3, "99")(s)).toStrictEqual(result1.map(String));
    });

    it("should always return dense arrays", () => {
        /* eslint-disable no-sparse-arrays */
        expect(insert([1, , 3, 5], 3, 4)).toStrictArrayEqual([1, void 0, 3, 4, 5]);
        expect(insertAt(3, 4)([1, , 3, 5])).toStrictArrayEqual([1, void 0, 3, 4, 5]);
        /* eslint-enable no-sparse-arrays */
    });

    it("should throw an exception if called without the data argument", () => {
        expect(insert).toThrow();
        expect(insertAt(3, "99")).toThrow();
    });

    it("should throw an exception if a `nil` value is passed in place of an array-like object", () => {
        expect(() => { insert(null, 3, 99); }).toThrow();
        expect(() => { insert(void 0, 3, 99); }).toThrow();
        expect(() => { insertAt(3, 99)(null); }).toThrow();
        expect(() => { insertAt(3, 99)(void 0); }).toThrow();
    });

    it("should consider every other value as an empty array", () => {
        wannabeEmptyArrays.forEach(value => {
            expect(insert(value, 3, 99)).toStrictEqual([99]);
            expect(insertAt(3, 99)(value)).toStrictEqual([99]);
        });
    });
});
