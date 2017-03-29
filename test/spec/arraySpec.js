var commons = require("../commons.js");

var lamb = commons.lamb;
var sparseArrayEquality = commons.equalities.sparseArrayEquality;

var nonStrings = commons.vars.nonStrings;
var nonArrayLikes = commons.vars.nonArrayLikes;
var nonFunctions = commons.vars.nonFunctions;
var wannabeEmptyArrays = commons.vars.wannabeEmptyArrays;
var zeroesAsIntegers = commons.vars.zeroesAsIntegers;

describe("lamb.array", function () {
    // to check "truthy" and "falsy" values returned by predicates
    var isVowel = function (char) { return ~"aeiouAEIOU".indexOf(char); };

    beforeEach(function() {
        jasmine.addCustomEqualityTester(sparseArrayEquality);
    });

    describe("append / appendTo", function () {
        var arr = ["a", "b", "c", "d", "e"];
        var s = "abcde";
        var r1 = ["a", "b", "c", "d", "e", "z"];
        var r2 = ["a", "b", "c", "d", "e", ["z"]];
        var r3 = ["a", "b", "c", "d", "e", void 0];

        afterEach(function () {
            expect(arr).toEqual(["a", "b", "c", "d", "e"]);
        });

        it("should append a value at the end of a copy of the given array", function () {
            expect(lamb.appendTo(arr, "z")).toEqual(r1);
            expect(lamb.append("z")(arr)).toEqual(r1);
            expect(lamb.appendTo(arr, ["z"])).toEqual(r2);
            expect(lamb.append(["z"])(arr)).toEqual(r2);
        });

        it("should accept array-like objects", function () {
            expect(lamb.appendTo(s, "z")).toEqual(r1);
            expect(lamb.append("z")(s)).toEqual(r1);
            expect(lamb.appendTo(s, ["z"])).toEqual(r2);
            expect(lamb.append(["z"])(s)).toEqual(r2);
        });

        it("should always return dense arrays", function () {
            expect(lamb.appendTo([1, , , 4], 5)).toEqual([1, void 0, void 0, 4, 5]);
            expect(lamb.append(5)([1, , , 4])).toEqual([1, void 0, void 0, 4, 5]);
        });

        it("should append an `undefined` value when the `value` parameter is missing", function () {
            expect(lamb.appendTo(arr)).toEqual(r3);
            expect(lamb.append()(arr)).toEqual(r3);
        });

        it("should throw an exception if called without the data argument", function () {
            expect(lamb.appendTo).toThrow();
            expect(lamb.append("z")).toThrow();
        });

        it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", function () {
            expect(function () { lamb.appendTo(null, "z"); }).toThrow();
            expect(function () { lamb.appendTo(void 0, "z"); }).toThrow();
            expect(function () { lamb.append("z")(null); }).toThrow();
            expect(function () { lamb.append("z")(void 0); }).toThrow();
        });

        it("should treat every other value as an empty array", function () {
            wannabeEmptyArrays.forEach(function (value) {
                expect(lamb.appendTo(value, "z")).toEqual(["z"]);
                expect(lamb.append("z")(value)).toEqual(["z"]);
            });
        });
    });

    describe("difference", function () {
        var a1 = [0, 1, 2, 3, 4, NaN];
        var a2 = [-0, 2, 3, 4, 5, NaN];
        var a3 = [4, 5, 1, 4, 5];
        var a4 = [6, 7];

        it("should return a new array with the items present only in the first of the two arrays", function () {
            var r = lamb.difference(a1, a4);

            expect(r).toEqual(a1);
            expect(r).not.toBe(a1);
            expect(lamb.difference(a1, a3)).toEqual([0, 2, 3, NaN]);
        });

        it("should use the \"SameValueZero\" comparison and keep the first encountered value in case of equality", function () {
            expect(lamb.difference(a1, a2)).toEqual([1]);
            expect(lamb.difference([-0, 1, 0, 2], [1, 3, 2])).toEqual([-0]);
        });

        it("should return an array without duplicates", function () {
            expect(lamb.difference(a3, a4)).toEqual([4, 5, 1]);
            expect(lamb.difference(a3, a1)).toEqual([5]);
        });

        it("should work with array-like objects", function () {
            expect(lamb.difference("abc", "bd")).toEqual(["a", "c"]);
            expect(lamb.difference(["a", "b", "c"], "bd")).toEqual(["a", "c"]);
            expect(lamb.difference("abc", ["b", "d"])).toEqual(["a", "c"]);
        });

        it("should throw an exception if called without arguments", function () {
            expect(lamb.difference).toThrow();
        });

        it("should throw an exception when a parameter is `null` or `undefined`", function () {
            expect(function () { lamb.difference(null, a4); }).toThrow();
            expect(function () { lamb.difference(void 0, a4); }).toThrow();
            expect(function () { lamb.difference(a4, null); }).toThrow();
            expect(function () { lamb.difference(a4, void 0); }).toThrow();
            expect(function () { lamb.difference(a4); }).toThrow();
        });

        it("should treat every other value in the main parameter as an empty array", function () {
            wannabeEmptyArrays.forEach(function (value) {
                expect(lamb.difference(value, a4)).toEqual([]);
            });
        });

        it("should treat every non-array-like value in the `other` parameter as an empty array", function () {
            wannabeEmptyArrays.forEach(function (value) {
                expect(lamb.difference(a1, value)).toEqual(a1);
                expect(lamb.difference(wannabeEmptyArrays, value)).toEqual(lamb.uniques(wannabeEmptyArrays));
            });
        });
    });

    describe("drop / dropFrom", function () {
        it("should drop the first `n` elements of an array or array-like object", function () {
            expect(lamb.dropFrom(["a", "b"], 1)).toEqual(["b"]);
            expect(lamb.drop(3)([1, 2, 3, 4])).toEqual([4]);
        });

        it("should work with array-like objects", function () {
            expect(lamb.dropFrom("abcd", 2)).toEqual(["c", "d"]);
            expect(lamb.drop(2)("abcd")).toEqual(["c", "d"]);
        });

        it("should accept a negative `n`", function () {
            expect(lamb.dropFrom([1, 2, 3, 4], -1)).toEqual([4]);
            expect(lamb.drop(-3)("abcd")).toEqual(["b", "c", "d"]);
        });

        it("should return a copy of the source array when `n` is 0 or less or equal than the additive inverse of the array-like length", function () {
            expect(lamb.dropFrom(["a", "b"], 0)).toEqual(["a", "b"]);
            expect(lamb.dropFrom([1, 2, 3, 4], -4)).toEqual([1, 2, 3, 4]);
            expect(lamb.drop(-10)([1, 2, 3, 4])).toEqual([1, 2, 3, 4]);
        });

        it("should return an empty array when `n` is greater than or equal to the array-like length", function () {
            expect(lamb.dropFrom([1, 2, 3, 4], 4)).toEqual([]);
            expect(lamb.dropFrom([1, 2, 3, 4], 5)).toEqual([]);
            expect(lamb.drop(10)([1, 2, 3, 4])).toEqual([]);
        });

        it("should convert to integer the value received as `n`", function () {
            var arr = [1, 2, 3, 4 , 5];

            zeroesAsIntegers.forEach(function (value) {
                expect(lamb.drop(value)(arr)).toEqual(arr);
                expect(lamb.dropFrom(arr, value)).toEqual(arr);
            });

            [[1], 1.5, true, "1"].forEach(function (value) {
                expect(lamb.drop(value)(arr)).toEqual([2, 3, 4 , 5]);
                expect(lamb.dropFrom(arr, value)).toEqual([2, 3, 4 , 5]);
            });

            expect(lamb.drop(new Date())(arr)).toEqual([]);
            expect(lamb.dropFrom(arr, new Date())).toEqual([]);

            expect(lamb.drop()(arr)).toEqual(arr);
            expect(lamb.dropFrom(arr)).toEqual(arr);
        });

        it("should always return dense arrays", function () {
            expect(lamb.dropFrom([1, , 3], 1)).toEqual([void 0, 3]);
            expect(lamb.drop(1)([1, , 3])).toEqual([void 0, 3]);
        });

        it("should throw an exception if called without the data argument or without arguments at all", function () {
            expect(lamb.dropFrom).toThrow();
            expect(lamb.drop(1)).toThrow();
            expect(lamb.drop()).toThrow();
        });

        it("should throw an exception if supplied with `null` or `undefined`", function () {
            expect(function () { lamb.dropFrom(null, 0); }).toThrow();
            expect(function () { lamb.dropFrom(void 0, 0); }).toThrow();
            expect(function () { lamb.drop(0)(null); }).toThrow();
            expect(function () { lamb.drop(0)(void 0); }).toThrow();
        });

        it("should treat every other value as an empty array", function () {
            wannabeEmptyArrays.forEach(function (value) {
                expect(lamb.dropFrom(value, 0)).toEqual([]);
                expect(lamb.drop(0)(value)).toEqual([]);
            });
        });
    });

    describe("dropWhile", function () {
        var isEven = function (n, idx, list) {
            expect(list[idx]).toBe(n);

            return n % 2 === 0;
        };
        var dropWhileIsEven = lamb.dropWhile(isEven);

        it("should build a function that drops the first n elements satisfying a predicate from an array or array-like object", function () {
            expect(dropWhileIsEven([])).toEqual([]);
            expect(dropWhileIsEven([2, 4, 6, 8])).toEqual([]);
            expect(dropWhileIsEven([2, 3, 4, 6, 8])).toEqual([3, 4, 6, 8]);
            expect(dropWhileIsEven([2, 4, 6, 7, 8])).toEqual([7, 8]);
            expect(dropWhileIsEven([1, 3, 5, 7])).toEqual([1, 3, 5, 7]);
        });

        it("should treat \"truthy\" and \"falsy\" values returned by predicates as booleans", function () {
            var dropWhileisVowel = lamb.dropWhile(isVowel);

            expect(dropWhileisVowel("aiuola")).toEqual(["l", "a"]);
        });

        it("should build a function throwing an exception if the predicate isn't a function", function () {
            nonFunctions.forEach(function (value) {
                expect(function () { lamb.dropWhile(value)([1, 2]); }).toThrow();
            });

            expect(function () { lamb.dropWhile()([1, 2]); }).toThrow();
        });

        it("should always return dense arrays", function () {
            var dropWhileIsUndefined = lamb.dropWhile(lamb.isUndefined);

            expect(dropWhileIsEven([2, 4, , , 5])).toEqual([void 0, void 0, 5]);
            expect(dropWhileIsUndefined([, , void 0, , void 0, 5, 6])).toEqual([5, 6]);
        });

        it("should throw an exception if called without the data argument", function () {
            expect(dropWhileIsEven).toThrow();
        });

        it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", function () {
            expect(function () { dropWhileIsEven(null); }).toThrow();
            expect(function () { dropWhileIsEven(void 0); }).toThrow();
        });

        it("should treat every other value as an empty array", function () {
            wannabeEmptyArrays.forEach(function (value) {
                expect(dropWhileIsEven(value)).toEqual([]);
            });
        });
    });

    describe("flatMap / flatMapWith", function () {
        it("should behave like map if the mapping function returns a non-array value", function () {
            var double = function (n, idx, list) {
                expect(list).toBe(arr);
                expect(list[idx]).toBe(n);
                return n * 2;
            };
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

        it("should keeps its behaviour consistent even if the received function returns mixed results", function () {
            var fn = function (n, idx, list) {
                expect(list).toBe(arr);
                expect(list[idx]).toBe(n);
                return n % 2 === 0 ? [n, n + 10] : n * 2;
            };
            var arr = [1, 2, 3, 4, 5];
            var result = [2, 2, 12, 6, 4, 14, 10];

            expect(lamb.flatMap(arr, fn)).toEqual(result);
            expect(lamb.flatMapWith(fn)(arr)).toEqual(result);
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

        it("should work on array-like objects", function () {
            var toUpperCase = lamb.generic(String.prototype.toUpperCase);
            var testString = "hello world";
            var result = ["H", "E", "L", "L", "O", " ", "W", "O", "R", "L", "D"];

            expect(lamb.flatMap(testString, toUpperCase)).toEqual(result);
            expect(lamb.flatMapWith(toUpperCase)(testString)).toEqual(result);
        });

        it("should always return dense arrays", function () {
            var fn = function (v) { return [, v,,]; };
            var arr = [1, , 3];
            var result = [void 0, 1, void 0, void 0, void 0, void 0, void 0, 3, void 0];

            expect(lamb.flatMap(arr, fn)).toEqual(result);
            expect(lamb.flatMapWith(fn)(arr)).toEqual(result);
        });

        it("should throw an exception if not supplied with a mapper function", function () {
            expect(function () {lamb.flatMap([1, 2, 3]);}).toThrow();
            expect(function () {lamb.flatMapWith()([1, 2, 3]);}).toThrow();
        });

        it("should throw an exception if called without the data argument", function () {
            expect(lamb.flatMap).toThrow();
            expect(lamb.flatMapWith(lamb.identity)).toThrow();
        });

        it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", function () {
            expect(function () { lamb.flatMap(null, lamb.identity); }).toThrow();
            expect(function () { lamb.flatMap(void 0, lamb.identity); }).toThrow();
            expect(function () { lamb.flatMapWith(lamb.identity)(null); }).toThrow();
            expect(function () { lamb.flatMapWith(lamb.identity)(void 0); }).toThrow();
        });

        it("should return an empty array for every other value", function () {
            wannabeEmptyArrays.forEach(function (value) {
                expect(lamb.flatMap(value, lamb.identity)).toEqual([]);
                expect(lamb.flatMapWith(lamb.identity)(value)).toEqual([]);
            });
        });
    });

    describe("flatten", function () {
        it("should return a deep flattened array", function () {
            var a1 = [[1, [2, [3, 4, ["a", ["b", ["c"]]]]]]];
            var a2 = [1, 2, [3, 4, [5, 6]], 7, 8];

            expect(lamb.flatten(a1)).toEqual([1, 2, 3, 4, "a", "b", "c"]);
            expect(lamb.flatten(a2)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
        });

        it("shouldn't flatten an array that is a value in an object", function () {
            var input = [["a", ["b", [{"c" : ["d"]}]]]];
            expect(lamb.flatten(input)).toEqual(["a", "b", {"c" : ["d"]}]);
        });

        it("should return an array copy of the source object if supplied with an array-like", function () {
            expect(lamb.flatten("foo")).toEqual(["f", "o", "o"]);
        });

        it("should always return dense arrays", function () {
            var arr = [1, [2, , 4], , [6, , [8, , 10]]];
            var result = [1, 2, void 0, 4, void 0, 6, void 0, 8, void 0, 10];

            expect(lamb.flatten(arr)).toEqual(result);
        });

        it("should throw an exception if called without arguments", function () {
            expect(lamb.flatten).toThrow();
        });

        it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", function () {
            expect(function () { lamb.flatten(null); }).toThrow();
            expect(function () { lamb.flatten(void 0); }).toThrow();
        });

        it("should treat every other value as an empty array", function () {
            wannabeEmptyArrays.forEach(function (value) {
                expect(lamb.flatten(value)).toEqual([]);
            });
        });
    });

    describe("init", function () {
        it("should return a copy of the given array-like object without the last element", function () {
            var arr = [1, 2, 3, 4, 5];

            expect(lamb.init(arr)).toEqual([1, 2, 3, 4]);
            expect(arr.length).toBe(5);
            expect(lamb.init("hello")).toEqual(["h", "e", "l", "l"]);
        });

        it("should return an empty array when called with an empty array or an array holding only one element", function () {
            expect(lamb.init([1])).toEqual([]);
            expect(lamb.init([])).toEqual([]);
        });

        it("should always return dense arrays", function () {
            expect(lamb.init([1, , 3, , 4])).toEqual([1, void 0, 3, void 0]);
            expect(lamb.init(Array(2))).toEqual([void 0]);
        });

        it("should throw an exception if called without arguments", function () {
            expect(lamb.init).toThrow();
        });

        it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", function () {
            expect(function () { lamb.init(null); }).toThrow();
            expect(function () { lamb.init(void 0); }).toThrow();
        });

        it("should return an empty array for every other value", function () {
            wannabeEmptyArrays.forEach(function (value) {
                expect(lamb.init(value)).toEqual([]);
            });
        });
    });

    describe("insert / insertAt", function () {
        var arr = [1, 2, 3, 4, 5];
        var result1 = [1, 2, 3, 99, 4, 5];
        var result2 = [99, 1, 2, 3, 4, 5];
        var result3 = [1, 2, 3, 4, 5, 99];

        afterEach(function () {
            expect(arr).toEqual([1, 2, 3, 4, 5]);
        });

        it("should allow to insert an element in a copy of an array at the specified index", function () {
            var r1 = lamb.insert(arr, 3, 99);
            var r2 = lamb.insertAt(3, 99)(arr);

            expect(r1).toEqual(result1);
            expect(r2).toEqual(result1);
            expect(r1).not.toBe(arr);
            expect(r2).not.toBe(arr);
        });

        it("should insert the element at the end of the array if the provided index is greater than its length", function () {
            expect(lamb.insert(arr, 99, 99)).toEqual(result3);
            expect(lamb.insertAt(99, 99)(arr)).toEqual(result3);
        });

        it("should allow the use of negative indexes", function () {
            expect(lamb.insert(arr, -2, 99)).toEqual(result1);
            expect(lamb.insertAt(-2, 99)(arr)).toEqual(result1);
        });

        it("should insert the element at the start of the array if provided with a negative index which is out of bounds", function () {
            expect(lamb.insert(arr, -99, 99)).toEqual(result2);
            expect(lamb.insertAt(-99, 99)(arr)).toEqual(result2);
        });

        it("should convert the index to integer following ECMA specifications", function () {
            // see https://www.ecma-international.org/ecma-262/7.0/#sec-tointeger

            zeroesAsIntegers.forEach(function (value) {
                expect(lamb.insert(arr, value, 99)).toEqual(result2);
                expect(lamb.insertAt(value, 99)(arr)).toEqual(result2);
            });

            [[3], -2, 3.6, 3.2, -2.8, -2.2, "-2", "3"].forEach(function (value) {
                expect(lamb.insert(arr, value, 99)).toEqual(result1);
                expect(lamb.insertAt(value, 99)(arr)).toEqual(result1);
            });

            expect(lamb.insert(arr, new Date(), 99)).toEqual(result3);
            expect(lamb.insertAt(new Date(), 99)(arr)).toEqual(result3);
        });

        it("should work with array-like objects", function () {
            var s = "12345";
            expect(lamb.insert(s, -2, "99")).toEqual(result1.map(String));
            expect(lamb.insertAt(3, "99")(s)).toEqual(result1.map(String));
        });

        it("should always return dense arrays", function () {
            expect(lamb.insert([1, , 3, 5], 3, 4)).toEqual([1, void 0, 3, 4, 5]);
            expect(lamb.insertAt(3, 4)([1, , 3, 5])).toEqual([1, void 0, 3, 4, 5]);
        });

        it("should throw an exception if called without the data argument", function () {
            expect(lamb.insert).toThrow();
            expect(lamb.insertAt(3, "99")).toThrow();
        });

        it("should throw an exception if a `nil` value is passed in place of an array-like object", function () {
            expect(function () { lamb.insert(null, 3, 99); }).toThrow();
            expect(function () { lamb.insert(void 0, 3, 99); }).toThrow();
            expect(function () { lamb.insertAt(3, 99)(null); }).toThrow();
            expect(function () { lamb.insertAt(3, 99)(void 0); }).toThrow();
        });

        it("should consider every other value as an empty array", function () {
            wannabeEmptyArrays.forEach(function (value) {
                expect(lamb.insert(value, 3, 99)).toEqual([99]);
                expect(lamb.insertAt(3, 99)(value)).toEqual([99]);
            });
        });
    });

    describe("intersection", function () {
        var a1 = [0, 1, 2, 3, 4, NaN];
        var a2 = [-0, 2, 2, 3, 4, 5];
        var a3 = [4, 5, 1, NaN];
        var a4 = [6, 7];

        it("should return an array of every item present in all given arrays", function () {
            expect(lamb.intersection(a1)).toEqual(a1);
            expect(lamb.intersection(a2)).toEqual([-0, 2, 3, 4, 5]);
            expect(lamb.intersection(a1, a2, a3)).toEqual([4]);
            expect(lamb.intersection(a1, a2, a3, a4)).toEqual([]);
        });

        it("should use the SameValueZero comparison and put in the result the first value found when comparing `0` with `-0`", function () {
            expect(lamb.intersection(a1, a3)).toEqual([1, 4, NaN]);
            expect(lamb.intersection(a2, a1)).toEqual([-0, 2, 3, 4]);
            expect(Object.is(-0, lamb.intersection(a2)[0])).toBe(true);
            expect(lamb.intersection(a1, a2)).toEqual([0, 2, 3, 4]);
            expect(Object.is(0, lamb.intersection(a1, a2)[0])).toBe(true);
        });

        it("should accept array-like objects", function () {
            expect(lamb.intersection("123", "23", "432", "321")).toEqual(["2", "3"]);
            expect(lamb.intersection(["1", "2"], "23", "42")).toEqual(["2"]);
        });

        it("should always return dense arrays", function () {
            expect(lamb.intersection(Array(2), Array(3))).toEqual([void 0]);
            expect(lamb.intersection([1, , 3], [void 0, 3], [3, , 4])).toEqual([void 0, 3]);
        });

        it("should return an empty array if called without arguments", function () {
            expect(lamb.intersection()).toEqual([]);
        });

        it("should throw an exception if any of the array-like is `null` or `undefined`", function () {
            expect(function () { lamb.intersection(null, [1, 2]); }).toThrow();
            expect(function () { lamb.intersection([1, 2], void 0); }).toThrow();
        });

        it("should treat other values as empty arrays", function () {
            wannabeEmptyArrays.forEach(function (value) {
                expect(lamb.intersection([2, 3], value)).toEqual([]);
            });
        });
    });

    describe("partition / partitionWith", function () {
        it("should split an array in two lists; one with the elements satisfying the predicate, the other with the remaining elements", function () {
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

        it("should return two lists even when the predicate is always satisfied or never satisfied", function () {
            var isGreaterThanTen = lamb.isGT(10);
            var arr1 = [1, 2, 3, 4, 5];
            var arr2 = [11, 12, 13, 14, 15];
            var arr3 = [];
            var res1 = [[], arr1.concat()];
            var res2 = [arr2.concat(), []];
            var res3 = [[], []];

            expect(lamb.partition(arr1, isGreaterThanTen)).toEqual(res1);
            expect(lamb.partitionWith(isGreaterThanTen)(arr1)).toEqual(res1);
            expect(lamb.partition(arr2, isGreaterThanTen)).toEqual(res2);
            expect(lamb.partitionWith(isGreaterThanTen)(arr2)).toEqual(res2);
            expect(lamb.partition(arr3, isGreaterThanTen)).toEqual(res3);
            expect(lamb.partitionWith(isGreaterThanTen)(arr3)).toEqual(res3);
        });

        it("should work with array-like objects and treat \"truthy\" and \"falsy\" values returned by predicates as booleans", function () {
            var testString = "Hello world";
            var result = [["e", "o", "o"], ["H", "l", "l", " ", "w", "r", "l", "d"]];

            expect(lamb.partition(testString, isVowel)).toEqual(result);
            expect(lamb.partitionWith(isVowel)(testString)).toEqual(result);
        });

        it("should always return dense arrays", function () {
            expect(lamb.partition([1, , 3, , 5], lamb.isUndefined)).toEqual([[void 0, void 0], [1, 3, 5]]);
            expect(lamb.partitionWith(lamb.isUndefined)([1, , 3, , 5])).toEqual([[void 0, void 0], [1, 3, 5]]);
        });

        it("should throw an exception if called without the data argument", function () {
            expect(lamb.partition).toThrow();
            expect(lamb.partitionWith(lamb.identity)).toThrow();
        });

        it("should throw an exception when the predicate isn't a function or is missing", function () {
            nonFunctions.forEach(function (value) {
                expect(function () { lamb.partition([1, 2], value); }).toThrow();
                expect(function () { lamb.partitionWith(value)([1, 2]); }).toThrow();
            });

            expect(function () { lamb.partition([1, 2]); }).toThrow();
            expect(function () { lamb.partitionWith()([1, 2]); }).toThrow();
        });

        it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", function () {
            expect(function () { lamb.partition(null); }).toThrow();
            expect(function () { lamb.partition(void 0); }).toThrow();
            expect(function () { lamb.partitionWith(lamb.identity)(null); }).toThrow();
            expect(function () { lamb.partitionWith(lamb.identity)(void 0); }).toThrow();
        });


        it("should treat every other value as an empty array", function () {
            wannabeEmptyArrays.forEach(function (value) {
                expect(lamb.partition(value, lamb.isType("Number"))).toEqual([[], []]);
                expect(lamb.partitionWith(lamb.isType("Number"))(value)).toEqual([[], []]);
            });
        });
    });

    describe("pluck / pluckKey", function () {
        var arr = [
            {bar: 1, baz: 2, qux: 3},
            {bar: 34, baz: 22, qux: 73},
            {bar: 45, baz: 21, qux: 83},
            {bar: 65, baz: 92, qux: 39}
        ];

        var lists = [[1, 2], [3, 4, 5], [6]];
        var s = "hello";

        it("should return an array of values taken from the given property of the source array elements", function () {
            expect(lamb.pluck(arr, "baz")).toEqual([2, 22, 21, 92]);
            expect(lamb.pluckKey("baz")(arr)).toEqual([2, 22, 21, 92]);
            expect(lamb.pluck(lists, "length")).toEqual([2, 3, 1]);
            expect(lamb.pluckKey("length")(lists)).toEqual([2, 3, 1]);
        });

        it("should work with array-like objects", function () {
            expect(lamb.pluck(s, "length")).toEqual([1, 1, 1, 1, 1]);
            expect(lamb.pluckKey("length")(s)).toEqual([1, 1, 1, 1, 1]);
        });

        it("should return a list of undefined values if no property is specified or if the property doesn't exist", function () {
            var r = [void 0, void 0, void 0, void 0];

            nonStrings.forEach(function (value) {
                expect(lamb.pluck(arr, value)).toEqual(r);
                expect(lamb.pluckKey(value)(arr)).toEqual(r);
            });

            expect(lamb.pluck(arr, "foo")).toEqual(r);
            expect(lamb.pluckKey("foo")(arr)).toEqual(r);

            expect(lamb.pluck(arr)).toEqual(r);
            expect(lamb.pluckKey()(arr)).toEqual(r);
        });

        it("should not skip deleted or unassigned indexes in the array-like and throw an exception", function () {
            var a = [, {bar: 2}];

            expect(function () { lamb.pluck(a, "bar"); }).toThrow();
            expect(function () { lamb.pluckKey("bar")(a); }).toThrow();
        });

        it("should throw an exception if called without the data argument", function () {
            expect(lamb.pluck).toThrow();
            expect(lamb.pluckKey("bar")).toThrow();
        });

        it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", function () {
            expect(function () { lamb.pluck(null, "bar"); }).toThrow();
            expect(function () { lamb.pluck(void 0, "bar"); }).toThrow();
            expect(function () { lamb.pluckKey("bar")(null); }).toThrow();
            expect(function () { lamb.pluckKey("bar")(void 0); }).toThrow();
        });

        it("should treat every other value as an empty array", function () {
            wannabeEmptyArrays.forEach(function (value) {
                expect(lamb.pluck(value, "bar")).toEqual([]);
                expect(lamb.pluckKey("bar")(value)).toEqual([]);
            });
        });
    });

    describe("pull / pullFrom", function () {
        it("should create a copy of the given array without the specified values", function () {
            var arr = ["foo", "bar", "baz"];

            expect(lamb.pullFrom(arr, ["foo", "baz"])).toEqual(["bar"]);
            expect(lamb.pull(["foo", "baz"])(arr)).toEqual(["bar"]);

            var r1 = lamb.pullFrom(arr, []);
            var r2 = lamb.pull([])(arr);

            expect(r1).toEqual(arr);
            expect(r1).not.toBe(arr);
            expect(r2).toEqual(arr);
            expect(r2).not.toBe(arr);
            expect(arr).toEqual(["foo", "bar", "baz"]);
        });

        it("should use the \"SameValueZero\" comparison to perform the equality test", function () {
            var obj = {a: 1};
            var arr = [1, 2];
            var mixed = ["bar", obj, arr, "5", 0, NaN, "foo", 5];
            var result = ["bar", "foo", 5];
            var values = [obj, arr, NaN, -0, "5"];

            expect(lamb.pullFrom(mixed, values)).toEqual(result);
            expect(lamb.pull(values)(mixed)).toEqual(result);
        });

        it("should accept array-like objects as the list we want to remove values from", function () {
            expect(lamb.pullFrom("hello", ["h", "l"])).toEqual(["e", "o"]);
            expect(lamb.pull(["h", "l"])("hello")).toEqual(["e", "o"]);
        });

        it("should accept array-like objects as the list of values we want to remove", function () {
            var arr = ["f", "b", "o", "o", "a", "r"];
            var result = ["f", "o", "o"];

            expect(lamb.pullFrom(arr, "bar")).toEqual(result);
            expect(lamb.pull("bar")(arr)).toEqual(result);
        });

        it("should consider non-array-likes received as the list of values as an empty array", function () {
            var arr = [1, 2, 3];

            nonArrayLikes.forEach(function (value) {
                var r1 = lamb.pullFrom(arr, value);
                var r2 = lamb.pull(value)(arr);

                expect(r1).toEqual(arr);
                expect(r1).not.toBe(arr);
                expect(r2).toEqual(arr);
                expect(r2).not.toBe(arr);
            });
        });

        it("should be able to remove non assigned indexes from sparse arrays", function () {
            expect(lamb.pullFrom([1, , 3, , 5], [void 0])).toEqual([1, 3, 5]);
            expect(lamb.pull([void 0])([1, , 3, , 5])).toEqual([1, 3, 5]);
        });

        it("should always return dense arrays", function () {
            expect(lamb.pullFrom([1, , 3, , 5], [3])).toEqual([1, void 0, void 0, 5]);
            expect(lamb.pull([3])([1, , 3, , 5])).toEqual([1, void 0, void 0, 5]);
        });

        it("should accept sparse arrays as the list of values to remove", function () {
            expect(lamb.pullFrom([1, , 3, , 5], [1, , 1])).toEqual([3, 5]);
            expect(lamb.pullFrom([1, void 0, 3, void 0, 5], [1, , 1])).toEqual([3, 5]);
            expect(lamb.pull([1, , 1])([1, , 3, , 5])).toEqual([3, 5]);
            expect(lamb.pull([1, void 0, 1])([1, , 3, , 5])).toEqual([3, 5]);
        });

        it("should throw an exception if called without arguments", function () {
            expect(lamb.pullFrom).toThrow();
            expect(lamb.pull()).toThrow();
        });

        it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", function () {
            expect(function () { lamb.pullFrom(null, ["foo"]); }).toThrow();
            expect(function () { lamb.pullFrom(void 0, ["foo"]); }).toThrow();
            expect(function () { lamb.pull(["foo"])(null); }).toThrow();
            expect(function () { lamb.pull(["foo"])(void 0); }).toThrow();
        });

        it("should treat every other value as an empty array", function () {
            wannabeEmptyArrays.forEach(function (value) {
                expect(lamb.pullFrom(value, ["lastIndex", "getDay", "valueOf"])).toEqual([]);
                expect(lamb.pull(["lastIndex", "getDay", "valueOf"])(value)).toEqual([]);
            });
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

        it("should return an array copy of the source object if supplied with an array-like", function () {
            expect(lamb.shallowFlatten("foo")).toEqual(["f", "o", "o"]);
        });

        it("should always return dense arrays", function () {
            var arr = [1, [2, , 4], , [6, , [8, , 10]]];
            var result = [1, 2, void 0, 4, void 0, 6, void 0, [8, , 10]];

            expect(lamb.shallowFlatten(arr)).toEqual(result);
        });

        it("should throw an exception if called without arguments", function () {
            expect(lamb.shallowFlatten).toThrow();
        });

        it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", function () {
            expect(function () { lamb.shallowFlatten(null); }).toThrow();
            expect(function () { lamb.shallowFlatten(void 0); }).toThrow();
        });

        it("should treat every other value as an empty array", function () {
            wannabeEmptyArrays.forEach(function (value) {
                expect(lamb.shallowFlatten(value)).toEqual([]);
            });
        });
    });

    describe("tail", function () {
        it("should return a copy of the given array-like object without the first element", function () {
            var arr = [1, 2, 3, 4, 5];

            expect(lamb.tail(arr)).toEqual([2, 3, 4, 5]);
            expect(arr.length).toBe(5);
            expect(lamb.tail("shell")).toEqual(["h", "e", "l", "l"]);
        });

        it("should return an empty array when called with an empty array or an array holding only one element", function () {
            expect(lamb.tail([1])).toEqual([]);
            expect(lamb.tail([])).toEqual([]);
        });

        it("should always return dense arrays", function () {
            expect(lamb.tail([1, , 3, ,])).toEqual([void 0, 3, void 0]);
            expect(lamb.tail(Array(2))).toEqual([void 0]);
            expect(lamb.tail(Array(1))).toEqual([]);
        });

        it("should throw an exception if called without arguments", function () {
            expect(lamb.tail).toThrow();
        });

        it("should throw an exception if supplied with `null` or `undefined`", function () {
            expect(function () { lamb.tail(null); }).toThrow();
            expect(function () { lamb.tail(void 0); }).toThrow();
        });

        it("should treat every other value as an empty array", function () {
            wannabeEmptyArrays.forEach(function (value) {
                expect(lamb.tail(value)).toEqual([]);
            });
        });
    });

    describe("take / takeFrom", function () {
        it("should retrieve the first `n` elements of an array or array-like object", function () {
            expect(lamb.takeFrom(["a", "b"], 1)).toEqual(["a"]);
            expect(lamb.take(3)([1, 2, 3, 4])).toEqual([1, 2, 3]);
        });

        it("should work with array-like objects", function () {
            expect(lamb.takeFrom("abcd", 2)).toEqual(["a", "b"]);
            expect(lamb.take(2)("abcd")).toEqual(["a", "b"]);
        });

        it("should accept a negative `n`", function () {
            expect(lamb.takeFrom([1, 2, 3, 4], -1)).toEqual([1, 2, 3]);
            expect(lamb.take(-3)("abcd")).toEqual(["a"]);
        });

        it("should return a copy of the source array when `n` is greater than or equal to the array-like length", function () {
            expect(lamb.takeFrom(["a", "b"], 3)).toEqual(["a", "b"]);
            expect(lamb.takeFrom([1, 2, 3, 4], 4)).toEqual([1, 2, 3, 4]);
            expect(lamb.take(10)([1, 2, 3, 4])).toEqual([1, 2, 3, 4]);
        });

        it("should return an empty array when `n` is 0 or less or equal than the additive inverse of the array-like length", function () {
            expect(lamb.takeFrom([1, 2, 3, 4], 0)).toEqual([]);
            expect(lamb.take(-4)([1, 2, 3, 4])).toEqual([]);
            expect(lamb.take(-10)([1, 2, 3, 4])).toEqual([]);
        });

        it("should convert to integer the value received as `n`", function () {
            var arr = [1, 2, 3, 4 , 5];

            zeroesAsIntegers.forEach(function (value) {
                expect(lamb.take(value)(arr)).toEqual([]);
                expect(lamb.takeFrom(arr, value)).toEqual([]);
            });

            [[1], 1.5, true, "1"].forEach(function (value) {
                expect(lamb.take(value)(arr)).toEqual([1]);
                expect(lamb.takeFrom(arr, value)).toEqual([1]);
            });

            expect(lamb.take(new Date())(arr)).toEqual(arr);
            expect(lamb.takeFrom(arr, new Date())).toEqual(arr);

            expect(lamb.take()(arr)).toEqual([]);
            expect(lamb.takeFrom(arr)).toEqual([]);
        });

        it("should always return dense arrays", function () {
            expect(lamb.takeFrom([1, , 3], 2)).toEqual([1, void 0]);
            expect(lamb.take(2)([1, , 3])).toEqual([1, void 0]);
        });

        it("should throw an exception if called without the data argument or without arguments at all", function () {
            expect(lamb.takeFrom).toThrow();
            expect(lamb.take(1)).toThrow();
            expect(lamb.take()).toThrow();
        });

        it("should throw an exception if supplied with `null` or `undefined`", function () {
            expect(function () { lamb.takeFrom(null, 0); }).toThrow();
            expect(function () { lamb.takeFrom(void 0, 0); }).toThrow();
            expect(function () { lamb.take(0)(null); }).toThrow();
            expect(function () { lamb.take(0)(void 0); }).toThrow();
        });

        it("should treat every other value as an empty array", function () {
            wannabeEmptyArrays.forEach(function (value) {
                expect(lamb.takeFrom(value, 0)).toEqual([]);
                expect(lamb.take(0)(value)).toEqual([]);
            });
        });
    });

    describe("takeWhile", function () {
        var isEven = function (n, idx, list) {
            expect(list[idx]).toBe(n);

            return n % 2 === 0;
        };
        var takeWhileIsEven = lamb.takeWhile(isEven);

        it("should build a function that takes the first n elements satisfying a predicate from an array or array-like object", function () {
            expect(takeWhileIsEven([])).toEqual([]);
            expect(takeWhileIsEven([1, 3, 5, 7])).toEqual([]);
            expect(takeWhileIsEven([2, 3, 4, 6, 8])).toEqual([2]);
            expect(takeWhileIsEven([2, 4, 6, 7, 8])).toEqual([2, 4, 6]);
            expect(takeWhileIsEven([2, 4, 6, 8])).toEqual([2, 4, 6, 8]);
        });

        it("should treat \"truthy\" and \"falsy\" values returned by predicates as booleans", function () {
            var takeWhileisVowel = lamb.takeWhile(isVowel);

            expect(takeWhileisVowel("aiuola")).toEqual(["a", "i", "u", "o"]);
        });

        it("should build a function throwing an exception if the predicate isn't a function", function () {
            nonFunctions.forEach(function (value) {
                expect(function () { lamb.takeWhile(value)([1, 2]); }).toThrow();
            });

            expect(function () { lamb.takeWhile()([1, 2]); }).toThrow();
        });

        it("should always return dense arrays", function () {
            var takeWhileIsUndefined = lamb.takeWhile(lamb.isUndefined);

            expect(takeWhileIsEven([2, 4, , , 6])).toEqual([2, 4]);
            expect(takeWhileIsUndefined([, , void 0, , void 0, 5, 6])).toEqual([void 0, void 0, void 0, void 0, void 0]);
        });

        it("should throw an exception if called without the data argument", function () {
            expect(takeWhileIsEven).toThrow();
        });

        it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", function () {
            expect(function () { takeWhileIsEven(null); }).toThrow();
            expect(function () { takeWhileIsEven(void 0); }).toThrow();
        });

        it("should treat every other value as an empty array", function () {
            wannabeEmptyArrays.forEach(function (value) {
                expect(takeWhileIsEven(value)).toEqual([]);
            });
        });
    });

    describe("union / unionBy", function () {
        var arrs = [
            [1, 2, 3],
            [4, 5, 1],
            [5],
            [6, 7, 3, 1],
            [2, 8, 3],
            [9, 0],
            [2, [2, 3]],
            [3, [2, 3]]
        ];
        var r1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, [2, 3], [2, 3]];
        var r2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, [2, 3]];

        var data = [
            [{"id": "1", "name": "foo"}],
            [{"id": "1", "name": "Foo"}, {"id": "2", "name": "bar"}, {"id": "3", "name": "baz"}],
            [{"id": "2", "name": "Bar"}, {"id": "1", "name": "FOO"}]
        ];

        var dataUnionById = [
            {"id": "1", "name": "foo"},
            {"id": "2", "name": "bar"},
            {"id": "3", "name": "baz"}
        ];

        var unionByIdentity = lamb.unionBy(lamb.identity);
        var unionAsStrings = lamb.unionBy(String);
        var unionById = lamb.unionBy(lamb.getKey("id"));

        describe("unionBy", function () {
            it("should build a function throwing an exception if the `iteratee` is not a function or if is missing", function () {
                nonFunctions.forEach(function (value) {
                    expect(function () { lamb.unionBy(value)([1, 2, 3]); }).toThrow();
                });

                expect(function () { lamb.unionBy()([1, 2, 3]); }).toThrow();
            });
        });

        it("should return a list of every unique element present in the given arrays", function () {
            expect(lamb.union([])).toEqual([]);
            expect(lamb.union([1, 2], [2, 3])).toEqual([1, 2, 3]);
            expect(lamb.union.apply(null, arrs)).toEqual(r1);

            expect(unionAsStrings([])).toEqual([]);
            expect(unionAsStrings([1, 2], [2, 3])).toEqual([1, 2, 3]);
            expect(unionAsStrings.apply(null, arrs)).toEqual(r2);
            expect(unionById.apply(null, data)).toEqual(dataUnionById);
        });

        it("should work with array-like objects", function () {
            expect(lamb.union("abc", "bcd", "cde")).toEqual(["a", "b", "c", "d", "e"]);
            expect(unionByIdentity("abc", "bcd", "cde")).toEqual(["a", "b", "c", "d", "e"]);
        });

        it("should return an empty array if it doesn't receive any array-like object", function () {
            expect(lamb.union()).toEqual([]);
            expect(unionAsStrings()).toEqual([]);
        });

        it("should always return dense arrays", function () {
            expect(lamb.union([1, , 3], [3, 5], [6, 7])).toEqual([1, void 0, 3, 5, 6, 7]);
            expect(lamb.union([1, , 3], [3, 5], [void 0, 7])).toEqual([1, void 0, 3, 5, 7]);

            expect(unionAsStrings([1, , 3], [3, 5], [6, 7])).toEqual([1, void 0, 3, 5, 6, 7]);
            expect(unionAsStrings([1, , 3], [3, 5], [void 0, 7])).toEqual([1, void 0, 3, 5, 7]);
        });

        it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", function () {
            expect(function () { lamb.union(null); }).toThrow();
            expect(function () { lamb.union(void 0); }).toThrow();
            expect(function () { lamb.union([1, 2], null); }).toThrow();
            expect(function () { lamb.union([1, 2], void 0); }).toThrow();

            expect(function () { unionAsStrings(null); }).toThrow();
            expect(function () { unionAsStrings(void 0); }).toThrow();
            expect(function () { unionAsStrings([1, 2], null); }).toThrow();
            expect(function () { unionAsStrings([1, 2], void 0); }).toThrow();
        });

        it("should treat every other value as an empty array", function () {
            wannabeEmptyArrays.forEach(function (value) {
                expect(lamb.union(value, [3, 5])).toEqual([3, 5]);
                expect(lamb.union([3, 5], value)).toEqual([3, 5]);
            });
        });
    });

    describe("uniques / uniquesBy", function () {
        var data = [
            {"id": "1", "name": "foo"},
            {"id": "1", "name": "Foo"},
            {"id": "2", "name": "bar"},
            {"id": "3", "name": "baz"},
            {"id": "2", "name": "Bar"},
            {"id": "1", "name": "FOO"}
        ];

        var dataUniques = [
            {"id": "1", "name": "foo"},
            {"id": "2", "name": "bar"},
            {"id": "3", "name": "baz"}
        ];

        var uniquesByIdentity = lamb.uniquesBy(lamb.identity);

        describe("uniques", function () {
            it("should return the unique elements of an array of simple values", function () {
                expect(lamb.uniques([0, 2, 3, 4, 0, 4, 3, 5, 2, 1, 1])).toEqual([0, 2, 3, 4, 5, 1]);
                expect(lamb.uniques(["foo", "bar", "bar", "baz"])).toEqual(["foo", "bar", "baz"]);
                expect(lamb.uniques(Array(3))).toEqual([void 0]);
            });

            it("should throw an exception if called without arguments", function () {
                expect(lamb.uniques).toThrow();
            });
        });

        describe("uniquesBy", function () {
            it("should use the provided iteratee to extract the values to compare", function () {
                expect(lamb.uniquesBy(lamb.getKey("id"))(data)).toEqual(dataUniques);
                expect(lamb.uniquesBy(lamb.invoker("toUpperCase"))(["b", "A", "r", "B", "a", "z"])).toEqual(["b", "A", "r", "z"]);
            });

            it("should build a function throwing an exception if the itereatee isn't a function or if is missing", function () {
                nonFunctions.forEach(function (value) {
                    expect(function () { lamb.uniquesBy(value)([1, 2, 3]); }).toThrow();
                });

                expect(function () { lamb.uniquesBy()([1, 2, 3]); }).toThrow();
            });
        });

        it("should use the SameValueZero comparison", function () {
            expect(lamb.uniques([0, 1, 2, NaN, 1, 2, -0, NaN])).toEqual([0, 1, 2, NaN]);
        });

        it("should return a copy of the source array if it's empty or already contains unique values", function () {
            var a1 = [];
            var r1 = lamb.uniques(a1);
            var a2 = [1, 2, 3, 4, 5];
            var r2 = lamb.uniques(a2);

            expect(r1).toEqual([]);
            expect(r1).not.toBe(a1);
            expect(r2).toEqual(a2);
            expect(r2).not.toBe(a2);
        });

        it("should work with array-like objects", function () {
            var s = "hello world";
            var r = ["h", "e", "l", "o", " ", "w", "r", "d"];

            expect(lamb.uniques(s)).toEqual(r);
            expect(uniquesByIdentity(s)).toEqual(r);
        });

        it("should prefer the first encountered value if two values are considered equal", function () {
            expect(Object.is(0, lamb.uniques([0, -0])[0])).toBe(true);
            expect(lamb.uniques([2, -0, 3, 3, 0, 1])).toEqual([2, -0, 3, 1]);

            var r = lamb.uniquesBy(lamb.getKey("id"))(data);

            expect(r).toEqual(dataUniques);
            expect(r[0]).toBe(data[0]);
            expect(r[1]).toBe(data[2]);
        });

        it("should always return dense arrays", function () {
            var a1 = [1, , 1, 3];
            var a2 = [1, , 1, void 0, 3];
            var r = [1, void 0, 3];

            expect(lamb.uniques(a1)).toEqual(r);
            expect(lamb.uniques(a2)).toEqual(r);
            expect(uniquesByIdentity(a1)).toEqual(r);
            expect(uniquesByIdentity(a2)).toEqual(r);
        });

        it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", function () {
            expect(function () { lamb.uniques(null); }).toThrow();
            expect(function () { lamb.uniques(void 0); }).toThrow();
            expect(function () { uniquesByIdentity(null); }).toThrow();
            expect(function () { uniquesByIdentity(void 0); }).toThrow();
        });

        it("should treat every other value as an empty array", function () {
            wannabeEmptyArrays.forEach(function (value) {
                expect(lamb.uniques(value)).toEqual([]);
                expect(uniquesByIdentity(value)).toEqual([]);
            });
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

            it("should build dense arrays when sparse ones are received", function () {
                expect(lamb.transpose([[1, , 3], [4, 5, void 0], [6, 7, ,]])).toEqual([
                    [1, 4, 6],
                    [void 0, 5, 7],
                    [3, void 0, void 0]
                ]);
            });

            it("should throw an exception when called without arguments", function () {
                expect(lamb.transpose).toThrow();
            });

            it("should throw an exception when a value in the array-like is `nil`", function () {
                expect(function () { lamb.transpose([null, [1, 2, 3]]); }).toThrow();
                expect(function () { lamb.transpose([[1, 2, 3], null]); }).toThrow();
                expect(function () { lamb.transpose([void 0, [1, 2, 3]]); }).toThrow();
                expect(function () { lamb.transpose([[1, 2, 3], void 0]); }).toThrow();
            });

            it("should consider other non-array-like values contained in the main array-like as empty arrays", function () {
                wannabeEmptyArrays.forEach(function (value) {
                    expect(lamb.transpose([[1, 2, 3], value])).toEqual([]);
                    expect(lamb.transpose([value, [1, 2, 3]])).toEqual([]);
                });
            });
        });

        describe("zip", function () {
            it("should pair items with the same index in the received lists", function () {
                expect(lamb.zip([])).toEqual([]);
                expect(lamb.zip(a1)).toEqual(r1);
                expect(lamb.zip(a1, a2)).toEqual(r2);
                expect(lamb.zip(a1, a2, a3)).toEqual(r3);
                expect(lamb.zip(a1, NaN)).toEqual([]);
            });

            it("should work with array-like objects", function () {
                expect(lamb.zip(a1, "abc")).toEqual([[1, "a"], [2, "b"], [3, "c"]]);
            });

            it("should build dense arrays when sparse ones are received", function () {
                expect(lamb.zip(a2, a3, Array(4))).toEqual([[5, 8, void 0], [6, 9, void 0]]);
            });

            it("should return an empty array when called without arguments", function () {
                expect(lamb.zip()).toEqual([]);
            });
        });

        it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", function () {
            expect(function () { lamb.transpose(null); }).toThrow();
            expect(function () { lamb.transpose(void 0); }).toThrow();
            expect(function () { lamb.zip(null); }).toThrow();
            expect(function () { lamb.zip(void 0); }).toThrow();
            expect(function () { lamb.zip([1, 2], null); }).toThrow();
            expect(function () { lamb.zip([1, 2], void 0); }).toThrow();
            expect(function () { lamb.zip([], null); }).toThrow();
            expect(function () { lamb.zip([], void 0); }).toThrow();
        });

        it("should treat every other value as an empty array", function () {
            wannabeEmptyArrays.forEach(function (value) {
                expect(lamb.transpose(value)).toEqual([]);
                expect(lamb.zip(value, [1, 2])).toEqual([]);
                expect(lamb.zip([1, 2], value)).toEqual([]);
            });
        });
    });

    describe("zipWithIndex", function () {
        it("should pair the received values with their index", function () {
            expect(lamb.zipWithIndex([])).toEqual([]);
            expect(lamb.zipWithIndex([1, 2, 3, 4])).toEqual([[1, 0], [2, 1], [3, 2], [4, 3]]);
        });

        it("should work with array-like objects", function () {
            expect(lamb.zipWithIndex("abcd")).toEqual([["a", 0], ["b", 1], ["c", 2], ["d", 3]]);
        });

        it("should not skip deleted or unassigned indexes in sparse arrays", function () {
            expect(lamb.zipWithIndex([1, , 3, ,])).toEqual([
                [1, 0],
                [void 0, 1],
                [3, 2],
                [void 0, 3]
            ]);
        });

        it("should throw an error if no arguments are supplied", function () {
            expect(lamb.zipWithIndex).toThrow();
        });

        it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", function () {
            expect(function () { lamb.zipWithIndex(null); }).toThrow();
            expect(function () { lamb.zipWithIndex(void 0); }).toThrow();
        });

        it("should treat every other value as an empty array", function () {
            wannabeEmptyArrays.forEach(function (value) {
                expect(lamb.zipWithIndex(value)).toEqual([]);
            });
        });
    });
});
