import * as lamb from "../..";
import {
    nonStrings,
    nonStringsAsStrings,
    wannabeEmptyObjects
} from "../../__tests__/commons";

describe("invoker", function () {
    var slice = lamb.invoker("slice");
    var tail = lamb.invoker("slice", 1);
    var arr = [1, 2, 3, 4, 5];
    var sliceSpy = jest.spyOn(arr, "slice");

    afterEach(function () {
        sliceSpy.mockClear();
    });

    it("should build a function that will invoke the desired method on the given object", function () {
        var s = "foo bar";

        expect(slice(arr, 1, 3)).toEqual([2, 3]);
        expect(arr.slice).toHaveBeenCalledTimes(1);
        expect(arr.slice.mock.calls[0]).toEqual([1, 3]);
        expect(slice(s, 1, 3)).toBe("oo");
    });

    it("should allow bound arguments", function () {
        expect(tail(arr)).toEqual([2, 3, 4, 5]);
        expect(tail(arr, -1)).toEqual([2, 3, 4]);
        expect(arr.slice).toHaveBeenCalledTimes(2);
        expect(arr.slice.mock.calls[0]).toEqual([1]);
        expect(arr.slice.mock.calls[1]).toEqual([1, -1]);
    });

    it("should build a function returning `undefined` if the given method doesn't exist on the received object", function () {
        expect(slice({})).toBeUndefined();
        expect(slice(new Date())).toBeUndefined();
    });

    it("should accept an empty string as a method name", function () {
        var obj = { "": function () { return 99; } };

        expect(lamb.invoker("")(obj)).toBe(99);
    });

    it("should convert to string every value received as a method name", function () {
        var obj = {};

        nonStringsAsStrings.forEach(function (method, idx) {
            obj[method] = lamb.always(method);

            expect(lamb.invoker(nonStrings[idx])(obj)).toBe(method);
        });

        expect(lamb.invoker()(obj)).toBe("undefined");
    });

    it("should build a function throwing an exception if the received object is `null`, `undefined` or is missing", function () {
        expect(function () { slice(null); }).toThrow();
        expect(function () { slice(void 0); }).toThrow();
        expect(slice).toThrow();
    });

    it("should build a function that converts to object every other value", function () {
        wannabeEmptyObjects.forEach(function (value) {
            if (value !== "") {
                expect(slice(value)).toBeUndefined();
            }
        });
    });
});
