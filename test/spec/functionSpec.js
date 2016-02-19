var sinon = require("sinon");
var stub = sinon.stub;
var assert = sinon.assert;

var lamb = require("../../dist/lamb.js");

describe("lamb.function", function () {
    describe("apply", function () {
        it("should apply the passed function to the given arguments", function () {
            expect(lamb.apply(Math.max, [-1, 3, 2, 15, 7])).toBe(15);
        });

        it("should accept an array-like object as arguments for the function", function () {
            expect(lamb.apply(Math.max, "3412")).toBe(4);
        });

        it("should throw an error if no function is passed", function () {
            expect(function () {lamb.apply({}, [])}).toThrow();
            expect(function () {lamb.apply(null, [])}).toThrow();
        });

        it("should throw an error if no arguments are passed", function () {
            expect(function (){lamb.apply(function () {})}).toThrow();
        });
    });

    describe("applyArgs", function () {
        it("should build a curried version of `apply` expecting the arguments as first parameter", function () {
            var arr = [1, 2, 3, 4, 5, 6];
            var isEven = function (n) { return n % 2 === 0;};
            var applyArgsTo = lamb.applyArgs([arr, isEven]);

            expect(applyArgsTo(lamb.filter)).toEqual([2, 4, 6]);
            expect(applyArgsTo(lamb.map)).toEqual([false, true, false, true, false, true]);
        });
    });

    describe("aritize", function () {
        it("should change the arity of the given function to the specified value", function () {
            var maxArgument = function () { return Math.max.apply(null, arguments); };
            var maxArgumentSpy = jasmine.createSpy("maxArgument").and.callFake(maxArgument);
            var maxOfFirst3 = lamb.aritize(maxArgumentSpy, 3);

            expect(maxOfFirst3(0, 1, 2, 3, 4, 5)).toBe(2);
            expect(maxArgumentSpy.calls.argsFor(0)).toEqual([0, 1, 2]);
        });
    });

    describe("binary", function () {
        it("should build a function that passes only two arguments to the given one", function () {
            spyOn(lamb, "list").and.callThrough();

            var binaryList = lamb.binary(lamb.list);

            expect(binaryList.length).toBe(2);
            expect(binaryList(1, 2, 3)).toEqual([1, 2]);
            expect(lamb.list.calls.argsFor(0)).toEqual([1, 2]);
        });
    });

    describe("currying", function () {
        var fooSubtract = function (a, b, c) {
            return a - b - c;
        };
        var subtractSpy = jasmine.createSpy("fooSubtract").and.callFake(fooSubtract);

        afterEach(function () {
            subtractSpy.calls.reset();
        });

        describe("curry", function () {
            it("should allow currying by always returning a function with an arity of one", function () {
                var curriedSub = lamb.curry(fooSubtract);
                var curriedSpy = lamb.curry(subtractSpy, 3);

                expect(curriedSub(1)(2)(3)).toBe(-4);
                expect(curriedSub(1, 5)(2)(3)).toBe(-4);
                expect(curriedSpy()(1)()()(2)()(3)).toBe(-4);
                expect(subtractSpy.calls.count()).toBe(1);
            });

            it("should return reusable partially applied functions", function () {
                var subtractFromTen = lamb.curry(fooSubtract)(11)(1);

                expect(subtractFromTen(2)).toBe(8);
                expect(subtractFromTen(22)).toBe(-12);
            });

            it("should accept undefined arguments, but empty calls shouldn't consume the arity", function () {
                var curriedList = lamb.curry(lamb.list, 4);

                expect(curriedList("a", "z")()("b")("c")("d")).toEqual(["a", "b", "c", "d"]);
                expect(curriedList("a")(undefined)("c")()("d")).toEqual(["a", undefined, "c", "d"]);
                expect(curriedList("a")(undefined)("c")(undefined)).toEqual(["a", undefined, "c", undefined]);
            });
        });

        describe("curryRight", function () {
            it("should allow currying from the rightmost argument", function () {
                var rightCurriedSub = lamb.curryRight(fooSubtract);

                expect(rightCurriedSub(1, 5)(2)()(3)).toBe(0);
                expect(rightCurriedSub(1)(2)(3)).toBe(0);
            });

            it("should return reusable partially applied functions", function () {
                var minusTen = lamb.curryRight(fooSubtract)(5)(5);

                expect(minusTen(11)).toBe(1);
                expect(minusTen(21)).toBe(11);
            });
        });

        describe("curryable", function () {
            it("should build an \"auto-curried\" function that allows us to consume its arity in any moment", function () {
                var curriedSub = lamb.curryable(fooSubtract);
                var curriedSpy = lamb.curryable(subtractSpy, 3);

                expect(curriedSub(1, 2, 3)).toBe(-4);
                expect(curriedSub(5)(6)(7)).toBe(-8);
                expect(curriedSub(1)(2, 3)).toBe(-4);
                expect(curriedSpy()(1)()()(2, 3)).toBe(-4);
                expect(subtractSpy.calls.count()).toBe(1);
            });

            it("should return reusable partially applied functions", function () {
                var subtractFromTen = lamb.curryable(fooSubtract)(11, 1);

                expect(subtractFromTen(2)).toBe(8);
                expect(subtractFromTen(22)).toBe(-12);
            });

            it("should accept undefined arguments, but empty calls shouldn't consume the arity", function () {
                var curriedList = lamb.curryable(lamb.list, 4);

                expect(curriedList("a", "b")()("c")("d")).toEqual(["a", "b", "c", "d"]);
                expect(curriedList("a", undefined, "c")()("d")).toEqual(["a", undefined, "c", "d"]);
                expect(curriedList("a", undefined, "c")(undefined)).toEqual(["a", undefined, "c", undefined]);
            });

            it("should build a function equivalent to the given one, if it's variadic and with an arity of zero", function () {
                expect(lamb.curryable(lamb.list)(1, 2, 3)).toEqual(lamb.list(1, 2, 3));
                expect(lamb.curryable(lamb.list)(1, 2, 3, 4, 5), 0).toEqual(lamb.list(1, 2, 3, 4, 5));
            });
        });

        describe("curryableRight", function () {
            it("should build an \"auto-curried\" function and start currying from the rightmost argument", function () {
                var rightCurried = lamb.curryableRight(fooSubtract);

                expect(rightCurried(1, 2)()(3)).toBe(0);
                expect(rightCurried(1, 2, 3)).toBe(0);
            });

            it("should return reusable partially applied functions", function () {
                var minusTen = lamb.curryableRight(fooSubtract)(5, 5);

                expect(minusTen(11)).toBe(1);
                expect(minusTen(21)).toBe(11);
            });
        });
    });

    describe("debounce", function () {
        it("should return a function that will execute the given function only if it stops being called for the specified timespan", function () {
            var value = 0;
            var testFn = sinon.spy(function (n) { value += n; });
            var debounced = lamb.debounce(testFn, 100);
            var clock = sinon.useFakeTimers(Date.now());

            debounced(1);
            debounced(2);
            debounced(3);
            assert.notCalled(testFn);
            expect(value).toBe(0);
            clock.tick(101);
            assert.calledOnce(testFn);
            expect(value).toBe(3);
            clock.restore();
        });
    });

    describe("flip", function () {
        it("should return a function that applies its arguments to the original function in reverse order", function () {
            var appendTo = function (a, b) { return a + b; };
            var prependTo = lamb.flip(appendTo);
            expect(prependTo("foo", "bar")).toBe("barfoo");
        });
    });

    describe("invokerOn", function () {
        it("should accept an object and build a function expecting a method name to be called on such object with the given parameters", function () {
            var someArray = [1, 2, 3, 4, 5];
            var someString = "foo bar";
            var callOnSomeArray = lamb.invokerOn(someArray);
            var callOnSomeString = lamb.invokerOn(someString);

            spyOn(someArray, "slice").and.callThrough();
            spyOn(someArray, "join").and.callThrough();

            expect(callOnSomeArray("slice", 1, 3)).toEqual([2, 3]);
            expect(someArray.slice.calls.count()).toBe(1);
            expect(someArray.slice.calls.first().object).toBe(someArray);

            expect(callOnSomeArray("join", "")).toBe("12345");
            expect(someArray.join.calls.count()).toBe(1);
            expect(someArray.join.calls.first().object).toBe(someArray);

            expect(callOnSomeString("slice", 1, 3)).toBe("oo");
            expect(callOnSomeString("toUpperCase")).toBe("FOO BAR");
            expect(callOnSomeString("foo")).toBe(void 0);
        });
    });

    describe("invoker", function () {
        it("should build a function that will invoke the desired method on the given object", function () {
            var slice = lamb.invoker("slice");
            var someArray = [1, 2, 3, 4, 5];
            var someString = "foo bar";

            spyOn(someArray, "slice").and.callThrough();

            expect(slice(someArray, 1, 3)).toEqual([2, 3]);
            expect(someArray.slice.calls.count()).toBe(1);
            expect(someArray.slice.calls.first().object).toBe(someArray);
            expect(slice(someString, 1, 3)).toBe("oo");
            expect(slice(1)).toBe(void 0);
        });
    });

    describe("mapArgs", function () {
        it("should build a function that allows to map over the received arguments before applying them to the original one", function () {
            var double = lamb.partial(lamb.multiply, 2);

            expect(lamb.mapArgs(lamb.add, double)(5, 3)).toBe(16);
        });
    });

    describe("pipe", function () {
        it("should return a function that is the pipeline of the given ones", function () {
            var addOne = function (n) { return n + 1;};
            var subtractTwo = function (n) {return n - 2;};
            var double = function (n) {return n * 2};

            var pipeline = lamb.pipe(addOne, subtractTwo, double);
            expect(pipeline(0)).toBe(-2);
        });

        it("should build a function returning \"undefined\" if no functions are passed", function () {
            expect(lamb.pipe()()).toBeUndefined();
        });
    });

    describe("tapArgs", function () {
        var someObject = {count: 5};
        var someArrayData = [2, 3, 123, 5, 6, 7, 54, 65, 76, 0];

        it("should build a function that allows to tap into the arguments of the original one", function () {
            var getDataAmount = lamb.tapArgs(lamb.add, lamb.getKey("count"), lamb.getKey("length"));
            expect(getDataAmount(someObject, someArrayData)).toBe(15);
        });

        it("should use arguments as they are when tappers are missing", function () {
            expect(lamb.tapArgs(lamb.add, lamb.getKey("count"))(someObject, -10)).toBe(-5);
        });
    });

    describe("throttle", function () {
        var foo = stub().returns(42);

        it("should return a function that will invoke the passed function at most once in the given timespan", function () {
            var throttledFoo = lamb.throttle(foo, 100);
            var r1 = throttledFoo();
            var r2 = throttledFoo();
            var r3 = throttledFoo();

            assert.calledOnce(foo);
            expect(r1 === 42).toBe(true);
            expect(r2 === 42).toBe(true);
            expect(r3 === 42).toBe(true);

            foo.reset();

            var clock = sinon.useFakeTimers(Date.now());
            throttledFoo = lamb.throttle(foo, 100);

            r1 = throttledFoo();
            r2 = throttledFoo();

            clock.tick(101);

            r3 = throttledFoo();

            assert.calledTwice(foo);
            expect(r1 === 42).toBe(true);
            expect(r2 === 42).toBe(true);
            expect(r3 === 42).toBe(true);

            clock.restore();
        });
    });

    describe("unary", function () {
        it("should build a function that passes only one argument to the given one", function () {
            spyOn(lamb, "list").and.callThrough();

            var unaryList = lamb.unary(lamb.list);

            expect(unaryList.length).toBe(1);
            expect(unaryList(1, 2, 3)).toEqual([1]);
            expect(lamb.list.calls.argsFor(0)).toEqual([1]);
        });
    });

    describe("wrap", function () {
        var add = function (a, b) {return a + b;};
        var square = function (n) {return n * n;};
        var wrapper = function (add, a, b) {
            return add(square(a), square(b));
        };
        var wrapperSpy = jasmine.createSpy("wrapper").and.callFake(wrapper);
        var addSquares = lamb.wrap(add, wrapperSpy);

        it("should allow to wrap a function with another one", function () {
            expect(addSquares(2, 3)).toBe(13);
            expect(wrapperSpy.calls.argsFor(0)[0]).toBe(add);
        });
    });
});
