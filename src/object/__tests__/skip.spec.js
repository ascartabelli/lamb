import merge from "../merge";
import skip from "../skip";
import skipIn from "../skipIn";
import {
    nonStringsAsStrings,
    wannabeEmptyArrays,
    wannabeEmptyObjects
} from "../../__tests__/commons";

describe("skipIn / skip", () => {
    const baseSimpleObj = { bar: 2 };
    const simpleObj = Object.create(baseSimpleObj, {
        foo: { value: 1, enumerable: true },
        baz: { value: 3, enumerable: true }
    });

    const names = [
        { name: "Jane", surname: "Doe" },
        { name: "John", surname: "Doe" },
        { name: "Mario", surname: "Rossi" },
        { name: "Paolo", surname: "Bianchi" }
    ];

    const oddObject = {};

    nonStringsAsStrings.forEach((key, idx) => {
        oddObject[key] = idx;
    });

    it("should return a copy of the given object without the specified properties", () => {
        expect(skipIn(simpleObj, ["bar", "baz"])).toStrictEqual({ foo: 1 });
        expect(skip(["bar", "baz"])(simpleObj)).toStrictEqual({ foo: 1 });
    });

    it("should include inherited properties", () => {
        expect(skipIn(simpleObj, ["foo"])).toStrictEqual({ bar: 2, baz: 3 });
        expect(skip(["foo"])(simpleObj)).toStrictEqual({ bar: 2, baz: 3 });
    });

    it("should include properties with `undefined` values in the result", () => {
        expect(skipIn({ a: null, b: void 0 }, ["c"])).toStrictEqual({ a: null, b: void 0 });
        expect(skip(["c"])({ a: null, b: void 0 })).toStrictEqual({ a: null, b: void 0 });
    });

    it("should accept arrays and array-like objects and integers as keys", () => {
        const result = {
            0: { name: "Jane", surname: "Doe" },
            2: { name: "Mario", surname: "Rossi" }
        };

        expect(skipIn(names, ["1", 3])).toStrictEqual(result);
        expect(skip(["1", 3])(names)).toStrictEqual(result);
        expect(skipIn("bar", [0, 2])).toStrictEqual({ 1: "a" });
        expect(skip([0, 2])("bar")).toStrictEqual({ 1: "a" });
    });

    it("should see unassigned or deleted indexes in sparse arrays as non-existing keys", () => {
        /* eslint-disable no-sparse-arrays */
        expect(skipIn([1, , 3], [2])).toStrictEqual({ 0: 1 });
        expect(skip([2])([1, , 3])).toStrictEqual({ 0: 1 });
        /* eslint-enable no-sparse-arrays */
    });

    it("should see unassigned or deleted indexes in sparse arrays received as the `blacklist` as `undefined` values", () => {
        /* eslint-disable comma-spacing, no-sparse-arrays */
        expect(skipIn({ undefined: 1, a: 2, b: 3 }, ["a", ,])).toStrictEqual({ b: 3 });
        expect(skip(["a", ,])({ undefined: 1, a: 2, b: 3 })).toStrictEqual({ b: 3 });
        /* eslint-enable comma-spacing, no-sparse-arrays */
    });

    it("should return a copy of the source object if supplied with an empty list of keys", () => {
        const r1 = skipIn(simpleObj, []);
        const r2 = skip([])(simpleObj);

        expect(r1).toStrictEqual({ foo: 1, bar: 2, baz: 3 });
        expect(r1).not.toBe(simpleObj);
        expect(r2).toStrictEqual({ foo: 1, bar: 2, baz: 3 });
        expect(r2).not.toBe(simpleObj);
    });

    it("should accept an array-like object as the `blacklist` parameter", () => {
        expect(skipIn({ a: 1, b: 2, c: 3 }, "ac")).toStrictEqual({ b: 2 });
        expect(skip("ac")({ a: 1, b: 2, c: 3 })).toStrictEqual({ b: 2 });
    });

    it("should convert to string every value in the `blacklist` parameter", () => {
        const testObj = merge({ bar: "baz" }, oddObject);

        expect(skipIn(testObj, nonStringsAsStrings)).toStrictEqual({ bar: "baz" });
        expect(skip(nonStringsAsStrings)(testObj)).toStrictEqual({ bar: "baz" });
    });

    it("should throw an exception if called without the main data argument", () => {
        expect(skipIn).toThrow();
        expect(skip(["a", "b"])).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` in place of the `blacklist`", () => {
        expect(() => { skipIn({ a: 1 }, null); }).toThrow();
        expect(() => { skipIn({ a: 1 }, void 0); }).toThrow();
        expect(() => { skip(null)({ a: 1 }); }).toThrow();
        expect(() => { skip(void 0)({ a: 1 }); }).toThrow();
        expect(() => { skip()({ a: 1 }); }).toThrow();
    });

    it("should treat other values for the `blacklist` parameter as an empty array and return a copy of the source object", () => {
        wannabeEmptyArrays.forEach(value => {
            const r1 = skipIn(simpleObj, value);
            const r2 = skip(value)(simpleObj);

            expect(r1).toStrictEqual({ foo: 1, bar: 2, baz: 3 });
            expect(r1).not.toBe(simpleObj);
            expect(r2).toStrictEqual({ foo: 1, bar: 2, baz: 3 });
            expect(r2).not.toBe(simpleObj);
        });
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an object", () => {
        expect(() => { skipIn(null, ["a", "b"]); }).toThrow();
        expect(() => { skipIn(void 0, ["a", "b"]); }).toThrow();
        expect(() => { skip(["a", "b"])(null); }).toThrow();
        expect(() => { skip(["a", "b"])(void 0); }).toThrow();
    });

    it("should convert to object every other value", () => {
        wannabeEmptyObjects.forEach(value => {
            expect(skipIn(value, ["a"])).toStrictEqual({});
            expect(skip(["a"])(value)).toStrictEqual({});
        });

        expect(skipIn(/foo/, ["lastIndex"])).toStrictEqual({});
        expect(skip(["lastIndex"])(/foo/)).toStrictEqual({});
    });
});
