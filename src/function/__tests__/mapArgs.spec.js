import * as lamb from "../..";
import { nonFunctions } from "../../__tests__/commons";

describe("mapArgs", function () {
    var double = jest.fn(function (n) { return n * 2; });

    afterEach(function () {
        double.mockClear();
    });

    it("should build a function that allows to map over the received arguments before applying them to the original one", function () {
        expect(lamb.mapArgs(lamb.sum, double)(5, 3)).toBe(16);
        expect(double).toHaveBeenCalledTimes(2);
        expect(double.mock.calls[0]).toEqual([5, 0, [5, 3]]);
        expect(double.mock.calls[1]).toEqual([3, 1, [5, 3]]);
    });

    it("should build a function throwing an exception if the mapper isn't a function or is missing", function () {
        nonFunctions.forEach(function (value) {
            expect(function () { lamb.mapArgs(lamb.sum, value)(1, 2); }).toThrow();
        });

        expect(function () { lamb.mapArgs(lamb.sum)(1, 2); }).toThrow();
    });

    it("should build a function throwing an exception if `fn` isn't a function", function () {
        nonFunctions.forEach(function (value) {
            expect(lamb.mapArgs(value, double)).toThrow();
        });
    });

    it("should build a function throwing an exception if called without arguments", function () {
        expect(lamb.mapArgs()).toThrow();
    });
});
