var lamb = require("../../dist/lamb.js");
var sparseArrayEquality = require("../custom_equalities.js").sparseArrayEquality;

describe("lamb.array_basics", function () {
    // for checking "truthy" and "falsy" values returned by predicates
    var isVowel = function (char) { return ~"aeiouAEIOU".indexOf(char); };

    beforeEach(function() {
        jasmine.addCustomEqualityTester(sparseArrayEquality);
    });

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

            expect(lamb.contains()([1, 3])).toBe(false);
            expect(lamb.contains()([1, 3, void 0])).toBe(true);
        });

        it("should be able to start checking from a specific index", function () {
            expect(lamb.contains("foo", 0)(testArray)).toBe(true);
            expect(lamb.isIn(testArray, "foo", 0)).toBe(true);
            expect(lamb.contains(12, 2)(testArray)).toBe(true);
            expect(lamb.isIn(testArray, 12, 2)).toBe(true);
            expect(lamb.contains("foo", 1)(testArray)).toBe(false);
            expect(lamb.isIn(testArray, "foo", 1)).toBe(false);
        });

        it("should convert to integer the value received as `fromIndex`", function () {
            ["foo", null, void 0, {}, [], /foo/, function () {}, NaN, false].forEach(function (value) {
                expect(lamb.contains("foo", value)(testArray)).toBe(true);
                expect(lamb.isIn(testArray, "foo", value)).toBe(true);
            });

            [[1], 1.5, new Date(), true, "2"].forEach(function (value) {
                expect(lamb.contains("foo", value)(testArray)).toBe(false);
                expect(lamb.isIn(testArray, "foo", value)).toBe(false);
            });

            expect(lamb.contains("foo")(testArray)).toBe(true);
            expect(lamb.isIn(testArray, "foo")).toBe(true);
        });

        it("should work with array-like objects", function () {
            expect(lamb.contains("f")("foo")).toBe(true);
            expect(lamb.isIn("foo", "f")).toBe(true);
            expect(lamb.contains("f", 1)("foo")).toBe(false);
            expect(lamb.isIn("foo", "f", 1)).toBe(false);
        });

        it("should throw an exception if called without the data argument or without arguments at all", function () {
            expect(lamb.isIn).toThrow();
            expect(lamb.contains(1)).toThrow();
            expect(lamb.contains()).toThrow();
        });

        it("should throw an exception if supplied with `null` or `undefined`", function () {
            expect(function () { lamb.isIn(null, 1); }).toThrow();
            expect(function () { lamb.isIn(void 0, 1); }).toThrow();
            expect(function () { lamb.contains(1)(null); }).toThrow();
            expect(function () { lamb.contains(1)(void 0); }).toThrow();
        });

        it("should treat every other value as an empty array and return false", function () {
            [/foo/, 1, function () {}, NaN, true, new Date()].forEach(function (value) {
                expect(lamb.contains(1)(value)).toBe(false);
                expect(lamb.isIn(value, 1)).toBe(false);
            });
        });
    });

    describe("every / everyIn", function () {
        var fakeContext = {};
        var a1 = [2, 4, 6, 8];
        var a2 = [1, 3, 5, 6, 7, 8];
        var isEven = function (n, idx, list) {
            expect(list[idx]).toBe(n);
            expect(this).toBe(fakeContext);

            return n % 2 === 0;
        };

        it("should check if every element of an array satisfies the given predicate", function () {
            expect(lamb.everyIn(a1, isEven, fakeContext)).toBe(true);
            expect(lamb.every(isEven, fakeContext)(a1)).toBe(true);
            expect(lamb.everyIn(a2, isEven, fakeContext)).toBe(false);
            expect(lamb.every(isEven, fakeContext)(a2)).toBe(false);
        });

        it("should work with array-like objects", function () {
            expect(lamb.everyIn("2468", isEven, fakeContext)).toBe(true);
            expect(lamb.every(isEven, fakeContext)("2468")).toBe(true);
            expect(lamb.everyIn("24678", isEven, fakeContext)).toBe(false);
            expect(lamb.every(isEven, fakeContext)("24678")).toBe(false);
        });

        it("should always return true for empty array-likes because of vacuous truth", function () {
            expect(lamb.everyIn([], isEven)).toBe(true);
            expect(lamb.every(isEven)([])).toBe(true);
            expect(lamb.everyIn("", isEven)).toBe(true);
            expect(lamb.every(isEven)("")).toBe(true);
        });

        it("should stop calling the predicate as soon as a `false` value is returned", function () {
            var isGreaterThan10 = jasmine.createSpy("isVowel").and.callFake(function (n) {
                return n > 10;
            });
            var arr = [12, 13, 9 , 15];

            expect(lamb.everyIn(arr, isGreaterThan10)).toBe(false);
            expect(isGreaterThan10.calls.count()).toBe(3);
            expect(lamb.every(isGreaterThan10)(arr)).toBe(false);
            expect(isGreaterThan10.calls.count()).toBe(6);
        });

        it("should treat \"truthy\" and \"falsy\" values returned by predicates as booleans", function () {
            expect(lamb.everyIn("aiu", isVowel)).toBe(true);
            expect(lamb.every(isVowel)("aiu")).toBe(true);
            expect(lamb.everyIn("aiuole", isVowel)).toBe(false);
            expect(lamb.every(isVowel)("aiuole")).toBe(false);
        });

        it("should not skip deleted or unassigned elements, unlike the native method", function () {
            var isDefined = lamb.not(lamb.isUndefined);
            var arr = Array(5);
            arr[2] = 99;

            expect(lamb.everyIn(arr, isDefined)).toBe(false);
            expect(lamb.every(isDefined)(arr)).toBe(false);
        });

        it("should throw an exception if the predicate isn't a function or is missing", function () {
            ["foo", null, void 0, {}, [], /foo/, 1, NaN, true, new Date()].forEach(function (value) {
                expect(function () { lamb.everyIn(arr, value); }).toThrow();
                expect(function () { lamb.every(value)(arr); }).toThrow();
            });

            expect(function () { lamb.everyIn(arr); }).toThrow();
            expect(function () { lamb.every()(arr); }).toThrow();
        });

        it("should throw an exception if called without the data argument", function () {
            expect(lamb.every(isEven)).toThrow();
            expect(lamb.everyIn).toThrow();
        });

        it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", function () {
            expect(function () { lamb.everyIn(null, isEven, fakeContext); }).toThrow();
            expect(function () { lamb.everyIn(void 0, isEven, fakeContext); }).toThrow();
            expect(function () { lamb.every(isEven)(null); }).toThrow();
            expect(function () { lamb.every(isEven)(void 0); }).toThrow();
        });

        it("should treat every other value as an empty array and return `true`", function () {
            [/foo/, 1, function () {}, NaN, true, new Date()].forEach(function (value) {
                expect(lamb.everyIn(value, isEven, fakeContext)).toBe(true);
                expect(lamb.every(isEven)(value)).toBe(true);
            });
        });
    });

    describe("filter / filterWith", function () {
        var fakeContext = {};
        var isLowerCase = function (s, idx, list) {
            expect(list[idx]).toBe(s);
            expect(this).toBe(fakeContext);
            return s.toLowerCase() === s;
        };
        var getLowerCaseEls = lamb.filterWith(isLowerCase, fakeContext);
        var arr = ["Foo", "bar", "baZ"];

        afterEach(function () {
            expect(arr).toEqual(["Foo", "bar", "baZ"]);
        });

        it("should filter an array by keeping the items satisfying the given predicate", function () {
            expect(lamb.filter(arr, isLowerCase, fakeContext)).toEqual(["bar"]);
            expect(getLowerCaseEls(arr)).toEqual(["bar"]);
        });

        it("should work with array-like objects", function () {
            expect(lamb.filter("fooBAR", isLowerCase, fakeContext)).toEqual(["f", "o", "o"]);
            expect(getLowerCaseEls("fooBAR")).toEqual(["f", "o", "o"]);
        });

        it("should not skip deleted or unassigned elements, unlike the native method", function () {
            var sparseArr = Array(4);
            sparseArr[2] = 3;
            var isOdd = function (n) { return n % 2 !== 0; };
            var result = [void 0, void 0, 3, void 0];

            expect(lamb.filter(sparseArr, isOdd)).toEqual(result);
            expect(lamb.filterWith(isOdd)(sparseArr)).toEqual(result);
        });

        it("should treat \"truthy\" and \"falsy\" values returned by predicates as booleans", function () {
            expect(lamb.filter("aiuola", isVowel)).toEqual(["a", "i", "u", "o", "a"]);
            expect(lamb.filterWith(isVowel)("aiuola")).toEqual(["a", "i", "u", "o", "a"]);
        });

        it("should throw an exception if the predicate isn't a function or is missing", function () {
            ["foo", null, void 0, {}, [], /foo/, 1, NaN, true, new Date()].forEach(function (value) {
                expect(function () { lamb.filter(arr, value); }).toThrow();
                expect(function () { lamb.filterWith(value)(arr); }).toThrow();
            });

            expect(function () { lamb.filterWith()(arr); }).toThrow();
            expect(function () { lamb.filter(arr); }).toThrow();
        });

        it("should throw an exception if called without the data argument", function () {
            expect(getLowerCaseEls).toThrow();
            expect(lamb.filter).toThrow();
        });

        it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", function () {
            expect(function () { lamb.filter(null, isLowerCase, fakeContext); }).toThrow();
            expect(function () { lamb.filter(void 0, isLowerCase, fakeContext); }).toThrow();
            expect(function () { getLowerCaseEls(null); }).toThrow();
            expect(function () { getLowerCaseEls(void 0); }).toThrow();
        });

        it("should treat every other value as an empty array", function () {
            [/foo/, 1, function () {}, NaN, true, new Date()].forEach(function (value) {
                expect(lamb.filter(value, isLowerCase, fakeContext)).toEqual([]);
                expect(getLowerCaseEls(value)).toEqual([]);
            });
        });
    });

    describe("find / findWhere / findIndex / findIndexWhere", function () {
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
            expect(s[idx]).toBe(char);
            return ~"AEIOUaeiou".indexOf(char);
        };

        var is40YO = lamb.hasKeyValue("age", 40);
        var is41YO = lamb.hasKeyValue("age", 41);

        describe("find", function () {
            it("should find an element in an array-like object by using the given predicate", function () {
                expect(lamb.find(persons, is40YO)).toEqual(persons[1]);
                expect(lamb.findWhere(is40YO)(persons)).toEqual(persons[1]);
            });

            it("should return `undefined` if there is no element satisfying the predicate", function () {
                expect(lamb.find(persons, is41YO)).toBeUndefined();
                expect(lamb.findWhere(is41YO)(persons)).toBeUndefined();
            });

            it("should treat \"truthy\" and \"falsy\" values returned by predicates as booleans", function () {
                expect(lamb.find(testString, isVowel, fakeContext)).toBe("e");
                expect(lamb.find("zxc", isVowel, fakeContext)).toBeUndefined();
                expect(lamb.findWhere(isVowel, fakeContext)(testString)).toBe("e");
                expect(lamb.findWhere(isVowel, fakeContext)("zxc")).toBeUndefined();
            });

            it("should throw an exception if the predicate isn't a function or is missing", function () {
                ["foo", null, void 0, {}, [], /foo/, 1, NaN, true, new Date()].forEach(function (value) {
                    expect(function () { lamb.find(persons, value); }).toThrow();
                    expect(function () { lamb.findWhere(value)(persons); }).toThrow();
                });

                expect(function () { lamb.find(persons); }).toThrow();
                expect(function () { lamb.findWhere()(persons); }).toThrow();
            });

            it("should throw an exception if called without arguments", function () {
                expect(lamb.find).toThrow();
                expect(lamb.findWhere()).toThrow();
            });

            it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", function () {
                expect(function () { lamb.find(null, is40YO); }).toThrow();
                expect(function () { lamb.find(void 0, is40YO); }).toThrow();
                expect(function () { lamb.findWhere(is40YO)(null); }).toThrow();
                expect(function () { lamb.findWhere(is40YO)(void 0); }).toThrow();
            });

            it("should treat every other value as an empty array", function () {
                [/foo/, 1, function () {}, NaN, true, new Date()].forEach(function (value) {
                    expect(lamb.find(value, is40YO)).toBeUndefined();
                    expect(lamb.findWhere(is40YO)(value)).toBeUndefined();
                });
            });
        });

        describe("findIndex", function () {
            it("should find the index of an element in an array-like object by using the given predicate", function () {
                expect(lamb.findIndex(persons, is40YO)).toBe(1);
                expect(lamb.findIndexWhere(is40YO)(persons)).toBe(1);
            });

            it("should return `-1` if there is no element satisfying the predicate", function () {
                expect(lamb.findIndex(persons, is41YO)).toBe(-1);
                expect(lamb.findIndexWhere(is41YO)(persons)).toBe(-1);
            });

            it("should treat \"truthy\" and \"falsy\" values returned by predicates as booleans", function () {
                expect(lamb.findIndex(testString, isVowel, fakeContext)).toBe(1);
                expect(lamb.findIndex("zxc", isVowel, fakeContext)).toBe(-1);
                expect(lamb.findIndexWhere(isVowel, fakeContext)(testString)).toBe(1);
                expect(lamb.findIndexWhere(isVowel, fakeContext)("zxc")).toBe(-1);
            });

            it("should throw an exception if the predicate isn't a function or is missing", function () {
                ["foo", null, void 0, {}, [], /foo/, 1, NaN, true, new Date()].forEach(function (value) {
                    expect(function () { lamb.findIndex(persons, value); }).toThrow();
                    expect(function () { lamb.findIndexWhere(value)(persons); }).toThrow();
                });

                expect(function () { lamb.findIndex(persons); }).toThrow();
                expect(function () { lamb.findIndexWhere()(persons); }).toThrow();
            });

            it("should throw an exception if called without arguments", function () {
                expect(lamb.findIndex).toThrow();
                expect(lamb.findIndexWhere()).toThrow();
            });

            it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", function () {
                expect(function () { lamb.findIndex(null, is40YO); }).toThrow();
                expect(function () { lamb.findIndex(void 0, is40YO); }).toThrow();
                expect(function () { lamb.findIndexWhere(is40YO)(null); }).toThrow();
                expect(function () { lamb.findIndexWhere(is40YO)(void 0); }).toThrow();

            });

            it("should treat every other value as an empty array", function () {
                [/foo/, 1, function () {}, NaN, true, new Date()].forEach(function (value) {
                    expect(lamb.findIndex(value, is40YO)).toBe(-1);
                    expect(lamb.findIndexWhere(is40YO)(value)).toBe(-1);
                });
            });
        });
    });

    describe("forEach", function () {
        var arr = [1, 2, 3, 4, 5];
        var fakeContext = {};
        var fn = function (el, idx, list) {
            expect(list[idx]).toBe(el);
            expect(this).toBe(fakeContext);
        };

        it("should execute the given function for every element of the provided array", function () {
            expect(lamb.forEach(arr, fn, fakeContext)).toBeUndefined();
        });

        it("should work with array-like objects", function () {
            expect(lamb.forEach("foo bar", fn, fakeContext)).toBeUndefined();
        });

        it("should not skip deleted or unassigned elements, unlike the native method", function () {
            var sparseArr = Array(3);
            sparseArr[1] = 3;

            var fn = jasmine.createSpy("fn").and.callThrough();

            expect(lamb.forEach(sparseArr, fn)).toBeUndefined();
            expect(fn.calls.count()).toBe(3);
            expect(fn.calls.argsFor(0)).toEqual([void 0, 0, sparseArr]);
            expect(fn.calls.argsFor(1)).toEqual([3, 1, sparseArr]);
            expect(fn.calls.argsFor(2)).toEqual([void 0, 2, sparseArr]);
        });

        it("should throw an exception if the predicate isn't a function or is missing", function () {
            ["foo", null, void 0, {}, [], /foo/, 1, NaN, true, new Date()].forEach(function (value) {
                expect(function () { lamb.forEach(arr, value); }).toThrow();
            });

            expect(function () { lamb.forEach(arr); }).toThrow();
        });

        it("should throw an exception if called without the data argument", function () {
            expect(lamb.forEach).toThrow();
        });

        it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", function () {
            expect(function () { lamb.forEach(null, fn, fakeContext); }).toThrow();
            expect(function () { lamb.forEach(void 0, fn, fakeContext); }).toThrow();
        });

        it("should treat every other value as an empty array", function () {
            var fn = jasmine.createSpy("fn").and.callThrough();

            [/foo/, 1, function () {}, NaN, true, new Date()].forEach(function (value) {
                expect(lamb.forEach(value, fn, fakeContext)).toBeUndefined();
            });

            expect(fn.calls.count()).toBe(0);
        });
    });

    describe("list", function () {
        it("should build an array with the received arguments", function () {
            expect(lamb.list(123)).toEqual([123]);
            expect(lamb.list(1, 2, 3)).toEqual([1, 2, 3]);
            expect(lamb.list(null, void 0)).toEqual([null, void 0]);
            expect(lamb.list(void 0)).toEqual([void 0]);
        });

        it("should return an empty array if no arguments are supplied", function () {
            expect(lamb.list()).toEqual([]);
        });
    });

    describe("map / mapWith", function () {
        var fakeContext = {};
        var double = function (n, idx, list) {
            expect(list[idx]).toBe(n);
            expect(this).toBe(fakeContext);
            return n * 2;
        };
        var makeDoubles = lamb.mapWith(double, fakeContext);
        var numbers = [1, 2, 3, 4, 5];

        afterEach(function () {
            expect(numbers).toEqual([1, 2, 3, 4, 5]);
        });

        it("should apply the provided function to the elements of the given array", function () {
            expect(lamb.map(numbers, double, fakeContext)).toEqual([2, 4, 6, 8, 10]);
            expect(makeDoubles(numbers)).toEqual([2, 4, 6, 8, 10]);
        });

        it("should work with array-like objects", function () {
            expect(lamb.map("12345", double, fakeContext)).toEqual([2, 4, 6, 8, 10]);
            expect(makeDoubles("12345")).toEqual([2, 4, 6, 8, 10]);
        });

        it("should not skip deleted or unassigned elements, unlike the native method", function () {
            var sparseArr = Array(3);
            sparseArr[1] = "foo";
            var safeUpperCase = lamb.compose(lamb.invoker("toUpperCase"), String);
            var result = ["UNDEFINED", "FOO", "UNDEFINED"];

            expect(lamb.map(sparseArr, safeUpperCase)).toEqual(result);
            expect(lamb.mapWith(safeUpperCase)(sparseArr)).toEqual(result);
        });


        it("should throw an exception if the iteratee isn't a function or is missing", function () {
            ["foo", null, void 0, {}, [], /foo/, 1, NaN, true, new Date()].forEach(function (value) {
                expect(function () { lamb.mapWith(value)(numbers); }).toThrow();
            });

            expect(function () { lamb.mapWith()(numbers); }).toThrow();
        });

        it("should throw an exception if called without the data argument", function () {
            expect(lamb.map).toThrow();
            expect(makeDoubles).toThrow();
        });

        it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", function () {
            expect(function () { lamb.map(null, double); }).toThrow();
            expect(function () { lamb.map(void 0, double); }).toThrow();
            expect(function () { makeDoubles(null); }).toThrow();
            expect(function () { makeDoubles(void 0); }).toThrow();
        });

        it("should treat every other value as an empty array", function () {
            [/foo/, 1, function () {}, NaN, true, new Date()].forEach(function (value) {
                expect(lamb.map(value, double)).toEqual([]);
                expect(makeDoubles(value)).toEqual([]);
            });
        });
    });

    describe("reduceRight / reduceRightWith", function () {
        var arr = [1, 2, 3, 4, 5];
        var s = "12345";

        afterEach(function () {
            expect(arr).toEqual([1, 2, 3, 4, 5]);
        });

        it("should fold the provided array with the given accumulator function starting from the last element", function () {
            var subtract = jasmine.createSpy("subtract").and.callFake(function (prev, current, idx, list) {
                expect(list).toBe(arr);
                expect(list[idx]).toBe(current);

                return prev - current;
            });

            var prevValues = [5, 1, -2, -4, 0, -5, -9, -12, -14, 10, 5, 1, -2, -4, 5, 1, -2, -4, 0, -5, -9, -12, -14, 10, 5, 1, -2, -4];

            expect(lamb.reduceRight(arr, subtract)).toBe(-5);
            expect(lamb.reduceRight(arr, subtract, 0)).toBe(-15);
            expect(lamb.reduceRight(arr, subtract, 10)).toBe(-5);
            expect(lamb.reduceRightWith(subtract)(arr)).toBe(-5);
            expect(lamb.reduceRightWith(subtract, 0)(arr)).toBe(-15);
            expect(lamb.reduceRightWith(subtract, 10)(arr)).toBe(-5);

            expect(subtract.calls.count()).toBe(prevValues.length);
            prevValues.forEach(function (prevValue, idx) {
                expect(subtract.calls.argsFor(idx)[0]).toEqual(prevValue);
            });
        });

        it("should work with array-like objects", function () {
            var fn = lamb.tapArgs(lamb.subtract, lamb.identity, Number);

            expect(lamb.reduceRight(s, fn)).toBe(-5);
            expect(lamb.reduceRight(s, fn, 0)).toBe(-15);
            expect(lamb.reduceRight(s, fn, 10)).toBe(-5);
            expect(lamb.reduceRightWith(fn)(s)).toBe(-5);
            expect(lamb.reduceRightWith(fn, 0)(s)).toBe(-15);
            expect(lamb.reduceRightWith(fn, 10)(s)).toBe(-5);
        });

        it("should not skip deleted or unassigned elements, unlike the native method", function () {
            var addSpy = jasmine.createSpy("add").and.callFake(lamb.add);
            var sparseArr = Array(3);
            sparseArr[1] = 3;

            expect(lamb.reduceRight(sparseArr, addSpy, 0)).toEqual(NaN);
            expect(lamb.reduceRightWith(addSpy, 0)(sparseArr)).toEqual(NaN);
            expect(addSpy.calls.count()).toBe(6);
        });

        it("should build a function throwing an exception if the accumulator isn't a function or is missing", function () {
            ["foo", null, void 0, {}, [], /foo/, 1, NaN, true, new Date()].forEach(function (value) {
                expect(function () { lamb.reduceRight(arr, value, 0); }).toThrow();
                expect(function () { lamb.reduceRightWith(value, 0)(arr); }).toThrow();
            });

            expect(function () { lamb.reduceRight(arr); }).toThrow();
            expect(function () { lamb.reduceRightWith()(arr); }).toThrow();
        });

        it("should throw an exception if called without the data argument", function () {
            expect(lamb.reduceRight).toThrow();
            expect(lamb.reduceRightWith(lamb.add, 0)).toThrow();
        });

        it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", function () {
            expect(function () { lamb.reduceRight(null, lamb.subtract, 0); }).toThrow();
            expect(function () { lamb.reduceRight(void 0, lamb.subtract, 0); }).toThrow();
            expect(function () { lamb.reduceRightWith(lamb.subtract, 0)(null); }).toThrow();
            expect(function () { lamb.reduceRightWith(lamb.subtract, 0)(void 0); }).toThrow();
        });

        it("should throw an exception when supplied with an empty array-like without an initial value", function () {
            expect(function () { lamb.reduceRight([], lamb.subtract); }).toThrow();
            expect(function () { lamb.reduceRight("", lamb.subtract); }).toThrow();
            expect(function () { lamb.reduceRightWith(lamb.subtract)([]); }).toThrow();
            expect(function () { lamb.reduceRightWith(lamb.subtract)(""); }).toThrow();
        });

        it("should treat every other value as an empty array and return the initial value", function () {
            [/foo/, 1, function () {}, NaN, true, new Date()].forEach(function (value) {
                expect(lamb.reduceRight(value, lamb.subtract, 99)).toEqual(99);
                expect(lamb.reduceRightWith(lamb.subtract, 99)(value)).toEqual(99);
            });
        });
    });

    describe("reduce / reduceWith", function () {
        var arr = [1, 2, 3, 4, 5];
        var s = "12345";

        afterEach(function () {
            expect(arr).toEqual([1, 2, 3, 4, 5]);
        });

        it("should fold the provided array with the given accumulator function starting from the first element", function () {
            var subtract = jasmine.createSpy("subtract").and.callFake(function (prev, current, idx, list) {
                expect(list).toBe(arr);
                expect(list[idx]).toBe(current);

                return prev - current;
            });

            var prevValues = [1, -1, -4, -8, 0, -1, -3, -6, -10, 10, 9, 7, 4, 0, 1, -1, -4, -8, 0, -1, -3, -6, -10, 10, 9, 7, 4, 0];

            expect(lamb.reduce(arr, subtract)).toBe(-13);
            expect(lamb.reduce(arr, subtract, 0)).toBe(-15);
            expect(lamb.reduce(arr, subtract, 10)).toBe(-5);
            expect(lamb.reduceWith(subtract)(arr)).toBe(-13);
            expect(lamb.reduceWith(subtract, 0)(arr)).toBe(-15);
            expect(lamb.reduceWith(subtract, 10)(arr)).toBe(-5);

            expect(subtract.calls.count()).toBe(prevValues.length);
            prevValues.forEach(function (prevValue, idx) {
                expect(subtract.calls.argsFor(idx)[0]).toEqual(prevValue);
            });
        });

        it("should work with array-like objects", function () {
            var fn = lamb.tapArgs(lamb.subtract, lamb.identity, Number);

            expect(lamb.reduce(s, fn)).toBe(-13);
            expect(lamb.reduce(s, fn, 0)).toBe(-15);
            expect(lamb.reduce(s, fn, 10)).toBe(-5);
            expect(lamb.reduceWith(fn)(s)).toBe(-13);
            expect(lamb.reduceWith(fn, 0)(s)).toBe(-15);
            expect(lamb.reduceWith(fn, 10)(s)).toBe(-5);
        });

        it("should not skip deleted or unassigned elements, unlike the native method", function () {
            var addSpy = jasmine.createSpy("add").and.callFake(lamb.add);
            var sparseArr = Array(3);
            sparseArr[1] = 3;

            expect(lamb.reduce(sparseArr, addSpy, 0)).toEqual(NaN);
            expect(lamb.reduceWith(addSpy, 0)(sparseArr)).toEqual(NaN);
            expect(addSpy.calls.count()).toBe(6);
        });

        it("should build a function throwing an exception if the accumulator isn't a function or is missing", function () {
            ["foo", null, void 0, {}, [], /foo/, 1, NaN, true, new Date()].forEach(function (value) {
                expect(function () { lamb.reduce(arr, value, 0); }).toThrow();
                expect(function () { lamb.reduceWith(value, 0)(arr); }).toThrow();
            });

            expect(function () { lamb.reduce(arr); }).toThrow();
            expect(function () { lamb.reduceWith()(arr); }).toThrow();
        });

        it("should throw an exception if called without the data argument", function () {
            expect(lamb.reduce).toThrow();
            expect(lamb.reduceWith(lamb.add, 0)).toThrow();
        });

        it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", function () {
            expect(function () { lamb.reduce(null, lamb.subtract, 0); }).toThrow();
            expect(function () { lamb.reduce(void 0, lamb.subtract, 0); }).toThrow();
            expect(function () { lamb.reduceWith(lamb.subtract, 0)(null); }).toThrow();
            expect(function () { lamb.reduceWith(lamb.subtract, 0)(void 0); }).toThrow();
        });

        it("should throw an exception when supplied with an empty array-like without an initial value", function () {
            expect(function () { lamb.reduce([], lamb.subtract); }).toThrow();
            expect(function () { lamb.reduce("", lamb.subtract); }).toThrow();
            expect(function () { lamb.reduceWith(lamb.subtract)([]); }).toThrow();
            expect(function () { lamb.reduceWith(lamb.subtract)(""); }).toThrow();
        });

        it("should treat every other value as an empty array and return the initial value", function () {
            [/foo/, 1, function () {}, NaN, true, new Date()].forEach(function (value) {
                expect(lamb.reduce(value, lamb.subtract, 99)).toEqual(99);
                expect(lamb.reduceWith(lamb.subtract, 99)(value)).toEqual(99);
            });
        });
    });

    describe("reverse", function () {
        it("should reverse a copy of an array-like object", function () {
            var arr = [1, 2, 3, 4, 5];
            var s = "hello";

            expect(lamb.reverse(arr)).toEqual([5, 4, 3, 2, 1]);
            expect(lamb.reverse(s)).toEqual(["o", "l", "l", "e", "h"]);
            expect(arr).toEqual([1, 2, 3, 4, 5]);
        });

        it("should throw an exception if called without arguments", function () {
            expect(lamb.reverse).toThrow();
        });

        it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", function () {
            expect(function () { lamb.reverse(null); }).toThrow();
            expect(function () { lamb.reverse(void 0); }).toThrow();
        });

        it("should treat every other value as an empty array", function () {
            [{}, /foo/, 1, function () {}, NaN, true, new Date()].forEach(function (value) {
                expect(lamb.reverse(value)).toEqual([]);
            });
        });
    });

    describe("slice / sliceAt", function () {
        var arr = [1, 2, 3, 4, 5, 6];
        var arrCopy = arr.slice();
        var s = "hello world";
        var users = [{name: "Jane"}, {name: "John"}, {name: "Mario"}, {name: "Paolo"}];
        var usersCopy = [{name: "Jane"}, {name: "John"}, {name: "Mario"}, {name: "Paolo"}];

        afterEach(function () {
            expect(arr).toEqual(arrCopy);
            expect(users).toEqual(usersCopy);
        });

        it("should return a copy of the desired portion of an array", function () {
            expect(lamb.slice(arr, 0, 3)).toEqual([1, 2, 3]);
            expect(lamb.sliceAt(0, 3)(arr)).toEqual([1, 2, 3]);

            var usersSliceA = lamb.slice(users, 1, 3);
            var usersSliceB = lamb.sliceAt(1, 3)(users);

            expect(usersSliceA).toEqual([{name: "John"}, {name: "Mario"}]);
            expect(usersSliceA[0]).toBe(users[1]);
            expect(usersSliceA[1]).toBe(users[2]);
            expect(usersSliceB).toEqual([{name: "John"}, {name: "Mario"}]);
            expect(usersSliceB[0]).toBe(users[1]);
            expect(usersSliceB[1]).toBe(users[2]);
        });

        it("should work on array-like objects", function () {
            expect(lamb.slice(s, 1, 3)).toEqual(["e", "l"]);
            expect(lamb.sliceAt(1, 3)(s)).toEqual(["e", "l"]);
        });

        it("should return an array copy of the array-like if the desired slice encompasses the whole array-like", function () {
            var r1 = lamb.slice(arr, 0, arr.length);
            var r2 = lamb.sliceAt(0, arr.length)(arr);

            expect(r1).toEqual(arrCopy);
            expect(r2).toEqual(arrCopy);
            expect(r1).not.toBe(arr);
            expect(r2).not.toBe(arr);
            expect(lamb.slice(s, 0, s.length)).toEqual(s.split(""));
            expect(lamb.sliceAt(0, s.length)(s)).toEqual(s.split(""));
        });

        it("should accept negative indexes in the `start` parameter", function () {
            expect(lamb.slice(arr, -3, 5)).toEqual([4, 5]);
            expect(lamb.slice(s, -5, 9)).toEqual(["w", "o", "r"]);

            expect(lamb.sliceAt(-3, 5)(arr)).toEqual([4, 5]);
            expect(lamb.sliceAt(-5, 9)(s)).toEqual(["w", "o", "r"]);
        });

        it("should accept negative indexes in the `end` parameter", function () {
            expect(lamb.slice(arr, 2, -2)).toEqual([3, 4]);
            expect(lamb.slice(s, 2, -2)).toEqual(["l", "l", "o", " ", "w", "o", "r"]);

            expect(lamb.sliceAt(2, -2)(arr)).toEqual([3, 4]);
            expect(lamb.sliceAt(2, -2)(s)).toEqual(["l", "l", "o", " ", "w", "o", "r"]);
        });

        it("should slice from the beginning of the array-like if the `start` parameter is less than or equal to the additive inverse of the array-like length", function () {
            expect(lamb.slice(arr, -20, 3)).toEqual([1, 2, 3]);
            expect(lamb.slice(arr, -arr.length, 3)).toEqual([1, 2, 3]);
            expect(lamb.slice(s, -20, 4)).toEqual(["h", "e", "l", "l"]);
            expect(lamb.slice(s, -s.length, 4)).toEqual(["h", "e", "l", "l"]);

            expect(lamb.sliceAt(-20, 3)(arr)).toEqual([1, 2, 3]);
            expect(lamb.sliceAt(-arr.length, 3)(arr)).toEqual([1, 2, 3]);
            expect(lamb.sliceAt(-20, 4)(s)).toEqual(["h", "e", "l", "l"]);
            expect(lamb.sliceAt(-s.length, 4)(s)).toEqual(["h", "e", "l", "l"]);
        });

        it("should slice to the end of the array-like if the `end` parameter is greater than its length", function () {
            expect(lamb.slice(arr, 3, 30)).toEqual([4, 5, 6]);
            expect(lamb.slice(s, 8, 40)).toEqual(["r", "l", "d"]);

            expect(lamb.sliceAt(3, 30)(arr)).toEqual([4, 5, 6]);
            expect(lamb.sliceAt(8, 40)(s)).toEqual(["r", "l", "d"]);
        });

        it("should return an empty array if `start` is greater than or equal to the length of the array-like", function () {
            expect(lamb.slice(arr, 6, 6)).toEqual([]);
            expect(lamb.slice(arr, 6, -1)).toEqual([]);
            expect(lamb.slice(arr, 7, -1)).toEqual([]);
            expect(lamb.slice(s, 11, 11)).toEqual([]);
            expect(lamb.slice(s, 11, -1)).toEqual([]);
            expect(lamb.slice(s, 12, -1)).toEqual([]);

            expect(lamb.sliceAt(6, 6)(arr)).toEqual([]);
            expect(lamb.sliceAt(6, -1)(arr)).toEqual([]);
            expect(lamb.sliceAt(7, -1)(arr)).toEqual([]);
            expect(lamb.sliceAt(11, 11)(s)).toEqual([]);
            expect(lamb.sliceAt(11, -1)(s)).toEqual([]);
            expect(lamb.sliceAt(12, -1)(s)).toEqual([]);
        });

        it("should return an empty array if `start` is greater than or equal to `end` (as natural indexes)", function () {
            expect(lamb.slice(arr, 4, 4)).toEqual([]);
            expect(lamb.slice(arr, 5, 4)).toEqual([]);
            expect(lamb.slice(arr, -5, -40)).toEqual([]);
            expect(lamb.slice(s, 4, 4)).toEqual([]);
            expect(lamb.slice(s, 5, 4)).toEqual([]);
            expect(lamb.slice(s, -5, -40)).toEqual([]);

            expect(lamb.sliceAt(4, 4)(arr)).toEqual([]);
            expect(lamb.sliceAt(5, 4)(arr)).toEqual([]);
            expect(lamb.sliceAt(-5, -40)(arr)).toEqual([]);
            expect(lamb.sliceAt(4, 4)(s)).toEqual([]);
            expect(lamb.sliceAt(5, 4)(s)).toEqual([]);
            expect(lamb.sliceAt(-5, -40)(s)).toEqual([]);
        });

        it("should convert to integer any value received as `start` or `end` following ECMA specifications", function () {
            // see http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger

            expect(lamb.slice(arr, new Date(1), new Date(4))).toEqual([2, 3, 4]);
            expect(lamb.slice(arr, 1.8, 4.9)).toEqual([2, 3, 4]);
            expect(lamb.slice(arr, null, 3)).toEqual([1, 2, 3]);
            expect(lamb.slice(arr, 1, null)).toEqual([]);
            expect(lamb.slice(arr, "1.8", "4.9")).toEqual([2, 3, 4]);
            expect(lamb.slice(arr, false, true)).toEqual([1]);
            expect(lamb.slice(arr, [1.8], [4.9])).toEqual([2, 3, 4]);
            expect(lamb.slice(arr, ["1.8"], ["4.9"])).toEqual([2, 3, 4]);

            expect(lamb.slice(s, new Date(1), new Date(3))).toEqual(["e", "l"]);
            expect(lamb.slice(s, 1.8, 3.9)).toEqual(["e", "l"]);
            expect(lamb.slice(s, null, 3)).toEqual(["h", "e", "l"]);
            expect(lamb.slice(s, 1, null)).toEqual([]);
            expect(lamb.slice(s, "1.8", "4.9")).toEqual(["e", "l", "l"]);
            expect(lamb.slice(s, false, true)).toEqual(["h"]);
            expect(lamb.slice(s, [1.8], [4.9])).toEqual(["e", "l", "l"]);
            expect(lamb.slice(s, ["1.8"], ["4.9"])).toEqual(["e", "l", "l"]);

            expect(lamb.sliceAt(new Date(1), new Date(4))(arr)).toEqual([2, 3, 4]);
            expect(lamb.sliceAt(1.8, 4.9)(arr)).toEqual([2, 3, 4]);
            expect(lamb.sliceAt(null, 3)(arr)).toEqual([1, 2, 3]);
            expect(lamb.sliceAt(1, null)(arr)).toEqual([]);
            expect(lamb.sliceAt("1.8", "4.9")(arr)).toEqual([2, 3, 4]);
            expect(lamb.sliceAt(false, true)(arr)).toEqual([1]);
            expect(lamb.sliceAt([1.8], [4.9])(arr)).toEqual([2, 3, 4]);
            expect(lamb.sliceAt(["1.8"], ["4.9"])(arr)).toEqual([2, 3, 4]);

            expect(lamb.sliceAt(new Date(1), new Date(3))(s)).toEqual(["e", "l"]);
            expect(lamb.sliceAt(1.8, 3.9)(s)).toEqual(["e", "l"]);
            expect(lamb.sliceAt(null, 3)(s)).toEqual(["h", "e", "l"]);
            expect(lamb.sliceAt(1, null)(s)).toEqual([]);
            expect(lamb.sliceAt("1.8", "4.9")(s)).toEqual(["e", "l", "l"]);
            expect(lamb.sliceAt(false, true)(s)).toEqual(["h"]);
            expect(lamb.sliceAt([1.8], [4.9])(s)).toEqual(["e", "l", "l"]);
            expect(lamb.sliceAt(["1.8"], ["4.9"])(s)).toEqual(["e", "l", "l"]);

            expect(lamb.slice(arr, -4.8, -2.9)).toEqual([3, 4]);
            expect(lamb.slice(arr, "-4.8", "-2.9")).toEqual([3, 4]);
            expect(lamb.slice(arr, [-4.8], [-2.9])).toEqual([3, 4]);

            expect(lamb.slice(s, -4.8, -2.9)).toEqual(["o", "r"]);
            expect(lamb.slice(s, "-4.8", "-2.9")).toEqual(["o", "r"]);
            expect(lamb.slice(s, [-4.8], [-2.9])).toEqual(["o", "r"]);

            expect(lamb.sliceAt(-4.8, -2.9)(arr)).toEqual([3, 4]);
            expect(lamb.sliceAt("-4.8", "-2.9")(arr)).toEqual([3, 4]);
            expect(lamb.sliceAt([-4.8], [-2.9])(arr)).toEqual([3, 4]);

            expect(lamb.sliceAt(-4.8, -2.9)(s)).toEqual(["o", "r"]);
            expect(lamb.sliceAt("-4.8", "-2.9")(s)).toEqual(["o", "r"]);
            expect(lamb.sliceAt([-4.8], [-2.9])(s)).toEqual(["o", "r"]);
        });

        it("should interpret as zeroes values received, or not, as `min` or `max` that don't have an integer representation", function () {
            [void 0, [1, 2], {a: 2}, "2a", /foo/, NaN, function () {}].forEach(function (value) {
                expect(lamb.slice(arr, value, arr.length)).toEqual(arrCopy);
                expect(lamb.slice(s, value, s.length)).toEqual(s.split(""));
                expect(lamb.slice(arr, 0, value)).toEqual([]);
                expect(lamb.slice(s, 0, value)).toEqual([]);

                expect(lamb.sliceAt(value, arr.length)(arr)).toEqual(arrCopy);
                expect(lamb.sliceAt(value, s.length)(s)).toEqual(s.split(""));
                expect(lamb.sliceAt(0, value)(arr)).toEqual([]);
                expect(lamb.sliceAt(0, value)(s)).toEqual([]);

                expect(lamb.slice(arr, 0)).toEqual([]);
                expect(lamb.slice(s, 0)).toEqual([]);

                expect(lamb.sliceAt(0)(arr)).toEqual([]);
                expect(lamb.sliceAt(0)(s)).toEqual([]);

            });

            expect(lamb.slice(arr)).toEqual([]);
            expect(lamb.sliceAt()(arr)).toEqual([]);
            expect(lamb.slice(s)).toEqual([]);
            expect(lamb.sliceAt()(s)).toEqual([]);
        });

        it("should return an array with `undefined` values in place of unassigned or deleted indexes if a sparse array is received", function () {
            var aSparse = [, 1, 2, , 4, , ,]; // length === 7, same as aDense
            var aDense = [void 0, 1, 2, void 0, 4, void 0, void 0];
            var r1 = lamb.slice(aSparse, 0, aSparse.length);
            var r2 = lamb.sliceAt(0, aSparse.length)(aSparse);

            expect(r1).toEqual(aDense);
            expect(r1).not.toEqual(aSparse);
            expect(r2).toEqual(aDense);
            expect(r2).not.toEqual(aSparse);
        });

        it("should try, as native `slice` does, to retrieve elements from objects with a `length` property, but it should always build dense arrays", function () {
            var objs = [
                {length: 3, "0": 1, "1": 2, "2": 3},
                {length: "2", "0": 1, "1": 2, "2": 3},
                {length: "-2", "0": 1, "1": 2, "2": 3}
            ];

            var results = [ [2, 3], [2], [] ];

            objs.forEach(function (obj, idx) {
                expect(lamb.slice(obj, 1, 3)).toEqual(results[idx]);
                expect(lamb.sliceAt(1, 3)(obj)).toEqual(results[idx]);
            });

            var oSparse = {length: 2};
            var rSparse = Array(2);
            var rDense = [void 0, void 0];

            expect(lamb.slice(oSparse, 0, oSparse.length)).toEqual(rDense);
            expect(lamb.slice(oSparse, 0, oSparse.length)).not.toEqual(rSparse);
            expect(lamb.sliceAt(0, oSparse.length)(oSparse)).toEqual(rDense);
            expect(lamb.sliceAt(0, oSparse.length)(oSparse)).not.toEqual(rSparse);
        });

        it("should work with array-like lengths up to 2^32 - 1", function () {
            var maxLen = Math.pow(2, 32) - 1;
            var maxIndex = maxLen - 1;
            var obj = {length: maxLen + 100};

            obj[maxIndex] = 99;
            obj[maxIndex + 1] = 88;

            expect(lamb.slice(obj, -1, obj.length)).toEqual([99]);
            expect(lamb.sliceAt(-1, obj.length)(obj)).toEqual([99]);
        });

        it("should throw an exception if it receives `null` or `undefined` instead of an array-like or if it's called without parameters", function () {
            expect(function () { lamb.slice(null, 1, 2); }).toThrow();
            expect(function () { lamb.slice(void 0, 1, 2); }).toThrow();
            expect(function () { lamb.sliceAt(1, 2)(null); }).toThrow();
            expect(function () { lamb.sliceAt(1, 2)(void 0); }).toThrow();

            expect(lamb.slice).toThrow();
            expect(lamb.sliceAt()).toThrow();
        });

        it("should treat every other value as an empty array", function () {
            [/foo/, 1, function () {}, NaN, true, new Date()].forEach(function (value) {
                expect(lamb.slice(value, 0, 2)).toEqual([]);
                expect(lamb.sliceAt(0, 2)(value)).toEqual([]);
            });
        });
    });

    describe("some / someIn", function () {
        var fakeContext = {};
        var a1 = [1, 3, 5, 6, 7, 8];
        var a2 = [1, 3, 5, 7];
        var isEven = function (n, idx, list) {
            expect(list[idx]).toBe(n);
            expect(this).toBe(fakeContext);

            return n % 2 === 0;
        };

        var isVowel = function (char) { return ~"aeiou".indexOf(char); };

        it("should check if at least one element of an array satisfies the given predicate", function () {
            expect(lamb.someIn(a1, isEven, fakeContext)).toBe(true);
            expect(lamb.some(isEven, fakeContext)(a1)).toBe(true);
            expect(lamb.someIn(a2, isEven, fakeContext)).toBe(false);
            expect(lamb.some(isEven, fakeContext)(a2)).toBe(false);
        });

        it("should work with array-like objects", function () {
            expect(lamb.someIn("134567", isEven, fakeContext)).toBe(true);
            expect(lamb.some(isEven, fakeContext)("134567")).toBe(true);
            expect(lamb.someIn("1357", isEven, fakeContext)).toBe(false);
            expect(lamb.some(isEven, fakeContext)("1357")).toBe(false);
        });

        it("should always return false for empty array-likes", function () {
            expect(lamb.someIn([], isEven)).toBe(false);
            expect(lamb.some(isEven)([])).toBe(false);
            expect(lamb.someIn("", isEven)).toBe(false);
            expect(lamb.some(isEven)("")).toBe(false);
        });

        it("should stop calling the predicate as soon as a `true` value is returned", function () {
            var isGreaterThan10 = jasmine.createSpy("isVowel").and.callFake(function (n) {
                return n > 10;
            });
            var arr = [1, 3, 15, 10, 11];

            expect(lamb.someIn(arr, isGreaterThan10)).toBe(true);
            expect(isGreaterThan10.calls.count()).toBe(3);
            expect(lamb.some(isGreaterThan10)(arr)).toBe(true);
            expect(isGreaterThan10.calls.count()).toBe(6);
        });

        it("should treat \"truthy\" and \"falsy\" values returned by predicates as booleans", function () {
            expect(lamb.someIn("hello", isVowel)).toBe(true);
            expect(lamb.some(isVowel)("hello")).toBe(true);
            expect(lamb.someIn("hll", isVowel)).toBe(false);
            expect(lamb.some(isVowel)("hll")).toBe(false);
        });

        it("should not skip deleted or unassigned elements, unlike the native method", function () {
            var arr = Array(5);
            arr[2] = 99;

            expect(lamb.someIn(arr, lamb.isUndefined)).toBe(true);
            expect(lamb.some(lamb.isUndefined)(arr)).toBe(true);
        });

        it("should throw an exception if the predicate isn't a function or is missing", function () {
            ["foo", null, void 0, {}, [], /foo/, 1, NaN, true, new Date()].forEach(function (value) {
                expect(function () { lamb.someIn(arr, value); }).toThrow();
                expect(function () { lamb.some(value)(arr); }).toThrow();
            });

            expect(function () { lamb.someIn(arr); }).toThrow();
            expect(function () { lamb.some()(arr); }).toThrow();
        });

        it("should throw an exception if called without the data argument", function () {
            expect(lamb.some(isEven)).toThrow();
            expect(lamb.someIn).toThrow();
        });

        it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", function () {
            expect(function () { lamb.someIn(null, isEven, fakeContext); }).toThrow();
            expect(function () { lamb.someIn(void 0, isEven, fakeContext); }).toThrow();
            expect(function () { lamb.some(isEven)(null); }).toThrow();
            expect(function () { lamb.some(isEven)(void 0); }).toThrow();
        });

        it("should treat every other value as an empty array and return `false`", function () {
            [/foo/, 1, function () {}, NaN, true, new Date()].forEach(function (value) {
                expect(lamb.someIn(value, isEven, fakeContext)).toBe(false);
                expect(lamb.some(isEven)(value)).toBe(false);
            });
        });
    });
});
