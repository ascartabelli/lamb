import identity from "../identity";
import mapValuesWith from "../../object/mapValuesWith";
import reduce from "../reduce";
import reduceWith from "../reduceWith";
import subtract from "../../math/subtract";
import sum from "../../math/sum";
import tapArgs from "../../function/tapArgs";
import { nonFunctions, wannabeEmptyArrays } from "../../__tests__/commons";

describe("reduce / reduceWith", () => {
    const arr = [1, 2, 3, 4, 5];
    const s = "12345";

    afterEach(() => {
        expect(arr).toStrictEqual([1, 2, 3, 4, 5]);
    });

    it("should fold or reduce the provided array with the given accumulator function starting from the first element", () => {
        const sub = jest.fn(function (prev, current, idx, list) {
            expect(current).toBe(list[idx]);
            expect(list).toBe(arr);

            return prev - current;
        });

        const prevValues = [
            1, -1, -4, -8, 0, -1, -3, -6, -10, 10, 9, 7, 4, 0,
            1, -1, -4, -8, 0, -1, -3, -6, -10, 10, 9, 7, 4, 0
        ];

        expect(reduce(arr, sub)).toBe(-13);
        expect(reduce(arr, sub, 0)).toBe(-15);
        expect(reduce(arr, sub, 10)).toBe(-5);
        expect(reduceWith(sub)(arr)).toBe(-13);
        expect(reduceWith(sub, 0)(arr)).toBe(-15);
        expect(reduceWith(sub, 10)(arr)).toBe(-5);

        expect(sub).toHaveBeenCalledTimes(prevValues.length);

        prevValues.forEach((prevValue, idx) => {
            expect(sub.mock.calls[idx][0]).toBe(prevValue);
        });
    });

    it("should work with array-like objects", () => {
        const fn = tapArgs(subtract, [identity, Number]);

        expect(reduce(s, fn)).toBe(-13);
        expect(reduce(s, fn, 0)).toBe(-15);
        expect(reduce(s, fn, 10)).toBe(-5);
        expect(reduceWith(fn)(s)).toBe(-13);
        expect(reduceWith(fn, 0)(s)).toBe(-15);
        expect(reduceWith(fn, 10)(s)).toBe(-5);
    });

    it("should not skip deleted or unassigned elements, unlike the native method", () => {
        const sumMock = jest.fn((a, b) => a + b);
        const sparseArr = Array(3);

        sparseArr[1] = 3;

        expect(reduce(sparseArr, sumMock, 0)).toBe(NaN);
        expect(reduceWith(sumMock, 0)(sparseArr)).toBe(NaN);
        expect(sumMock).toHaveBeenCalledTimes(6);
    });

    it("should use all the necessary arguments even if reduce is called with more than three arguements", () => {
        // causes reduce to be called with five arguments
        const f = mapValuesWith(reduceWith(sum, 7));

        expect(f({ a: [...arr] }).a).toBe(22);
    });

    it("should build a function throwing an exception if the accumulator isn't a function or is missing", () => {
        nonFunctions.forEach(value => {
            expect(() => { reduce(arr, value, 0); }).toThrow();
            expect(() => { reduceWith(value, 0)(arr); }).toThrow();
        });

        expect(() => { reduce(arr); }).toThrow();
        expect(() => { reduceWith()(arr); }).toThrow();
    });

    it("should throw an exception if called without the data argument", () => {
        expect(reduce).toThrow();
        expect(reduceWith(sum, 0)).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", () => {
        expect(() => { reduce(null, subtract, 0); }).toThrow();
        expect(() => { reduce(void 0, subtract, 0); }).toThrow();
        expect(() => { reduceWith(subtract, 0)(null); }).toThrow();
        expect(() => { reduceWith(subtract, 0)(void 0); }).toThrow();
    });

    it("should throw an exception when supplied with an empty array-like without an initial value", () => {
        expect(() => { reduce([], subtract); }).toThrow();
        expect(() => { reduce("", subtract); }).toThrow();
        expect(() => { reduceWith(subtract)([]); }).toThrow();
        expect(() => { reduceWith(subtract)(""); }).toThrow();
    });

    it("should treat every other value as an empty array and return the initial value", () => {
        wannabeEmptyArrays.forEach(value => {
            expect(reduce(value, subtract, 99)).toBe(99);
            expect(reduceWith(subtract, 99)(value)).toBe(99);
        });
    });
});
