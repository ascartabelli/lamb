import filter from "../filter";
import filterWith from "../filterWith";
import isUndefined from "../../core/isUndefined";
import { nonFunctions, wannabeEmptyArrays } from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("filter / filterWith", () => {
    function isLowerCase (s, idx, list) {
        expect(list[idx]).toBe(s);

        return s.toLowerCase() === s;
    }

    // to check "truthy" and "falsy" values returned by predicates
    function isVowel (char, idx, s) {
        expect(s[idx]).toBe(char);

        return ~"aeiouAEIOU".indexOf(char);
    }

    const arr = ["Foo", "bar", "baZ"];
    const getLowerCaseEls = filterWith(isLowerCase);

    afterEach(() => {
        expect(arr).toStrictEqual(["Foo", "bar", "baZ"]);
    });

    it("should filter an array by keeping the items satisfying the given predicate", () => {
        expect(filter(arr, isLowerCase)).toStrictEqual(["bar"]);
        expect(getLowerCaseEls(arr)).toStrictEqual(["bar"]);
    });

    it("should work with array-like objects", () => {
        expect(filter("fooBAR", isLowerCase)).toStrictEqual(["f", "o", "o"]);
        expect(getLowerCaseEls("fooBAR")).toStrictEqual(["f", "o", "o"]);
    });

    it("should not skip deleted or unassigned elements, unlike the native method", () => {
        const sparseArr = Array(4);

        sparseArr[2] = 3;

        const isOdd = n => n % 2 !== 0;
        const result = [void 0, void 0, 3, void 0];

        expect(filter(sparseArr, isOdd)).toStrictArrayEqual(result);
        expect(filterWith(isOdd)(sparseArr)).toStrictArrayEqual(result);
    });

    it("should treat \"truthy\" and \"falsy\" values returned by predicates as booleans", () => {
        expect(filter("aiuola", isVowel)).toStrictEqual(["a", "i", "u", "o", "a"]);
        expect(filterWith(isVowel)("aiuola")).toStrictEqual(["a", "i", "u", "o", "a"]);
    });

    it("should always return dense arrays", () => {
        // eslint-disable-next-line no-sparse-arrays
        const sparseArr = [1, , , 4, void 0, 5];

        expect(filter(sparseArr, isUndefined)).toStrictArrayEqual([void 0, void 0, void 0]);
        expect(filterWith(isUndefined)(sparseArr)).toStrictArrayEqual([void 0, void 0, void 0]);
    });

    it("should throw an exception if the predicate isn't a function or is missing", () => {
        nonFunctions.forEach(value => {
            expect(() => { filter(arr, value); }).toThrow();
            expect(() => { filterWith(value)(arr); }).toThrow();
        });

        expect(() => { filterWith()(arr); }).toThrow();
        expect(() => { filter(arr); }).toThrow();
    });

    it("should throw an exception if called without the data argument", () => {
        expect(getLowerCaseEls).toThrow();
        expect(filter).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", () => {
        expect(() => { filter(null, isLowerCase); }).toThrow();
        expect(() => { filter(void 0, isLowerCase); }).toThrow();
        expect(() => { getLowerCaseEls(null); }).toThrow();
        expect(() => { getLowerCaseEls(void 0); }).toThrow();
    });

    it("should treat every other value as an empty array", () => {
        wannabeEmptyArrays.forEach(value => {
            expect(filter(value, isLowerCase)).toStrictEqual([]);
            expect(getLowerCaseEls(value)).toStrictEqual([]);
        });
    });
});
