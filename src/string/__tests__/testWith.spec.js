import * as lamb from "../..";

describe("testWith", function () {
    it("should build a predicate accepting a string value to be tested against the pattern", function () {
        var hasNumbersOnly = lamb.testWith(/^\d+$/);
        var hasOnlyLowerCaseLetters = lamb.testWith(new RegExp("^[a-z]+$"));

        expect(hasNumbersOnly("123a")).toBe(false);
        expect(hasNumbersOnly("123")).toBe(true);
        expect(hasOnlyLowerCaseLetters("aBc")).toBe(false);
        expect(hasOnlyLowerCaseLetters("abc")).toBe(true);
    });

    it("should be safe to reuse the function even when the \"global\" flag is used in the pattern", function () {
        var re = /^\d+$/g;
        var hasNumbersOnly = lamb.testWith(re);

        expect(hasNumbersOnly("123")).toBe(true);
        expect(re.lastIndex).toBe(0);
        expect(hasNumbersOnly("123")).toBe(true);
        expect(re.lastIndex).toBe(0);
    });

    it("should convert every value passed as `pattern` to a RegExp", function () {
        var d = new Date();
        var values = [null, void 0, { a: 2 }, [1, 2], 1, function () {}, NaN, true, d];
        var matches = [
            "null",
            "",
            "[object Object]",
            "1,2",
            "1",
            "function  {}",
            "NaN",
            "true",
            RegExp(d).source.replace(/[+()]/g, "")
        ];

        values.forEach(function (value, idx) {
            expect(lamb.testWith(value)(matches[idx])).toBe(true);
        });

        expect(lamb.testWith()("")).toBe(true);
    });

    it("should throw an exception when the source string is `nil` or is missing", function () {
        expect(function () { lamb.testWith(/asd/)(null); }).toThrow();
        expect(function () { lamb.testWith(/asd/)(void 0); }).toThrow();
        expect(lamb.testWith(/asd/)).toThrow();
        expect(lamb.testWith()).toThrow();
    });

    it("should convert to string every other value passed as `source`", function () {
        var d = new Date();
        var values = [{ a: 2 }, [1, 2], /foo/, 1, function () {}, NaN, true, d];
        var patterns = [
            /\[object Object\]/,
            /1,2/,
            /foo/,
            /1/,
            /function \(\) \{\}/,
            /NaN/,
            /true/,
            RegExp(String(d).replace(/([+()])/g, "\\$1"))
        ];

        values.forEach(function (value, idx) {
            expect(lamb.testWith(patterns[idx])(value)).toBe(true);
        });
    });
});
