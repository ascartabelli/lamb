import curry from "../curry";
import curryable from "../curryable";
import curryableRight from "../curryableRight";
import curryRight from "../curryRight";
import head from "../../array/head";
import list from "../../array/list";

describe("currying", () => {
    const fooSubtract = jest.fn((a, b, c) => a - b - c);

    afterEach(() => {
        fooSubtract.mockClear();
    });

    describe("curry / curryRight", () => {
        it("should allow currying by always returning a function with an arity of one", () => {
            const sub1 = curry(fooSubtract, 3);
            const sub2 = curryRight(fooSubtract, 3);

            expect(sub1(1)(2)(3)).toBe(-4);
            expect(sub2(1)(2)(3)).toBe(0);
        });

        it("should try to desume the arity from the function's length", () => {
            const sub1 = curry(fooSubtract);
            const sub2 = curryRight(fooSubtract);

            expect(sub1(1)(2)(3)).toBe(-4);
            expect(sub2(1)(2)(3)).toBe(0);
        });

        it("should return the received function if the desumed or given arity isn't greater than one", () => {
            expect(curry(list)).toBe(list);
            expect(curryRight(list)).toBe(list);
            expect(curry(head)).toBe(head);
            expect(curryRight(head)).toBe(head);
        });

        it("should give priority to the `arity` parameter over the function's length", () => {
            const sub1 = curry(fooSubtract, 2);
            const sub2 = curryRight(fooSubtract, 2);

            expect(sub1(1)(2)).toBe(NaN);
            expect(sub2(1)(2)).toBe(NaN);

            expect(fooSubtract).toHaveBeenCalledTimes(2);
            expect(fooSubtract).toHaveBeenNthCalledWith(1, 1, 2);
            expect(fooSubtract).toHaveBeenNthCalledWith(2, 2, 1);
        });

        it("should ignore extra parameters", () => {
            const sub1 = curry(fooSubtract, 3);
            const sub2 = curryRight(fooSubtract, 3);

            expect(sub1(1, 99)(2, 88, 77)(3, 66)).toBe(-4);
            expect(sub2(1, 99)(2, 88, 77)(3, 66)).toBe(0);

            expect(fooSubtract).toHaveBeenCalledTimes(2);
            expect(fooSubtract).toHaveBeenNthCalledWith(1, 1, 2, 3);
            expect(fooSubtract).toHaveBeenNthCalledWith(2, 3, 2, 1);
        });

        it("should let empty calls consume the arity", () => {
            const collectLeft = curry(list, 4);
            const collectRight = curryRight(list, 4);

            expect(collectLeft("a", "z")()("c")("d")).toStrictEqual(["a", void 0, "c", "d"]);
            expect(collectRight("a", "z")()("c")("d")).toStrictEqual(["d", "c", void 0, "a"]);
        });

        it("should return a reusable function", () => {
            const fooSubFromFive = curry(fooSubtract)(5);
            const fooSubMinusFive = curryRight(fooSubtract)(5);
            const subFromOne = fooSubFromFive(4);
            const subFromTwo = fooSubFromFive(3);
            const minusNine = fooSubMinusFive(4);
            const minusSix = fooSubMinusFive(1);

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

        it("should preserve the function's context", () => {
            function fn (a, b) {
                this.values.push(a - b);
            }

            const obj = {
                values: [1, 2, 3],
                foo: curry(fn)(4),
                bar: curryRight(fn)(4)
            };

            obj.foo(5);
            expect(obj.values).toStrictEqual([1, 2, 3, -1]);

            obj.bar(5);
            expect(obj.values).toStrictEqual([1, 2, 3, -1, 1]);
        });

        it("should throw an exception if called without arguments", () => {
            expect(curry).toThrow();
            expect(curryRight).toThrow();
        });
    });

    describe("curryable / curryableRight", () => {
        it("should build an \"auto-curried\" function that allows us to consume its arity in any moment", () => {
            const sub1 = curryable(fooSubtract, 3);
            const sub2 = curryableRight(fooSubtract, 3);

            expect(sub1(1, 2, 3)).toBe(-4);
            expect(sub1(1, 2)(3)).toBe(-4);
            expect(sub1(1)(2, 3)).toBe(-4);
            expect(sub1(1)(2)(3)).toBe(-4);
            expect(sub2(1, 2, 3)).toBe(0);
            expect(sub2(1, 2)(3)).toBe(0);
            expect(sub2(1)(2, 3)).toBe(0);
            expect(sub2(1)(2)(3)).toBe(0);
        });

        it("should try to desume the arity from the function's length", () => {
            const sub1 = curryable(fooSubtract);
            const sub2 = curryableRight(fooSubtract);

            expect(sub1(1)(2, 3)).toBe(-4);
            expect(sub2(1)(2, 3)).toBe(0);
        });

        it("should return the received function if the desumed or given arity isn't greater than one", () => {
            expect(curryable(list)).toBe(list);
            expect(curryableRight(list)).toBe(list);
            expect(curryable(head)).toBe(head);
            expect(curryableRight(head)).toBe(head);
        });

        it("should give priority to the `arity` parameter over the function's length", () => {
            const sub1 = curryable(fooSubtract, 2);
            const sub2 = curryableRight(fooSubtract, 2);

            expect(sub1(1)(2)).toBe(NaN);
            expect(sub2(1)(2)).toBe(NaN);

            expect(fooSubtract).toHaveBeenCalledTimes(2);
            expect(fooSubtract).toHaveBeenNthCalledWith(1, 1, 2);
            expect(fooSubtract).toHaveBeenNthCalledWith(2, 2, 1);
        });

        it("should pass extra arguments received to the original function", () => {
            const foo = jest.fn();
            const args = [1, 2, 3, 4, 5];

            curryable(foo, 3)(1, 2)(3, 4, 5);
            curryableRight(foo, 4)(5, 4)(3)(2, 1);
            curryable(fooSubtract, 3)(1, 2)(3, 4, 5);
            curryableRight(fooSubtract, 3)(5, 4)(3, 2, 1);

            expect(foo).toHaveBeenCalledTimes(2);
            expect(fooSubtract).toHaveBeenNthCalledWith(1, ...args);
            expect(fooSubtract).toHaveBeenNthCalledWith(2, ...args);
            expect(fooSubtract).toHaveBeenCalledTimes(2);
            expect(fooSubtract).toHaveBeenNthCalledWith(1, ...args);
            expect(fooSubtract).toHaveBeenNthCalledWith(2, ...args);
        });

        it("should let empty calls consume the arity", () => {
            const collectLeft = curryable(list, 4);
            const collectRight = curryableRight(list, 4);

            expect(collectLeft("a")()("c", "d")).toStrictEqual(["a", void 0, "c", "d"]);
            expect(collectRight("a")()("c", "d")).toStrictEqual(["d", "c", void 0, "a"]);
        });

        it("should return a reusable function", () => {
            const fooSubFromFive = curryable(fooSubtract)(5);
            const fooSubMinusFive = curryableRight(fooSubtract)(5);
            const subFromOne = fooSubFromFive(4);
            const subFromTwo = fooSubFromFive(3);
            const minusNine = fooSubMinusFive(4);
            const minusSix = fooSubMinusFive(1);

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

        it("should preserve the function's context", () => {
            function fn (a, b) {
                this.values.push(a - b);
            }

            const obj = {
                values: [1, 2, 3],
                foo: curryable(fn),
                bar: curryableRight(fn)
            };

            obj.foo(4, 5);
            expect(obj.values).toStrictEqual([1, 2, 3, -1]);

            obj.bar(4, 5);
            expect(obj.values).toStrictEqual([1, 2, 3, -1, 1]);
        });

        it("should throw an exception if called without arguments", () => {
            expect(curryable).toThrow();
            expect(curryableRight).toThrow();
        });
    });
});
