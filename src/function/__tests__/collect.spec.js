import always from "../../core/always";
import collect from "../collect";
import identity from "../../core/identity";
import { nonArrayLikes, nonFunctions } from "../../__tests__/commons";

describe("collect", () => {
    it("should collect the values returned by the given series of functions applied with the provided parameters", () => {
        const min = jest.fn(Math.min);
        const max = jest.fn(Math.max);
        const minAndMax = collect([min, max]);

        expect(minAndMax(3, 1, -2, 5, 4, -1)).toStrictEqual([-2, 5]);
        expect(min).toHaveBeenCalledTimes(1);
        expect(min).toHaveBeenCalledWith(3, 1, -2, 5, 4, -1);
        expect(max).toHaveBeenCalledTimes(1);
        expect(max).toHaveBeenCalledWith(3, 1, -2, 5, 4, -1);
    });

    it("should return an empty array if the array of functions is empty", () => {
        expect(collect([])(1, 2, 3)).toStrictEqual([]);
    });

    it("should call the received functions even if there are no provided parameters", () => {
        expect(collect([identity, always(99)])()).toStrictEqual([void 0, 99]);
    });

    it("should throw an exception if the received parameter isn't an array", () => {
        nonArrayLikes.forEach(value => {
            expect(() => { collect(value); }).toThrow();
        });

        expect(collect).toThrow();
    });

    it("should build a function returning an exception if it receives a value that isn't a function", () => {
        nonFunctions.forEach(function (value) {
            expect(() => { collect([always(99), value])(1, 2, 3); }).toThrow();
            expect(() => { collect([value, always(99)])(1, 2, 3); }).toThrow();
        });
    });
});
