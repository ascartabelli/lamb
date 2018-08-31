import * as lamb from "../..";
import {
    nonStrings,
    nonStringsAsStrings,
    wannabeEmptyObjects
} from "../../__tests__/commons";

describe("invokerOn", function () {
    var arr = [1, 2, 3, 4, 5];
    var callOnArr = lamb.invokerOn(arr);

    var sliceSpy = jest.spyOn(arr, "slice");
    var joinSpy = jest.spyOn(arr, "join");

    afterEach(function () {
        sliceSpy.mockClear();
        joinSpy.mockClear();
    });

    it("should accept an object and build a function expecting a method name to be called on such object with the given parameters", function () {
        var s = "foo bar";
        var callOnS = lamb.invokerOn(s);

        expect(callOnArr("slice", 1, 3)).toEqual([2, 3]);
        expect(arr.slice).toHaveBeenCalledTimes(1);
        expect(arr.slice.mock.calls[0]).toEqual([1, 3]);

        expect(callOnArr("join", "")).toBe("12345");
        expect(arr.join).toHaveBeenCalledTimes(1);
        expect(arr.join.mock.calls[0]).toEqual([""]);

        expect(callOnS("slice", 1, 3)).toBe("oo");
        expect(callOnS("toUpperCase")).toBe("FOO BAR");
    });

    it("should build a function returning `undefined` if the given method doesn't exist on the received object", function () {
        expect(callOnArr("foo")).toBeUndefined();
    });

    it("should accept an empty string as a method name", function () {
        var obj = { "": function () { return 99; } };

        expect(lamb.invokerOn(obj)("")).toBe(99);
    });

    it("should convert to string every value received as a method name", function () {
        var obj = {};
        var callOnObj = lamb.invokerOn(obj);

        nonStringsAsStrings.forEach(function (method, idx) {
            obj[method] = lamb.always(method);

            expect(callOnObj(nonStrings[idx])).toBe(method);
        });

        expect(callOnObj()).toBe("undefined");
    });

    it("should build a function throwing an exception if the received object is `null`, `undefined` or is missing", function () {
        expect(lamb.invokerOn(null)).toThrow();
        expect(lamb.invokerOn(void 0)).toThrow();
        expect(lamb.invokerOn()).toThrow();
    });

    it("should build a function that converts to object every other value", function () {
        wannabeEmptyObjects.forEach(function (value) {
            expect(lamb.invokerOn(value)("someMethod")).toBeUndefined();
        });
    });
});
