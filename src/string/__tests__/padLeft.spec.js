import * as lamb from "../..";
import { zeroesAsIntegers } from "../../__tests__/commons";

describe("padLeft / padRight", function () {
    var source = "foo";

    it("should pad a string to the given length with the provided char", function () {
        expect(lamb.padLeft(source, "-", 5)).toBe("--foo");
        expect(lamb.padLeft("", "-", 5)).toBe("-----");
        expect(lamb.padRight(source, "-", 5)).toBe("foo--");
        expect(lamb.padRight("", "-", 5)).toBe("-----");
    });

    it("should return a copy of the original string if the given length is lesser or equal to the string's length or if it's not a number", function () {
        expect(lamb.padLeft(source, "-", 0)).toBe("foo");
        expect(lamb.padLeft(source, "-", -1)).toBe("foo");
        expect(lamb.padLeft(source, "-", 3)).toBe("foo");
        expect(lamb.padRight(source, "-", 0)).toBe("foo");
        expect(lamb.padRight(source, "-", -1)).toBe("foo");
        expect(lamb.padRight(source, "-", 3)).toBe("foo");

        zeroesAsIntegers.forEach(function (value) {
            expect(lamb.padLeft(source, "-", value)).toBe("foo");
            expect(lamb.padRight(source, "-", value)).toBe("foo");
        });
    });

    it("should use only the first character of the string passed as padding char", function () {
        expect(lamb.padLeft(source, "ab", 7)).toBe("aaaafoo");
        expect(lamb.padRight(source, "ab", 7)).toBe("fooaaaa");
    });

    it("should not do any padding if the padding char is an empty string", function () {
        expect(lamb.padLeft(source, "", 5)).toBe("foo");
        expect(lamb.padRight(source, "", 5)).toBe("foo");
    });

    it("should convert to string values received as padding characters", function () {
        var d = new Date();
        var dChar = String(d)[0];
        var values = [null, void 0, [7, 8], /foo/, 1, function () {}, NaN, true, d, { a: 2 }];
        var resultsA = [
            "nnfoo", "uufoo", "77foo", "//foo", "11foo", "fffoo",
            "NNfoo", "ttfoo", dChar + dChar + "foo", "[[foo"
        ];
        var resultsB = [
            "foonn", "foouu", "foo77", "foo//", "foo11", "fooff",
            "fooNN", "foott", "foo" + dChar + dChar, "foo[["
        ];

        values.forEach(function (value, idx) {
            expect(lamb.padLeft(source, value, 5)).toBe(resultsA[idx]);
            expect(lamb.padRight(source, value, 5)).toBe(resultsB[idx]);
        });
    });

    it("should throw an exception when the source is `null` or `undefined` and when it's called without arguments", function () {
        expect(function () { lamb.padLeft(null, "-", 10); }).toThrow();
        expect(function () { lamb.padLeft(void 0, "-", 10); }).toThrow();
        expect(function () { lamb.padRight(null, "-", 10); }).toThrow();
        expect(function () { lamb.padRight(void 0, "-", 10); }).toThrow();
        expect(lamb.padLeft).toThrow();
        expect(lamb.padRight).toThrow();
    });

    it("should convert to string every other value passed as source", function () {
        var d = new Date();
        var values = [{ a: 2 }, [1, 2], /foo/, 1, function () {}, NaN, true, d];
        var resultsA = [
            "[object Object]", "----1,2", "--/foo/", "------1",
            "function () {}", "----NaN", "---true", String(d)
        ];
        var resultsB = [
            "[object Object]", "1,2----", "/foo/--", "1------",
            "function () {}", "NaN----", "true---", String(d)
        ];

        values.forEach(function (value, idx) {
            expect(lamb.padLeft(value, "-", 7)).toBe(resultsA[idx]);
            expect(lamb.padRight(value, "-", 7)).toBe(resultsB[idx]);
        });
    });
});
