import always from "../../core/always";
import getKey from "../../object/getKey";
import sum from "../../math/sum";
import tapArgs from "../tapArgs";
import { nonFunctions, wannabeEmptyArrays } from "../../__tests__/commons";

describe("tapArgs", () => {
    const someObject = { count: 5 };
    const someArrayData = [2, 3, 123, 5, 6, 7, 54, 65, 76, 0];
    const sumMock = jest.fn(sum);

    afterEach(() => {
        sumMock.mockClear();
    });

    it("should build a function that allows to tap into the arguments of the original one", () => {
        const getDataAmount = tapArgs(sumMock, [getKey("count"), getKey("length")]);

        expect(getDataAmount(someObject, someArrayData)).toBe(15);
        expect(sumMock).toHaveBeenCalledTimes(1);
        expect(sumMock).toHaveBeenCalledWith(someObject.count, someArrayData.length);
    });

    it("should use arguments as they are when tappers are missing", () => {
        expect(tapArgs(sumMock, [getKey("count")])(someObject, -10)).toBe(-5);
        expect(sumMock).toHaveBeenCalledTimes(1);
        expect(sumMock).toHaveBeenCalledWith(someObject.count, -10);
    });

    it("should build a function throwing an exception if a tapper isn't a function", () => {
        nonFunctions.forEach(value => {
            expect(() => { tapArgs(sum, [value, always(99)])(1, 2); }).toThrow();
            expect(() => { tapArgs(sum, [always(99), value])(1, 2); }).toThrow();
        });
    });

    it("should build a function that doesn't throw an exception if a tapper isn't a function but is not called", () => {
        const inc = n => ++n;

        nonFunctions.forEach(value => {
            expect(tapArgs(sum, [value, always(99)])()).toBe(NaN);
            expect(tapArgs(inc, [inc, value])(25)).toBe(27);
        });
    });

    it("should build a function throwing an exception if a `nil` value is passed as the tappers array", () => {
        expect(() => { tapArgs(sumMock, null)(2, 3); }).toThrow();
        expect(() => { tapArgs(sumMock, void 0)(2, 3); }).toThrow();
    });

    it("should consider other values as empty arrays", () => {
        wannabeEmptyArrays.forEach((value, idx) => {
            expect(tapArgs(sumMock, value)(2, 3)).toBe(5);
            expect(sumMock).toHaveBeenNthCalledWith(idx + 1, 2, 3);
        });
    });

    it("should build a function throwing an exception if `fn` isn't a function or is missing", () => {
        nonFunctions.forEach(value => {
            expect(tapArgs(value, [always(99)])).toThrow();
        });

        expect(tapArgs()).toThrow();
    });
});
