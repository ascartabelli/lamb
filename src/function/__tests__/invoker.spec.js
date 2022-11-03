import always from "../../core/always";
import invoke from "../invoke";
import list from "../../array/list";
import {
    nonArrayLikes,
    nonStrings,
    nonStringsAsStrings,
    wannabeEmptyObjects
} from "../../__tests__/commons";

describe("invoke", () => {
    const slice = invoke("slice");
    const tail = invoke("slice", [1]);
    const arr = [1, 2, 3, 4, 5];
    const s = "Hello world";
    const maxSpy = jest.spyOn(Math, "max");
    const sliceSpy = jest.spyOn(arr, "slice");

    afterEach(() => {
        maxSpy.mockClear();
        sliceSpy.mockClear();
    });

    it("should build a function that will invoke the desired method on the given object", () => {
        expect(invoke("max")(Math, 1, 3, 2)).toBe(3);
        expect(slice(arr, 1, 3)).toStrictEqual([2, 3]);
        expect(sliceSpy).toHaveBeenCalledTimes(1);
        expect(sliceSpy).toHaveBeenCalledWith(1, 3);
        expect(slice(s, 1, 3)).toBe("el");
    });

    it("should allow bound arguments", () => {
        expect(invoke("max", [4, 7, 5])(Math, 1, 3, 2)).toBe(7);
        expect(tail(arr)).toStrictEqual([2, 3, 4, 5]);
        expect(tail(arr, -1)).toStrictEqual([2, 3, 4]);
        expect(sliceSpy).toHaveBeenCalledTimes(2);
        expect(sliceSpy).toHaveBeenNthCalledWith(1, 1);
        expect(sliceSpy).toHaveBeenNthCalledWith(2, 1, -1);
    });

    it("should allow array-like objects as bound arguments", () => {
        const obj = { method: list };
        const callMethod = invoke("method", "abcde");

        expect(callMethod(obj, "f")).toStrictEqual(["a", "b", "c", "d", "e", "f"]);
    });

    it("should build a function returning `undefined` if the given method doesn't exist on the received object", () => {
        expect(slice({})).toBeUndefined();
        expect(slice(new Date())).toBeUndefined();
    });

    it("should accept an empty string as a method name", () => {
        const obj = { "": () => 99 };

        expect(invoke("")(obj)).toBe(99);
    });

    it("should convert to string every value received as a method name", () => {
        const obj = {};

        nonStringsAsStrings.forEach((method, idx) => {
            obj[method] = always(method);

            expect(invoke(nonStrings[idx])(obj)).toBe(method);
        });

        expect(invoke()(obj)).toBe("undefined");
    });

    it("should treat non-arrays values passed as bound arguments as empty arrays", () => {
        const numbers = [1, 3, 2];

        nonArrayLikes.forEach((value, idx) => {
            const fn = invoke("max", value);

            expect(fn(Math, ...numbers)).toBe(3);
            expect(maxSpy).toHaveBeenNthCalledWith(idx + 1, ...numbers);
        });

        expect(maxSpy).toHaveBeenCalledTimes(nonArrayLikes.length);
    });

    it("should build a function throwing an exception if the received object is `null`, `undefined` or is missing", () => {
        expect(() => { slice(null); }).toThrow();
        expect(() => { slice(void 0); }).toThrow();
        expect(slice).toThrow();
    });

    it("should build a function that converts to object every other value", () => {
        wannabeEmptyObjects.forEach(value => {
            if (value !== "") {
                expect(slice(value)).toBeUndefined();
            }
        });
    });
});
