import generic from "../generic";
import { nonFunctions } from "../../__tests__/commons";

describe("generic", () => {
    it("should create a generic function out of an object method", () => {
        function double (n) {
            expect(this).toBe(fakeContext);

            return n * 2;
        }

        const mapSpy = jest.spyOn(Array.prototype, "map");
        const fakeContext = {};
        const numbers = [1, 2, 3, 4, 5];
        const map = generic(Array.prototype.map);

        expect(map(numbers, double, fakeContext)).toStrictEqual([2, 4, 6, 8, 10]);
        expect(mapSpy).toHaveBeenCalledTimes(1);
        expect(mapSpy).toHaveBeenCalledWith(double, fakeContext);
    });

    it("should build a function throwing an exception if called without arguments or if `method` isn't a function", () => {
        nonFunctions.forEach(value => {
            expect(generic(value)).toThrow();
        });

        expect(generic()).toThrow();
    });
});
