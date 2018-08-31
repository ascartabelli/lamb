import * as lamb from "../..";

describe("currying", function () {
    var fooSubtract = jest.fn(function (a, b, c) {
        return a - b - c;
    });

    afterEach(function () {
        fooSubtract.mockClear();
    });

    describe("curry / curryRight", function () {
        it("should allow currying by always returning a function with an arity of one", function () {
            var sub1 = lamb.curry(fooSubtract, 3);
            var sub2 = lamb.curryRight(fooSubtract, 3);

            expect(sub1(1)(2)(3)).toBe(-4);
            expect(sub2(1)(2)(3)).toBe(0);
        });

        it("should try to desume the arity from the function's length", function () {
            var sub1 = lamb.curry(fooSubtract);
            var sub2 = lamb.curryRight(fooSubtract);

            expect(sub1(1)(2)(3)).toBe(-4);
            expect(sub2(1)(2)(3)).toBe(0);
        });

        it("should return the received function if the desumed or given arity isn't greater than one", function () {
            expect(lamb.curry(lamb.list)).toBe(lamb.list);
            expect(lamb.curryRight(lamb.list)).toBe(lamb.list);
            expect(lamb.curry(lamb.head)).toBe(lamb.head);
            expect(lamb.curryRight(lamb.head)).toBe(lamb.head);
        });

        it("should give priority to the `arity` parameter over the function's length", function () {
            var sub1 = lamb.curry(fooSubtract, 2);
            var sub2 = lamb.curryRight(fooSubtract, 2);

            expect(sub1(1)(2)).toEqual(NaN);
            expect(sub2(1)(2)).toEqual(NaN);

            expect(fooSubtract).toHaveBeenCalledTimes(2);
            expect(fooSubtract.mock.calls[0]).toEqual([1, 2]);
            expect(fooSubtract.mock.calls[1]).toEqual([2, 1]);
        });

        it("should ignore extra parameters", function () {
            var sub1 = lamb.curry(fooSubtract, 3);
            var sub2 = lamb.curryRight(fooSubtract, 3);

            expect(sub1(1, 99)(2, 88, 77)(3, 66)).toBe(-4);
            expect(sub2(1, 99)(2, 88, 77)(3, 66)).toBe(0);

            expect(fooSubtract).toHaveBeenCalledTimes(2);
            expect(fooSubtract.mock.calls[0]).toEqual([1, 2, 3]);
            expect(fooSubtract.mock.calls[1]).toEqual([3, 2, 1]);
        });

        it("should let empty calls consume the arity", function () {
            var collectLeft = lamb.curry(lamb.list, 4);
            var collectRight = lamb.curryRight(lamb.list, 4);

            expect(collectLeft("a", "z")()("c")("d")).toEqual(["a", void 0, "c", "d"]);
            expect(collectRight("a", "z")()("c")("d")).toEqual(["d", "c", void 0, "a"]);
        });

        it("should return a reusable function", function () {
            var fooSubFromFive = lamb.curry(fooSubtract)(5);
            var fooSubMinusFive = lamb.curryRight(fooSubtract)(5);
            var subFromOne = fooSubFromFive(4);
            var subFromTwo = fooSubFromFive(3);
            var minusNine = fooSubMinusFive(4);
            var minusSix = fooSubMinusFive(1);

            expect(fooSubFromFive(4)(3)).toBe(-2);
            expect(fooSubMinusFive(4)(3)).toBe(-6);
            expect(subFromOne(1)).toBe(0);
            expect(subFromOne(3)).toBe(-2);
            expect(subFromTwo(3)).toBe(-1);
            expect(subFromTwo(2)).toBe(0);
            expect(minusNine(10)).toBe(1);
            expect(minusNine(9)).toBe(0);
            expect(minusSix(10)).toBe(4);
            expect(minusSix(4)).toBe(-2);
        });

        it("should preserve the function's context", function () {
            var fn = function (a, b) {
                this.values.push(a - b);
            };

            var obj = {
                values: [1, 2, 3],
                foo: lamb.curry(fn)(4),
                bar: lamb.curryRight(fn)(4)
            };

            obj.foo(5);
            expect(obj.values).toEqual([1, 2, 3, -1]);

            obj.bar(5);
            expect(obj.values).toEqual([1, 2, 3, -1, 1]);
        });

        it("should throw an exception if called without arguments", function () {
            expect(lamb.curry).toThrow();
            expect(lamb.curryRight).toThrow();
        });
    });

    describe("curryable / curryableRight", function () {
        it("should build an \"auto-curried\" function that allows us to consume its arity in any moment", function () {
            var sub1 = lamb.curryable(fooSubtract, 3);
            var sub2 = lamb.curryableRight(fooSubtract, 3);

            expect(sub1(1, 2, 3)).toBe(-4);
            expect(sub1(1, 2)(3)).toBe(-4);
            expect(sub1(1)(2, 3)).toBe(-4);
            expect(sub1(1)(2)(3)).toBe(-4);
            expect(sub2(1, 2, 3)).toBe(0);
            expect(sub2(1, 2)(3)).toBe(0);
            expect(sub2(1)(2, 3)).toBe(0);
            expect(sub2(1)(2)(3)).toBe(0);
        });

        it("should try to desume the arity from the function's length", function () {
            var sub1 = lamb.curryable(fooSubtract);
            var sub2 = lamb.curryableRight(fooSubtract);

            expect(sub1(1)(2, 3)).toBe(-4);
            expect(sub2(1)(2, 3)).toBe(0);
        });

        it("should return the received function if the desumed or given arity isn't greater than one", function () {
            expect(lamb.curryable(lamb.list)).toBe(lamb.list);
            expect(lamb.curryableRight(lamb.list)).toBe(lamb.list);
            expect(lamb.curryable(lamb.head)).toBe(lamb.head);
            expect(lamb.curryableRight(lamb.head)).toBe(lamb.head);
        });

        it("should give priority to the `arity` parameter over the function's length", function () {
            var sub1 = lamb.curryable(fooSubtract, 2);
            var sub2 = lamb.curryableRight(fooSubtract, 2);

            expect(sub1(1)(2)).toEqual(NaN);
            expect(sub2(1)(2)).toEqual(NaN);

            expect(fooSubtract).toHaveBeenCalledTimes(2);
            expect(fooSubtract.mock.calls[0]).toEqual([1, 2]);
            expect(fooSubtract.mock.calls[1]).toEqual([2, 1]);
        });

        it("should pass extra arguments received to the original function", function () {
            var foo = jest.fn();
            var args = [1, 2, 3, 4, 5];

            lamb.curryable(foo, 3)(1, 2)(3, 4, 5);
            lamb.curryableRight(foo, 4)(5, 4)(3)(2, 1);
            lamb.curryable(fooSubtract, 3)(1, 2)(3, 4, 5);
            lamb.curryableRight(fooSubtract, 3)(5, 4)(3, 2, 1);

            expect(foo).toHaveBeenCalledTimes(2);
            expect(foo.mock.calls[0]).toEqual(args);
            expect(foo.mock.calls[1]).toEqual(args);
            expect(fooSubtract).toHaveBeenCalledTimes(2);
            expect(fooSubtract.mock.calls[0]).toEqual(args);
            expect(fooSubtract.mock.calls[1]).toEqual(args);
        });

        it("should let empty calls consume the arity", function () {
            var collectLeft = lamb.curryable(lamb.list, 4);
            var collectRight = lamb.curryableRight(lamb.list, 4);

            expect(collectLeft("a")()("c", "d")).toEqual(["a", void 0, "c", "d"]);
            expect(collectRight("a")()("c", "d")).toEqual(["d", "c", void 0, "a"]);
        });

        it("should return a reusable function", function () {
            var fooSubFromFive = lamb.curryable(fooSubtract)(5);
            var fooSubMinusFive = lamb.curryableRight(fooSubtract)(5);
            var subFromOne = fooSubFromFive(4);
            var subFromTwo = fooSubFromFive(3);
            var minusNine = fooSubMinusFive(4);
            var minusSix = fooSubMinusFive(1);

            expect(fooSubFromFive(4, 3)).toBe(-2);
            expect(fooSubMinusFive(4, 3)).toBe(-6);
            expect(subFromOne(1)).toBe(0);
            expect(subFromOne(3)).toBe(-2);
            expect(subFromTwo(3)).toBe(-1);
            expect(subFromTwo(2)).toBe(0);
            expect(minusNine(10)).toBe(1);
            expect(minusNine(9)).toBe(0);
            expect(minusSix(10)).toBe(4);
            expect(minusSix(4)).toBe(-2);
        });

        it("should preserve the function's context", function () {
            var fn = function (a, b) {
                this.values.push(a - b);
            };

            var obj = {
                values: [1, 2, 3],
                foo: lamb.curryable(fn),
                bar: lamb.curryableRight(fn)
            };

            obj.foo(4, 5);
            expect(obj.values).toEqual([1, 2, 3, -1]);

            obj.bar(4, 5);
            expect(obj.values).toEqual([1, 2, 3, -1, 1]);
        });

        it("should throw an exception if called without arguments", function () {
            expect(lamb.curryable).toThrow();
            expect(lamb.curryableRight).toThrow();
        });
    });
});
