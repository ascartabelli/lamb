import binary from "../binary";
import list from "../../array/list";
import slice from "../slice";
import { nonFunctions } from "../../__tests__/commons";

describe("binary", () => {
    const listSpy = jest.fn(list);
    const binaryList = binary(listSpy);

    afterEach(() => {
        listSpy.mockClear();
    });

    it("should build a function that passes only two arguments to the given one", () => {
        expect(binaryList.length).toBe(2);
        expect(binaryList(1, 2, 3)).toStrictEqual([1, 2]);
        expect(listSpy).toHaveBeenCalledTimes(1);
        expect(listSpy).toHaveBeenCalledWith(1, 2);
    });

    it("should add `undefined` arguments if the received parameters aren't two", () => {
        expect(binaryList()).toStrictEqual([void 0, void 0]);
        expect(binaryList(1)).toStrictEqual([1, void 0]);
    });

    it("should not modify the function's context", () => {
        function fn () {
            this.values = this.values.concat(slice(arguments, 0, arguments.length));
        }

        const obj = { values: [1, 2, 3], addValues: binary(fn) };

        obj.addValues(4, 5, 6, 7);

        expect(obj.values).toStrictEqual([1, 2, 3, 4, 5]);
    });

    it("should build a function throwing an exception if the `fn` parameter isn't a function or is missing", () => {
        nonFunctions.forEach(function (value) {
            expect(binary(value)).toThrow();
        });

        expect(binary()).toThrow();
    });
});
