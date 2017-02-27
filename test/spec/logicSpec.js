var commons = require("../commons.js");

var lamb = commons.lamb;

var nonFunctions = commons.vars.nonFunctions;
var valuesList = commons.vars.valuesList;

describe("lamb.logic", function () {
    var isEven = function (n) { return n % 2 === 0; };
    var isGreaterThanTwo = lamb.isGT(2);
    var isLessThanTen = lamb.isLT(10);

    // to check "truthy" and "falsy" values returned by predicates
    var hasEvens = function (array) { return ~lamb.findIndex(array, isEven); };
    var isVowel = function (char) { return ~"aeiouAEIOU".indexOf(char); };

    function Foo (value) {
        this.value = value;
    }

    Foo.prototype = {
        _safeValue: 99,
        value: 0,
        getSafeValue: function () {
            return this._safeValue;
        },
        getValue: function () {
            return typeof this.value === "number" ? this.value : void 0;
        },
        isEven: function () {
            return this.value % 2 === 0;
        },
        isPositive: function () {
            return this.value > 0;
        }
    };
    Foo.prototype.getIfPositiveOrGetSafe = lamb.condition(Foo.prototype.isPositive, Foo.prototype.getValue, Foo.prototype.getSafeValue);
    Foo.prototype.getIfPositiveOrUndefined = lamb.case(Foo.prototype.isPositive, Foo.prototype.getValue);
    Foo.prototype.getWhenPositiveOrElse = lamb.when(Foo.prototype.isPositive, Foo.prototype.getValue);
    Foo.prototype.getUnlessIsPositiveOrElse = lamb.unless(Foo.prototype.isPositive, Foo.prototype.getValue);
    Foo.prototype.isOdd = lamb.not(Foo.prototype.isEven);
    Foo.prototype.isPositiveEven = lamb.allOf(Foo.prototype.isEven, Foo.prototype.isPositive);
    Foo.prototype.isPositiveOrEven = lamb.anyOf(Foo.prototype.isEven, Foo.prototype.isPositive);

    describe("adapter", function () {
        it("should accept a series of functions and build another function that calls them one by one until a non-undefined value is returned", function () {
            var filterString = lamb.case(
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

        it("should not modify the functions' context", function () {
            var obj = {value: 5, getValue: lamb.adapter(Foo.prototype.getValue)};
            expect(obj.getValue()).toBe(5);
        });

        it("should not throw an exception if some parameter isn't a function if a previous function returned a non-undefined value", function () {
            nonFunctions.forEach(function (value) {
                expect(lamb.adapter(isEven, value)(2)).toBe(true);
            });
        });

        it("should build a function returning an exception if a parameter isn't a function and no previous function returned a non-unefined value", function () {
            var fn = function (v) { return isEven(v) ? true : void 0; };

            nonFunctions.forEach(function (value) {
                expect(function () { lamb.adapter(value, fn)(2); }).toThrow();
                expect(function () { lamb.adapter(fn, value)(3); }).toThrow();
            });
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

        it("should treat \"truthy\" and \"falsy\" values returned by predicates as booleans", function () {
            expect(lamb.allOf(hasEvens)([1, 3, 5, 7])).toBe(false);
            expect(lamb.allOf(hasEvens)([1, 2, 5, 7])).toBe(true);
            expect(lamb.allOf(isVowel)("b")).toBe(false);
            expect(lamb.allOf(isVowel)("a")).toBe(true);
        });

        it("should keep the predicate context", function () {
            expect(new Foo(6).isPositiveEven()).toBe(true);
            expect(new Foo(5).isPositiveEven()).toBe(false);
        });

        it("should return `true` for any value if not supplied with predicates because of vacuous truth", function () {
            valuesList.forEach(function (value) {
                expect(lamb.allOf()(value)).toBe(true);
            });
        });

        it("should build a function returning an exception if any given predicate isn't a function", function () {
            nonFunctions.forEach(function (value) {
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

        it("should treat \"truthy\" and \"falsy\" values returned by predicates as booleans", function () {
            expect(lamb.anyOf(hasEvens)([1, 3, 5, 7])).toBe(false);
            expect(lamb.anyOf(hasEvens)([1, 2, 5, 7])).toBe(true);
            expect(lamb.anyOf(isVowel)("b")).toBe(false);
            expect(lamb.anyOf(isVowel)("a")).toBe(true);
        });

        it("should keep the predicate context", function () {
            expect(new Foo(5).isPositiveOrEven()).toBe(true);
            expect(new Foo(-5).isPositiveOrEven()).toBe(false);
        });

        it("should return `false` for any value if not supplied with predicates", function () {
            valuesList.forEach(function (value) {
                expect(lamb.anyOf()(value)).toBe(false);
            });
        });

        it("should not throw an exception if some predicate isn't a function if a previous predicate satisfies the condition", function () {
            nonFunctions.forEach(function (value) {
                expect(lamb.anyOf(isEven, value)(2)).toBe(true);
            });
        });

        it("should build a function returning an exception if a predicate isn't a function and the condition isn't satisfied yet", function () {
            nonFunctions.forEach(function (value) {
                expect(function () { lamb.anyOf(value, isEven)(2); }).toThrow();
                expect(function () { lamb.anyOf(isEven, value)(3); }).toThrow();
            });
        });
    });

    describe("areSame / is", function () {
        it("should verify the equality of two values", function () {
            var o = {foo: "bar"};

            expect(lamb.areSame(o, o)).toBe(true);
            expect(lamb.areSame(o, {foo: "bar"})).toBe(false);
            expect(lamb.areSame(42, 42)).toBe(true);
            expect(lamb.areSame([], [])).toBe(false);
            expect(lamb.areSame(0, -0)).toBe(false);
            expect(lamb.areSame(NaN, NaN)).toBe(true);

            expect(lamb.is(o)(o)).toBe(true);
            expect(lamb.is(o)({foo: "bar"})).toBe(false);
            expect(lamb.is(42)(42)).toBe(true);
            expect(lamb.is([])([])).toBe(false);
            expect(lamb.is(0)(-0)).toBe(false);
            expect(lamb.is(NaN)(NaN)).toBe(true);
        });
    });

    describe("areSVZ / isSVZ", function () {
        it("should verify the equality of two values using the \"SameValueZero\" comparison", function () {
            var o = {foo: "bar"};

            expect(lamb.areSVZ(o, o)).toBe(true);
            expect(lamb.areSVZ(o, {foo: "bar"})).toBe(false);
            expect(lamb.areSVZ(42, 42)).toBe(true);
            expect(lamb.areSVZ([], [])).toBe(false);
            expect(lamb.areSVZ(0, -0)).toBe(true);
            expect(lamb.areSVZ(NaN, NaN)).toBe(true);

            expect(lamb.isSVZ(o)(o)).toBe(true);
            expect(lamb.isSVZ(o)({foo: "bar"})).toBe(false);
            expect(lamb.isSVZ(42)(42)).toBe(true);
            expect(lamb.isSVZ([])([])).toBe(false);
            expect(lamb.isSVZ(0)(-0)).toBe(true);
            expect(lamb.isSVZ(NaN)(NaN)).toBe(true);
        });
    });

    describe("case / condition", function () {
        var halve = lamb.divideBy(2);
        var isGreaterThan5 = lamb.isGT(5);
        var halveIfGreaterThan5 = lamb.condition(isGreaterThan5, halve, lamb.identity);

        describe("case", function () {
            it("should call the received function if the predicate is satisfied by the same arguments", function () {
                expect(lamb.case(isGreaterThan5, halve)(10)).toBe(5);
            });

            it("should build a function that returns `undefined` if the predicate isn't satisfied", function () {
                expect(lamb.case(isGreaterThan5, halve)(3)).toBeUndefined();
            });
        });

        describe("condition", function () {
            it("should build a function that conditionally executes the received functions evaluating a predicate", function () {
                expect(halveIfGreaterThan5(3)).toBe(3);
                expect(halveIfGreaterThan5(10)).toBe(5);
            });

            it("should build a function throwing an exception if `falseFn` isn't a function or is missing", function () {
                nonFunctions.forEach(function (value) {
                    expect(lamb.condition(lamb.always(false), lamb.always(99), value)).toThrow();
                });

                expect(lamb.condition(lamb.always(false), lamb.always(99))).toThrow();
            });
        });

        it("should pass all the received arguments to both the predicate and the chosen branching function", function () {
            var satisfiedPredicate = jasmine.createSpy().and.returnValue(true);
            var notSatisfiedPredicate = jasmine.createSpy().and.returnValue(false);

            var condA = lamb.condition(satisfiedPredicate, lamb.list, lamb.always([]));
            var condB = lamb.condition(notSatisfiedPredicate, lamb.always([]), lamb.list);
            var caseA = lamb.case(satisfiedPredicate, lamb.list);
            var caseB = lamb.case(notSatisfiedPredicate, lamb.always([]))

            expect(condA(1, 2, 3, 4)).toEqual([1, 2, 3, 4]);
            expect(condB(5, 6, 7)).toEqual([5, 6, 7]);
            expect(caseA(8, 9, 10)).toEqual([8, 9, 10]);
            expect(caseB(11, 12)).toBeUndefined();

            expect(satisfiedPredicate.calls.count()).toBe(2);
            expect(satisfiedPredicate.calls.argsFor(0)).toEqual([1, 2, 3, 4]);
            expect(satisfiedPredicate.calls.argsFor(1)).toEqual([8, 9, 10]);

            expect(notSatisfiedPredicate.calls.count()).toBe(2);
            expect(notSatisfiedPredicate.calls.argsFor(0)).toEqual([5, 6, 7]);
            expect(notSatisfiedPredicate.calls.argsFor(1)).toEqual([11, 12]);
        });

        it("should treat \"truthy\" and \"falsy\" values returned by predicates as booleans", function () {
            var condA = lamb.condition(hasEvens, lamb.always("yes"), lamb.always("no"));
            var condB = lamb.condition(isVowel, lamb.always("yes"), lamb.always("no"));
            var caseA = lamb.case(hasEvens, lamb.always("yes"));
            var caseB = lamb.case(isVowel, lamb.always("yes"));

            expect(condA([1, 2, 5, 7])).toBe("yes");
            expect(condA([1, 3, 5, 7])).toBe("no");
            expect(condB("a")).toBe("yes");
            expect(condB("b")).toBe("no");

            expect(caseA([1, 2, 5, 7])).toBe("yes");
            expect(caseA([1, 3, 5, 7])).toBeUndefined();
            expect(caseB("a")).toBe("yes");
            expect(caseB("b")).toBeUndefined();
        });

        it("should keep the functions' context", function () {
            expect(new Foo(55).getIfPositiveOrGetSafe()).toBe(55);
            expect(new Foo(-55).getIfPositiveOrGetSafe()).toBe(99);

            expect(new Foo(55).getIfPositiveOrUndefined()).toBe(55);
            expect(new Foo(-55).getIfPositiveOrUndefined()).toBeUndefined();
        });

        it("should build a function throwing an exception if the predicate isn't a function", function () {
            nonFunctions.forEach(function (value) {
                expect(lamb.condition(value, lamb.always(99))).toThrow();
                expect(lamb.case(value, lamb.always(99))).toThrow();
            });
        });

        it("should build a function throwing an exception if `trueFn` isn't a function or is missing", function () {
            nonFunctions.forEach(function (value) {
                expect(lamb.condition(lamb.always(true), value, lamb.always(99))).toThrow();
                expect(lamb.case(lamb.always(true), value)).toThrow();
            });

            expect(lamb.condition(lamb.always(true))).toThrow();
            expect(lamb.case(lamb.always(true))).toThrow();
        });

        it("should build a function throwing an exception if called without arguments", function () {
            expect(lamb.condition()).toThrow();
            expect(lamb.case()).toThrow();
        });
    });

    describe("comparison operators", function () {
        var d1 = new Date(2010, 11, 2);
        var d2 = new Date(2010, 11, 3);
        var d3 = new Date(2010, 11, 2);

        describe("gt / isGT", function () {
            it("should verify if the first argument is greater than the second", function () {
                expect(lamb.gt(2, 1)).toBe(true);
                expect(lamb.gt(1, 2)).toBe(false);
                expect(lamb.gt(2, 2)).toBe(false);
                expect(lamb.gt(true, false)).toBe(true);
                expect(lamb.gt(d2, d1)).toBe(true);
                expect(lamb.gt("a", "A")).toBe(true);
                expect(lamb.gt("", "a")).toBe(false);

                expect(lamb.isGT(1)(2)).toBe(true);
                expect(lamb.isGT(2)(1)).toBe(false);
                expect(lamb.isGT(2)(2)).toBe(false);
                expect(lamb.isGT(false)(true)).toBe(true);
                expect(lamb.isGT(d1)(d2)).toBe(true);
                expect(lamb.isGT("A")("a")).toBe(true);
                expect(lamb.isGT("a")("")).toBe(false);
            });
        });

        describe("gte / isGTE", function () {
            it("should verify if the first argument is greater than or equal to the second", function () {
                expect(lamb.gte(2, 1)).toBe(true);
                expect(lamb.gte(1, 2)).toBe(false);
                expect(lamb.gte(2, 2)).toBe(true);
                expect(lamb.gte(true, false)).toBe(true);
                expect(lamb.gte(d2, d1)).toBe(true);
                expect(lamb.gte(d1, d3)).toBe(true);
                expect(lamb.gte("a", "A")).toBe(true);
                expect(lamb.gte("", "a")).toBe(false);

                expect(lamb.isGTE(1)(2)).toBe(true);
                expect(lamb.isGTE(2)(1)).toBe(false);
                expect(lamb.isGTE(2)(2)).toBe(true);
                expect(lamb.isGTE(false)(true)).toBe(true);
                expect(lamb.isGTE(d1)(d2)).toBe(true);
                expect(lamb.isGTE(d3)(d1)).toBe(true);
                expect(lamb.isGTE("A")("a")).toBe(true);
                expect(lamb.isGTE("a")("")).toBe(false);
            });
        });

        describe("lt / isLT", function () {
            it("should verify if the first argument is less than the second", function () {
                expect(lamb.lt(2, 1)).toBe(false);
                expect(lamb.lt(1, 2)).toBe(true);
                expect(lamb.lt(2, 2)).toBe(false);
                expect(lamb.lt(true, false)).toBe(false);
                expect(lamb.lt(d2, d1)).toBe(false);
                expect(lamb.lt("a", "A")).toBe(false);
                expect(lamb.lt("", "a")).toBe(true);

                expect(lamb.isLT(1)(2)).toBe(false);
                expect(lamb.isLT(2)(1)).toBe(true);
                expect(lamb.isLT(2)(2)).toBe(false);
                expect(lamb.isLT(false)(true)).toBe(false);
                expect(lamb.isLT(d1)(d2)).toBe(false);
                expect(lamb.isLT("A")("a")).toBe(false);
                expect(lamb.isLT("a")("")).toBe(true);
            });
        });

        describe("lte / isLTE", function () {
            it("should verify if the first argument is less than or equal to the second", function () {
                expect(lamb.lte(2, 1)).toBe(false);
                expect(lamb.lte(1, 2)).toBe(true);
                expect(lamb.lte(2, 2)).toBe(true);
                expect(lamb.lte(true, false)).toBe(false);
                expect(lamb.lte(d2, d1)).toBe(false);
                expect(lamb.lte(d1, d3)).toBe(true);
                expect(lamb.lte("a", "A")).toBe(false);
                expect(lamb.lte("", "a")).toBe(true);

                expect(lamb.isLTE(1)(2)).toBe(false);
                expect(lamb.isLTE(2)(1)).toBe(true);
                expect(lamb.isLTE(2)(2)).toBe(true);
                expect(lamb.isLTE(false)(true)).toBe(false);
                expect(lamb.isLTE(d1)(d2)).toBe(false);
                expect(lamb.isLTE(d3)(d1)).toBe(true);
                expect(lamb.isLTE("A")("a")).toBe(false);
                expect(lamb.isLTE("a")("")).toBe(true);
            });
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
            nonFunctions.forEach(function (value) {
                expect(lamb.not(value)).toThrow();
            });

            expect(lamb.not()).toThrow();
        });
    });

    describe("unless / when", function () {
        var increment = lamb.add(1);
        var incArray = lamb.mapWith(increment);
        var a1 = [1, 3, 5];
        var a2 = [1, 4, 5];

        it("should build a function that conditionally applies its `fn` parameter to the received value depending on the evaluation of a predicate", function () {
            expect(lamb.unless(isEven, increment)(5)).toBe(6);
            expect(lamb.when(isEven, increment)(4)).toBe(5);
        });

        it("should build a function returning the received value when the desired condition is not met", function () {
            expect(lamb.unless(isEven, increment)(6)).toBe(6);
            expect(lamb.when(isEven, increment)(5)).toBe(5);
        });

        it("should treat \"truthy\" and \"falsy\" values returned by predicates as booleans", function () {
            expect(lamb.unless(hasEvens, incArray)(a1)).toEqual([2, 4, 6]);
            expect(lamb.unless(hasEvens, incArray)(a2)).toBe(a2);
            expect(lamb.when(hasEvens, incArray)(a1)).toBe(a1);
            expect(lamb.when(hasEvens, incArray)(a2)).toEqual([2, 5, 6]);
        });

        it("should build a unary function and ignore extra arguments", function () {
            var incSpy = jasmine.createSpy().and.callFake(increment);
            var isEvenSpy = jasmine.createSpy().and.callFake(isEven);
            var incUnlessEven = lamb.unless(isEvenSpy, incSpy);
            var incWhenEven = lamb.when(isEvenSpy, incSpy);

            expect(incUnlessEven.length).toBe(1);
            expect(incUnlessEven(5, 6, 7)).toBe(6);
            expect(incUnlessEven(6, 7, 8)).toBe(6);

            expect(incWhenEven.length).toBe(1);
            expect(incWhenEven(4, 5)).toBe(5);
            expect(incWhenEven(5, 6)).toBe(5);

            expect(isEvenSpy.calls.count()).toBe(4);
            expect(isEvenSpy.calls.argsFor(0)).toEqual([5]);
            expect(isEvenSpy.calls.argsFor(1)).toEqual([6]);
            expect(isEvenSpy.calls.argsFor(2)).toEqual([4]);
            expect(isEvenSpy.calls.argsFor(3)).toEqual([5]);

            expect(incSpy.calls.count()).toBe(2);
            expect(incSpy.calls.argsFor(0)).toEqual([5]);
            expect(incSpy.calls.argsFor(1)).toEqual([4]);
        });

        it("should keep the functions' context", function () {
            var positiveFoo = new Foo(33);
            var negativeFoo = new Foo(-33);

            expect(positiveFoo.getWhenPositiveOrElse(88)).toBe(33);
            expect(negativeFoo.getWhenPositiveOrElse(88)).toBe(88);
            expect(positiveFoo.getUnlessIsPositiveOrElse(-88)).toBe(-88);
            expect(negativeFoo.getUnlessIsPositiveOrElse(-88)).toBe(-33);
        });

        it("should build a function throwing an exception if the predicate isn't a function", function () {
            nonFunctions.forEach(function (value) {
                expect(function () { lamb.unless(value, increment)(5); }).toThrow();
                expect(function () { lamb.when(value, increment)(2); }).toThrow();
            });
        });

        it("should not throw an exception if the transformer isn't a function and the conditions aren't met", function () {
            nonFunctions.forEach(function (value) {
                expect(lamb.unless(isEven, value)(2)).toBe(2);
                expect(lamb.when(isEven, value)(5)).toBe(5);
            });
        });

        it("should build a function throwing an exception if the transformer isn't a function and the conditions are met", function () {
            nonFunctions.forEach(function (value) {
                expect(function () { lamb.unless(isEven, value)(5); }).toThrow();
                expect(function () { lamb.when(isEven, value)(2); }).toThrow();
            });
        });

        it("should build a function throwing an exception if called without arguments", function () {
            expect(lamb.unless()).toThrow();
            expect(lamb.when()).toThrow();
        });
    });
});
