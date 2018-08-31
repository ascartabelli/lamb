import * as lamb from "../..";
import { nonFunctions, wannabeEmptyArrays } from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("filter / filterWith", function () {
    var arr = ["Foo", "bar", "baZ"];

    var isLowerCase = function (s, idx, list) {
        expect(list[idx]).toBe(s);

        return s.toLowerCase() === s;
    };

    // to check "truthy" and "falsy" values returned by predicates
    var isVowel = function (char, idx, s) {
        expect(s[idx]).toBe(char);

        return ~"aeiouAEIOU".indexOf(char);
    };

    var getLowerCaseEls = lamb.filterWith(isLowerCase);

    afterEach(function () {
        expect(arr).toEqual(["Foo", "bar", "baZ"]);
    });

    it("should filter an array by keeping the items satisfying the given predicate", function () {
        expect(lamb.filter(arr, isLowerCase)).toEqual(["bar"]);
        expect(getLowerCaseEls(arr)).toEqual(["bar"]);
    });

    it("should work with array-like objects", function () {
        expect(lamb.filter("fooBAR", isLowerCase)).toEqual(["f", "o", "o"]);
        expect(getLowerCaseEls("fooBAR")).toEqual(["f", "o", "o"]);
    });

    it("should not skip deleted or unassigned elements, unlike the native method", function () {
        var sparseArr = Array(4);

        sparseArr[2] = 3;

        var isOdd = function (n) { return n % 2 !== 0; };
        var result = [void 0, void 0, 3, void 0];

        expect(lamb.filter(sparseArr, isOdd)).toStrictArrayEqual(result);
        expect(lamb.filterWith(isOdd)(sparseArr)).toStrictArrayEqual(result);
    });

    it("should treat \"truthy\" and \"falsy\" values returned by predicates as booleans", function () {
        expect(lamb.filter("aiuola", isVowel)).toEqual(["a", "i", "u", "o", "a"]);
        expect(lamb.filterWith(isVowel)("aiuola")).toEqual(["a", "i", "u", "o", "a"]);
    });

    it("should always return dense arrays", function () {
        // eslint-disable-next-line no-sparse-arrays
        var sparseArr = [1, , , 4, void 0, 5];

        expect(lamb.filter(sparseArr, lamb.isUndefined)).toStrictArrayEqual([void 0, void 0, void 0]);
        expect(lamb.filterWith(lamb.isUndefined)(sparseArr)).toStrictArrayEqual([void 0, void 0, void 0]);
    });

    it("should throw an exception if the predicate isn't a function or is missing", function () {
        nonFunctions.forEach(function (value) {
            expect(function () { lamb.filter(arr, value); }).toThrow();
            expect(function () { lamb.filterWith(value)(arr); }).toThrow();
        });

        expect(function () { lamb.filterWith()(arr); }).toThrow();
        expect(function () { lamb.filter(arr); }).toThrow();
    });

    it("should throw an exception if called without the data argument", function () {
        expect(getLowerCaseEls).toThrow();
        expect(lamb.filter).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", function () {
        expect(function () { lamb.filter(null, isLowerCase); }).toThrow();
        expect(function () { lamb.filter(void 0, isLowerCase); }).toThrow();
        expect(function () { getLowerCaseEls(null); }).toThrow();
        expect(function () { getLowerCaseEls(void 0); }).toThrow();
    });

    it("should treat every other value as an empty array", function () {
        wannabeEmptyArrays.forEach(function (value) {
            expect(lamb.filter(value, isLowerCase)).toEqual([]);
            expect(getLowerCaseEls(value)).toEqual([]);
        });
    });
});
