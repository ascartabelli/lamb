import * as lamb from "../..";
import { nonArrayLikes, nonFunctions } from "../../__tests__/commons";

describe("collect", function () {
    it("should collect the values returned by the given series of functions applied with the provided parameters", function () {
        var min = jest.fn(Math.min);
        var max = jest.fn(Math.max);
        var minAndMax = lamb.collect([min, max]);

        expect(minAndMax(3, 1, -2, 5, 4, -1)).toEqual([-2, 5]);
        expect(min).toHaveBeenCalledTimes(1);
        expect(max).toHaveBeenCalledTimes(1);
        expect(min.mock.calls[0]).toEqual([3, 1, -2, 5, 4, -1]);
        expect(max.mock.calls[0]).toEqual([3, 1, -2, 5, 4, -1]);
    });

    it("should return an empty array if the array of functions is empty", function () {
        expect(lamb.collect([])(1, 2, 3)).toEqual([]);
    });

    it("should call the received functions even if there are no provided parameters", function () {
        expect(lamb.collect([lamb.identity, lamb.always(99)])()).toEqual([void 0, 99]);
    });

    it("should throw an exception if the received parameter isn't an array", function () {
        nonArrayLikes.forEach(function (value) {
            expect(function () { lamb.collect(value); }).toThrow();
        });

        expect(lamb.collect).toThrow();
    });

    it("should build a function returning an exception if it receives a value that isn't a function", function () {
        nonFunctions.forEach(function (value) {
            expect(function () { lamb.collect([lamb.always(99), value])(1, 2, 3); }).toThrow();
            expect(function () { lamb.collect([value, lamb.always(99)])(1, 2, 3); }).toThrow();
        });
    });
});
