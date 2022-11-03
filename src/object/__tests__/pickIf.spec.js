import isNil from "../../core/isNil";
import isUndefined from "../../core/isUndefined";
import pickIf from "../pickIf";
import { nonFunctions, wannabeEmptyObjects } from "../../__tests__/commons";

describe("pickIf", () => {
    const names = [
        { name: "Jane", surname: "Doe" },
        { name: "John", surname: "Doe" },
        { name: "Mario", surname: "Rossi" },
        { name: "Paolo", surname: "Bianchi" }
    ];

    const persons = [
        { name: "Jane", surname: "Doe", age: 12, city: "New York" },
        { name: "John", surname: "Doe", age: 40, city: "London" },
        { name: "Mario", surname: "Rossi", age: 18, city: "Rome" },
        { name: "Paolo", surname: "Bianchi", age: 15, city: "Amsterdam" }
    ];

    const isNumber = value => typeof value === "number";
    const isNameKey = (value, key) => key.indexOf("name") !== -1;

    // to check "truthy" and "falsy" values returned by predicates
    const isNameKey2 = (value, key) => ~key.indexOf("name");

    it("should pick object properties using a predicate", () => {
        expect(pickIf(isNumber)(persons[0])).toStrictEqual({ age: 12 });
        expect(persons.map(pickIf(isNameKey))).toStrictEqual(names);
    });

    it("should include properties with `undefined` values in the result", () => {
        expect(pickIf(isNil)({ a: null, b: void 0 })).toStrictEqual({ a: null, b: void 0 });
    });

    it("should accept array-like objects", () => {
        const isEven = n => n % 2 === 0;

        expect(pickIf(isEven)([1, 2, 3, 4])).toStrictEqual({ 1: 2, 3: 4 });
        expect(pickIf(isEven)("1234")).toStrictEqual({ 1: "2", 3: "4" });
    });

    it("should not consider unassigned or deleted indexes in sparse arrays", () => {
        // eslint-disable-next-line no-sparse-arrays
        expect(pickIf(isUndefined)([1, , 3, void 0])).toStrictEqual({ 3: void 0 });
    });

    it("should treat \"truthy\" and \"falsy\" values returned by predicates as booleans", () => {
        expect(persons.map(pickIf(isNameKey2))).toStrictEqual(names);
    });

    it("should throw an exception if the predicate isn't a function or if is missing", () => {
        nonFunctions.forEach(value => {
            expect(() => { pickIf(value)({ a: 2 }); }).toThrow();
        });

        expect(() => { pickIf()({ a: 2 }); }).toThrow();
    });

    it("should throw an exception if the `source` is `null` or `undefined` or if is missing", () => {
        expect(pickIf(isNumber)).toThrow();
        expect(() => { pickIf(isNumber)(null); }).toThrow();
        expect(() => { pickIf(isNumber)(void 0); }).toThrow();
    });

    it("should convert to object every other value received as `source`", () => {
        wannabeEmptyObjects.forEach(value => {
            expect(pickIf(isNumber)(value)).toStrictEqual({});
        });
    });
});
