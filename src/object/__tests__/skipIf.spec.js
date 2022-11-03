import isNil from "../../core/isNil";
import isUndefined from "../../core/isUndefined";
import not from "../../logic/not";
import skipIf from "../skipIf";
import { nonFunctions, wannabeEmptyObjects } from "../../__tests__/commons";

describe("skipIf", () => {
    const agesAndCities = [
        { age: 12, city: "New York" },
        { age: 40, city: "London" },
        { age: 18, city: "Rome" },
        { age: 15, city: "Amsterdam" }
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

    it("should skip object properties using a predicate", () => {
        expect(persons.map(skipIf(isNameKey))).toStrictEqual(agesAndCities);
        expect(skipIf(isNumber)(persons[0])).toStrictEqual(
            { name: "Jane", surname: "Doe", city: "New York" }
        );
    });

    it("should include properties with `undefined` values in the result", () => {
        const isNotNil = not(isNil);

        expect(skipIf(isNotNil)({ a: null, b: void 0 })).toStrictEqual({ a: null, b: void 0 });
    });

    it("should accept array-like objects", () => {
        const isEven = n => n % 2 === 0;

        expect(skipIf(isEven)([1, 2, 3, 4])).toStrictEqual({ 0: 1, 2: 3 });
        expect(skipIf(isEven)("1234")).toStrictEqual({ 0: "1", 2: "3" });
    });

    it("should not consider unassigned or deleted indexes in sparse arrays", () => {
        // eslint-disable-next-line no-sparse-arrays
        expect(skipIf(not(isUndefined))([1, , 3, void 0])).toStrictEqual({ 3: void 0 });
    });

    it("should treat \"truthy\" and \"falsy\" values returned by predicates as booleans", () => {
        expect(persons.map(skipIf(isNameKey2))).toStrictEqual(agesAndCities);
    });

    it("should throw an exception if the predicate isn't a function or if is missing", () => {
        nonFunctions.forEach(value => {
            expect(() => { skipIf(value)({ a: 2 }); }).toThrow();
        });

        expect(() => { skipIf()({ a: 2 }); }).toThrow();
    });

    it("should throw an exception if the `source` is `null` or `undefined` or if is missing", () => {
        expect(skipIf(isNumber)).toThrow();
        expect(() => { skipIf(isNumber)(null); }).toThrow();
        expect(() => { skipIf(isNumber)(void 0); }).toThrow();
    });

    it("should convert to object every other value received as `source`", () => {
        wannabeEmptyObjects.forEach(value => {
            expect(skipIf(isNumber)(value)).toStrictEqual({});
        });
    });
});
