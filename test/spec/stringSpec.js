
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

        it("should use a space as a default padding character", function () {
            expect(lamb.padLeft(source, "", 5)).toBe("  foo");
            expect(lamb.padRight(source, "", 5)).toBe("foo  ");

            [null, void 0, [], /foo/, 1, function () {}, NaN, true, new Date()].forEach(function (value) {
                expect(lamb.padLeft(source, value, 5)).toBe("  foo");
                expect(lamb.padRight(source, value, 5)).toBe("foo  ");
            });
        });

        it("should throw an exception when the source is `null` or `undefined`", function () {
            expect(function () { lamb.padLeft(null, "-", 10); }).toThrow();
            expect(function () { lamb.padLeft(void 0, "-", 10); }).toThrow();
            expect(function () { lamb.padRight(null, "-", 10); }).toThrow();
            expect(function () { lamb.padRight(void 0, "-", 10); }).toThrow();
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
        it("should build a new string by repeating the source string the desired amount of times", function () {
            var source = "foo";

            expect(lamb.repeat(source, -1)).toBe("");
            expect(lamb.repeat(source, 0)).toBe("");
            expect(lamb.repeat(source, 1)).toBe("foo");
            expect(lamb.repeat(source, 3)).toBe("foofoofoo");
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
    });
});
