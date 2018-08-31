import * as lamb from "../..";
import { nonFunctions, wannabeEmptyArrays } from "../../__tests__/commons";

describe("count / countBy", function () {
    var getCity = lamb.getKey("city");

    var persons = [
        { name: "Jane", surname: "Doe", age: 12, city: "New York" },
        { name: "John", surname: "Doe", age: 40, city: "New York" },
        { name: "Mario", surname: "Rossi", age: 18, city: "Rome" },
        { name: "Paolo", surname: "Bianchi", age: 15 }
    ];

    var personsCityCount = {
        "New York": 2,
        Rome: 1,
        undefined: 1
    };

    var personsAgeGroupCount = {
        under20: 3,
        over20: 1
    };

    var splitByAgeGroup = function (person, idx, list) {
        expect(list).toBe(persons);
        expect(persons[idx]).toBe(person);

        return person.age > 20 ? "over20" : "under20";
    };

    it("should count the occurences of the key generated by the provided iteratee", function () {
        expect(lamb.count(persons, getCity)).toEqual(personsCityCount);
        expect(lamb.countBy(getCity)(persons)).toEqual(personsCityCount);
        expect(lamb.count(persons, splitByAgeGroup)).toEqual(personsAgeGroupCount);
        expect(lamb.countBy(splitByAgeGroup)(persons)).toEqual(personsAgeGroupCount);
    });

    it("should work with array-like objects", function () {
        var result = {
            h: 1, e: 1, l: 3, o: 2, " ": 1, w: 1, r: 1, d: 1
        };

        expect(lamb.count("hello world", lamb.identity)).toEqual(result);
        expect(lamb.countBy(lamb.identity)("hello world")).toEqual(result);
    });

    it("should throw an exception if the iteratee isn't a function", function () {
        nonFunctions.forEach(function (value) {
            expect(function () { lamb.count(persons, value); }).toThrow();
            expect(function () { lamb.countBy(value)(persons); }).toThrow();
        });

        expect(function () { lamb.count(persons); }).toThrow();
        expect(function () { lamb.countBy()(persons); }).toThrow();
    });

    it("should consider deleted or unassigned indexes in sparse arrays as `undefined` values", function () {
        var arr = [1, , 3, void 0, 5]; // eslint-disable-line no-sparse-arrays
        var result = { false: 3, true: 2 };

        expect(lamb.count(arr, lamb.isUndefined)).toEqual(result);
        expect(lamb.countBy(lamb.isUndefined)(arr)).toEqual(result);
    });

    it("should throw an exception if called without the data argument", function () {
        expect(lamb.count).toThrow();
        expect(lamb.countBy(lamb.identity)).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined`", function () {
        expect(function () { lamb.count(null, lamb.identity); }).toThrow();
        expect(function () { lamb.count(void 0, lamb.identity); }).toThrow();
        expect(function () { lamb.countBy(lamb.identity)(null); }).toThrow();
        expect(function () { lamb.countBy(lamb.identity)(void 0); }).toThrow();
    });

    it("should treat every other value as an empty array and return an empty object", function () {
        wannabeEmptyArrays.forEach(function (value) {
            expect(lamb.countBy(lamb.identity)(value)).toEqual({});
            expect(lamb.count(value, lamb.identity)).toEqual({});
        });
    });
});
