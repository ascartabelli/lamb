import * as lamb from "../..";
import { nonFunctions } from "../../__tests__/commons";

describe("sorter / sorterDesc", function () {
    var myComparer = jest.fn().mockReturnValue("foo");
    var myReader = jest.fn(lamb.getKey("a"));
    var foo = { a: 1 };
    var bar = { a: 2 };

    afterEach(function () {
        myComparer.mockClear();
        myReader.mockClear();
    });

    it("should build a sorting criterion", function () {
        var sorterAsc = lamb.sorter();
        var sorterDesc = lamb.sorterDesc();

        expect(sorterAsc.isDescending).toBe(false);
        expect(sorterDesc.isDescending).toBe(true);
        expect(typeof sorterAsc.compare).toBe("function");
        expect(typeof sorterDesc.compare).toBe("function");
        expect(sorterAsc.compare.length).toBe(2);
        expect(sorterDesc.compare.length).toBe(2);
        expect(sorterAsc.compare("a", "b")).toBe(-1);
        expect(sorterDesc.compare("a", "b")).toBe(-1);
    });

    it("should use a custom comparer if supplied with one", function () {
        expect(lamb.sorter(null, myComparer).compare(foo, bar)).toBe("foo");
    });

    it("should use a custom reader if supplied with one", function () {
        lamb.sorter(myReader, myComparer).compare(foo, bar);

        expect(myReader).toHaveBeenCalledTimes(2);
        expect(myReader.mock.calls[0][0]).toBe(foo);
        expect(myReader.mock.calls[1][0]).toBe(bar);
        expect(myComparer).toHaveBeenCalledTimes(1);
        expect(myComparer.mock.calls[0]).toEqual([1, 2]);
    });

    it("should pass values directly to the comparer if there's no reader function or if the reader is the identity function", function () {
        lamb.sorter(lamb.identity, myComparer).compare(foo, bar);
        lamb.sorterDesc(null, myComparer).compare(foo, bar);

        expect(myComparer).toHaveBeenCalledTimes(2);
        expect(myComparer.mock.calls[0][0]).toBe(foo);
        expect(myComparer.mock.calls[0][1]).toBe(bar);
        expect(myComparer.mock.calls[1][0]).toBe(foo);
        expect(myComparer.mock.calls[1][1]).toBe(bar);
    });

    it("should build a default sorting criterion if the comparer isn't a function", function () {
        nonFunctions.forEach(function (value) {
            var sorterAsc = lamb.sorter(lamb.identity, value);
            var sorterDesc = lamb.sorterDesc(lamb.identity, value);

            expect(sorterAsc.isDescending).toBe(false);
            expect(sorterDesc.isDescending).toBe(true);
            expect(typeof sorterAsc.compare).toBe("function");
            expect(typeof sorterDesc.compare).toBe("function");
            expect(sorterAsc.compare.length).toBe(2);
            expect(sorterDesc.compare.length).toBe(2);
            expect(sorterAsc.compare("a", "b")).toBe(-1);
            expect(sorterDesc.compare("a", "b")).toBe(-1);
        });
    });
});
