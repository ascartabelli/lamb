import getKey from "../../object/getKey";
import group from "../group";
import groupBy from "../groupBy";
import identity from "../../core/identity";
import isUndefined from "../../core/isUndefined";
import { nonFunctions, wannabeEmptyArrays } from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("group / groupBy", () => {
    function splitByAgeGroup (person, idx, list) {
        expect(list).toBe(persons);
        expect(persons[idx]).toBe(person);

        return person.age > 20 ? "over20" : "under20";
    }

    const getCity = getKey("city");
    const persons = [
        { name: "Jane", surname: "Doe", age: 12, city: "New York" },
        { name: "John", surname: "Doe", age: 40, city: "New York" },
        { name: "Mario", surname: "Rossi", age: 18, city: "Rome" },
        { name: "Paolo", surname: "Bianchi", age: 15 }
    ];
    const personsByAgeGroup = {
        under20: [
            { name: "Jane", surname: "Doe", age: 12, city: "New York" },
            { name: "Mario", surname: "Rossi", age: 18, city: "Rome" },
            { name: "Paolo", surname: "Bianchi", age: 15 }
        ],
        over20: [
            { name: "John", surname: "Doe", age: 40, city: "New York" }
        ]
    };
    const personsByCity = {
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

    it("should build an object using the provided iteratee to group the list with the desired criterion", () => {
        expect(group(persons, splitByAgeGroup)).toStrictEqual(personsByAgeGroup);
        expect(groupBy(splitByAgeGroup)(persons)).toStrictEqual(personsByAgeGroup);
        expect(group(persons, getCity)).toStrictEqual(personsByCity);
        expect(groupBy(getCity)(persons)).toStrictEqual(personsByCity);
    });

    it("should work with array-like objects", () => {
        function testArgs () {
            return group(arguments, n => (n % 2 === 0 ? "even" : "odd"));
        }

        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const result = { even: [2, 4, 6, 8, 10], odd: [1, 3, 5, 7, 9] };

        expect(testArgs.apply(null, numbers)).toStrictEqual(result);
    });

    it("should consider deleted or unassigned indexes in sparse arrays as `undefined` values", () => {
        const arr = [1, , 3, void 0, 5]; // eslint-disable-line no-sparse-arrays
        const expected = { false: [1, 3, 5], true: [void 0, void 0] };
        const r1 = group(arr, isUndefined);
        const r2 = groupBy(isUndefined)(arr);

        expect(r1).toStrictEqual(expected);
        expect(r1.true).toStrictArrayEqual(expected.true);
        expect(r2).toStrictEqual(expected);
        expect(r2.true).toStrictArrayEqual(expected.true);
    });

    it("should throw an exception if the iteratee isn't a function", () => {
        nonFunctions.forEach(value => {
            expect(() => { group(persons, value); }).toThrow();
            expect(() => { groupBy(value)(persons); }).toThrow();
        });

        expect(() => { group(persons); }).toThrow();
        expect(() => { groupBy()(persons); }).toThrow();
    });

    it("should throw an exception if called without the data argument", () => {
        expect(group).toThrow();
        expect(groupBy(identity)).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined`", () => {
        expect(() => { group(null, identity); }).toThrow();
        expect(() => { group(void 0, identity); }).toThrow();
        expect(() => { groupBy(identity)(null); }).toThrow();
        expect(() => { groupBy(identity)(void 0); }).toThrow();
    });

    it("should treat every other value as an empty array and return an empty object", () => {
        wannabeEmptyArrays.forEach(value => {
            expect(groupBy(identity)(value)).toStrictEqual({});
            expect(group(value, identity)).toStrictEqual({});
        });
    });
});
