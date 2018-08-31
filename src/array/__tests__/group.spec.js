import * as lamb from "../..";
import { nonFunctions, wannabeEmptyArrays } from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("group / groupBy", function () {
    var getCity = lamb.getKey("city");

    var persons = [
        { name: "Jane", surname: "Doe", age: 12, city: "New York" },
        { name: "John", surname: "Doe", age: 40, city: "New York" },
        { name: "Mario", surname: "Rossi", age: 18, city: "Rome" },
        { name: "Paolo", surname: "Bianchi", age: 15 }
    ];

    var personsByAgeGroup = {
        under20: [
            { name: "Jane", surname: "Doe", age: 12, city: "New York" },
            { name: "Mario", surname: "Rossi", age: 18, city: "Rome" },
            { name: "Paolo", surname: "Bianchi", age: 15 }
        ],
        over20: [
            { name: "John", surname: "Doe", age: 40, city: "New York" }
        ]
    };

    var personsByCity = {
        "New York": [
            { name: "Jane", surname: "Doe", age: 12, city: "New York" },
            { name: "John", surname: "Doe", age: 40, city: "New York" }
        ],
        Rome: [
            { name: "Mario", surname: "Rossi", age: 18, city: "Rome" }
        ],
        undefined: [
            { name: "Paolo", surname: "Bianchi", age: 15 }
        ]
    };

    var splitByAgeGroup = function (person, idx, list) {
        expect(list).toBe(persons);
        expect(persons[idx]).toBe(person);

        return person.age > 20 ? "over20" : "under20";
    };

    it("should build an object using the provided iteratee to group the list with the desired criterion", function () {
        expect(lamb.group(persons, splitByAgeGroup)).toEqual(personsByAgeGroup);
        expect(lamb.groupBy(splitByAgeGroup)(persons)).toEqual(personsByAgeGroup);
        expect(lamb.group(persons, getCity)).toEqual(personsByCity);
        expect(lamb.groupBy(getCity)(persons)).toEqual(personsByCity);
    });

    it("should work with array-like objects", function () {
        var evenAndOdd = function (n) { return n % 2 === 0 ? "even" : "odd"; };
        var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        var result = { even: [2, 4, 6, 8, 10], odd: [1, 3, 5, 7, 9] };
        var argsTest = function () {
            return lamb.group(arguments, evenAndOdd);
        };

        expect(argsTest.apply(null, numbers)).toEqual(result);
    });

    it("should consider deleted or unassigned indexes in sparse arrays as `undefined` values", function () {
        var arr = [1, , 3, void 0, 5]; // eslint-disable-line no-sparse-arrays
        var expected = { false: [1, 3, 5], true: [void 0, void 0] };
        var r1 = lamb.group(arr, lamb.isUndefined);
        var r2 = lamb.groupBy(lamb.isUndefined)(arr);

        expect(r1).toEqual(expected);
        expect(r1.true).toStrictArrayEqual(expected.true);
        expect(r2).toEqual(expected);
        expect(r2.true).toStrictArrayEqual(expected.true);
    });

    it("should throw an exception if the iteratee isn't a function", function () {
        nonFunctions.forEach(function (value) {
            expect(function () { lamb.group(persons, value); }).toThrow();
            expect(function () { lamb.groupBy(value)(persons); }).toThrow();
        });

        expect(function () { lamb.group(persons); }).toThrow();
        expect(function () { lamb.groupBy()(persons); }).toThrow();
    });

    it("should throw an exception if called without the data argument", function () {
        expect(lamb.group).toThrow();
        expect(lamb.groupBy(lamb.identity)).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined`", function () {
        expect(function () { lamb.group(null, lamb.identity); }).toThrow();
        expect(function () { lamb.group(void 0, lamb.identity); }).toThrow();
        expect(function () { lamb.groupBy(lamb.identity)(null); }).toThrow();
        expect(function () { lamb.groupBy(lamb.identity)(void 0); }).toThrow();
    });

    it("should treat every other value as an empty array and return an empty object", function () {
        wannabeEmptyArrays.forEach(function (value) {
            expect(lamb.groupBy(lamb.identity)(value)).toEqual({});
            expect(lamb.group(value, lamb.identity)).toEqual({});
        });
    });
});
