import * as lamb from "../..";
import { nonFunctions } from "../../__tests__/commons";

describe("unary", function () {
    var listSpy = jest.fn(lamb.list);
    var unaryList = lamb.unary(listSpy);

    afterEach(function () {
        listSpy.mockClear();
    });

    it("should build a function that passes only one argument to the given one", function () {
        expect(unaryList.length).toBe(1);
        expect(unaryList(1, 2, 3)).toEqual([1]);
        expect(listSpy.mock.calls[0]).toEqual([1]);
    });

    it("should add an `undefined` argument if the built function doesn't receive parameters", function () {
        expect(unaryList()).toEqual([void 0]);
    });

    it("should not modify the function's context", function () {
        var fn = function () {
            this.values.push(arguments[0]);
        };
        var obj = { values: [1, 2, 3], addValue: lamb.unary(fn) };

        obj.addValue(4);

        expect(obj.values).toEqual([1, 2, 3, 4]);
    });

    it("should build a function throwing an exception if the `fn` parameter isn't a function or is missing", function () {
        nonFunctions.forEach(function (value) {
            expect(lamb.unary(value)).toThrow();
        });

        expect(lamb.unary()).toThrow();
    });
});
