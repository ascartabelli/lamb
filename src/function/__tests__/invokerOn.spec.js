import always from "../../core/always";
import invokeOn from "../invokeOn";
import {
    nonStrings,
    nonStringsAsStrings,
    wannabeEmptyObjects
} from "../../__tests__/commons";

describe("invokeOn", () => {
    const arr = [1, 2, 3, 4, 5];
    const callOnArr = invokeOn(arr);
    const sliceSpy = jest.spyOn(arr, "slice");
    const joinSpy = jest.spyOn(arr, "join");

    afterEach(() => {
        sliceSpy.mockClear();
        joinSpy.mockClear();
    });

    it("should accept an object and build a function expecting a method name to be called on such object with the given parameters", () => {
        const s = "foo bar";
        const callOnS = invokeOn(s);

        expect(callOnArr("slice", 1, 3)).toStrictEqual([2, 3]);
        expect(sliceSpy).toHaveBeenCalledTimes(1);
        expect(sliceSpy).toHaveBeenCalledWith(1, 3);

        expect(callOnArr("join", "")).toBe("12345");
        expect(joinSpy).toHaveBeenCalledTimes(1);
        expect(joinSpy).toHaveBeenCalledWith("");

        expect(callOnS("slice", 1, 3)).toBe("oo");
        expect(callOnS("toUpperCase")).toBe("FOO BAR");
    });

    it("should build a function returning `undefined` if the given method doesn't exist on the received object", () => {
        expect(callOnArr("foo")).toBeUndefined();
    });

    it("should accept an empty string as a method name", () => {
        const obj = { "": () => 99 };

        expect(invokeOn(obj)("")).toBe(99);
    });

    it("should convert to string every value received as a method name", () => {
        const obj = {};
        const callOnObj = invokeOn(obj);

        nonStringsAsStrings.forEach((method, idx) => {
            obj[method] = always(method);

            expect(callOnObj(nonStrings[idx])).toBe(method);
        });

        expect(callOnObj()).toBe("undefined");
    });

    it("should build a function throwing an exception if the received object is `null`, `undefined` or is missing", () => {
        expect(invokeOn(null)).toThrow();
        expect(invokeOn(void 0)).toThrow();
        expect(invokeOn()).toThrow();
    });

    it("should build a function that converts to object every other value", () => {
        wannabeEmptyObjects.forEach(value => {
            expect(invokeOn(value)("someMethod")).toBeUndefined();
        });
    });
});
