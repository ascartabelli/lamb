import testWith from "../testWith";

describe("testWith", () => {
    it("should build a predicate accepting a string value to be tested against the pattern", () => {
        const hasNumbersOnly = testWith(/^\d+$/);
        const hasOnlyLowerCaseLetters = testWith(new RegExp("^[a-z]+$"));

        expect(hasNumbersOnly("123a")).toBe(false);
        expect(hasNumbersOnly("123")).toBe(true);
        expect(hasOnlyLowerCaseLetters("aBc")).toBe(false);
        expect(hasOnlyLowerCaseLetters("abc")).toBe(true);
    });

    it("should be safe to reuse the function even when the \"global\" flag is used in the pattern", () => {
        const re = /^\d+$/g;
        const hasNumbersOnly = testWith(re);

        expect(hasNumbersOnly("123")).toBe(true);
        expect(re.lastIndex).toBe(0);
        expect(hasNumbersOnly("123")).toBe(true);
        expect(re.lastIndex).toBe(0);
    });

    it("should convert every value passed as `pattern` to a RegExp", () => {
        const d = new Date();
        const values = [null, void 0, { a: 2 }, [1, 2], 1, function () {}, NaN, true, d];
        const matches = [
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

        values.forEach((value, idx) => {
            expect(testWith(value)(matches[idx])).toBe(true);
        });

        expect(testWith()("")).toBe(true);
    });

    it("should throw an exception when the source string is `nil` or is missing", () => {
        expect(() => { testWith(/asd/)(null); }).toThrow();
        expect(() => { testWith(/asd/)(void 0); }).toThrow();
        expect(testWith(/asd/)).toThrow();
        expect(testWith()).toThrow();
    });

    it("should convert to string every other value passed as `source`", () => {
        const d = new Date();
        const values = [{ a: 2 }, [1, 2], /foo/, 1, function () {}, NaN, true, d];
        const patterns = [
            /\[object Object\]/,
            /1,2/,
            /foo/,
            /1/,
            /function \(\) \{\}/,
            /NaN/,
            /true/,
            RegExp(String(d).replace(/([+()])/g, "\\$1"))
        ];

        values.forEach((value, idx) => {
            expect(testWith(patterns[idx])(value)).toBe(true);
        });
    });
});
