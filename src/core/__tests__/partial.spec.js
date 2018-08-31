import * as lamb from "../..";
import { nonArrayLikes, nonFunctions } from "../../__tests__/commons";

describe("partial / partialRight", function () {
    var foo = function (a, b, c, d, e) {
        return a + b + c + d + e;
    };
    var __ = lamb.__;

    it("should return a partially applied function using the given arguments", function () {
        var f1 = lamb.partial(foo, ["a", "b", "c"]);
        var f2 = lamb.partialRight(foo, ["a", "b", "c"]);

        expect(f1("d", "e")).toBe("abcde");
        expect(f2("d", "e")).toBe("deabc");
    });

    it("should accept placeholders as arguments", function () {
        var f1 = lamb.partial(foo, [__, __, "c", __, "e"]);
        var f2 = lamb.partialRight(foo, [__, __, "c", __, "e"]);
        var f3 = lamb.partial(foo, [__, "c", __, "e"]);
        var f4 = lamb.partialRight(foo, [__, "c", __, "e"]);

        expect(f1("a", "b", "d")).toBe("abcde");
        expect(f2("a", "b", "d")).toBe("abcde");
        expect(f3("a", "b", "d")).toBe("acbed");
        expect(f4("a", "b", "d")).toBe("abcde");
    });

    it("should be possible to create a partial application from another partial application", function () {
        var f1 = lamb.partial(foo, [__, "b", __, "d"]);
        var f2 = lamb.partialRight(foo, [__, "b", __, "d"]);

        expect(lamb.partial(f1, ["a", __, "e"])("c")).toBe("abcde");
        expect(lamb.partial(f2, ["a", __, "e"])("c")).toBe("acbed");
    });

    it("should give an `undefined` value to unfilled placeholders", function () {
        var f1 = lamb.partial(lamb.list, [__, 2, __, 3, __, 5, __]);
        var f2 = lamb.partialRight(lamb.list, [__, 2, __, 3, __, 5, __]);

        expect(f1(99)).toEqual([99, 2, void 0, 3, void 0, 5, void 0]);
        expect(f1(98, 99)).toEqual([98, 2, 99, 3, void 0, 5, void 0]);
        expect(f2(99)).toEqual([void 0, 2, void 0, 3, void 0, 5, 99]);
        expect(f2(98, 99)).toEqual([void 0, 2, void 0, 3, 98, 5, 99]);
    });

    it("should be safe to call the partial application multiple times with different values for unfilled placeholders", function () {
        var list = [{ id: "foo" }, { id: "bar" }, { id: "baz" }];
        var getID1 = lamb.partial(lamb.getIn, [__, "id"]);
        var getID2 = lamb.unary(lamb.partialRight(lamb.getIn, [__, "id"]));

        expect(list.map(getID1)).toEqual(["foo", "bar", "baz"]);
        expect(list.map(getID2)).toEqual(["foo", "bar", "baz"]);
    });

    it("should pass all the received arguments to the partially applied function, even if they exceed the original function's arity", function () {
        function binaryFoo (a, b) {
            return a + b + arguments[2] + arguments[3] + arguments[4];
        }

        expect(lamb.partial(binaryFoo, ["a", __, __, "d"])("b", "c", "e")).toBe("abcde");
        expect(lamb.partialRight(binaryFoo, ["a", __, __, "d"])("b", "c", "e")).toBe("baced");
    });

    it("should preserve the function's context", function () {
        var fn = function (a, b) {
            this.values.push(a - b);
        };

        var obj = {
            values: [1, 2, 3],
            foo: lamb.partial(fn, [4, __]),
            bar: lamb.partialRight(fn, [__, 4])
        };

        obj.foo(5);
        expect(obj.values).toEqual([1, 2, 3, -1]);

        obj.bar(5);
        expect(obj.values).toEqual([1, 2, 3, -1, 1]);
    });

    it("should consider non-arrays received as the `args` parameter as empty arrays", function () {
        var divideSpy = jest.fn(lamb.divide);

        nonArrayLikes.forEach(function (value, idx) {
            expect(lamb.partial(divideSpy, value)(5, 4)).toBe(1.25);
            expect(lamb.partialRight(divideSpy, value)(5, 4)).toBe(1.25);
            expect(divideSpy.mock.calls[idx * 2]).toEqual([5, 4]);
            expect(divideSpy.mock.calls[idx * 2 + 1]).toEqual([5, 4]);
        });

        expect(lamb.partial(divideSpy)(5, 4)).toBe(1.25);
        expect(lamb.partialRight(divideSpy)(5, 4)).toBe(1.25);
        expect(divideSpy.mock.calls[nonArrayLikes.length * 2]).toEqual([5, 4]);
        expect(divideSpy.mock.calls[nonArrayLikes.length * 2 + 1]).toEqual([5, 4]);
        expect(divideSpy).toHaveBeenCalledTimes(nonArrayLikes.length * 2 + 2);

        divideSpy.mockRestore();
    });

    it("should build a function throwing an exception if called without arguments or if `fn` isn't a function", function () {
        nonFunctions.forEach(function (value) {
            expect(lamb.partial(value)).toThrow();
            expect(lamb.partialRight(value)).toThrow();
        });

        expect(lamb.partial()).toThrow();
        expect(lamb.partialRight()).toThrow();
    });
});
