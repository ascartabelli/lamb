import getKey from "../../object/getKey";
import identity from "../../core/identity";
import invoke from "../../function/invoke";
import uniques from "../uniques";
import uniquesBy from "../uniquesBy";
import { nonFunctions, wannabeEmptyArrays } from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("uniques / uniquesBy", () => {
    const data = [
        { id: "1", name: "foo" },
        { id: "1", name: "Foo" },
        { id: "2", name: "bar" },
        { id: "3", name: "baz" },
        { id: "2", name: "Bar" },
        { id: "1", name: "FOO" }
    ];

    const dataUniques = [
        { id: "1", name: "foo" },
        { id: "2", name: "bar" },
        { id: "3", name: "baz" }
    ];

    const uniquesByIdentity = uniquesBy(identity);

    describe("uniques", () => {
        it("should return the unique elements of an array of simple values", () => {
            expect(uniques([0, 2, 3, 4, 0, 4, 3, 5, 2, 1, 1])).toStrictEqual([0, 2, 3, 4, 5, 1]);
            expect(uniques(["foo", "bar", "bar", "baz"])).toStrictEqual(["foo", "bar", "baz"]);
            expect(uniques(Array(3))).toStrictEqual([void 0]);
        });

        it("should throw an exception if called without arguments", () => {
            expect(uniques).toThrow();
        });
    });

    describe("uniquesBy", () => {
        it("should use the provided iteratee to extract the values to compare", () => {
            const chars = ["b", "A", "r", "B", "a", "z"];

            expect(uniquesBy(invoke("toUpperCase"))(chars)).toStrictEqual(["b", "A", "r", "z"]);
            expect(uniquesBy(getKey("id"))(data)).toStrictEqual(dataUniques);
        });

        it("should build a function throwing an exception if the itereatee isn't a function or if is missing", () => {
            nonFunctions.forEach(value => {
                expect(() => { uniquesBy(value)([1, 2, 3]); }).toThrow();
            });

            expect(() => { uniquesBy()([1, 2, 3]); }).toThrow();
        });
    });

    it("should use the SameValueZero comparison", () => {
        expect(uniques([0, 1, 2, NaN, 1, 2, -0, NaN])).toStrictEqual([0, 1, 2, NaN]);
    });

    it("should return a copy of the source array if it's empty or already contains unique values", () => {
        const a1 = [];
        const r1 = uniques(a1);
        const a2 = [1, 2, 3, 4, 5];
        const r2 = uniques(a2);

        expect(r1).toStrictEqual([]);
        expect(r1).not.toBe(a1);
        expect(r2).toStrictEqual(a2);
        expect(r2).not.toBe(a2);
    });

    it("should work with array-like objects", () => {
        const s = "hello world";
        const r = ["h", "e", "l", "o", " ", "w", "r", "d"];

        expect(uniques(s)).toStrictEqual(r);
        expect(uniquesByIdentity(s)).toStrictEqual(r);
    });

    it("should prefer the first encountered value if two values are considered equal", () => {
        expect(Object.is(0, uniques([0, -0])[0])).toBe(true);
        expect(uniques([2, -0, 3, 3, 0, 1])).toStrictEqual([2, -0, 3, 1]);

        const r = uniquesBy(getKey("id"))(data);

        expect(r).toStrictEqual(dataUniques);
        expect(r[0]).toBe(data[0]);
        expect(r[1]).toBe(data[2]);
    });

    it("should always return dense arrays", () => {
        /* eslint-disable no-sparse-arrays */
        const a1 = [1, , 1, 3];
        const a2 = [1, , 1, void 0, 3];
        /* eslint-enable no-sparse-arrays */

        const r = [1, void 0, 3];

        expect(uniques(a1)).toStrictArrayEqual(r);
        expect(uniques(a2)).toStrictArrayEqual(r);
        expect(uniquesByIdentity(a1)).toStrictArrayEqual(r);
        expect(uniquesByIdentity(a2)).toStrictArrayEqual(r);
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", () => {
        expect(() => { uniques(null); }).toThrow();
        expect(() => { uniques(void 0); }).toThrow();
        expect(() => { uniquesByIdentity(null); }).toThrow();
        expect(() => { uniquesByIdentity(void 0); }).toThrow();
    });

    it("should treat every other value as an empty array", () => {
        wannabeEmptyArrays.forEach(value => {
            expect(uniques(value)).toStrictEqual([]);
            expect(uniquesByIdentity(value)).toStrictEqual([]);
        });
    });
});
