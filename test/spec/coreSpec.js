var lamb = require("../../dist/lamb.js");

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
        it("should return a function that is the composition of a list of functions, each consuming the return value of the function that follows", function () {
            var double = function (n) { return n * 2; };
            var cube = function (n) { return Math.pow(n, 3); };
            var changeSign = function (n) { return -n; };
            var composed = lamb.compose(double, cube, changeSign);

            expect(composed(2)).toBe(-16);
        });

        it("should build a function returning `undefined` if no functions are passed", function () {
            expect(lamb.compose()()).toBeUndefined();
        });
        
        it("should build a function throwing an exception if any parameter is not a function", function () {
            [void 0, null, {}, [1, 2], "foo", /foo/, 1, NaN, true, new Date()].forEach(function (value) {
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
            [void 0, null, {}, [1, 2], "foo", /foo/, 1, NaN, true, new Date()].forEach(function (value) {
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
            var partialFooSubtract = lamb.partial(fooSubtract, 1, 2, 3);

            expect(partialFooSubtract(4, 5)).toBe(-13);
        });

        it("should accept placeholders as arguments", function () {
            var partialFooSubtract = lamb.partial(fooSubtract, _, _, 3, _, 5);

            expect(partialFooSubtract(1, 2, 4)).toBe(-13);
        });

        it("should be possible to create a partial application from another partial application", function () {
            var partialFooSubtract = lamb.partial(fooSubtract, _, 2, _, 4);
            var partialFooSubtract2 = lamb.partial(partialFooSubtract, 1, _, 5);

            expect(partialFooSubtract2(3)).toBe(-13);
        });

        it("should give an undefined value to unfilled placeholders", function () {
            var foo = lamb.partial(function () {
                return lamb.slice(arguments);
            }, _, 2, 3, _, 5);

            expect(foo(1)).toEqual([1, 2, 3, undefined, 5]);
        });

        it("should be safe to call the partial application multiple times with different values for unfilled placeholders", function () {
            var list = [{"id" : "foo"}, {"id" : "bar"}, {"id" : "baz"}];
            var getID = lamb.partial(lamb.getIn, _, "id");
            expect(list.map(getID)).toEqual(["foo", "bar", "baz"]);
        });

        it("should pass all the received arguments, even if they exceed the original function's arity", function () {
            function foo (a, b) {
                return a + b + arguments[2] + arguments[3];
            }

            expect(lamb.partial(foo, 2, _, _, 1)(3,4)).toBe(10);
        });
        
        it("should build a function throwing an exception if called without arguments or if `fn` isn't a function", function () {
            [void 0, null, {}, [1, 2], "foo", /foo/, 1, NaN, true, new Date()].forEach(function (value) {
                expect(lamb.partial(value)).toThrow();
            });
            
            expect(lamb.partial()).toThrow();
        });
    });
});
