import merge from "../merge";
import pick from "../pick";
import pickIn from "../pickIn";
import {
    nonStringsAsStrings,
    wannabeEmptyArrays,
    wannabeEmptyObjects
} from "../../__tests__/commons";

describe("pickIn / pick", () => {
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

    it("should return an object having only the specified properties of the source object (if they exist)", () => {
        expect(pickIn(simpleObj, ["foo", "baz", "foobaz"])).toStrictEqual({ foo: 1, baz: 3 });
        expect(pick(["foo", "baz", "foobaz"])(simpleObj)).toStrictEqual({ foo: 1, baz: 3 });
    });

    it("should include inherited properties", () => {
        expect(pickIn(simpleObj, ["foo", "bar"])).toStrictEqual({ foo: 1, bar: 2 });
        expect(pick(["foo", "bar"])(simpleObj)).toStrictEqual({ foo: 1, bar: 2 });
    });

    it("should include properties with `undefined` values in the result", () => {
        expect(pickIn({ a: null, b: void 0 }, ["a", "b"])).toStrictEqual({ a: null, b: void 0 });
        expect(pick(["a", "b"])({ a: null, b: void 0 })).toStrictEqual({ a: null, b: void 0 });
    });

    it("should accept arrays and array-like objects and integers as keys", () => {
        const result = {
            0: { name: "Jane", surname: "Doe" },
            2: { name: "Mario", surname: "Rossi" }
        };

        expect(pickIn(names, ["0", 2])).toStrictEqual(result);
        expect(pick(["0", 2])(names)).toStrictEqual(result);
        expect(pickIn("bar", [0, 2])).toStrictEqual({ 0: "b", 2: "r" });
        expect(pick([0, 2])("bar")).toStrictEqual({ 0: "b", 2: "r" });
    });

    it("should see unassigned or deleted indexes in sparse arrays as non-existing keys", () => {
        /* eslint-disable no-sparse-arrays */
        expect(pickIn([1, , 3], [0, 1])).toStrictEqual({ 0: 1 });
        expect(pick([0, 1])([1, , 3])).toStrictEqual({ 0: 1 });
        /* eslint-enable no-sparse-arrays */
    });

    it("should see unassigned or deleted indexes in sparse arrays received as the `whitelist` as `undefined` values", () => {
        /* eslint-disable comma-spacing, no-sparse-arrays */
        expect(pickIn({ undefined: 1, a: 2, b: 3 }, ["a", ,])).toStrictEqual({ undefined: 1, a: 2 });
        expect(pick(["a", ,])({ undefined: 1, a: 2, b: 3 })).toStrictEqual({ undefined: 1, a: 2 });
        /* eslint-enable comma-spacing, no-sparse-arrays */
    });

    it("should return an empty object if supplied with an empty list of keys", () => {
        expect(pickIn(simpleObj, [])).toStrictEqual({});
        expect(pick([])(simpleObj)).toStrictEqual({});
    });

    it("should accept an array-like object as the `whitelist` parameter", () => {
        expect(pickIn({ a: 1, b: 2, c: 3 }, "ac")).toStrictEqual({ a: 1, c: 3 });
        expect(pick("ac")({ a: 1, b: 2, c: 3 })).toStrictEqual({ a: 1, c: 3 });
    });

    it("should convert to string every value in the `whitelist` parameter", () => {
        const testObj = merge({ bar: "baz" }, oddObject);

        expect(pickIn(testObj, nonStringsAsStrings)).toStrictEqual(oddObject);
        expect(pick(nonStringsAsStrings)(testObj)).toStrictEqual(oddObject);
    });

    it("should throw an exception if called without the main data argument", () => {
        expect(pickIn).toThrow();
        expect(pick(["a", "b"])).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` in place of the `whitelist`", () => {
        expect(() => { pickIn({ a: 1 }, null); }).toThrow();
        expect(() => { pickIn({ a: 1 }, void 0); }).toThrow();
        expect(() => { pick(null)({ a: 1 }); }).toThrow();
        expect(() => { pick(void 0)({ a: 1 }); }).toThrow();
        expect(() => { pick()({ a: 1 }); }).toThrow();
    });

    it("should treat other values for the `whitelist` parameter as an empty array and return an empty object", () => {
        wannabeEmptyArrays.forEach(value => {
            expect(pickIn({ a: 1, b: 2 }, value)).toStrictEqual({});
            expect(pick(value)({ a: 1, b: 2 })).toStrictEqual({});
        });
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an object", () => {
        expect(() => { pickIn(null, ["a", "b"]); }).toThrow();
        expect(() => { pickIn(void 0, ["a", "b"]); }).toThrow();
        expect(() => { pick(["a", "b"])(null); }).toThrow();
        expect(() => { pick(["a", "b"])(void 0); }).toThrow();
    });

    it("should convert to object every other value", () => {
        wannabeEmptyObjects.forEach(value => {
            expect(pickIn(value, ["a"])).toStrictEqual({});
            expect(pick(["a"])(value)).toStrictEqual({});
        });

        expect(pickIn(/foo/, ["lastIndex"])).toStrictEqual({ lastIndex: 0 });
        expect(pick(["lastIndex"])(/foo/)).toStrictEqual({ lastIndex: 0 });
    });
});
