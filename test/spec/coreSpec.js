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
            var r1 = fn();
            var r2 = fn();
            expect(r1).toBe(o);
            expect(r2).toBe(o);
            expect(r1).toBe(r2);
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

        it("should build a function returning \"undefined\" if no functions are passed", function () {
            expect(lamb.compose()()).toBeUndefined();
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
            expect(Array.prototype.map.calls.argsFor(0)).toEqual([double, fakeContext]);
        });
    });

    describe("identity", function () {
        it("should return the value received as argument", function () {
            expect(lamb.identity(0)).toBe(0);
            expect(lamb.identity("foo")).toBe("foo");
            expect(lamb.identity(null)).toBe(null);

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

        it("should make possible to create a partial application from another partial application", function () {
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
            var getID = lamb.partial(lamb.get, _, "id");
            expect(list.map(getID)).toEqual(["foo", "bar", "baz"]);
        });
    });
});
