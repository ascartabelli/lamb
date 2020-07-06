import * as lamb from "../..";
import { nonFunctions, wannabeEmptyArrays } from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("uniques / uniquesBy", function () {
    var data = [
        { id: "1", name: "foo" },
        { id: "1", name: "Foo" },
        { id: "2", name: "bar" },
        { id: "3", name: "baz" },
        { id: "2", name: "Bar" },
        { id: "1", name: "FOO" }
    ];

    var dataUniques = [
        { id: "1", name: "foo" },
        { id: "2", name: "bar" },
        { id: "3", name: "baz" }
    ];

    var uniquesByIdentity = lamb.uniquesBy(lamb.identity);

    describe("uniques", function () {
        it("should return the unique elements of an array of simple values", function () {
            expect(lamb.uniques([0, 2, 3, 4, 0, 4, 3, 5, 2, 1, 1])).toEqual([0, 2, 3, 4, 5, 1]);
            expect(lamb.uniques(["foo", "bar", "bar", "baz"])).toEqual(["foo", "bar", "baz"]);
            expect(lamb.uniques(Array(3))).toEqual([void 0]);
        });

        it("should throw an exception if called without arguments", function () {
            expect(lamb.uniques).toThrow();
        });
    });

    describe("uniquesBy", function () {
        it("should use the provided iteratee to extract the values to compare", function () {
            var chars = ["b", "A", "r", "B", "a", "z"];

            expect(lamb.uniquesBy(lamb.invoke("toUpperCase"))(chars)).toEqual(["b", "A", "r", "z"]);
            expect(lamb.uniquesBy(lamb.getKey("id"))(data)).toEqual(dataUniques);
        });

        it("should build a function throwing an exception if the itereatee isn't a function or if is missing", function () {
            nonFunctions.forEach(function (value) {
                expect(function () { lamb.uniquesBy(value)([1, 2, 3]); }).toThrow();
            });

            expect(function () { lamb.uniquesBy()([1, 2, 3]); }).toThrow();
        });
    });

    it("should use the SameValueZero comparison", function () {
        expect(lamb.uniques([0, 1, 2, NaN, 1, 2, -0, NaN])).toEqual([0, 1, 2, NaN]);
    });

    it("should return a copy of the source array if it's empty or already contains unique values", function () {
        var a1 = [];
        var r1 = lamb.uniques(a1);
        var a2 = [1, 2, 3, 4, 5];
        var r2 = lamb.uniques(a2);

        expect(r1).toEqual([]);
        expect(r1).not.toBe(a1);
        expect(r2).toEqual(a2);
        expect(r2).not.toBe(a2);
    });

    it("should work with array-like objects", function () {
        var s = "hello world";
        var r = ["h", "e", "l", "o", " ", "w", "r", "d"];

        expect(lamb.uniques(s)).toEqual(r);
        expect(uniquesByIdentity(s)).toEqual(r);
    });

    it("should prefer the first encountered value if two values are considered equal", function () {
        expect(Object.is(0, lamb.uniques([0, -0])[0])).toBe(true);
        expect(lamb.uniques([2, -0, 3, 3, 0, 1])).toEqual([2, -0, 3, 1]);

        var r = lamb.uniquesBy(lamb.getKey("id"))(data);

        expect(r).toEqual(dataUniques);
        expect(r[0]).toBe(data[0]);
        expect(r[1]).toBe(data[2]);
    });

    it("should always return dense arrays", function () {
        /* eslint-disable no-sparse-arrays */
        var a1 = [1, , 1, 3];
        var a2 = [1, , 1, void 0, 3];
        /* eslint-enable no-sparse-arrays */

        var r = [1, void 0, 3];

        expect(lamb.uniques(a1)).toStrictArrayEqual(r);
        expect(lamb.uniques(a2)).toStrictArrayEqual(r);
        expect(uniquesByIdentity(a1)).toStrictArrayEqual(r);
        expect(uniquesByIdentity(a2)).toStrictArrayEqual(r);
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", function () {
        expect(function () { lamb.uniques(null); }).toThrow();
        expect(function () { lamb.uniques(void 0); }).toThrow();
        expect(function () { uniquesByIdentity(null); }).toThrow();
        expect(function () { uniquesByIdentity(void 0); }).toThrow();
    });

    it("should treat every other value as an empty array", function () {
        wannabeEmptyArrays.forEach(function (value) {
            expect(lamb.uniques(value)).toEqual([]);
            expect(uniquesByIdentity(value)).toEqual([]);
        });
    });
});
