import forEach from "../forEach";
import { nonFunctions, wannabeEmptyArrays } from "../../__tests__/commons";

describe("forEach", () => {
    function fn (el, idx, list) {
        expect(list[idx]).toBe(el);
    }

    const arr = [1, 2, 3, 4, 5];

    it("should execute the given function for every element of the provided array", () => {
        expect(forEach(arr, fn)).toBeUndefined();
    });

    it("should work with array-like objects", () => {
        expect(forEach("foo bar", fn)).toBeUndefined();
    });

    it("should not skip deleted or unassigned elements, unlike the native method", () => {
        const sparseArr = Array(3);

        sparseArr[1] = 3;

        const dummyFn = jest.fn();

        expect(forEach(sparseArr, dummyFn)).toBeUndefined();
        expect(dummyFn).toHaveBeenCalledTimes(3);
        expect(dummyFn).toHaveBeenNthCalledWith(1, void 0, 0, sparseArr);
        expect(dummyFn).toHaveBeenNthCalledWith(2, 3, 1, sparseArr);
        expect(dummyFn).toHaveBeenNthCalledWith(3, void 0, 2, sparseArr);
    });

    it("should throw an exception if the predicate isn't a function or is missing", () => {
        nonFunctions.forEach(value => {
            expect(() => { forEach(arr, value); }).toThrow();
        });

        expect(() => { forEach(arr); }).toThrow();
    });

    it("should throw an exception if called without the data argument", () => {
        expect(forEach).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", () => {
        expect(() => { forEach(null, fn); }).toThrow();
        expect(() => { forEach(void 0, fn); }).toThrow();
    });

    it("should treat every other value as an empty array", () => {
        const dummyFn = jest.fn();

        wannabeEmptyArrays.forEach(value => {
            expect(forEach(value, dummyFn)).toBeUndefined();
        });

        expect(dummyFn).not.toHaveBeenCalled();
    });
});
