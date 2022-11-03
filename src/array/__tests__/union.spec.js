import getKey from "../../object/getKey";
import identity from "../../core/identity";
import union from "../union";
import unionBy from "../unionBy";
import { nonFunctions, wannabeEmptyArrays } from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("union / unionBy", () => {
    const a1 = [1, 2, 3];
    const a2 = [2, 3, 5];
    const a3 = [3, 4, 5, [2, 3]];
    const a4 = [2, 3, 4, [2, 3]];

    const r1 = [1, 2, 3, 5, 4, [2, 3], [2, 3]];
    const r2 = [1, 2, 3, 5, 4, [2, 3]];
    const r3 = [1, 2, 3, 5];

    const data = [
        [{ id: "1", name: "foo" }],
        [{ id: "1", name: "Foo" }, { id: "2", name: "bar" }, { id: "3", name: "baz" }],
        [{ id: "2", name: "Bar" }, { id: "1", name: "FOO" }]
    ];

    const dataUnionById = [
        { id: "1", name: "foo" },
        { id: "2", name: "bar" },
        { id: "3", name: "baz" }
    ];

    const unionByIdentity = unionBy(identity);
    const unionAsStrings = unionBy(String);
    const unionById = unionBy(getKey("id"));

    describe("unionBy", () => {
        it("should build a function throwing an exception if the `iteratee` is not a function or if is missing", () => {
            nonFunctions.forEach(function (value) {
                expect(() => { unionBy(value)(a1, a2); }).toThrow();
            });

            expect(() => { unionBy()(a1, a2); }).toThrow();
        });
    });

    it("should return a list of every unique element present in the two given arrays", () => {
        expect(union([], [])).toStrictEqual([]);
        expect(union([1, 2], [2, 3])).toStrictEqual([1, 2, 3]);
        expect(union(
            union(a1, a2),
            union(a3, a4)
        )).toStrictEqual(r1);
        expect(unionAsStrings([], [])).toStrictEqual([]);
        expect(unionAsStrings([1, 2], [2, 3])).toStrictEqual([1, 2, 3]);
        expect(unionAsStrings(
            unionAsStrings(a1, a2),
            unionAsStrings(a3, a4)
        )).toStrictEqual(r2);
        expect(unionById(
            unionById(data[0], data[1]),
            data[2]
        )).toStrictEqual(dataUnionById);
    });

    it("should ignore extra arguments", () => {
        expect(union(a1, a2, a3)).toStrictEqual(r3);
        expect(unionAsStrings(a1, a2, a3)).toStrictEqual(r3);
    });

    it("should work with array-like objects", () => {
        expect(union("abc", "bcd")).toStrictEqual(["a", "b", "c", "d"]);
        expect(unionByIdentity("abc", "bcd")).toStrictEqual(["a", "b", "c", "d"]);
    });

    it("should use the \"SameValueZero\" comparison and keep the first encountered value in case of equality", () => {
        expect(union([-0, 2, 3, NaN], [1, 0, NaN, 1])).toStrictEqual([-0, 2, 3, NaN, 1]);
        expect(unionAsStrings([-0, 2, 3, NaN], [1, 0, NaN, 1])).toStrictEqual([-0, 2, 3, NaN, 1]);
    });

    it("should always return dense arrays", () => {
        /* eslint-disable no-sparse-arrays */
        expect(union(
            union([1, , 3], [3, 5]),
            [6, 7])
        ).toStrictArrayEqual([1, void 0, 3, 5, 6, 7]);
        expect(union(
            [1, , 3],
            union([3, 5], [void 0, 7])
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

    it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", () => {
        expect(() => { union(null, a1); }).toThrow();
        expect(() => { union(void 0, a1); }).toThrow();
        expect(() => { union(a1, null); }).toThrow();
        expect(() => { union(a1, void 0); }).toThrow();
        expect(() => { union(a1); }).toThrow();

        expect(() => { unionAsStrings(null, a2); }).toThrow();
        expect(() => { unionAsStrings(void 0, a2); }).toThrow();
        expect(() => { unionAsStrings(a2, null); }).toThrow();
        expect(() => { unionAsStrings(a2, void 0); }).toThrow();
        expect(() => { unionAsStrings(a2); }).toThrow();

        expect(union).toThrow();
        expect(unionAsStrings).toThrow();
    });

    it("should treat every other value as an empty array", () => {
        wannabeEmptyArrays.forEach(value => {
            expect(union(value, [3, 5])).toStrictEqual([3, 5]);
            expect(union([3, 5], value)).toStrictEqual([3, 5]);
        });
    });
});
