import aritize from "../aritize";
import slice from "../../core/slice";
import { nonFunctions, zeroesAsIntegers } from "../../__tests__/commons";

describe("aritize", () => {
    const maxArgument = jest.fn(Math.max);

    afterEach(() => {
        maxArgument.mockClear();
    });

    it("should change the arity of the given function to the specified value", () => {
        const maxOfFirst3 = aritize(maxArgument, 3);

        expect(maxOfFirst3(0, 1, 2, 3, 4, 5)).toBe(2);
        expect(maxArgument).toHaveBeenCalledTimes(1);
        expect(maxArgument).toHaveBeenCalledWith(0, 1, 2);
    });

    it("should allow negative arities", () => {
        expect(aritize(maxArgument, -1)(0, 1, 2, 3)).toBe(2);
        expect(maxArgument).toHaveBeenCalledTimes(1);
        expect(maxArgument).toHaveBeenCalledWith(0, 1, 2);
    });

    it("should call the function without arguments if the arity is zero or if it's out of bounds", () => {
        expect(aritize(maxArgument, -10)(0, 1, 2, 3)).toBe(-Infinity);
        expect(aritize(maxArgument, 0)(0, 1, 2, 3)).toBe(-Infinity);
        expect(maxArgument).toHaveBeenCalledTimes(2);
        expect(maxArgument.mock.calls[0].length).toBe(0);
        expect(maxArgument.mock.calls[1].length).toBe(0);
    });

    it("should add `undefined` arguments if the desired arity is greater than the amount of received parameters", () => {
        expect(aritize(maxArgument, 6)(0, 1, 2, 3)).toBe(NaN);
        expect(maxArgument).toHaveBeenCalledTimes(1);
        expect(maxArgument).toHaveBeenCalledWith(0, 1, 2, 3, void 0, void 0);
    });

    it("should convert the arity to an integer following ECMA specifications", () => {
        // see https://www.ecma-international.org/ecma-262/7.0/#sec-tointeger

        zeroesAsIntegers.forEach(value => {
            expect(aritize(maxArgument, value)(0, 1, 2, 3, 4, 5)).toBe(-Infinity);
            expect(maxArgument.mock.calls[0].length).toBe(0);
        });

        expect(aritize(maxArgument)(0, 1, 2, 3, 4, 5)).toBe(-Infinity);

        const lastCallIdx = maxArgument.mock.calls.length - 1;

        expect(maxArgument.mock.calls[lastCallIdx].length).toBe(0);

        maxArgument.mockClear();

        [[5], 5.9, "5.9", "-1", ["-1.9"]].forEach((value, idx) => {
            expect(aritize(maxArgument, value)(0, 1, 2, 3, 4, 5)).toBe(4);
            expect(maxArgument).toHaveBeenNthCalledWith(idx + 1, 0, 1, 2, 3, 4);
        });

        expect(maxArgument).toHaveBeenCalledTimes(5);
    });

    it("should not modify the function's context", () => {
        function fn () {
            this.values = this.values.concat(slice(arguments, 0, arguments.length));
        }

        const obj = { values: [1, 2, 3], addValues: aritize(fn, 2) };

        obj.addValues(4, 5, 6, 7);

        expect(obj.values).toStrictEqual([1, 2, 3, 4, 5]);
    });

    it("should build a function throwing an exception if the `fn` parameter isn't a function or is missing", () => {
        nonFunctions.forEach(value => {
            expect(aritize(value, 0)).toThrow();
        });

        expect(aritize()).toThrow();
    });
});
