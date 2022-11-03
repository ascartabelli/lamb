import getKey from "../../object/getKey";
import identity from "../../core/identity";
import sorter from "../sorter";
import sorterDesc from "../sorterDesc";
import { nonFunctions } from "../../__tests__/commons";

describe("sorter / sorterDesc", () => {
    const myComparer = jest.fn().mockReturnValue("foo");
    const myReader = jest.fn(getKey("a"));
    const foo = { a: 1 };
    const bar = { a: 2 };

    afterEach(() => {
        myComparer.mockClear();
        myReader.mockClear();
    });

    it("should build a sorting criterion", () => {
        const ascSorter = sorter();
        const descSorter = sorterDesc();

        expect(ascSorter.isDescending).toBe(false);
        expect(descSorter.isDescending).toBe(true);
        expect(typeof ascSorter.compare).toBe("function");
        expect(typeof descSorter.compare).toBe("function");
        expect(ascSorter.compare.length).toBe(2);
        expect(descSorter.compare.length).toBe(2);
        expect(ascSorter.compare("a", "b")).toBe(-1);
        expect(descSorter.compare("a", "b")).toBe(-1);
    });

    it("should use a custom comparer if supplied with one", () => {
        expect(sorter(null, myComparer).compare(foo, bar)).toBe("foo");
    });

    it("should use a custom reader if supplied with one", () => {
        sorter(myReader, myComparer).compare(foo, bar);

        expect(myReader).toHaveBeenCalledTimes(2);
        expect(myReader).toHaveBeenNthCalledWith(1, foo);
        expect(myReader).toHaveBeenNthCalledWith(2, bar);
        expect(myComparer).toHaveBeenCalledTimes(1);
        expect(myComparer).toHaveBeenCalledWith(1, 2);
    });

    it("should pass values directly to the comparer if there's no reader function or if the reader is the identity function", () => {
        sorter(identity, myComparer).compare(foo, bar);
        sorterDesc(null, myComparer).compare(foo, bar);

        expect(myComparer).toHaveBeenCalledTimes(2);
        expect(myComparer).toHaveBeenNthCalledWith(1, foo, bar);
        expect(myComparer).toHaveBeenNthCalledWith(2, foo, bar);
    });

    it("should build a default sorting criterion if the comparer isn't a function", () => {
        nonFunctions.forEach(value => {
            const ascSorter = sorter(identity, value);
            const descSorter = sorterDesc(identity, value);

            expect(ascSorter.isDescending).toBe(false);
            expect(descSorter.isDescending).toBe(true);
            expect(typeof ascSorter.compare).toBe("function");
            expect(typeof descSorter.compare).toBe("function");
            expect(ascSorter.compare.length).toBe(2);
            expect(descSorter.compare.length).toBe(2);
            expect(ascSorter.compare("a", "b")).toBe(-1);
            expect(descSorter.compare("a", "b")).toBe(-1);
        });
    });
});
