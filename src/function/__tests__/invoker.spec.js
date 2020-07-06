import * as lamb from "../..";
import {
    nonArrayLikes,
    nonStrings,
    nonStringsAsStrings,
    wannabeEmptyObjects
} from "../../__tests__/commons";

describe("invoke", function () {
    var slice = lamb.invoke("slice");
    var tail = lamb.invoke("slice", [1]);
    var arr = [1, 2, 3, 4, 5];
    var s = "Hello world";
    var maxSpy = jest.spyOn(Math, "max");
    var sliceSpy = jest.spyOn(arr, "slice");

    afterEach(function () {
        maxSpy.mockClear();
        sliceSpy.mockClear();
    });

    it("should build a function that will invoke the desired method on the given object", function () {
        expect(lamb.invoke("max")(Math, 1, 3, 2)).toBe(3);
        expect(slice(arr, 1, 3)).toEqual([2, 3]);
        expect(arr.slice).toHaveBeenCalledTimes(1);
        expect(arr.slice.mock.calls[0]).toEqual([1, 3]);
        expect(slice(s, 1, 3)).toBe("el");
    });

    it("should allow bound arguments", function () {
        expect(lamb.invoke("max", [4, 7, 5])(Math, 1, 3, 2)).toBe(7);
        expect(tail(arr)).toEqual([2, 3, 4, 5]);
        expect(tail(arr, -1)).toEqual([2, 3, 4]);
        expect(arr.slice).toHaveBeenCalledTimes(2);
        expect(arr.slice.mock.calls[0]).toEqual([1]);
        expect(arr.slice.mock.calls[1]).toEqual([1, -1]);
    });

    it("should allow array-like objects as bound arguments", function () {
        var obj = { method: lamb.list };
        var callMethod = lamb.invoke("method", "abcde");

        expect(callMethod(obj, "f")).toEqual(["a", "b", "c", "d", "e", "f"]);
    });

    it("should build a function returning `undefined` if the given method doesn't exist on the received object", function () {
        expect(slice({})).toBeUndefined();
        expect(slice(new Date())).toBeUndefined();
    });

    it("should accept an empty string as a method name", function () {
        var obj = { "": function () { return 99; } };

        expect(lamb.invoke("")(obj)).toBe(99);
    });

    it("should convert to string every value received as a method name", function () {
        var obj = {};

        nonStringsAsStrings.forEach(function (method, idx) {
            obj[method] = lamb.always(method);

            expect(lamb.invoke(nonStrings[idx])(obj)).toBe(method);
        });

        expect(lamb.invoke()(obj)).toBe("undefined");
    });

    it("should treat non-arrays values passed as bound arguments as empty arrays", function () {
        nonArrayLikes.forEach(function (value, idx) {
            var fn = lamb.invoke("max", value);

            expect(fn(Math, 1, 3, 2)).toBe(3);
            expect(maxSpy.mock.calls[idx]).toEqual([1, 3, 2]);
        });

        expect(maxSpy).toHaveBeenCalledTimes(nonArrayLikes.length);
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
