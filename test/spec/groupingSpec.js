var lamb = require("../../dist/lamb.js");
var sparseArrayEquality = require("../custom_equalities.js").sparseArrayEquality;

describe("lamb.grouping", function () {
    var persons = [
        {"name": "Jane", "surname": "Doe", "age": 12, "city": "New York"},
        {"name": "John", "surname": "Doe", "age": 40, "city": "New York"},
        {"name": "Mario", "surname": "Rossi", "age": 18, "city": "Rome"},
        {"name": "Paolo", "surname": "Bianchi", "age": 15}
    ];

    var personsCityCount = {
        "New York": 2,
        "Rome": 1,
        "undefined": 1
    };

    var personsAgeGroupCount = {
        "under20": 3,
        "over20": 1
    };

    var personsByAgeGroup = {
        "under20": [
            {"name": "Jane", "surname": "Doe", "age": 12, "city": "New York"},
            {"name": "Mario", "surname": "Rossi", "age": 18, "city": "Rome"},
            {"name": "Paolo", "surname": "Bianchi", "age": 15}
        ],
        "over20": [
            {"name": "John", "surname": "Doe", "age": 40, "city": "New York"}
        ]
    };

    var personsByCity = {
        "New York": [
            {"name": "Jane", "surname": "Doe", "age": 12, "city": "New York"},
            {"name": "John", "surname": "Doe", "age": 40, "city": "New York"}
        ],
        "Rome": [
            {"name": "Mario", "surname": "Rossi", "age": 18, "city": "Rome"}
        ],
        "undefined": [
            {"name": "Paolo", "surname": "Bianchi", "age": 15}
        ]
    };

    var personsByAgeIndex = {
        "12": {"name": "Jane", "surname": "Doe", "age": 12, "city": "New York"},
        "15": {"name": "Paolo", "surname": "Bianchi", "age": 15},
        "18": {"name": "Mario", "surname": "Rossi", "age": 18, "city": "Rome"},
        "40": {"name": "John", "surname": "Doe", "age": 40, "city": "New York"}
    };

    var personsByCityIndex = {
        "New York": {"name": "John", "surname": "Doe", "age": 40, "city": "New York"},
        "Rome": {"name": "Mario", "surname": "Rossi", "age": 18, "city": "Rome"},
        "undefined": {"name": "Paolo", "surname": "Bianchi", "age": 15}
    };

    var fakeContext = {};
    var getCity = lamb.getKey("city");

    var splitByAgeGroup = function (person, idx, list) {
        expect(this).toBe(fakeContext);
        expect(list).toBe(persons);
        expect(persons[idx]).toBe(person);
        return person.age > 20 ? "over20" : "under20";
    };

    beforeEach(function() {
        jasmine.addCustomEqualityTester(sparseArrayEquality);
    });

    describe("count / countBy", function () {
        it("should count the occurences of the key generated by the provided iteratee", function () {
            expect(lamb.count(persons, getCity)).toEqual(personsCityCount);
            expect(lamb.countBy(getCity)(persons)).toEqual(personsCityCount);
            expect(lamb.count(persons, splitByAgeGroup, fakeContext)).toEqual(personsAgeGroupCount);
            expect(lamb.countBy(splitByAgeGroup, fakeContext)(persons)).toEqual(personsAgeGroupCount);
        });

        it("should work with array-like objects", function () {
            var result = {"h": 1, "e": 1, "l": 3, "o": 2, " ": 1, "w": 1, "r": 1, "d": 1};

            expect(lamb.count("hello world", lamb.identity)).toEqual(result);
            expect(lamb.countBy(lamb.identity)("hello world")).toEqual(result);
        });

        it("should throw an exception if the iteratee isn't a function", function () {
            [void 0, null, {}, [1, 2], "foo", /foo/, 1, NaN, true, new Date()].forEach(function (value) {
                expect(function () { lamb.count(persons, value); }).toThrow();
                expect(function () { lamb.countBy(value)(persons); }).toThrow();
            });

            expect(function () { lamb.count(persons); }).toThrow();
            expect(function () { lamb.countBy()(persons); }).toThrow();
        });

        it("should consider deleted or unassigned indexes in sparse arrays as `undefined` values", function () {
            var arr = [1, , 3, void 0, 5];
            var result = {"false": 3, "true": 2};

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
            [/foo/, 1, function () {}, NaN, true, new Date()].forEach(function (value) {
                expect(lamb.countBy(lamb.identity)(value)).toEqual({});
                expect(lamb.count(value, lamb.identity)).toEqual({});
            });
        });
    });

    describe("group / groupBy", function () {
        it("should build an object using the provided iteratee to group the list with the desired criterion", function () {
            expect(lamb.group(persons, splitByAgeGroup, fakeContext)).toEqual(personsByAgeGroup);
            expect(lamb.groupBy(splitByAgeGroup, fakeContext)(persons)).toEqual(personsByAgeGroup);
            expect(lamb.group(persons, getCity)).toEqual(personsByCity);
            expect(lamb.groupBy(getCity)(persons)).toEqual(personsByCity);
        });

        it("should work with array-like objects", function () {
            var evenAndOdd = function (n) { return n % 2 === 0 ? "even" : "odd"; };
            var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            var result = {"even": [2, 4, 6, 8, 10], "odd": [1, 3, 5, 7, 9]};
            var argsTest = function () {
                return lamb.group(arguments, evenAndOdd);
            };

            expect(argsTest.apply(null, numbers)).toEqual(result);
        });

        it("should consider deleted or unassigned indexes in sparse arrays as `undefined` values", function () {
            var arr = [1, , 3, void 0, 5];
            var result = {"false": [1, 3, 5], "true": [void 0, void 0]};

            expect(lamb.group(arr, lamb.isUndefined)).toEqual(result);
            expect(lamb.groupBy(lamb.isUndefined)(arr)).toEqual(result);
        });

        it("should throw an exception if the iteratee isn't a function", function () {
            [void 0, null, {}, [1, 2], "foo", /foo/, 1, NaN, true, new Date()].forEach(function (value) {
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
            [/foo/, 1, function () {}, NaN, true, new Date()].forEach(function (value) {
                expect(lamb.groupBy(lamb.identity)(value)).toEqual({});
                expect(lamb.group(value, lamb.identity)).toEqual({});
            });
        });
    });

    describe("index / indexBy", function () {
        it("should build a lookup table with keys generated by the iteratee and one value for each key from the original list", function () {
            var indexByAge = function (person, idx, list) {
                expect(this).toBe(fakeContext);
                expect(list).toBe(persons);
                expect(persons[idx]).toBe(person);
                return person.age;
            };

            expect(lamb.index(persons, indexByAge, fakeContext)).toEqual(personsByAgeIndex);
            expect(lamb.indexBy(indexByAge, fakeContext)(persons)).toEqual(personsByAgeIndex);
        });

        it("should use the last evaluated value when the iteratee produces a duplicate key", function () {
            expect(lamb.index(persons, getCity)).toEqual(personsByCityIndex);
            expect(lamb.indexBy(getCity)(persons)).toEqual(personsByCityIndex);
        });

        it("should work with array-like objects", function () {
            var result = {"h": "h", "e": "e", "l": "l", "o": "o", " ": " ", "w": "w", "r": "r", "d": "d"};

            expect(lamb.index("hello world", lamb.identity)).toEqual(result);
            expect(lamb.indexBy(lamb.identity)("hello world")).toEqual(result);
        });

        it("should consider deleted or unassigned indexes in sparse arrays as `undefined` values", function () {
            var arr = [1, , 3, void 0, 5];
            var result = {"0": 1, "1": void 0, "2": 3, "3": void 0, "4": 5};

            expect(lamb.index(arr, lamb.getArgAt(1))).toEqual(result);
            expect(lamb.indexBy(lamb.getArgAt(1))(arr)).toEqual(result);
        });

        it("should throw an exception if the iteratee isn't a function", function () {
            [void 0, null, {}, [1, 2], "foo", /foo/, 1, NaN, true, new Date()].forEach(function (value) {
                expect(function () { lamb.index(persons, value); }).toThrow();
                expect(function () { lamb.indexBy(value)(persons); }).toThrow();
            });

            expect(function () { lamb.index(persons); }).toThrow();
            expect(function () { lamb.indexBy()(persons); }).toThrow();
        });

        it("should throw an exception if called without the data argument", function () {
            expect(lamb.index).toThrow();
            expect(lamb.indexBy(lamb.identity)).toThrow();
        });

        it("should throw an exception if supplied with `null` or `undefined`", function () {
            expect(function () { lamb.index(null, lamb.identity); }).toThrow();
            expect(function () { lamb.index(void 0, lamb.identity); }).toThrow();
            expect(function () { lamb.indexBy(lamb.identity)(null); }).toThrow();
            expect(function () { lamb.indexBy(lamb.identity)(void 0); }).toThrow();
        });

        it("should treat every other value as an empty array and return an empty object", function () {
            [/foo/, 1, function () {}, NaN, true, new Date()].forEach(function (value) {
                expect(lamb.indexBy(lamb.identity)(value)).toEqual({});
                expect(lamb.index(value, lamb.identity)).toEqual({});
            });
        });
    });
});