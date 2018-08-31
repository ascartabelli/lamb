import * as lamb from "../..";
import { nonFunctions, wannabeEmptyObjects } from "../../__tests__/commons";

describe("pickIf", function () {
    var names = [
        { name: "Jane", surname: "Doe" },
        { name: "John", surname: "Doe" },
        { name: "Mario", surname: "Rossi" },
        { name: "Paolo", surname: "Bianchi" }
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

    it("should pick object properties using a predicate", function () {
        expect(lamb.pickIf(isNumber)(persons[0])).toEqual({ age: 12 });
        expect(persons.map(lamb.pickIf(isNameKey))).toEqual(names);
    });

    it("should include properties with `undefined` values in the result", function () {
        expect(lamb.pickIf(lamb.isNil)({ a: null, b: void 0 })).toStrictEqual({ a: null, b: void 0 });
    });

    it("should accept array-like objects", function () {
        var isEven = function (n) { return n % 2 === 0; };

        expect(lamb.pickIf(isEven)([1, 2, 3, 4])).toEqual({ 1: 2, 3: 4 });
        expect(lamb.pickIf(isEven)("1234")).toEqual({ 1: "2", 3: "4" });
    });

    it("should not consider unassigned or deleted indexes in sparse arrays", function () {
        // eslint-disable-next-line no-sparse-arrays
        expect(lamb.pickIf(lamb.isUndefined)([1, , 3, void 0])).toStrictEqual({ 3: void 0 });
    });

    it("should treat \"truthy\" and \"falsy\" values returned by predicates as booleans", function () {
        expect(persons.map(lamb.pickIf(isNameKey2))).toEqual(names);
    });

    it("should throw an exception if the predicate isn't a function or if is missing", function () {
        nonFunctions.forEach(function (value) {
            expect(function () { lamb.pickIf(value)({ a: 2 }); }).toThrow();
        });

        expect(function () { lamb.pickIf()({ a: 2 }); }).toThrow();
    });

    it("should throw an exception if the `source` is `null` or `undefined` or if is missing", function () {
        expect(lamb.pickIf(isNumber)).toThrow();
        expect(function () { lamb.pickIf(isNumber)(null); }).toThrow();
        expect(function () { lamb.pickIf(isNumber)(void 0); }).toThrow();
    });

    it("should convert to object every other value received as `source`", function () {
        wannabeEmptyObjects.forEach(function (v) {
            expect(lamb.pickIf(isNumber)(v)).toEqual({});
        });
    });
});
