import * as lamb from "../..";
import { nonFunctions, wannabeEmptyObjects } from "../../__tests__/commons";

describe("skipIf", function () {
    var agesAndCities = [
        { age: 12, city: "New York" },
        { age: 40, city: "London" },
        { age: 18, city: "Rome" },
        { age: 15, city: "Amsterdam" }
    ];

    var persons = [
        { name: "Jane", surname: "Doe", age: 12, city: "New York" },
        { name: "John", surname: "Doe", age: 40, city: "London" },
        { name: "Mario", surname: "Rossi", age: 18, city: "Rome" },
        { name: "Paolo", surname: "Bianchi", age: 15, city: "Amsterdam" }
    ];

    var isNumber = function (v) { return typeof v === "number"; };
    var isNameKey = function (value, key) { return key.indexOf("name") !== -1; };

    // to check "truthy" and "falsy" values returned by predicates
    var isNameKey2 = function (value, key) { return ~key.indexOf("name"); };

    it("should skip object properties using a predicate", function () {
        expect(persons.map(lamb.skipIf(isNameKey))).toEqual(agesAndCities);
        expect(lamb.skipIf(isNumber)(persons[0])).toEqual(
            { name: "Jane", surname: "Doe", city: "New York" }
        );
    });

    it("should include properties with `undefined` values in the result", function () {
        var isNotNil = lamb.not(lamb.isNil);

        expect(lamb.skipIf(isNotNil)({ a: null, b: void 0 })).toStrictEqual({ a: null, b: void 0 });
    });

    it("should accept array-like objects", function () {
        var isEven = function (n) { return n % 2 === 0; };

        expect(lamb.skipIf(isEven)([1, 2, 3, 4])).toEqual({ 0: 1, 2: 3 });
        expect(lamb.skipIf(isEven)("1234")).toEqual({ 0: "1", 2: "3" });
    });

    it("should not consider unassigned or deleted indexes in sparse arrays", function () {
        // eslint-disable-next-line no-sparse-arrays
        expect(lamb.skipIf(lamb.not(lamb.isUndefined))([1, , 3, void 0])).toStrictEqual({ 3: void 0 });
    });

    it("should treat \"truthy\" and \"falsy\" values returned by predicates as booleans", function () {
        expect(persons.map(lamb.skipIf(isNameKey2))).toEqual(agesAndCities);
    });

    it("should throw an exception if the predicate isn't a function or if is missing", function () {
        nonFunctions.forEach(function (value) {
            expect(function () { lamb.skipIf(value)({ a: 2 }); }).toThrow();
        });

        expect(function () { lamb.skipIf()({ a: 2 }); }).toThrow();
    });

    it("should throw an exception if the `source` is `null` or `undefined` or if is missing", function () {
        expect(lamb.skipIf(isNumber)).toThrow();
        expect(function () { lamb.skipIf(isNumber)(null); }).toThrow();
        expect(function () { lamb.skipIf(isNumber)(void 0); }).toThrow();
    });

    it("should convert to object every other value received as `source`", function () {
        wannabeEmptyObjects.forEach(function (v) {
            expect(lamb.skipIf(isNumber)(v)).toEqual({});
        });
    });
});
