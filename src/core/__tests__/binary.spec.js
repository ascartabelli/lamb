import * as lamb from "../..";
import { nonFunctions } from "../../__tests__/commons";

describe("binary", function () {
    var listSpy = jest.fn(lamb.list);
    var binaryList = lamb.binary(listSpy);

    afterEach(function () {
        listSpy.mockClear();
    });

    it("should build a function that passes only two arguments to the given one", function () {
        expect(binaryList.length).toBe(2);
        expect(binaryList(1, 2, 3)).toEqual([1, 2]);
        expect(listSpy.mock.calls[0]).toEqual([1, 2]);
    });

    it("should add `undefined` arguments if the received parameters aren't two", function () {
        expect(binaryList()).toEqual([void 0, void 0]);
        expect(binaryList(1)).toEqual([1, void 0]);
    });

    it("should not modify the function's context", function () {
        var fn = function () {
            this.values = this.values.concat(lamb.slice(arguments, 0, arguments.length));
        };

        var obj = { values: [1, 2, 3], addValues: lamb.binary(fn) };

        obj.addValues(4, 5, 6, 7);

        expect(obj.values).toEqual([1, 2, 3, 4, 5]);
    });

    it("should build a function throwing an exception if the `fn` parameter isn't a function or is missing", function () {
        nonFunctions.forEach(function (value) {
            expect(lamb.binary(value)).toThrow();
        });

        expect(lamb.binary()).toThrow();
    });
});
