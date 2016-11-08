
var lamb = require("../../dist/lamb.js");

describe("lamb.string", function () {
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

            [null, void 0, /foo/, [], function () {}, NaN, {}].forEach(function (value) {
                expect(lamb.padLeft("", "-", value)).toBe("");
                expect(lamb.padRight("", "-", value)).toBe("");
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
            var values = [null, void 0, [7,8], /foo/, 1, function () {}, NaN, true, d, {a: 2}];
            var resultsA = ["nnfoo", "uufoo", "77foo", "//foo", "11foo", "fffoo", "NNfoo", "ttfoo", dChar + dChar + "foo", "[[foo"]
            values.forEach(function (value, idx) {
                expect(lamb.padLeft(source, value, 5)).toBe(resultsA[idx]);
                // expect(lamb.padRight(source, value, 5)).toBe("foo  ");
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
            var values = [{a: 2}, [1, 2], /foo/, 1, function () {}, NaN, true, d];
            var resultsA = ["[object Object]", "----1,2", "--/foo/", "------1", "function () {}", "----NaN", "---true", String(d)];
            var resultsB = ["[object Object]", "1,2----", "/foo/--", "1------", "function () {}", "NaN----", "true---", String(d)];

            values.forEach(function (value, idx) {
                expect(lamb.padLeft(value, "-", 7)).toBe(resultsA[idx]);
                expect(lamb.padRight(value, "-", 7)).toBe(resultsB[idx]);
            });
        });
    });

    describe("repeat", function () {
        var source = "foo";

        it("should build a new string by repeating the source string the desired amount of times", function () {
            expect(lamb.repeat(source, 0)).toBe("");
            expect(lamb.repeat(source, 1)).toBe("foo");
            expect(lamb.repeat(source, 3)).toBe("foofoofoo");
        });

        it("should consider negative values in the `times` parameter as zeroes", function () {
            expect(lamb.repeat(source, -1)).toBe("");
            expect(lamb.repeat(source, -99)).toBe("");
        });

        it("should floor floating point values passed as the `times` parameter", function () {
            expect(lamb.repeat(source, 3.2)).toBe("foofoofoo");
            expect(lamb.repeat(source, 3.8)).toBe("foofoofoo");
        });

        it("should convert to number every other value passed as the `times` parameter", function () {
            [null, void 0, [], /foo/, function () {}, NaN, false].forEach(function (value) {
                expect(lamb.repeat("foo", value)).toBe("");
            });

            expect(lamb.repeat("foo")).toBe("");
            expect(lamb.repeat("foo", true)).toBe("foo");
            expect(lamb.repeat("foo", "2.5")).toBe("foofoo");
            expect(lamb.repeat("foo", new Date(3))).toBe("foofoofoo");
        });

        it("should throw an exception when the source is `null` or `undefined` and when it's called without arguments", function () {
            expect(function () { lamb.repeat(null, 10); }).toThrow();
            expect(function () { lamb.repeat(void 0, 10); }).toThrow();
            expect(lamb.repeat).toThrow();
        });

        it("should convert to string every other value passed as source", function () {
            var d = new Date();
            var values = [{a: 2}, [1, 2], /foo/, 1, function () {}, NaN, true, d];
            var results = [
                "[object Object][object Object][object Object]",
                "1,21,21,2",
                "/foo//foo//foo/",
                "111",
                "function () {}function () {}function () {}",
                "NaNNaNNaN",
                "truetruetrue",
                String(d)+String(d)+String(d)
            ];

            values.forEach(function (value, idx) {
                expect(lamb.repeat(value, 3)).toBe(results[idx]);
            });
        });
    });

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
            var values = [null, void 0, {a: 2}, [1, 2], 1, function () {}, NaN, true, d];
            var matches = [
                "null",
                "",
                "[object Object]",
                "1,2",
                "1",
                "function  {}",
                "NaN",
                "true",
                RegExp(d).source.replace(/[\+\(\)]/g, "")
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
            var values = [{a: 2}, [1, 2], /foo/, 1, function () {}, NaN, true, d];
            var patterns = [
                /\[object Object\]/,
                /1,2/,
                /foo/,
                /1/,
                /function \(\) \{\}/,
                /NaN/,
                /true/,
                RegExp(String(d).replace(/([\+\(\)])/g, "\\$1"))
            ];

            values.forEach(function (value, idx) {
                expect(lamb.testWith(patterns[idx])(value)).toBe(true);
            });
        });
    });
});
