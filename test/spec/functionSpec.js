var sinon = require("sinon");
var stub = sinon.stub;
var assert = sinon.assert;

var lamb = require("../../dist/lamb.js");

describe("lamb.function", function () {
    function Foo (value) {
        this.value = value;
    }
    Foo.prototype = {
        value: 0,
        bar: function (a, b) {
            return (this.value + a) / b;
        }
    }

    describe("apply", function () {
        it("should apply the passed function to the given arguments", function () {
            expect(lamb.apply(Math.max, [-1, 3, 2, 15, 7])).toBe(15);
        });

        it("should accept an array-like object as arguments for the function", function () {
            expect(lamb.apply(Math.max, "3412")).toBe(4);
        });

        it("should not alter the function's context", function () {
            var obj = {value: 4, apply: lamb.apply};
            expect(obj.apply(Foo.prototype.bar, [1, 2])).toBe(2.5);
        });

        it("should treat non-array-like values for the `args` parameter as empty arrays", function () {
            var fooSpy = jasmine.createSpy("fooSpy");
            var values = [null, void 0, {}, /foo/, NaN, true, new Date()];

            for (var i = 0; i < values.length; i++) {
                lamb.apply(fooSpy, values[i]);
                expect(fooSpy.calls.argsFor(i).length).toBe(0);
            }

            lamb.apply(fooSpy);
            expect(fooSpy.calls.argsFor(i).length).toBe(0);
            expect(fooSpy.calls.count()).toBe(i + 1);
        });

        it("should throw an exception if `fn` isn't a function", function () {
            ["foo", null, void 0, {}, [], /foo/, 1, NaN, true, new Date()].forEach(function (value) {
                expect(function () { lamb.apply(value, []); }).toThrow();
            });
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

        it("should accept an array-like object", function () {
            expect(lamb.applyArgs("3412")(Math.max)).toBe(4);
        });

        it("should not alter the function's context", function () {
            var obj = {value: 4, baz: lamb.applyArgs([1, 2])};
            expect(obj.baz(Foo.prototype.bar)).toBe(2.5);
        });

        it("should treat non-array-like values for the `args` parameter as empty arrays", function () {
            var fooSpy = jasmine.createSpy("fooSpy");
            var values = [null, void 0, {}, /foo/, NaN, true, new Date()];

            for (var i = 0; i < values.length; i++) {
                lamb.applyArgs(values[i])(fooSpy);
                expect(fooSpy.calls.argsFor(i).length).toBe(0);
            }

            lamb.applyArgs()(fooSpy);
            expect(fooSpy.calls.argsFor(i).length).toBe(0);
            expect(fooSpy.calls.count()).toBe(i + 1);
        });

        it("should throw an exception if `fn` isn't a function", function () {
            ["foo", null, void 0, {}, [], /foo/, 1, NaN, true, new Date()].forEach(function (value) {
                expect(function () { lamb.applyArgs([])(value); }).toThrow();
            });

            expect(lamb.applyArgs([])).toThrow();
        });
    });

    describe("aritize", function () {
        var maxArgument = function () { return Math.max.apply(null, arguments); };
        var maxArgumentSpy = jasmine.createSpy("maxArgument").and.callFake(maxArgument);;

        afterEach(function () {
            maxArgumentSpy.calls.reset();
        });

        it("should change the arity of the given function to the specified value", function () {
            var maxOfFirst3 = lamb.aritize(maxArgumentSpy, 3);

            expect(maxOfFirst3(0, 1, 2, 3, 4, 5)).toBe(2);
            expect(maxArgumentSpy.calls.argsFor(0)).toEqual([0, 1, 2]);
        });

        it("should allow negative arities", function () {
            expect(lamb.aritize(maxArgumentSpy, -1)(0, 1, 2, 3)).toBe(2);
            expect(maxArgumentSpy.calls.argsFor(0)).toEqual([0, 1, 2]);
        });

        it("should call the function without arguments if the arity is out of bounds", function () {
            expect(lamb.aritize(maxArgumentSpy, -10)(0, 1, 2, 3)).toBe(-Infinity);
            expect(maxArgumentSpy.calls.argsFor(0).length).toBe(0);
        });

        it("should add `undefined` arguments if the desired arity is greater than the amount of received parameters", function () {
            expect(lamb.aritize(maxArgumentSpy, 6)(0, 1, 2, 3)).toEqual(NaN);
            expect(maxArgumentSpy.calls.argsFor(0)).toEqual([0, 1, 2, 3, void 0, void 0]);
        });

        it("should use all received arguments if supplied with an `undefined` arity following the ECMA specifications of `slice`", function () {
            // see http://www.ecma-international.org/ecma-262/6.0/#sec-array.prototype.slice

            expect(lamb.aritize(maxArgumentSpy, void 0)(0, 1, 2, 3, 4, 5)).toBe(5);
            expect(lamb.aritize(maxArgumentSpy)(0, 1, 2, 3, 4, 5)).toBe(5);
            expect(maxArgumentSpy.calls.argsFor(0)).toEqual([0, 1, 2, 3, 4, 5]);
            expect(maxArgumentSpy.calls.argsFor(1)).toEqual([0, 1, 2, 3, 4, 5]);
        })

        it("should convert the arity to an integer following ECMA specifications", function () {
            // see http://www.ecma-international.org/ecma-262/6.0/#sec-tointeger

            [{}, "foo", NaN, null, function () {}, ["a", "b"]].forEach(function (value, idx) {
                expect(lamb.aritize(maxArgumentSpy, value)(0, 1, 2, 3, 4, 5)).toBe(-Infinity);
                expect(maxArgumentSpy.calls.argsFor(idx).length).toBe(0);
            });

            maxArgumentSpy.calls.reset();

            [[5], 5.9, "5.9", "-1", ["-1.9"]].forEach(function (value, idx) {
                expect(lamb.aritize(maxArgumentSpy, value)(0, 1, 2, 3, 4, 5)).toBe(4);
                expect(maxArgumentSpy.calls.argsFor(idx)).toEqual([0, 1, 2, 3, 4]);
            });
        });

        it("should not modify the function's context", function () {
            var fn = function () {
                this.values = this.values.concat(lamb.slice(arguments));
            };

            var obj = {values: [1, 2, 3], addValues: lamb.aritize(fn, 2)};
            obj.addValues(4, 5, 6, 7);

            expect(obj.values).toEqual([1, 2, 3, 4, 5]);
        });

        it("should build a function throwing an exception if the `fn` parameter isn't a function or is missing", function () {
            ["foo", null, void 0, {}, [], /foo/, 1, NaN, true, new Date()].forEach(function (value) {
                expect(lamb.aritize(value, 0)).toThrow();
            });

            expect(lamb.aritize()).toThrow();
        });
    });

    describe("binary", function () {
        var binaryList;

        beforeEach(function () {
            spyOn(lamb, "list").and.callThrough();
            binaryList = lamb.binary(lamb.list);
        });

        afterEach(function () {
            lamb.list.calls.reset();
        });

        it("should build a function that passes only two arguments to the given one", function () {
            expect(binaryList.length).toBe(2);
            expect(binaryList(1, 2, 3)).toEqual([1, 2]);
            expect(lamb.list.calls.argsFor(0)).toEqual([1, 2]);
        });

        it("should add `undefined` arguments if the received parameters aren't two", function () {
            expect(binaryList()).toEqual([void 0, void 0]);
            expect(binaryList(1)).toEqual([1, void 0]);
        });

        it("should not modify the function's context", function () {
            var fn = function () {
                this.values = this.values.concat(lamb.slice(arguments));
            };

            var obj = {values: [1, 2, 3], addValues: lamb.binary(fn)};
            obj.addValues(4, 5, 6, 7);

            expect(obj.values).toEqual([1, 2, 3, 4, 5]);
        });

        it("should build a function throwing an exception if the `fn` parameter isn't a function or is missing", function () {
            ["foo", null, void 0, {}, [], /foo/, 1, NaN, true, new Date()].forEach(function (value) {
                expect(lamb.binary(value)).toThrow();
            });

            expect(lamb.binary()).toThrow();
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

    describe("getArgAt", function () {
        it("should build a function that returns the argument received at the given index", function () {
            expect(lamb.getArgAt(1)("a", "b", "c")).toBe("b");
        });

        it("should allow negative indexes", function () {
            expect(lamb.getArgAt(-1)("a", "b", "c")).toBe("c");
            expect(lamb.getArgAt(-2)("a", "b", "c")).toBe("b");
        });

        it("should return undefined if no arguments are passed or if the index is out of bounds", function () {
            expect(lamb.getArgAt(6)("a", "b", "c")).toBeUndefined();
            expect(lamb.getArgAt(-4)("a", "b", "c")).toBeUndefined();
            expect(lamb.getArgAt(2)()).toBeUndefined();
        });

        it("should return undefined if the index isn't an integer", function () {
            [-6, 66, NaN, null, void 0, {}, [], [2], "a", "1", "1.5", 1.5].forEach(function (v) {
                expect(lamb.getArgAt(v)("a", "b", "c")).toBeUndefined();
            });
            expect(lamb.getArgAt()("a", "b", "c")).toBeUndefined();
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
            expect(callOnSomeString("foo")).toBeUndefined();
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
            expect(slice(1)).toBeUndefined();
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
        var unaryList;

        beforeEach(function () {
            spyOn(lamb, "list").and.callThrough();
            unaryList = lamb.unary(lamb.list);
        });

        afterEach(function () {
            lamb.list.calls.reset();
        });

        it("should build a function that passes only one argument to the given one", function () {
            expect(unaryList.length).toBe(1);
            expect(unaryList(1, 2, 3)).toEqual([1]);
            expect(lamb.list.calls.argsFor(0)).toEqual([1]);
        });

        it("should add an `undefined` argument if the built function doesn't receive parameters", function () {
            expect(unaryList()).toEqual([void 0]);
        });

        it("should not modify the function's context", function () {
            var fn = function () {
                this.values.push(arguments[0]);
            };

            var obj = {values: [1, 2, 3], addValue: lamb.unary(fn)};
            obj.addValue(4);

            expect(obj.values).toEqual([1, 2, 3, 4]);
        });

        it("should build a function throwing an exception if the `fn` parameter isn't a function or is missing", function () {
            ["foo", null, void 0, {}, [], /foo/, 1, NaN, true, new Date()].forEach(function (value) {
                expect(lamb.unary(value)).toThrow();
            });

            expect(lamb.unary()).toThrow();
        });
    });

    describe("wrap", function () {
        var add = function (a, b) {return a + b;};
        var square = function (n) {return n * n;};
        var wrapper = function (fn, a, b) {
            return fn(square(a), square(b));
        };
        var wrapperSpy = jasmine.createSpy().and.callFake(wrapper);
        var addSquares = lamb.wrap(add, wrapperSpy);

        it("should allow to wrap a function with another one", function () {
            expect(addSquares(2, 3)).toBe(13);
            expect(wrapperSpy.calls.argsFor(0)[0]).toBe(add);
        });
    });
});
