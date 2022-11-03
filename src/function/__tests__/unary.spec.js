import list from "../../array/list";
import unary from "../unary";
import { nonFunctions } from "../../__tests__/commons";

describe("unary", () => {
    const listSpy = jest.fn(list);
    const unaryList = unary(listSpy);

    afterEach(() => {
        listSpy.mockClear();
    });

    it("should build a function that passes only one argument to the given one", () => {
        expect(unaryList.length).toBe(1);
        expect(unaryList(1, 2, 3)).toStrictEqual([1]);
        expect(listSpy).toHaveBeenCalledTimes(1);
        expect(listSpy).toHaveBeenCalledWith(1);
    });

    it("should add an `undefined` argument if the built function doesn't receive parameters", () => {
        expect(unaryList()).toStrictEqual([void 0]);
    });

    it("should not modify the function's context", () => {
        function fn () {
            this.values.push(arguments[0]);
        }

        const obj = { values: [1, 2, 3], addValue: unary(fn) };

        obj.addValue(4);

        expect(obj.values).toStrictEqual([1, 2, 3, 4]);
    });

    it("should build a function throwing an exception if the `fn` parameter isn't a function or is missing", () => {
        nonFunctions.forEach(value => {
            expect(unary(value)).toThrow();
        });

        expect(unary()).toThrow();
    });
});
