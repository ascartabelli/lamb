import * as lamb from "../..";
import {
    nonFunctions,
    nonStrings,
    nonStringsAsStrings,
    wannabeEmptyObjects
} from "../../__tests__/commons";

describe("keySatisfies", function () {
    var users = [
        { name: "Jane", age: 12, active: false },
        { name: "John", age: 40, active: false },
        { name: "Mario", age: 18, active: true },
        { name: "Paolo", age: 15, active: true }
    ];

    it("should use a predicate and a property name to build a new predicate that will be applied on an object's key", function () {
        var isAdult = lamb.keySatisfies(lamb.isGTE(18), "age");

        expect(users.map(isAdult)).toEqual([false, true, true, false]);
    });

    it("should pass an `undefined` value to the predicate if the given property doesn't exist", function () {
        var isGreaterThan17 = function (n) {
            expect(arguments.length).toBe(1);
            expect(n).toBeUndefined();

            return n > 17;
        };

        expect(lamb.keySatisfies(isGreaterThan17, "foo")(users[0])).toBe(false);
        expect(lamb.keySatisfies(isGreaterThan17, "bar")(users[2])).toBe(false);
    });

    it("should apply the function's calling context to the predicate", function () {
        var ageValidator = {
            minAllowedAge: 15,
            maxAllowedAge: 50,
            hasValidAge: lamb.keySatisfies(function (age) {
                return age >= this.minAllowedAge && age <= this.maxAllowedAge;
            }, "age")
        };

        expect(ageValidator.hasValidAge({ age: 20 })).toBe(true);
        expect(ageValidator.hasValidAge({ age: 55 })).toBe(false);

        var ageValidator2 = Object.create(ageValidator, {
            minAllowedAge: { value: 21 },
            maxAllowedAge: { value: 55 }
        });

        expect(ageValidator2.hasValidAge({ age: 20 })).toBe(false);
        expect(ageValidator2.hasValidAge({ age: 55 })).toBe(true);
    });

    it("should accept integers as keys and accept array-like objects", function () {
        var o = { 1: "a", 2: "b" };
        var arr = [1, 2, 3, 4];
        var s = "abcd";

        expect(lamb.keySatisfies(lamb.is("a"), 1)(o)).toBe(true);
        expect(lamb.keySatisfies(lamb.is(2), 1)(arr)).toBe(true);
        expect(lamb.keySatisfies(lamb.is("c"), 2)(s)).toBe(true);
    });

    it("should pass an `undefined` value to the predicate for unassigned or deleted indexes in sparse arrays", function () {
        /* eslint-disable no-sparse-arrays */
        expect(lamb.keySatisfies(lamb.isUndefined, "1")([1, , 3])).toBe(true);
        expect(lamb.keySatisfies(lamb.isUndefined, "-2")([1, , 3])).toBe(true);
        /* eslint-enable no-sparse-arrays */
    });

    it("should convert other values for the `key` parameter to string", function () {
        var testObj = lamb.make(
            nonStringsAsStrings,
            lamb.range(0, nonStringsAsStrings.length, 1)
        );

        nonStrings.forEach(function (key) {
            var value = nonStringsAsStrings.indexOf(String(key));

            expect(lamb.keySatisfies(lamb.is(value), key)(testObj)).toBe(true);
        });

        expect(lamb.keySatisfies(lamb.is(99))({ undefined: 99 })).toBe(true);
    });

    it("should throw an exception if the predicate isn't a function or is missing", function () {
        nonFunctions.forEach(function (value) {
            expect(function () { lamb.keySatisfies(value, "foo")({}); }).toThrow();
        });

        expect(function () { lamb.keySatisfies()({}); }).toThrow();
    });

    it("should throw an exception if called without the data argument", function () {
        expect(lamb.keySatisfies(lamb.contains, "foo")).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an object", function () {
        expect(function () { lamb.keySatisfies(lamb.contains(99), "foo")(null); }).toThrow();
        expect(function () { lamb.keySatisfies(lamb.contains(99), "foo")(void 0); }).toThrow();
    });

    it("should convert to object every other value", function () {
        var isZero = lamb.isSVZ(0);

        wannabeEmptyObjects.forEach(function (v) {
            expect(lamb.keySatisfies(isZero, "foo")(v)).toBe(false);
        });

        expect(lamb.keySatisfies(isZero, "lastIndex")(/foo/)).toBe(true);
    });
});
