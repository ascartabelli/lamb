import pluck from "../pluck";
import pluckFrom from "../pluckFrom";
import { nonStrings, wannabeEmptyArrays } from "../../__tests__/commons";

describe("pluckFrom / pluck", () => {
    const arr = [
        { bar: 1, baz: 2, qux: 3 },
        { bar: 34, baz: 22, qux: 73 },
        { bar: 45, baz: 21, qux: 83 },
        { bar: 65, baz: 92, qux: 39 }
    ];
    const lists = [[1, 2], [3, 4, 5], [6]];
    const s = "hello";

    it("should return an array of values taken from the given property of the source array elements", () => {
        expect(pluckFrom(arr, "baz")).toStrictEqual([2, 22, 21, 92]);
        expect(pluck("baz")(arr)).toStrictEqual([2, 22, 21, 92]);
        expect(pluckFrom(lists, "length")).toStrictEqual([2, 3, 1]);
        expect(pluck("length")(lists)).toStrictEqual([2, 3, 1]);
    });

    it("should work with array-like objects", () => {
        expect(pluckFrom(s, "length")).toStrictEqual([1, 1, 1, 1, 1]);
        expect(pluck("length")(s)).toStrictEqual([1, 1, 1, 1, 1]);
    });

    it("should return a list of undefined values if no property is specified or if the property doesn't exist", () => {
        const r = [void 0, void 0, void 0, void 0];

        nonStrings.forEach(value => {
            expect(pluckFrom(arr, value)).toStrictEqual(r);
            expect(pluck(value)(arr)).toStrictEqual(r);
        });

        expect(pluckFrom(arr, "foo")).toStrictEqual(r);
        expect(pluck("foo")(arr)).toStrictEqual(r);

        expect(pluckFrom(arr)).toStrictEqual(r);
        expect(pluck()(arr)).toStrictEqual(r);
    });

    it("should not skip deleted or unassigned indexes in the array-like and throw an exception", () => {
        const a = [, { bar: 2 }]; // eslint-disable-line no-sparse-arrays

        expect(() => { pluckFrom(a, "bar"); }).toThrow();
        expect(() => { pluck("bar")(a); }).toThrow();
    });

    it("should throw an exception if called without the data argument", () => {
        expect(pluckFrom).toThrow();
        expect(pluck("bar")).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", () => {
        expect(() => { pluckFrom(null, "bar"); }).toThrow();
        expect(() => { pluckFrom(void 0, "bar"); }).toThrow();
        expect(() => { pluck("bar")(null); }).toThrow();
        expect(() => { pluck("bar")(void 0); }).toThrow();
    });

    it("should treat every other value as an empty array", () => {
        wannabeEmptyArrays.forEach(value => {
            expect(pluckFrom(value, "bar")).toStrictEqual([]);
            expect(pluck("bar")(value)).toStrictEqual([]);
        });
    });
});
