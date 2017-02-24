var commons = require("../commons.js");

var lamb = commons.lamb;

var nonArrayLikes = commons.vars.nonArrayLikes;
var nonFunctions = commons.vars.nonFunctions;

describe("lamb.core", function () {
    describe("_version", function () {
        it("should equal the package.json version", function () {
            expect(lamb._version).toBe(require("../../package.json").version);
        });
    });

    describe("always", function () {
        it("should return a function that returns a constant value", function () {
            var o = {a: 1};
            var fn = lamb.always(o);
            var r1 = fn("foo");
            var r2 = fn();
            expect(r1).toBe(o);
            expect(r2).toBe(o);
            expect(r1).toBe(r2);
        });

        it("should build a function returning `undefined` if called without arguments", function () {
            expect(lamb.always()()).toBeUndefined();
        });
    });

    describe("compose", function () {
        var double = function (n) { return n * 2; };
        var cube = function (n) { return Math.pow(n, 3); };
        var changeSign = function (n) { return -n; };

        it("should return a function that is the composition of a list of functions, each consuming the return value of the function that follows", function () {
            var composed = lamb.compose(double, cube, changeSign);

            expect(composed(2)).toBe(-16);
        });

        it("should be possible to reuse composed functions", function () {
            var cubeAndDouble = lamb.compose(double, cube);
            var fn1 = lamb.compose(double, cube, cubeAndDouble);
            var fn2 = lamb.compose(cubeAndDouble, cubeAndDouble);

            expect(fn1(5)).toBe(31250000);
            expect(fn2(5)).toBe(31250000);
        });

        it("should behave like the received function if only one function is supplied", function () {
            var fn = function (a, b, c) { return a - b - c; };

            expect(lamb.compose(fn)(5, 4, 3)).toBe(-2);
        });

        it("should behave like `identity` if no functions are passed", function () {
            var obj = {};

            expect(lamb.compose()(obj)).toBe(obj);
            expect(lamb.compose()()).toBeUndefined();
            expect(lamb.compose()(2, 3, 4)).toBe(2);
        });

        it("should build a function throwing an exception if any parameter is not a function", function () {
            nonFunctions.forEach(function (value) {
                expect(lamb.compose(lamb.identity, value)).toThrow();
                expect(lamb.compose(value, lamb.identity)).toThrow();
            });
        });
    });

    describe("generic", function () {
        it("should create a generic function out of an object method", function () {
            spyOn(Array.prototype, "map").and.callThrough();

            var fakeContext = {};
            var double = function (n) {
                expect(this).toBe(fakeContext);
                return n * 2;
            };
            var numbers = [1, 2, 3, 4, 5];
            var map = lamb.generic(Array.prototype.map);

            expect(map(numbers, double, fakeContext)).toEqual([2, 4, 6, 8, 10]);
            expect(Array.prototype.map.calls.count()).toBe(1);
            expect(Array.prototype.map.calls.first().object).toBe(numbers);
            expect(Array.prototype.map.calls.argsFor(0)[0]).toBe(double);
            expect(Array.prototype.map.calls.argsFor(0)[1]).toBe(fakeContext);
        });

        it("should build a function throwing an exception if called without arguments or if `method` isn't a function", function () {
            nonFunctions.forEach(function (value) {
                expect(lamb.generic(value)).toThrow();
            });

            expect(lamb.generic()).toThrow();
        });
    });

    describe("identity", function () {
        it("should return the value received as argument", function () {
            expect(lamb.identity(0)).toBe(0);
            expect(lamb.identity("foo")).toBe("foo");
            expect(lamb.identity(null)).toBe(null);
            expect(lamb.identity()).toBeUndefined();

            var someRefType = {"foo" : 5};
            expect(lamb.identity(someRefType)).toBe(someRefType);
        });
    });

    describe("partial", function () {
        var fooSubtract = function (a, b, c, d, e) {
            return a - b - c - d - e;
        };
        var _ = lamb;

        it("should return a partially applied function using the given arguments", function () {
            var partialFooSubtract = lamb.partial(fooSubtract, [1, 2, 3]);

            expect(partialFooSubtract(4, 5)).toBe(-13);
        });

        it("should accept placeholders as arguments", function () {
            var partialFooSubtract = lamb.partial(fooSubtract, [_, _, 3, _, 5]);

            expect(partialFooSubtract(1, 2, 4)).toBe(-13);
        });

        it("should be possible to create a partial application from another partial application", function () {
            var partialFooSubtract = lamb.partial(fooSubtract, [_, 2, _, 4]);
            var partialFooSubtract2 = lamb.partial(partialFooSubtract, [1, _, 5]);

            expect(partialFooSubtract2(3)).toBe(-13);
        });

        it("should give an undefined value to unfilled placeholders", function () {
            var foo = lamb.partial(lamb.list, [_, 2, _, 3, _, 5, _]);

            expect(foo(1)).toEqual([1, 2, void 0, 3, void 0, 5, void 0]);
        });

        it("should be safe to call the partial application multiple times with different values for unfilled placeholders", function () {
            var list = [{"id" : "foo"}, {"id" : "bar"}, {"id" : "baz"}];
            var getID = lamb.partial(lamb.getIn, [_, "id"]);
            expect(list.map(getID)).toEqual(["foo", "bar", "baz"]);
        });

        it("should pass all the received arguments to the partially applied function, even if they exceed the original function's arity", function () {
            function foo (a, b) {
                return a + b + arguments[2] + arguments[3];
            }

            expect(lamb.partial(foo, [2, _, _, 1])(3, 4)).toBe(10);
        });

        it("should preserve the function's context", function () {
            var fn = function (a, b) {
                this.values.push(a - b);
            };

            var obj = {
                values: [1, 2, 3],
                foo: lamb.partial(fn, [4, _]),
                bar: lamb.partial(fn, [_, 4])
            };

            obj.foo(5);
            expect(obj.values).toEqual([1, 2, 3, -1]);

            obj.bar(5);
            expect(obj.values).toEqual([1, 2, 3, -1, 1]);
        });

        it("should consider non-arrays received as the `args` parameter as empty arrays", function () {
            var divideSpy = jasmine.createSpy().and.callFake(lamb.divide);

            nonArrayLikes.forEach(function (value, idx) {
                expect(lamb.partial(divideSpy, value)(5, 4)).toBe(1.25);
                expect(divideSpy.calls.argsFor(idx)).toEqual([5, 4]);
            });

            expect(lamb.partial(divideSpy)(5, 4)).toBe(1.25);
            expect(divideSpy.calls.argsFor(nonArrayLikes.length)).toEqual([5, 4]);
            expect(divideSpy.calls.count()).toBe(nonArrayLikes.length + 1);
        });

        it("should build a function throwing an exception if called without arguments or if `fn` isn't a function", function () {
            nonFunctions.forEach(function (value) {
                expect(lamb.partial(value)).toThrow();
            });

            expect(lamb.partial()).toThrow();
        });
    });
});
