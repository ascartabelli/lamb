import * as lamb from "../..";
import { nonFunctions } from "../../__tests__/commons";

describe("generic", function () {
    it("should create a generic function out of an object method", function () {
        var arrayProto = Array.prototype;

        jest.spyOn(arrayProto, "map");

        var fakeContext = {};
        var double = function (n) {
            expect(this).toBe(fakeContext);

            return n * 2;
        };
        var numbers = [1, 2, 3, 4, 5];
        var map = lamb.generic(arrayProto.map);

        expect(map(numbers, double, fakeContext)).toEqual([2, 4, 6, 8, 10]);
        expect(arrayProto.map).toHaveBeenCalledTimes(1);
        expect(arrayProto.map.mock.calls[0][0]).toBe(double);
        expect(arrayProto.map.mock.calls[0][1]).toBe(fakeContext);
    });

    it("should build a function throwing an exception if called without arguments or if `method` isn't a function", function () {
        nonFunctions.forEach(function (value) {
            expect(lamb.generic(value)).toThrow();
        });

        expect(lamb.generic()).toThrow();
    });
});
