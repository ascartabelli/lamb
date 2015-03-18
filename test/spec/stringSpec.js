
var lamb = require("../../dist/lamb.js");

describe("lamb.string", function () {
    describe("padLeft", function () {
        it("should pad a string to the given length with the given char starting from the beginning of the string", function () {
            var source = "foo";

            expect(lamb.padLeft(source, "-", 0)).toBe("foo");
            expect(lamb.padLeft(source, "-", -1)).toBe("foo");
            expect(lamb.padLeft(source, "-", 5)).toBe("--foo");
            expect(lamb.padLeft(source, "-", 3)).toBe("foo");
            expect(lamb.padLeft(source, "ab", 7)).toBe("aaaafoo");
            expect(lamb.padLeft(source, "", 5)).toBe("  foo");
            expect(lamb.padLeft("", "-", 5)).toBe("-----");
        });
    });

    describe("padRight", function () {
        it("should pad a string to the given length with the given char starting from the end of the string", function () {
            var source = "foo";

            expect(lamb.padRight(source, "-", 0)).toBe("foo");
            expect(lamb.padRight(source, "-", -1)).toBe("foo");
            expect(lamb.padRight(source, "-", 5)).toBe("foo--");
            expect(lamb.padRight(source, "-", 3)).toBe("foo");
            expect(lamb.padRight(source, "ab", 7)).toBe("fooaaaa");
            expect(lamb.padRight(source, "", 5)).toBe("foo  ");
            expect(lamb.padRight("", "-", 5)).toBe("-----");
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

            expect(hasNumbersOnly("123a")).toBe(false);
            expect(hasNumbersOnly("123")).toBe(true);
        });

        it("should accept RegExp object instances other than literals", function () {
            var hasOnlyLowerCaseLetters = lamb.testWith(new RegExp("^[a-z]+$"));

            expect(hasOnlyLowerCaseLetters("aBc")).toBe(false);
            expect(hasOnlyLowerCaseLetters("abc")).toBe(true);
        });
    });
});
