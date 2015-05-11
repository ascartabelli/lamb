var lamb = require("../../dist/lamb.js");

describe("lamb.array", function () {
    describe("contains / isIn", function () {
        var testArray = ["foo", NaN, 0, 12];

        it("should verify if a value is contained in an array using the \"SameValueZero\" comparison", function () {
            expect(lamb.contains(12)(testArray)).toBe(true);
            expect(lamb.isIn(testArray, 12)).toBe(true);
            expect(lamb.contains(NaN)(testArray)).toBe(true);
            expect(lamb.isIn(testArray, NaN)).toBe(true);
            expect(lamb.contains(0)(testArray)).toBe(true);
            expect(lamb.isIn(testArray, 0)).toBe(true);
            expect(lamb.contains(-0)(testArray)).toBe(true);
            expect(lamb.isIn(testArray, -0)).toBe(true);
            expect(lamb.contains(15)(testArray)).toBe(false);
            expect(lamb.isIn(testArray, 15)).toBe(false);
        });

        it("should start the check from the beginning of the array if the \"fromIndex\" parameter is not specified", function () {
            expect(lamb.contains("foo")(testArray)).toBe(true);
            expect(lamb.isIn(testArray, "foo")).toBe(true);
        });

        it("should be able to start checking from a specific index", function () {
            expect(lamb.contains("foo", 0)(testArray)).toBe(true);
            expect(lamb.isIn(testArray, "foo", 0)).toBe(true);
            expect(lamb.contains(12, 2)(testArray)).toBe(true);
            expect(lamb.isIn(testArray, 12, 2)).toBe(true);
            expect(lamb.contains("foo", 1)(testArray)).toBe(false);
            expect(lamb.isIn(testArray, "foo", 1)).toBe(false);
        });

        it("should work with array-like objects", function () {
            expect(lamb.contains("f")("foo")).toBe(true);
            expect(lamb.isIn("foo", "f")).toBe(true);
            expect(lamb.contains("f", 1)("foo")).toBe(false);
            expect(lamb.isIn("foo", "f", 1)).toBe(false);
        });
    });

    describe("difference", function () {
        it("should throw an exception if no arguments are supplied", function () {
            expect(lamb.difference).toThrow();
        });

        it("should return an array of items present only in the first of the given arrays", function () {
            var a1 = [0, 1, 2, 3, 4, NaN];
            var a2 = [-0, 2, 3, 4, 5, NaN];
            var a3 = [4, 5, 1];
            var a4 = [6, 7];

            expect(lamb.difference(a1)).toEqual(a1);
            expect(lamb.difference(a1, a2)).toEqual([1]);
            expect(lamb.difference(a1, a2, a3)).toEqual([]);
            expect(lamb.difference(a1, a3, a4)).toEqual([0, 2, 3, NaN]);
            expect(Object.is(0, lamb.difference(a1, a3, a4)[0])).toBe(true);
        });
    });

    describe("drop / dropN", function () {
        it("should drop the first n elements of an array or array-like object", function () {
            expect(lamb.drop(["a", "b"], 1)).toEqual(["b"]);
            expect(lamb.drop(["a", "b"], 0)).toEqual(["a", "b"]);
            expect(lamb.drop([1, 2, 3, 4], -1)).toEqual([4]);
            expect(lamb.drop([1, 2, 3, 4], -4)).toEqual([1, 2, 3, 4]);
            expect(lamb.dropN(3)([1, 2, 3, 4])).toEqual([4]);
            expect(lamb.dropN(10)([1, 2, 3, 4])).toEqual([]);
            expect(lamb.dropN(2)("abcd")).toEqual(["c", "d"]);
        });
    });

    describe("dropWhile", function () {
        it("should build a function that drops the first n elements satisfying a predicate from an array or array-like object", function () {
            var fakeContext = {};
            var isEven = function (n, idx, list) {
                expect(list[idx]).toBe(n);
                expect(this).toBe(fakeContext);

                return n % 2 === 0;
            };
            var dropWhileIsEven = lamb.dropWhile(isEven, fakeContext);

            expect(dropWhileIsEven([])).toEqual([]);
            expect(dropWhileIsEven([2, 4, 6, 8])).toEqual([]);
            expect(dropWhileIsEven([2, 3, 4, 6, 8])).toEqual([3, 4, 6, 8]);
            expect(dropWhileIsEven([2, 4, 6, 7, 8])).toEqual([7, 8]);
            expect(dropWhileIsEven([1, 3, 5, 7])).toEqual([1, 3, 5, 7]);
        });
    });

    describe("filterWith", function () {
        it("should build a partial application of `filter` expecting the array-like object to act upon", function () {
            var fakeContext = {};
            var isLowerCase = function (s) {
                expect(this).toBe(fakeContext);
                return s.toLowerCase() === s;
            };

            var getLowerCaseEls = lamb.filterWith(isLowerCase, fakeContext);
            expect(getLowerCaseEls(["Foo", "bar", "baZ"])).toEqual(["bar"]);
            expect(getLowerCaseEls("fooBAR")).toEqual(["f", "o", "o"]);
        });
    });

    describe("find / findIndex", function () {
        var persons = [
            {"name": "Jane", "surname": "Doe", "age": 12},
            {"name": "John", "surname": "Doe", "age": 40},
            {"name": "Mario", "surname": "Rossi", "age": 18},
            {"name": "Paolo", "surname": "Bianchi", "age": 40}
        ];

        var fakeContext = {};
        var testString = "Hello world";

        var isVowel = function (char, idx, s) {
            expect(this).toBe(fakeContext);
            expect(s[idx]).toBe(testString[idx]);
            return "AEIOUaeiou".indexOf(char) !== -1;
        };

        describe("find", function () {
            it("should find an element in an array-like object by using the given predicate", function () {
                expect(lamb.find(persons, lamb.hasKeyValue("age", 40))).toEqual(persons[1]);
                expect(lamb.find(testString, isVowel, fakeContext)).toBe("e");
            });

            it("should return `undefined` if there is no element satisfying the predicate", function () {
                expect(lamb.find(persons, lamb.hasKeyValue("age", 41))).toBe(void 0);
            });
        });

        describe("findIndex", function () {
            it("should find the index of an element in an array-like object by using the given predicate", function () {
                expect(lamb.findIndex(persons, lamb.hasKeyValue("age", 40))).toBe(1);
                expect(lamb.findIndex(testString, isVowel, fakeContext)).toBe(1);
            });

            it("should return `-1` if there is no element satisfying the predicate", function () {
                expect(lamb.findIndex(persons, lamb.hasKeyValue("age", 41))).toBe(-1);
            });
        });
    });

    describe("flatMap / flatMapWith", function () {
        it("should behave like map if the mapping function returns a non array value", function () {
            var double = function (n) { return n * 2; };
            var arr = [1, 2, 3, 4, 5];
            var result = [2, 4, 6, 8, 10];

            expect(lamb.flatMap(arr, double)).toEqual(result);
            expect(lamb.flatMapWith(double)(arr)).toEqual(result);
        });

        it("should concatenate arrays returned by the mapping function to the result", function () {
            var splitString = function (s) {
                return s.split("");
            };
            var arr = ["foo", "bar", "baz"];
            var result = ["f", "o", "o", "b", "a", "r", "b", "a", "z"];

            expect(lamb.flatMap(arr, splitString)).toEqual(result);
            expect(lamb.flatMapWith(splitString)(arr)).toEqual(result);
        });

        it("should not flatten nested arrays", function () {
            var splitString = function (s) {
                return String(s) === s ? s.split("") : [[s, "not a string"]];
            };
            var arr = ["foo", "bar", 5, "baz"];
            var result = ["f", "o", "o", "b", "a", "r", [5, "not a string"], "b", "a", "z"];

            expect(lamb.flatMap(arr, splitString)).toEqual(result);
            expect(lamb.flatMapWith(splitString)(arr)).toEqual(result);

            var arr2 = ["foo", ["bar", ["baz"]]];
            var result = ["foo", "bar", ["baz"]];

            expect(lamb.flatMap(arr2, lamb.identity)).toEqual(result);
            expect(lamb.flatMapWith(lamb.identity)(arr2)).toEqual(result);
        });

        it("should accept a context object to be used in the mapping function", function () {
            var fooObject = {
                getAtIndexAndDouble : function (idx) {
                    var v = this.values[idx];
                    return [v, v * 2];
                },
                getValuesAndDoublesAtIndexes: function (indexes) {
                    return lamb.flatMap(indexes, this.getAtIndexAndDouble, this);
                },
                values: [1, 2, 3, 4, 5]
            };
            var indexes = [0, 1, 2];
            var result = [1, 2, 2, 4, 3, 6]

            expect(fooObject.getValuesAndDoublesAtIndexes(indexes)).toEqual(result);
            expect(lamb.flatMapWith(fooObject.getAtIndexAndDouble, fooObject)(indexes)).toEqual(result);
        });

        it("should work on array-like objects", function () {
            var toUpperCase = lamb.generic(String.prototype.toUpperCase);
            var testString = "hello world";
            var result = ["H", "E", "L", "L", "O", " ", "W", "O", "R", "L", "D"];

            expect(lamb.flatMap(testString, toUpperCase)).toEqual(result);
            expect(lamb.flatMapWith(toUpperCase)(testString)).toEqual(result);
        });

        it("should return an empty array if is supplied with a non array value", function () {
            expect(lamb.flatMap({}, lamb.identity)).toEqual([]);
            expect(lamb.flatMapWith(lamb.identity)({})).toEqual([]);
        });

        it("should throw an error if called with null of undefined in place of the array", function () {
            expect(function () {lamb.flatMap(null, lamb.identity);}).toThrow();
            expect(lamb.flatMap).toThrow();
            expect(function () {lamb.flatMapWith(lamb.identity)(null);}).toThrow();
            expect(lamb.flatMapWith(lamb.identity)).toThrow();
        });

        it("should throw an error if not supplied with a mapper function", function () {
            expect(function () {lamb.flatMap([1, 2, 3]);}).toThrow();
            expect(function () {lamb.flatMapWith()([1, 2, 3]);}).toThrow();
        });
    });

    describe("flatten", function () {
        it("should throw an exception if no arguments are supplied", function () {
            expect(lamb.flatten).toThrow();
        });

        it("should return a deep flattened array", function () {
            var input = [[1, [2, [3, ["a", ["b", ["c"]]]]]]];

            expect(lamb.flatten(input)).toEqual([1, 2, 3, "a", "b", "c"]);
        });

        it("shouldn't flatten an array that is a value in an object", function () {
            var input = [["a", ["b", [{"c" : ["d"]}]]]];

            expect(lamb.flatten(input)).toEqual(["a", "b", {"c" : ["d"]}]);
        });
    });

    describe("group / groupBy", function () {
        var persons = [
            {"name": "Jane", "surname": "Doe", "age": 12, "city": "New York"},
            {"name": "John", "surname": "Doe", "age": 40, "city": "New York"},
            {"name": "Mario", "surname": "Rossi", "age": 18, "city": "Rome"},
            {"name": "Paolo", "surname": "Bianchi", "age": 15}
        ];

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

        it("should build an object using the provided iteratee to group the list with the desired criterion", function () {
            var fakeContext = {};
            var splitByAgeGroup = function (person, idx, list) {
                expect(this).toBe(fakeContext);
                expect(list).toBe(persons);
                expect(persons[idx]).toBe(person);
                return person.age > 20 ? "over20" : "under20";
            };
            var getCity = lamb.getKey("city");

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
    });

    describe("intersection", function () {
        it("should throw an exception if no arguments are supplied", function () {
            expect(lamb.intersection).toThrow();
        });

        it("should return an array of every item present in all given arrays", function () {
            var a1 = [0, 1, 2, 3, 4, NaN];
            var a2 = [-0, 2, 2, 3, 4, 5];
            var a3 = [4, 5, 1, NaN];
            var a4 = [6, 7];

            expect(lamb.intersection(a1)).toEqual(a1);
            expect(lamb.intersection(a2)).toEqual([-0, 2, 3, 4, 5]);
            expect(Object.is(-0, lamb.intersection(a2)[0])).toBe(true);
            expect(lamb.intersection(a1, a2)).toEqual([0, 2, 3, 4]);
            expect(Object.is(0, lamb.intersection(a1, a2)[0])).toBe(true);
            expect(lamb.intersection(a1, a2, a3)).toEqual([4]);
            expect(lamb.intersection(a1, a2, a3, a4)).toEqual([]);
            expect(lamb.intersection(a1, a3)).toEqual([1, 4, NaN]);
        });
    });

    describe("insert", function () {
        var personsByCaseInsensitiveNameAsc = [
            {"name": "jane", "surname": "doe"},
            {"name": "John", "surname": "Doe"},
            {"name": "john", "surname": "doe"},
            {"name": "Mario", "surname": "Rossi"}
        ];

        var expectedResult = [
            {"name": "jane", "surname": "doe"},
            {"name": "John", "surname": "Doe"},
            {"name": "john", "surname": "doe"},
            {"name": "marco", "surname": "Rossi"},
            {"name": "Mario", "surname": "Rossi"}
        ];

        var toLowerCase = lamb.generic(String.prototype.toLowerCase);
        var compose = lamb.compose;
        var getKey = lamb.getKey;
        var getLowerCaseName = compose(toLowerCase, getKey("name"));

        it("should insert an element in a copy of a sorted array respecting the order", function () {
            var result = lamb.insert(
                personsByCaseInsensitiveNameAsc,
                {"name": "marco", "surname": "Rossi"},
                lamb.sorter.ascending,
                getLowerCaseName
            );

            expect(result).toEqual(expectedResult);
            expect(personsByCaseInsensitiveNameAsc.length).toBe(4);

            // references are not broken
            expect(personsByCaseInsensitiveNameAsc[0]).toBe(result[0]);
        });

        it("should allow inserting in descending order with the default `comparer`", function () {
            expect(lamb.insert([3, 2, 1], 1.5, lamb.sorter.descending)).toEqual([3, 2, 1.5, 1]);
            expect(lamb.insert([3, 2, 1], 2, lamb.sorter.descending)).toEqual([3, 2, 2, 1]);
        });

        it("should use the default values for the `comparer` and `reader` if those aren't supplied", function () {
            expect(lamb.insert([1, 2, 3], 2.5)).toEqual([1, 2, 2.5, 3]);
        });

        it("should be able to insert values at the beginning and at the end of the array", function () {
            var arr = [1, 2, 3];
            expect(lamb.insert(arr, 0)).toEqual([0, 1, 2, 3]);
            expect(lamb.insert(arr, 4)).toEqual([1, 2, 3, 4]);
        });

        it("should accept an empty list", function () {
            expect(lamb.insert([], 1)).toEqual([1]);
        });
    });

    describe("list", function () {
        it("should return an empty array if no arguments are supplied", function () {
            expect(lamb.list()).toEqual([]);
        });

        it("should build an array with the passed arguments", function () {
            expect(lamb.list(1, 2, 3)).toEqual([1, 2, 3]);
            expect(lamb.list(null, void 0)).toEqual([null, void 0]);
        });
    });

    describe("mapWith", function () {
        it("should accept a mapping function and return a partially applied version of map expecting the array to operate upon as argument", function () {
            var fakeContext = {};
            var double = function (n) {
                expect(this).toBe(fakeContext);
                return n * 2;
            };
            var makeDoubles = lamb.mapWith(double, fakeContext);
            var numbers = [1, 2, 3, 4, 5];

            expect(makeDoubles(numbers)).toEqual([2, 4, 6, 8, 10]);
        });
    });

    describe("partition / partitionWith", function () {
        it("should split an array-like objects in two lists; one with the elements satisfying the predicate, the other with the remaining elements", function () {
            var persons = [
                {"name": "Jane", "surname": "Doe", "active": false},
                {"name": "John", "surname": "Doe", "active": true},
                {"name": "Mario", "surname": "Rossi", "active": true},
                {"name": "Paolo", "surname": "Bianchi", "active": false}
            ];

            var fooIsActive = function (el, idx, list) {
                expect(list[idx]).toBe(el);
                expect(list).toBe(persons);

                return el.active;
            };

            var result = [
                [{"name": "John", "surname": "Doe", "active": true}, {"name": "Mario", "surname": "Rossi", "active": true}],
                [{"name": "Jane", "surname": "Doe", "active": false}, {"name": "Paolo", "surname": "Bianchi", "active": false}]
            ];

            expect(lamb.partition(persons, fooIsActive)).toEqual(result);
            expect(lamb.partitionWith(fooIsActive)(persons)).toEqual(result);
        });

        it("should accept a context object for the predicate", function () {
            var fakeContext = {};
            var isEven = function (n) {
                expect(this).toBe(fakeContext);
                return n % 2 === 0;
            };
            var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            var result = [[2, 4, 6, 8, 10], [1, 3, 5, 7, 9]];

            expect(lamb.partition(numbers, isEven, fakeContext)).toEqual(result);
            expect(lamb.partitionWith(isEven, fakeContext)(numbers)).toEqual(result);
        });

        it("should work with array-like objects", function () {
            var isVowel = function (char) { return ~"aeiou".indexOf(char); };
            var testString = "Hello world";
            var result = [["e", "o", "o"], ["H", "l", "l", " ", "w", "r", "l", "d"]];

            expect(lamb.partition(testString, isVowel)).toEqual(result);
            expect(lamb.partitionWith(isVowel)(testString)).toEqual(result);
        });
    });

    describe("pluck / pluckKey", function () {
        it("should throw an exception if no array-like object is supplied", function () {
            expect(lamb.pluck).toThrow();
            expect(lamb.pluckKey("foo")).toThrow();
        });

        it("should return a list of undefined values if no property is specified", function () {
            expect(lamb.pluck([1, 2, 3, 4])).toEqual([void 0, void 0, void 0, void 0]);
            expect(lamb.pluckKey()([1, 2, 3, 4])).toEqual([void 0, void 0, void 0, void 0]);
        });

        it("should return an array of values taken from the given property of the source array elements", function () {
            var sourceArray = [
                {"foo": 1, "bar": 2, "baz": 3},
                {"foo": 34, "bar": 22, "baz": 73},
                {"foo": 45, "bar": 21, "baz": 83},
                {"foo": 65, "bar": 92, "baz": 39}
            ];

            expect(lamb.pluck(sourceArray, "bar")).toEqual([2, 22, 21, 92]);
            expect(lamb.pluckKey("bar")(sourceArray)).toEqual([2, 22, 21, 92]);

            var lists = [
                [1, 2],
                [3, 4, 5],
                [6]
            ];

            expect(lamb.pluck(lists, "length")).toEqual([2, 3, 1]);
            expect(lamb.pluckKey("length")(lists)).toEqual([2, 3, 1]);
        });
    });

    describe("shallowFlatten", function () {
        it("should return a shallow flattened array", function () {
            var a1 = [[1, [2, [3, ["a", ["b", ["c"]]]]]]];
            var a2 = [1, 2, [3, 4, [5, 6]], 7, 8];

            expect(lamb.shallowFlatten(a1)).toEqual([1, [2, [3, ["a", ["b", ["c"]]]]]]);
            expect(lamb.shallowFlatten(a2)).toEqual([1, 2, 3, 4, [5, 6], 7, 8]);
        });

        it("shouldn't flatten an array that is a value in an object", function () {
            var input = ["a", "b", {"c" : ["d"]}];

            expect(lamb.shallowFlatten(input)).toEqual(input);
        });
    });

    describe("sorter", function () {
        var persons = [
            {"name": "John", "surname" :"Doe"},
            {"name": "john", "surname" :"doe"},
            {"name": "Mario", "surname": "Rossi"},
            {"name": "jane", "surname": "doe"}
        ];

        var personsByCaseInsensitiveNameAsc = [
            {"name": "jane", "surname": "doe"},
            {"name": "John", "surname": "Doe"},
            {"name": "john", "surname": "doe"},
            {"name": "Mario", "surname": "Rossi"}
        ];

        var mixed = ["1", "10", 1, false, "20", "15"];
        var mixedAsNumbersDesc = ["20", "15", "10", "1", 1, false];

        var toLowerCase = lamb.generic(String.prototype.toLowerCase);
        var compose = lamb.compose;
        var getKey = lamb.getKey;
        var getLowerCaseName = compose(toLowerCase, getKey("name"));

        it("should build a comparison function for array sorting", function () {
            var sorter = lamb.sorter(
                lamb.sorter.ascending,
                getLowerCaseName
            );

            expect(persons.sort(sorter)).toEqual(personsByCaseInsensitiveNameAsc);

            sorter = lamb.sorter(
                lamb.sorter.descending,
                Number
            );

            expect(mixed.sort(sorter)).toEqual(mixedAsNumbersDesc);
        });
    });

    describe("take / takeN", function () {
        it("should retrieve the first n elements of an array or array-like object", function () {
            expect(lamb.take(["a", "b"], 1)).toEqual(["a"]);
            expect(lamb.take(["a", "b"], 0)).toEqual([]);
            expect(lamb.take([1, 2, 3, 4], -1)).toEqual([1, 2, 3]);
            expect(lamb.take([1, 2, 3, 4], -5)).toEqual([]);
            expect(lamb.takeN(3)([1, 2, 3, 4])).toEqual([1, 2, 3]);
            expect(lamb.takeN(10)([1, 2, 3, 4])).toEqual([1, 2, 3, 4]);
            expect(lamb.takeN(2)("abcd")).toEqual(["a", "b"]);
        });
    });

    describe("takeWhile", function () {
        it("should build a function that takes the first n elements satisfying a predicate from an array or array-like object", function () {
            var fakeContext = {};
            var isEven = function (n, idx, list) {
                expect(list[idx]).toBe(n);
                expect(this).toBe(fakeContext);

                return n % 2 === 0;
            };
            var takeWhileIsEven = lamb.takeWhile(isEven, fakeContext);

            expect(takeWhileIsEven([])).toEqual([]);
            expect(takeWhileIsEven([1, 3, 5, 7])).toEqual([]);
            expect(takeWhileIsEven([2, 3, 4, 6, 8])).toEqual([2]);
            expect(takeWhileIsEven([2, 4, 6, 7, 8])).toEqual([2, 4, 6]);
            expect(takeWhileIsEven([2, 4, 6, 8])).toEqual([2, 4, 6, 8]);
        });
    });

    describe("union", function () {
        it("should return an empty array if no arguments are supplied", function () {
            expect(lamb.union()).toEqual([]);
        });

        it("should return a list of every unique element present in the given arrays", function () {
            expect(lamb.union([])).toEqual([]);
            expect(lamb.union([1, 2], [2, 3])).toEqual([1, 2, 3]);
            expect(lamb.union(
                [1, 2, 3],
                [4, 5, 1],
                [5],
                [6, 7, 3, 1],
                [2, 8, 3],
                [9, 0],
                [2, [2, 3]],
                [3, [2, 3]]
            )).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 0, [2, 3], [2, 3]]);
        });

        it("should work with array-like objects", function () {
            expect(lamb.union("abc", "bcd", "cde")).toEqual(["a", "b", "c", "d", "e"]);
        });
    });

    describe("uniques", function () {
        it("should throw an exception if no arguments are supplied", function () {
            expect(lamb.uniques).toThrow();
        });

        it("should return the unique elements of an array of simple values", function () {
            expect(lamb.uniques([])).toEqual([]);
            expect(lamb.uniques([0, 2, 3, 4, 0, 4, 3, -0, 2, NaN, 1, 1, NaN])).toEqual([0, 2, 3, 4, NaN, 1]);
            expect(Object.is(0, lamb.uniques([0, -0])[0])).toBe(true);
            expect(lamb.uniques(["foo", "bar", "bar", "baz"])).toEqual(["foo", "bar", "baz"]);
        });

        it("should return the unique elements of an array of complex values when supplied with an iteratee", function () {
            var iteratee = function (obj) {
                return obj.id;
            };

            var data = [
                {"id": "1", "name": "foo"},
                {"id": "1", "name": "foo"},
                {"id": "2", "name": "bar"},
                {"id": "3", "name": "baz"},
                {"id": "2", "name": "bar"},
                {"id": "1", "name": "foo"}
            ];

            var expectedResult = [
                {"id": "1", "name": "foo"},
                {"id": "2", "name": "bar"},
                {"id": "3", "name": "baz"}
            ];

            expect(lamb.uniques(data, iteratee)).toEqual(expectedResult);
        });
    });

    describe("transpose / zip", function () {
        var a1 = [1, 2, 3, 4];
        var a2 = [5, 6, 7];
        var a3 = [8, 9];

        var r1 = [[1], [2], [3], [4]];
        var r2 = [[1, 5], [2, 6], [3, 7]];
        var r3 = [[1, 5, 8], [2, 6, 9]];



        describe("transpose", function () {
            it("should throw an error if no arguments are supplied", function () {
                expect(lamb.transpose).toThrow();
            });

            it("should transpose a matrix", function () {
                expect(lamb.transpose([])).toEqual([]);
                expect(lamb.transpose([1, 2, 3])).toEqual([]);
                expect(lamb.transpose(r1)).toEqual([a1]);
                expect(lamb.transpose(r2)).toEqual([[1, 2, 3], [5, 6, 7]]);
                expect(lamb.transpose(r3)).toEqual([[1, 2], [5, 6], [8, 9]]);
            });

            it("should work with array-like objects", function () {
                var fn = function () {
                    return lamb.transpose(arguments);
                };

                expect(fn("abc", [1, 2, 3])).toEqual([["a", 1], ["b", 2], ["c", 3]]);
            });
        });

        describe("zip", function () {
            it("should pair items with the same index in the received lists", function () {
                expect(lamb.zip()).toEqual([]);
                expect(lamb.zip([])).toEqual([]);
                expect(lamb.zip(a1)).toEqual(r1);
                expect(lamb.zip(a1, a2)).toEqual(r2);
                expect(lamb.zip(a1, a2, a3)).toEqual(r3);
                expect(lamb.zip(a1, NaN)).toEqual([]);
            });

            it("should work with array-like objects", function () {
                expect(lamb.zip(a1, "abc")).toEqual([[1, "a"], [2, "b"], [3, "c"]]);
            });
        });
    });

    describe("zipWithIndex", function () {
        it("should throw an error if no arguments are supplied", function () {
            expect(lamb.zipWithIndex).toThrow();
        });

        it("should pair the received values with their index", function () {
            expect(lamb.zipWithIndex([])).toEqual([]);
            expect(lamb.zipWithIndex([1, 2, 3, 4])).toEqual([[1, 0], [2, 1], [3, 2], [4, 3]]);
        });

        it("should work with array-like objects", function () {
            expect(lamb.zipWithIndex("abcd")).toEqual([["a", 0], ["b", 1], ["c", 2], ["d", 3]]);
        });
    });
});
