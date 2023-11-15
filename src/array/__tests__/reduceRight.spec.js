import identity from "../../core/identity";
import mapValuesWith from "../../object/mapValuesWith";
import reduceRight from "../reduceRight";
import reduceRightWith from "../reduceRightWith";
import subtract from "../../math/subtract";
import sum from "../../math/sum";
import tapArgs from "../../function/tapArgs";
import { nonFunctions, wannabeEmptyArrays } from "../../__tests__/commons";

describe("reduceRight / reduceRightWith", () => {
    const arr = [1, 2, 3, 4, 5];
    const s = "12345";

    afterEach(() => {
        expect(arr).toStrictEqual([1, 2, 3, 4, 5]);
    });

    it("should fold or reduce the provided array with the given accumulator function starting from the last element", () => {
        const subtractMock = jest.fn((prev, current, idx, list) => {
            expect(list).toBe(arr);
            expect(list[idx]).toBe(current);

            return prev - current;
        });

        const prevValues = [
            5, 1, -2, -4, 0, -5, -9, -12, -14, 10, 5, 1, -2, -4,
            5, 1, -2, -4, 0, -5, -9, -12, -14, 10, 5, 1, -2, -4
        ];

        expect(reduceRight(arr, subtractMock)).toBe(-5);
        expect(reduceRight(arr, subtractMock, 0)).toBe(-15);
        expect(reduceRight(arr, subtractMock, 10)).toBe(-5);
        expect(reduceRightWith(subtractMock)(arr)).toBe(-5);
        expect(reduceRightWith(subtractMock, 0)(arr)).toBe(-15);
        expect(reduceRightWith(subtractMock, 10)(arr)).toBe(-5);

        expect(subtractMock).toHaveBeenCalledTimes(prevValues.length);

        prevValues.forEach((prevValue, idx) => {
            expect(subtractMock.mock.calls[idx][0]).toStrictEqual(prevValue);
        });
    });

    it("should work with array-like objects", () => {
        const fn = tapArgs(subtract, [identity, Number]);

        expect(reduceRight(s, fn)).toBe(-5);
        expect(reduceRight(s, fn, 0)).toBe(-15);
        expect(reduceRight(s, fn, 10)).toBe(-5);
        expect(reduceRightWith(fn)(s)).toBe(-5);
        expect(reduceRightWith(fn, 0)(s)).toBe(-15);
        expect(reduceRightWith(fn, 10)(s)).toBe(-5);
    });

    it("should not skip deleted or unassigned elements, unlike the native method", () => {
        const sumMock = jest.fn((a, b) => a + b);
        const sparseArr = Array(3);

        sparseArr[1] = 3;

        expect(reduceRight(sparseArr, sumMock, 0)).toStrictEqual(NaN);
        expect(reduceRightWith(sumMock, 0)(sparseArr)).toStrictEqual(NaN);
        expect(sumMock).toHaveBeenCalledTimes(6);
    });

    it("should use all the necessary arguments even if reduce is called with more than three arguements", () => {
        // causes reduce to be called with five arguments
        const f = mapValuesWith(reduceRightWith(sum, 7));

        expect(f({ a: [...arr] }).a).toBe(22);
    });

    it("should build a function throwing an exception if the accumulator isn't a function or is missing", () => {
        nonFunctions.forEach(value => {
            expect(() => { reduceRight(arr, value, 0); }).toThrow();
            expect(() => { reduceRightWith(value, 0)(arr); }).toThrow();
        });

        expect(() => { reduceRight(arr); }).toThrow();
        expect(() => { reduceRightWith()(arr); }).toThrow();
    });

    it("should throw an exception if called without the data argument", () => {
        expect(reduceRight).toThrow();
        expect(reduceRightWith(sum, 0)).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", () => {
        expect(() => { reduceRight(null, subtract, 0); }).toThrow();
        expect(() => { reduceRight(void 0, subtract, 0); }).toThrow();
        expect(() => { reduceRightWith(subtract, 0)(null); }).toThrow();
        expect(() => { reduceRightWith(subtract, 0)(void 0); }).toThrow();
    });

    it("should throw an exception when supplied with an empty array-like without an initial value", () => {
        expect(() => { reduceRight([], subtract); }).toThrow();
        expect(() => { reduceRight("", subtract); }).toThrow();
        expect(() => { reduceRightWith(subtract)([]); }).toThrow();
        expect(() => { reduceRightWith(subtract)(""); }).toThrow();
    });

    it("should treat every other value as an empty array and return the initial value", () => {
        wannabeEmptyArrays.forEach(value => {
            expect(reduceRight(value, subtract, 99)).toStrictEqual(99);
            expect(reduceRightWith(subtract, 99)(value)).toStrictEqual(99);
        });
    });
});
