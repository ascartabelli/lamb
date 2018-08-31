import * as lamb from "../..";
import { nonFunctions, wannabeEmptyArrays } from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("union / unionBy", function () {
    var a1 = [1, 2, 3];
    var a2 = [2, 3, 5];
    var a3 = [3, 4, 5, [2, 3]];
    var a4 = [2, 3, 4, [2, 3]];

    var r1 = [1, 2, 3, 5, 4, [2, 3], [2, 3]];
    var r2 = [1, 2, 3, 5, 4, [2, 3]];
    var r3 = [1, 2, 3, 5];

    var data = [
        [{ id: "1", name: "foo" }],
        [{ id: "1", name: "Foo" }, { id: "2", name: "bar" }, { id: "3", name: "baz" }],
        [{ id: "2", name: "Bar" }, { id: "1", name: "FOO" }]
    ];

    var dataUnionById = [
        { id: "1", name: "foo" },
        { id: "2", name: "bar" },
        { id: "3", name: "baz" }
    ];

    var unionByIdentity = lamb.unionBy(lamb.identity);
    var unionAsStrings = lamb.unionBy(String);
    var unionById = lamb.unionBy(lamb.getKey("id"));

    describe("unionBy", function () {
        it("should build a function throwing an exception if the `iteratee` is not a function or if is missing", function () {
            nonFunctions.forEach(function (value) {
                expect(function () { lamb.unionBy(value)(a1, a2); }).toThrow();
            });

            expect(function () { lamb.unionBy()(a1, a2); }).toThrow();
        });
    });

    it("should return a list of every unique element present in the two given arrays", function () {
        expect(lamb.union([], [])).toEqual([]);
        expect(lamb.union([1, 2], [2, 3])).toEqual([1, 2, 3]);
        expect(lamb.union(
            lamb.union(a1, a2),
            lamb.union(a3, a4)
        )).toEqual(r1);
        expect(unionAsStrings([], [])).toEqual([]);
        expect(unionAsStrings([1, 2], [2, 3])).toEqual([1, 2, 3]);
        expect(unionAsStrings(
            unionAsStrings(a1, a2),
            unionAsStrings(a3, a4)
        )).toEqual(r2);
        expect(unionById(
            unionById(data[0], data[1]),
            data[2]
        )).toEqual(dataUnionById);
    });

    it("should ignore extra arguments", function () {
        expect(lamb.union(a1, a2, a3)).toEqual(r3);
        expect(unionAsStrings(a1, a2, a3)).toEqual(r3);
    });

    it("should work with array-like objects", function () {
        expect(lamb.union("abc", "bcd")).toEqual(["a", "b", "c", "d"]);
        expect(unionByIdentity("abc", "bcd")).toEqual(["a", "b", "c", "d"]);
    });

    it("should use the \"SameValueZero\" comparison and keep the first encountered value in case of equality", function () {
        expect(lamb.union([-0, 2, 3, NaN], [1, 0, NaN, 1])).toEqual([-0, 2, 3, NaN, 1]);
        expect(unionAsStrings([-0, 2, 3, NaN], [1, 0, NaN, 1])).toEqual([-0, 2, 3, NaN, 1]);
    });

    it("should always return dense arrays", function () {
        /* eslint-disable no-sparse-arrays */
        expect(lamb.union(
            lamb.union([1, , 3], [3, 5]),
            [6, 7])
        ).toStrictArrayEqual([1, void 0, 3, 5, 6, 7]);
        expect(lamb.union(
            [1, , 3],
            lamb.union([3, 5], [void 0, 7])
        )).toStrictArrayEqual([1, void 0, 3, 5, 7]);

        expect(unionAsStrings(
            unionAsStrings([1, , 3], [3, 5]),
            [6, 7]
        )).toStrictArrayEqual([1, void 0, 3, 5, 6, 7]);
        expect(unionAsStrings(
            [1, , 3],
            unionAsStrings([3, 5], [void 0, 7])
        )).toStrictArrayEqual([1, void 0, 3, 5, 7]);
        /* eslint-enable no-sparse-arrays */
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", function () {
        expect(function () { lamb.union(null, a1); }).toThrow();
        expect(function () { lamb.union(void 0, a1); }).toThrow();
        expect(function () { lamb.union(a1, null); }).toThrow();
        expect(function () { lamb.union(a1, void 0); }).toThrow();
        expect(function () { lamb.union(a1); }).toThrow();

        expect(function () { unionAsStrings(null, a2); }).toThrow();
        expect(function () { unionAsStrings(void 0, a2); }).toThrow();
        expect(function () { unionAsStrings(a2, null); }).toThrow();
        expect(function () { unionAsStrings(a2, void 0); }).toThrow();
        expect(function () { unionAsStrings(a2); }).toThrow();

        expect(lamb.union).toThrow();
        expect(unionAsStrings).toThrow();
    });

    it("should treat every other value as an empty array", function () {
        wannabeEmptyArrays.forEach(function (value) {
            expect(lamb.union(value, [3, 5])).toEqual([3, 5]);
            expect(lamb.union([3, 5], value)).toEqual([3, 5]);
        });
    });
});
