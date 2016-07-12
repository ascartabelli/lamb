var lamb = require("../../dist/lamb.js");

describe("lamb.array_basics", function () {
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
});
