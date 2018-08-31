import * as lamb from "../..";
import { nonFunctions, wannabeEmptyArrays } from "../../__tests__/commons";

describe("tapArgs", function () {
    var someObject = { count: 5 };
    var someArrayData = [2, 3, 123, 5, 6, 7, 54, 65, 76, 0];
    var sum = jest.fn(lamb.sum);

    afterEach(function () {
        sum.mockClear();
    });

    it("should build a function that allows to tap into the arguments of the original one", function () {
        var getDataAmount = lamb.tapArgs(sum, [lamb.getKey("count"), lamb.getKey("length")]);

        expect(getDataAmount(someObject, someArrayData)).toBe(15);
        expect(sum).toHaveBeenCalledTimes(1);
        expect(sum.mock.calls[0]).toEqual([someObject.count, someArrayData.length]);
    });

    it("should use arguments as they are when tappers are missing", function () {
        expect(lamb.tapArgs(sum, [lamb.getKey("count")])(someObject, -10)).toBe(-5);
        expect(sum).toHaveBeenCalledTimes(1);
        expect(sum.mock.calls[0]).toEqual([someObject.count, -10]);
    });

    it("should build a function throwing an exception if a tapper isn't a function", function () {
        nonFunctions.forEach(function (value) {
            expect(function () { lamb.tapArgs(lamb.sum, [value, lamb.always(99)])(1, 2); }).toThrow();
            expect(function () { lamb.tapArgs(lamb.sum, [lamb.always(99), value])(1, 2); }).toThrow();
        });
    });

    it("should build a function that doesn't throw an exception if a tapper isn't a function but is not called", function () {
        var inc = function (n) { return ++n; };

        nonFunctions.forEach(function (value) {
            expect(lamb.tapArgs(lamb.sum, [value, lamb.always(99)])()).toEqual(NaN);
            expect(lamb.tapArgs(inc, [inc, value])(25)).toBe(27);
        });
    });

    it("should build a function throwing an exception if a `nil` value is passed as the tappers array", function () {
        expect(function () { lamb.tapArgs(sum, null)(2, 3); }).toThrow();
        expect(function () { lamb.tapArgs(sum, void 0)(2, 3); }).toThrow();
    });

    it("should consider other values as empty arrays", function () {
        wannabeEmptyArrays.forEach(function (value, idx) {
            expect(lamb.tapArgs(sum, value)(2, 3)).toBe(5);
            expect(sum.mock.calls[idx]).toEqual([2, 3]);
        });
    });

    it("should build a function throwing an exception if `fn` isn't a function or is missing", function () {
        nonFunctions.forEach(function (value) {
            expect(lamb.tapArgs(value, [lamb.always(99)])).toThrow();
        });

        expect(lamb.tapArgs()).toThrow();
    });
});
