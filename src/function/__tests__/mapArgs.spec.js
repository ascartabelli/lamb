import mapArgs from "../mapArgs";
import sum from "../../math/sum";
import { nonFunctions } from "../../__tests__/commons";

describe("mapArgs", () => {
    const double = jest.fn(n => n * 2);

    afterEach(() => {
        double.mockClear();
    });

    it("should build a function that allows to map over the received arguments before applying them to the original one", () => {
        expect(mapArgs(sum, double)(5, 3)).toBe(16);
        expect(double).toHaveBeenCalledTimes(2);
        expect(double).toHaveBeenNthCalledWith(1, 5, 0, [5, 3]);
        expect(double).toHaveBeenNthCalledWith(2, 3, 1, [5, 3]);
    });

    it("should build a function throwing an exception if the mapper isn't a function or is missing", () => {
        nonFunctions.forEach(value => {
            expect(() => { mapArgs(sum, value)(1, 2); }).toThrow();
        });

        expect(() => { mapArgs(sum)(1, 2); }).toThrow();
    });

    it("should build a function throwing an exception if `fn` isn't a function", () => {
        nonFunctions.forEach(value => {
            expect(mapArgs(value, double)).toThrow();
        });
    });

    it("should build a function throwing an exception if called without arguments", () => {
        expect(mapArgs()).toThrow();
    });
});
