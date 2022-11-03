import contains from "../../array/contains";
import isGTE from "../../logic/isGTE";
import is from "../../logic/is";
import isSVZ from "../../core/isSVZ";
import isUndefined from "../../core/isUndefined";
import keySatisfies from "../keySatisfies";
import make from "../make";
import range from "../../math/range";
import {
    nonFunctions,
    nonStrings,
    nonStringsAsStrings,
    wannabeEmptyObjects
} from "../../__tests__/commons";

describe("keySatisfies", () => {
    const users = [
        { name: "Jane", age: 12, active: false },
        { name: "John", age: 40, active: false },
        { name: "Mario", age: 18, active: true },
        { name: "Paolo", age: 15, active: true }
    ];

    it("should use a predicate and a property name to build a new predicate that will be applied on an object's key", () => {
        const isAdult = keySatisfies(isGTE(18), "age");

        expect(users.map(isAdult)).toStrictEqual([false, true, true, false]);
    });

    it("should pass an `undefined` value to the predicate if the given property doesn't exist", () => {
        const isGreaterThan17 = function (n) {
            expect(arguments.length).toBe(1);
            expect(n).toBeUndefined();

            return n > 17;
        };

        expect(keySatisfies(isGreaterThan17, "foo")(users[0])).toBe(false);
        expect(keySatisfies(isGreaterThan17, "bar")(users[2])).toBe(false);
    });

    it("should apply the function's calling context to the predicate", () => {
        const ageValidator = {
            minAllowedAge: 15,
            maxAllowedAge: 50,
            hasValidAge: keySatisfies(function (age) {
                return age >= this.minAllowedAge && age <= this.maxAllowedAge;
            }, "age")
        };

        expect(ageValidator.hasValidAge({ age: 20 })).toBe(true);
        expect(ageValidator.hasValidAge({ age: 55 })).toBe(false);

        const ageValidator2 = Object.create(ageValidator, {
            minAllowedAge: { value: 21 },
            maxAllowedAge: { value: 55 }
        });

        expect(ageValidator2.hasValidAge({ age: 20 })).toBe(false);
        expect(ageValidator2.hasValidAge({ age: 55 })).toBe(true);
    });

    it("should accept integers as keys and accept array-like objects", () => {
        const o = { 1: "a", 2: "b" };
        const arr = [1, 2, 3, 4];
        const s = "abcd";

        expect(keySatisfies(is("a"), 1)(o)).toBe(true);
        expect(keySatisfies(is(2), 1)(arr)).toBe(true);
        expect(keySatisfies(is("c"), 2)(s)).toBe(true);
    });

    it("should pass an `undefined` value to the predicate for unassigned or deleted indexes in sparse arrays", () => {
        /* eslint-disable no-sparse-arrays */
        expect(keySatisfies(isUndefined, "1")([1, , 3])).toBe(true);
        expect(keySatisfies(isUndefined, "-2")([1, , 3])).toBe(true);
        /* eslint-enable no-sparse-arrays */
    });

    it("should convert other values for the `key` parameter to string", () => {
        const testObj = make(
            nonStringsAsStrings,
            range(0, nonStringsAsStrings.length, 1)
        );

        nonStrings.forEach(key => {
            const value = nonStringsAsStrings.indexOf(String(key));

            expect(keySatisfies(is(value), key)(testObj)).toBe(true);
        });

        expect(keySatisfies(is(99))({ undefined: 99 })).toBe(true);
    });

    it("should throw an exception if the predicate isn't a function or is missing", () => {
        nonFunctions.forEach(value => {
            expect(() => { keySatisfies(value, "foo")({}); }).toThrow();
        });

        expect(() => { keySatisfies()({}); }).toThrow();
    });

    it("should throw an exception if called without the data argument", () => {
        expect(keySatisfies(contains, "foo")).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an object", () => {
        expect(() => { keySatisfies(contains(99), "foo")(null); }).toThrow();
        expect(() => { keySatisfies(contains(99), "foo")(void 0); }).toThrow();
    });

    it("should convert to object every other value", () => {
        const isZero = isSVZ(0);

        wannabeEmptyObjects.forEach(value => {
            expect(keySatisfies(isZero, "foo")(value)).toBe(false);
        });

        expect(keySatisfies(isZero, "lastIndex")(/foo/)).toBe(true);
    });
});
