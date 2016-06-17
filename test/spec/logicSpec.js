var lamb = require("../../dist/lamb.js");

describe("lamb.logic", function () {
    var isEven = function (n) { return n % 2 === 0; };
    var isGreaterThanTwo = function (n) { return n > 2; };
    var isLessThanTen = function (n) { return n < 10; };

    function Foo (value) {
        this.value = value;
    }

    Foo.prototype = {
        value: 0,
        isEven: function () {
            return this.value % 2 === 0;
        },
        isPositive: function () {
            return this.value > 0;
        }
    };
    Foo.prototype.isOdd = lamb.not(Foo.prototype.isEven);
    Foo.prototype.isPositiveEven = lamb.allOf(Foo.prototype.isEven, Foo.prototype.isPositive);
    Foo.prototype.isPositiveOrEven = lamb.anyOf(Foo.prototype.isEven, Foo.prototype.isPositive);


    describe("adapter", function () {
        it("should accept a series of functions and build another function that calls them one by one until a non-undefined value is returned", function () {
            var isEven = function (n) { return n % 2 === 0; };
            var filterString = lamb.condition(
                lamb.isType("String"),
                lamb.compose(lamb.invoker("join", ""), lamb.filter)
            );
            var filterAdapter = lamb.adapter(lamb.invoker("filter"), filterString);

            expect(filterAdapter([1, 2, 3, 4, 5, 6], isEven)).toEqual([2, 4, 6]);
            expect(filterAdapter("123456", isEven)).toBe("246");
            expect(filterAdapter({}, isEven)).toBeUndefined();

            var filterWithDefault = lamb.adapter(filterAdapter, lamb.always("Not implemented"));
            expect(filterWithDefault([1, 2, 3, 4, 5, 6], isEven)).toEqual([2, 4, 6]);
            expect(filterWithDefault("123456", isEven)).toBe("246");
            expect(filterWithDefault({}, isEven)).toBe("Not implemented");
        });
    });

    describe("allOf", function () {
        it("should return true if all the given predicates are satisfied", function () {
            var check = lamb.allOf(isEven, isGreaterThanTwo, isLessThanTen);
            expect([4, 6, 8].map(check)).toEqual([true, true, true]);
        });

        it("should return false if one the given predicates isn't satisfied", function () {
            var check = lamb.allOf(isEven, isGreaterThanTwo, isLessThanTen);
            expect([2, 3, 16].map(check)).toEqual([false, false, false]);
        });

        it("should keep the predicate context", function () {
            expect(new Foo(6).isPositiveEven()).toBe(true);
            expect(new Foo(5).isPositiveEven()).toBe(false);
        });

        it("should return `true` for any value if not supplied with predicates because of vacuous truth", function () {
            ["foo", null, void 0, {}, [], /foo/, 1, NaN, true, new Date()].forEach(function (value) {
                expect(lamb.allOf()(value)).toBe(true);
            });
        });

        it("should build a function returning an exception if any given predicate isn't a function", function () {
            ["foo", null, void 0, {}, [], /foo/, 1, NaN, true, new Date()].forEach(function (value) {
                expect(function () { lamb.allOf(value, isEven)(2); }).toThrow();
                expect(function () { lamb.allOf(isEven, value)(2); }).toThrow();
            });
        });
    });

    describe("anyOf", function () {
        it("should return true if at least one of the given predicates is satisfied", function () {
            var check = lamb.anyOf(isEven, isGreaterThanTwo, isLessThanTen);
            expect([33, 44, 5].map(check)).toEqual([true, true, true]);
        });

        it("should return false if none of the given predicates is satisfied", function () {
            var check = lamb.anyOf(isEven, isLessThanTen);
            expect([33, 35, 55].map(check)).toEqual([false, false, false]);
        });

        it("should keep the predicate context", function () {
            expect(new Foo(5).isPositiveOrEven()).toBe(true);
            expect(new Foo(-5).isPositiveOrEven()).toBe(false);
        });

        it("should return `false` for any value if not supplied with predicates", function () {
            ["foo", null, void 0, {}, [], /foo/, 1, NaN, true, new Date()].forEach(function (value) {
                expect(lamb.anyOf()(value)).toBe(false);
            });
        });

        it("should not throw an exception if some predicate isn't a function if a previous predicate satisfies the condition", function () {
            ["foo", null, void 0, {}, [], /foo/, 1, NaN, true, new Date()].forEach(function (value) {
                expect(lamb.anyOf(isEven, value)(2)).toBe(true);
            });
        });

        it("should build a function returning an exception if a predicate isn't a function and the condition isn't satisfied yet", function () {
            ["foo", null, void 0, {}, [], /foo/, 1, NaN, true, new Date()].forEach(function (value) {
                expect(function () { lamb.anyOf(value, isEven)(2); }).toThrow();
                expect(function () { lamb.anyOf(isEven, value)(3); }).toThrow();
            });
        });
    });

    describe("condition", function () {
        it("should build a function that conditionally executes the received functions evaluating a predicate", function () {
            var halve = lamb.partial(lamb.multiply, .5);
            var isGreaterThan5 = lamb.partial(lamb.isGT, lamb, 5);
            var halveIfGreaterThan5 = lamb.condition(isGreaterThan5, halve, lamb.identity);

            expect(halveIfGreaterThan5(3)).toBe(3);
            expect(halveIfGreaterThan5(10)).toBe(5);
            expect(lamb.condition(isGreaterThan5, halve)(3)).toBeUndefined();
        });
    });

    describe("is", function () {
        it("should verify the equality of two values", function () {
            var o = {foo: "bar"};

            expect(lamb.is(o, o)).toBe(true);
            expect(lamb.is(o, {foo: "bar"})).toBe(false);
            expect(lamb.is(42, 42)).toBe(true);
            expect(lamb.is([], [])).toBe(false);
            expect(lamb.is(0, -0)).toBe(false);
            expect(lamb.is(NaN, NaN)).toBe(true);
        });
    });

    describe("comparison operators", function () {
        var d1 = new Date(2010, 11, 2);
        var d2 = new Date(2010, 11, 3);
        var d3 = new Date(2010, 11, 2);

        describe("isGT", function () {
            it("should verify if the first argument is greater than the second", function () {
                expect(lamb.isGT(2, 1)).toBe(true);
                expect(lamb.isGT(1, 2)).toBe(false);
                expect(lamb.isGT(2, 2)).toBe(false);
                expect(lamb.isGT(true, false)).toBe(true);
                expect(lamb.isGT(d2, d1)).toBe(true);
                expect(lamb.isGT("a", "A")).toBe(true);
                expect(lamb.isGT("", "a")).toBe(false);
            });
        });

        describe("isGTE", function () {
            it("should verify if the first argument is greater than or equal to the second", function () {
                expect(lamb.isGTE(2, 1)).toBe(true);
                expect(lamb.isGTE(1, 2)).toBe(false);
                expect(lamb.isGTE(2, 2)).toBe(true);
                expect(lamb.isGTE(true, false)).toBe(true);
                expect(lamb.isGTE(d2, d1)).toBe(true);
                expect(lamb.isGTE(d1, d3)).toBe(true);
                expect(lamb.isGTE("a", "A")).toBe(true);
                expect(lamb.isGTE("", "a")).toBe(false);
            });
        });

        describe("isLT", function () {
            it("should verify if the first argument is less than the second", function () {
                expect(lamb.isLT(2, 1)).toBe(false);
                expect(lamb.isLT(1, 2)).toBe(true);
                expect(lamb.isLT(2, 2)).toBe(false);
                expect(lamb.isLT(true, false)).toBe(false);
                expect(lamb.isLT(d2, d1)).toBe(false);
                expect(lamb.isLT("a", "A")).toBe(false);
                expect(lamb.isLT("", "a")).toBe(true);
            });
        });

        describe("isLTE", function () {
            it("should verify if the first argument is less than or equal to the second", function () {
                expect(lamb.isLTE(2, 1)).toBe(false);
                expect(lamb.isLTE(1, 2)).toBe(true);
                expect(lamb.isLTE(2, 2)).toBe(true);
                expect(lamb.isLTE(true, false)).toBe(false);
                expect(lamb.isLTE(d2, d1)).toBe(false);
                expect(lamb.isLTE(d1, d3)).toBe(true);
                expect(lamb.isLTE("a", "A")).toBe(false);
                expect(lamb.isLTE("", "a")).toBe(true);
            });
        });
    });

    describe("isNot", function () {
        it("should verify that two values are different from each other", function () {
            var o = {foo: "bar"};

            expect(lamb.isNot(o, o)).toBe(false);
            expect(lamb.isNot(o, {foo: "bar"})).toBe(true);
            expect(lamb.isNot(42, 42)).toBe(false);
            expect(lamb.isNot([], [])).toBe(true);
            expect(lamb.isNot(0, -0)).toBe(true);
            expect(lamb.isNot(NaN, NaN)).toBe(false);
        });
    });

    describe("isSVZ", function () {
        it("should verify the equality of two values using the \"SameValueZero\" comparison", function () {
            var o = {foo: "bar"};

            expect(lamb.isSVZ(o, o)).toBe(true);
            expect(lamb.isSVZ(o, {foo: "bar"})).toBe(false);
            expect(lamb.isSVZ(42, 42)).toBe(true);
            expect(lamb.isSVZ([], [])).toBe(false);
            expect(lamb.isSVZ(0, -0)).toBe(true);
            expect(lamb.isSVZ(NaN, NaN)).toBe(true);
        });
    });

    describe("not", function () {
        it("should reverse the truthiness of the given predicate", function () {
            var isOdd = lamb.not(isEven);

            expect(isOdd(3)).toBe(true);
        });

        it("should keep the predicate context", function () {
            expect(new Foo(4).isOdd()).toBe(false);
            expect(new Foo(5).isOdd()).toBe(true);
        });

        it("should build a function returning an exception if the given predicate is missing or isn't a function", function () {
            ["foo", null, void 0, {}, [], /foo/, 1, NaN, true, new Date()].forEach(function (value) {
                expect(lamb.not(value)).toThrow();
            });

            expect(lamb.not()).toThrow();
        });
    });
});
