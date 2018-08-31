import * as lamb from "../..";
import { nonFunctions, zeroesAsIntegers } from "../../__tests__/commons";

describe("aritize", function () {
    var maxArgument = jest.fn(Math.max);

    afterEach(function () {
        maxArgument.mockClear();
    });

    it("should change the arity of the given function to the specified value", function () {
        var maxOfFirst3 = lamb.aritize(maxArgument, 3);

        expect(maxOfFirst3(0, 1, 2, 3, 4, 5)).toBe(2);
        expect(maxArgument.mock.calls[0]).toEqual([0, 1, 2]);
    });

    it("should allow negative arities", function () {
        expect(lamb.aritize(maxArgument, -1)(0, 1, 2, 3)).toBe(2);
        expect(maxArgument.mock.calls[0]).toEqual([0, 1, 2]);
    });

    it("should call the function without arguments if the arity is zero or if it's out of bounds", function () {
        expect(lamb.aritize(maxArgument, -10)(0, 1, 2, 3)).toBe(-Infinity);
        expect(lamb.aritize(maxArgument, 0)(0, 1, 2, 3)).toBe(-Infinity);
        expect(maxArgument).toHaveBeenCalledTimes(2);
        expect(maxArgument.mock.calls[0].length).toBe(0);
        expect(maxArgument.mock.calls[1].length).toBe(0);
    });

    it("should add `undefined` arguments if the desired arity is greater than the amount of received parameters", function () {
        expect(lamb.aritize(maxArgument, 6)(0, 1, 2, 3)).toEqual(NaN);
        expect(maxArgument.mock.calls[0]).toEqual([0, 1, 2, 3, void 0, void 0]);
    });

    it("should convert the arity to an integer following ECMA specifications", function () {
        // see https://www.ecma-international.org/ecma-262/7.0/#sec-tointeger

        zeroesAsIntegers.forEach(function (value) {
            expect(lamb.aritize(maxArgument, value)(0, 1, 2, 3, 4, 5)).toBe(-Infinity);
            expect(maxArgument.mock.calls[0].length).toBe(0);
        });

        expect(lamb.aritize(maxArgument)(0, 1, 2, 3, 4, 5)).toBe(-Infinity);

        var lastCallIdx = maxArgument.mock.calls.length - 1;

        expect(maxArgument.mock.calls[lastCallIdx].length).toBe(0);

        maxArgument.mockClear();

        [[5], 5.9, "5.9", "-1", ["-1.9"]].forEach(function (value, idx) {
            expect(lamb.aritize(maxArgument, value)(0, 1, 2, 3, 4, 5)).toBe(4);
            expect(maxArgument.mock.calls[idx]).toEqual([0, 1, 2, 3, 4]);
        });
    });

    it("should not modify the function's context", function () {
        var fn = function () {
            this.values = this.values.concat(lamb.slice(arguments, 0, arguments.length));
        };

        var obj = { values: [1, 2, 3], addValues: lamb.aritize(fn, 2) };

        obj.addValues(4, 5, 6, 7);

        expect(obj.values).toEqual([1, 2, 3, 4, 5]);
    });

    it("should build a function throwing an exception if the `fn` parameter isn't a function or is missing", function () {
        nonFunctions.forEach(function (value) {
            expect(lamb.aritize(value, 0)).toThrow();
        });

        expect(lamb.aritize()).toThrow();
    });
});
