import __ from "../__";
import divide from "../../math/divide";
import getIn from "../../object/getIn";
import list from "../../array/list";
import partial from "../partial";
import partialRight from "../partialRight";
import unary from "../../function/unary";
import { nonArrayLikes, nonFunctions } from "../../__tests__/commons";

describe("partial / partialRight", () => {
    function sumOfFive (a, b, c, d, e) {
        return a + b + c + d + e;
    }

    it("should return a partially applied function using the given arguments", () => {
        const f1 = partial(sumOfFive, ["a", "b", "c"]);
        const f2 = partialRight(sumOfFive, ["a", "b", "c"]);

        expect(f1("d", "e")).toBe("abcde");
        expect(f2("d", "e")).toBe("deabc");
    });

    it("should accept placeholders as arguments", () => {
        const f1 = partial(sumOfFive, [__, __, "c", __, "e"]);
        const f2 = partialRight(sumOfFive, [__, __, "c", __, "e"]);
        const f3 = partial(sumOfFive, [__, "c", __, "e"]);
        const f4 = partialRight(sumOfFive, [__, "c", __, "e"]);

        expect(f1("a", "b", "d")).toBe("abcde");
        expect(f2("a", "b", "d")).toBe("abcde");
        expect(f3("a", "b", "d")).toBe("acbed");
        expect(f4("a", "b", "d")).toBe("abcde");
    });

    it("should be possible to create a partial application from another partial application", () => {
        const f1 = partial(sumOfFive, [__, "b", __, "d"]);
        const f2 = partialRight(sumOfFive, [__, "b", __, "d"]);

        expect(partial(f1, ["a", __, "e"])("c")).toBe("abcde");
        expect(partial(f2, ["a", __, "e"])("c")).toBe("acbed");
    });

    it("should give an `undefined` value to unfilled placeholders", () => {
        const f1 = partial(list, [__, 2, __, 3, __, 5, __]);
        const f2 = partialRight(list, [__, 2, __, 3, __, 5, __]);

        expect(f1(99)).toStrictEqual([99, 2, void 0, 3, void 0, 5, void 0]);
        expect(f1(98, 99)).toStrictEqual([98, 2, 99, 3, void 0, 5, void 0]);
        expect(f2(99)).toStrictEqual([void 0, 2, void 0, 3, void 0, 5, 99]);
        expect(f2(98, 99)).toStrictEqual([void 0, 2, void 0, 3, 98, 5, 99]);
    });

    it("should be safe to call the partial application multiple times with different values for unfilled placeholders", () => {
        const arr = [{ id: "foo" }, { id: "bar" }, { id: "baz" }];
        const getID1 = partial(getIn, [__, "id"]);
        const getID2 = unary(partialRight(getIn, [__, "id"]));

        expect(arr.map(getID1)).toStrictEqual(["foo", "bar", "baz"]);
        expect(arr.map(getID2)).toStrictEqual(["foo", "bar", "baz"]);
    });

    it("should pass all the received arguments to the partially applied function, even if they exceed the original function's arity", () => {
        function binaryFoo (a, b) {
            return a + b + arguments[2] + arguments[3] + arguments[4];
        }

        expect(partial(binaryFoo, ["a", __, __, "d"])("b", "c", "e")).toBe("abcde");
        expect(partialRight(binaryFoo, ["a", __, __, "d"])("b", "c", "e")).toBe("baced");
    });

    it("should preserve the function's context", () => {
        function fn (a, b) {
            this.values.push(a - b);
        }

        const obj = {
            values: [1, 2, 3],
            foo: partial(fn, [4, __]),
            bar: partialRight(fn, [__, 4])
        };

        obj.foo(5);
        expect(obj.values).toStrictEqual([1, 2, 3, -1]);

        obj.bar(5);
        expect(obj.values).toStrictEqual([1, 2, 3, -1, 1]);
    });

    it("should consider non-arrays received as the `args` parameter as empty arrays", () => {
        const divideSpy = jest.fn(divide);

        nonArrayLikes.forEach((value, idx) => {
            expect(partial(divideSpy, value)(5, 4)).toBe(1.25);
            expect(partialRight(divideSpy, value)(5, 4)).toBe(1.25);
            expect(divideSpy).toHaveBeenNthCalledWith(idx * 2 + 1, 5, 4);
            expect(divideSpy).toHaveBeenNthCalledWith(idx * 2 + 2, 5, 4);
        });

        expect(partial(divideSpy)(5, 4)).toBe(1.25);
        expect(partialRight(divideSpy)(5, 4)).toBe(1.25);
        expect(divideSpy).toHaveBeenCalledTimes(nonArrayLikes.length * 2 + 2);
        expect(divideSpy).toHaveBeenNthCalledWith(nonArrayLikes.length * 2 + 1, 5, 4);
        expect(divideSpy).toHaveBeenNthCalledWith(nonArrayLikes.length * 2 + 2, 5, 4);

        divideSpy.mockRestore();
    });

    it("should build a function throwing an exception if called without arguments or if `fn` isn't a function", () => {
        nonFunctions.forEach(value => {
            expect(partial(value)).toThrow();
            expect(partialRight(value)).toThrow();
        });

        expect(partial()).toThrow();
        expect(partialRight()).toThrow();
    });
});
