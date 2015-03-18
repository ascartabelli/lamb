var lamb = require("../../dist/lamb.js");

describe("lamb.array", function () {
    describe("difference", function () {
        it("should throw an exception if no arguments are supplied", function () {
            expect(lamb.difference).toThrow();
        });

        it("should return an array of items present only in the first of the given arrays", function () {
            var a1 = [1, 2, 3, 4];
            var a2 = [2, 3, 4, 5];
            var a3 = [4, 5, 1];
            var a4 = [6, 7];

            expect(lamb.difference(a1)).toEqual(a1);
            expect(lamb.difference(a1, a2)).toEqual([1]);
            expect(lamb.difference(a1, a2, a3)).toEqual([]);
            expect(lamb.difference(a1, a3, a4)).toEqual([2, 3]);
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

    describe("flatMap", function () {
        it("should behave like map if the mapping function returns a non array value", function () {
            var double = function (n) { return n * 2; };
            var arr = [1, 2, 3, 4, 5];

            expect(lamb.flatMap(arr, double)).toEqual([2, 4, 6, 8, 10]);
        });

        it("should concatenate arrays returned by the mapping function to the result", function () {
            var splitString = function (s) {
                return s.split("");
            };
            var arr = ["foo", "bar", "baz"];

            expect(lamb.flatMap(arr, splitString)).toEqual(["f", "o", "o", "b", "a", "r", "b", "a", "z"]);
        });

        it("should not flatten nested arrays", function () {
            var splitString = function (s) {
                return String(s) === s ? s.split("") : [[s, "not a string"]];
            };
            var arr = ["foo", "bar", 5, "baz"];

            expect(lamb.flatMap(arr, splitString)).toEqual(["f", "o", "o", "b", "a", "r", [5, "not a string"], "b", "a", "z"]);

            var arr2 = ["foo", ["bar", ["baz"]]];

            expect(lamb.flatMap(arr2, lamb.identity)).toEqual(["foo", "bar", ["baz"]]);
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

            expect(fooObject.getValuesAndDoublesAtIndexes([0, 1, 2])).toEqual([1, 2, 2, 4, 3, 6]);
        });

        it("should work on array-like objects", function () {
            var toUpperCase = lamb.generic(String.prototype.toUpperCase);
            expect(lamb.flatMap("hello world", toUpperCase)).toEqual(["H", "E", "L", "L", "O", " ", "W", "O", "R", "L", "D"]);
        });

        it("should return an empty array if is supplied with a non array value", function () {
            expect(lamb.flatMap({}, lamb.identity)).toEqual([]);
            expect(lamb.flatMap(1, lamb.identity)).toEqual([]);
            expect(lamb.flatMap(NaN, lamb.identity)).toEqual([]);
        });

        it("should throw an error if called with null of undefined in place of the array", function () {
            expect(function () {lamb.flatMap(null, lamb.identity);}).toThrow();
            expect(lamb.flatMap).toThrow();
        });

        it("should throw an error if not supplied with a mapper function", function () {
            expect(function () {lamb.flatMap([1, 2, 3]);}).toThrow();
        });
    });

    describe("flatten", function () {
        it("should throw an exception if no arguments are supplied", function () {
            expect(lamb.flatten).toThrow();
        });

        it("should return a deep flattened array of arrays by default", function () {
            var input = [[1, [2, [3, ["a", ["b", ["c"]]]]]]];

            expect(lamb.flatten(input)).toEqual([1, 2, 3, "a", "b", "c"]);
        });

        it("should return a shallow flattened array of arrays when called with doShallow = true", function () {
            var input = [[1, [2, [3, ["a", ["b", ["c"]]]]]]];

            expect(lamb.flatten(input, true)).toEqual([1, [2, [3, ["a", ["b", ["c"]]]]]]);
        });

        it("shouldn't flatten an array that is a value in an object", function () {
            var input = [["a", ["b", [{"c" : ["d"]}]]]];

            expect(lamb.flatten(input)).toEqual(["a", "b", {"c" : ["d"]}]);
        });
    });

    describe("intersection", function () {
        it("should throw an exception if no arguments are supplied", function () {
            expect(lamb.intersection).toThrow();
        });

        it("should return an array of every item present in all given arrays", function () {
            var a1 = [1, 2, 3, 4];
            var a2 = [2, 3, 4, 5];
            var a3 = [4, 5, 1];
            var a4 = [6, 7];

            expect(lamb.intersection(a1)).toEqual(a1);
            expect(lamb.intersection(a1, a2)).toEqual([2, 3, 4]);
            expect(lamb.intersection(a1, a2, a3)).toEqual([4]);
            expect(lamb.intersection(a1, a2, a3, a4)).toEqual([]);
            expect(lamb.intersection(a1, a3)).toEqual([1, 4]);
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

        it("should return build an array with the passed arguments", function () {
            expect(lamb.list(1, 2, 3)).toEqual([1, 2, 3]);
            expect(lamb.list(null, void 0)).toEqual([null, void 0]);
        });
    });

    describe("mapWith", function () {
        it("should accept a mapping function and return a curried version of map expecting the array to operate upon as argument", function () {
            var makeDoubles = lamb.mapWith(function (n) { return n * 2; });
            var numbers = [1, 2, 3, 4, 5];

            expect(makeDoubles(numbers)).toEqual([2, 4, 6, 8, 10]);
        });
    });

    describe("pluck", function () {
        it("should throw an exception if no arguments are supplied", function () {
            expect(lamb.pluck).toThrow();
        });

        it("should return a list of undefined values if no property is specified", function () {
            expect(lamb.pluck([1, 2, 3, 4])).toEqual([void 0, void 0, void 0, void 0]);
        });

        it("should return an array of values taken from the given property of the source array elements", function () {
            var sourceArray = [
                {"foo" : 1, "bar" : 2, "baz" : 3},
                {"foo" : 34, "bar" : 22, "baz" : 73},
                {"foo" : 45, "bar" : 21, "baz" : 83},
                {"foo" : 65, "bar" : 92, "baz" : 39}
            ];

            expect(lamb.pluck(sourceArray, "bar")).toEqual([2, 22, 21, 92]);

            var lists = [
                [1, 2],
                [3, 4, 5],
                [6]
            ];

            expect(lamb.pluck(lists, "length")).toEqual([2, 3, 1]);
        });
    });

    describe("sorter", function () {
        var persons = [
            {"name": "John", "surname" :"Doe"},
            {"name": "john", "surname" :"doe"},
            {"name" :"Mario", "surname" :"Rossi"},
            {"name" :"jane", "surname":"doe"}
        ];

        var personsByCaseInsensitiveNameAsc = [
            {"name" :"jane", "surname":"doe"},
            {"name": "John", "surname" :"Doe"},
            {"name": "john", "surname" :"doe"},
            {"name" :"Mario", "surname" :"Rossi"}
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
        it("should throw an exception if no arguments are supplied", function () {
            expect(lamb.union).toThrow();
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
                [9, 0]
            )).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]);
        });
    });

    describe("uniques", function () {
        it("should throw an exception if no arguments are supplied", function () {
            expect(lamb.uniques).toThrow();
        });

        it("should return the unique elements of an array of simple values", function () {
            expect(lamb.uniques([])).toEqual([]);
            expect(lamb.uniques([0, 2, 3, 4, 0, 4, 3, 2, 1, 1])).toEqual([0, 2, 3, 4, 1]);
            expect(lamb.uniques(["foo", "bar", "bar", "baz"])).toEqual(["foo", "bar", "baz"]);
        });

        it("should return the unique elements of an array of complex values when supplied with an iteratee", function () {
            var iteratee = function (obj) {
                return obj.id;
            };

            var data = [
                {"id" : "1", "name" : "foo"},
                {"id" : "1", "name" : "foo"},
                {"id" : "2", "name" : "bar"},
                {"id" : "3", "name" : "baz"},
                {"id" : "2", "name" : "bar"},
                {"id" : "1", "name" : "foo"}
            ];

            var expectedResult = [
                {"id" : "1", "name" : "foo"},
                {"id" : "2", "name" : "bar"},
                {"id" : "3", "name" : "baz"}
            ];

            expect(lamb.uniques(data, iteratee)).toEqual(expectedResult);
        });
    });
});
