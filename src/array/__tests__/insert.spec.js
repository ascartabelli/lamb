import * as lamb from "../..";
import { wannabeEmptyArrays, zeroesAsIntegers } from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("insert / insertAt", function () {
    var arr = [1, 2, 3, 4, 5];
    var result1 = [1, 2, 3, 99, 4, 5];
    var result2 = [99, 1, 2, 3, 4, 5];
    var result3 = [1, 2, 3, 4, 5, 99];

    afterEach(function () {
        expect(arr).toEqual([1, 2, 3, 4, 5]);
    });

    it("should allow to insert an element in a copy of an array at the specified index", function () {
        var r1 = lamb.insert(arr, 3, 99);
        var r2 = lamb.insertAt(3, 99)(arr);

        expect(r1).toEqual(result1);
        expect(r2).toEqual(result1);
        expect(r1).not.toBe(arr);
        expect(r2).not.toBe(arr);
    });

    it("should insert the element at the end of the array if the provided index is greater than its length", function () {
        expect(lamb.insert(arr, 99, 99)).toEqual(result3);
        expect(lamb.insertAt(99, 99)(arr)).toEqual(result3);
    });

    it("should allow the use of negative indexes", function () {
        expect(lamb.insert(arr, -2, 99)).toEqual(result1);
        expect(lamb.insertAt(-2, 99)(arr)).toEqual(result1);
    });

    it("should insert the element at the start of the array if provided with a negative index which is out of bounds", function () {
        expect(lamb.insert(arr, -99, 99)).toEqual(result2);
        expect(lamb.insertAt(-99, 99)(arr)).toEqual(result2);
    });

    it("should convert the index to integer following ECMA specifications", function () {
        // see https://www.ecma-international.org/ecma-262/7.0/#sec-tointeger

        zeroesAsIntegers.forEach(function (value) {
            expect(lamb.insert(arr, value, 99)).toEqual(result2);
            expect(lamb.insertAt(value, 99)(arr)).toEqual(result2);
        });

        [[3], -2, 3.6, 3.2, -2.8, -2.2, "-2", "3"].forEach(function (value) {
            expect(lamb.insert(arr, value, 99)).toEqual(result1);
            expect(lamb.insertAt(value, 99)(arr)).toEqual(result1);
        });

        expect(lamb.insert(arr, new Date(), 99)).toEqual(result3);
        expect(lamb.insertAt(new Date(), 99)(arr)).toEqual(result3);
    });

    it("should work with array-like objects", function () {
        var s = "12345";

        expect(lamb.insert(s, -2, "99")).toEqual(result1.map(String));
        expect(lamb.insertAt(3, "99")(s)).toEqual(result1.map(String));
    });

    it("should always return dense arrays", function () {
        /* eslint-disable no-sparse-arrays */
        expect(lamb.insert([1, , 3, 5], 3, 4)).toStrictArrayEqual([1, void 0, 3, 4, 5]);
        expect(lamb.insertAt(3, 4)([1, , 3, 5])).toStrictArrayEqual([1, void 0, 3, 4, 5]);
        /* eslint-enable no-sparse-arrays */
    });

    it("should throw an exception if called without the data argument", function () {
        expect(lamb.insert).toThrow();
        expect(lamb.insertAt(3, "99")).toThrow();
    });

    it("should throw an exception if a `nil` value is passed in place of an array-like object", function () {
        expect(function () { lamb.insert(null, 3, 99); }).toThrow();
        expect(function () { lamb.insert(void 0, 3, 99); }).toThrow();
        expect(function () { lamb.insertAt(3, 99)(null); }).toThrow();
        expect(function () { lamb.insertAt(3, 99)(void 0); }).toThrow();
    });

    it("should consider every other value as an empty array", function () {
        wannabeEmptyArrays.forEach(function (value) {
            expect(lamb.insert(value, 3, 99)).toEqual([99]);
            expect(lamb.insertAt(3, 99)(value)).toEqual([99]);
        });
    });
});
