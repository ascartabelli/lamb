import padLeft from "../padLeft";
import padRight from "../padRight";
import { zeroesAsIntegers } from "../../__tests__/commons";

describe("padLeft / padRight", () => {
    const source = "foo";

    it("should pad a string to the given length with the provided char", () => {
        expect(padLeft(source, "-", 5)).toBe("--foo");
        expect(padLeft("", "-", 5)).toBe("-----");
        expect(padRight(source, "-", 5)).toBe("foo--");
        expect(padRight("", "-", 5)).toBe("-----");
    });

    it("should return a copy of the original string if the given length is lesser or equal to the string's length or if it's not a number", () => {
        expect(padLeft(source, "-", 0)).toBe("foo");
        expect(padLeft(source, "-", -1)).toBe("foo");
        expect(padLeft(source, "-", 3)).toBe("foo");
        expect(padRight(source, "-", 0)).toBe("foo");
        expect(padRight(source, "-", -1)).toBe("foo");
        expect(padRight(source, "-", 3)).toBe("foo");

        zeroesAsIntegers.forEach(value => {
            expect(padLeft(source, "-", value)).toBe("foo");
            expect(padRight(source, "-", value)).toBe("foo");
        });
    });

    it("should use only the first character of the string passed as padding char", () => {
        expect(padLeft(source, "ab", 7)).toBe("aaaafoo");
        expect(padRight(source, "ab", 7)).toBe("fooaaaa");
    });

    it("should not do any padding if the padding char is an empty string", () => {
        expect(padLeft(source, "", 5)).toBe("foo");
        expect(padRight(source, "", 5)).toBe("foo");
    });

    it("should convert to string values received as padding characters", () => {
        const d = new Date();
        const dChar = String(d)[0];
        const values = [null, void 0, [7, 8], /foo/, 1, function () {}, NaN, true, d, { a: 2 }];
        const resultsA = [
            "nnfoo", "uufoo", "77foo", "//foo", "11foo", "fffoo",
            "NNfoo", "ttfoo", dChar + dChar + "foo", "[[foo"
        ];
        const resultsB = [
            "foonn", "foouu", "foo77", "foo//", "foo11", "fooff",
            "fooNN", "foott", "foo" + dChar + dChar, "foo[["
        ];

        values.forEach((value, idx) => {
            expect(padLeft(source, value, 5)).toBe(resultsA[idx]);
            expect(padRight(source, value, 5)).toBe(resultsB[idx]);
        });
    });

    it("should throw an exception when the source is `null` or `undefined` and when it's called without arguments", () => {
        expect(() => { padLeft(null, "-", 10); }).toThrow();
        expect(() => { padLeft(void 0, "-", 10); }).toThrow();
        expect(() => { padRight(null, "-", 10); }).toThrow();
        expect(() => { padRight(void 0, "-", 10); }).toThrow();
        expect(padLeft).toThrow();
        expect(padRight).toThrow();
    });

    it("should convert to string every other value passed as source", () => {
        const d = new Date();
        const values = [{ a: 2 }, [1, 2], /foo/, 1, function () {}, NaN, true, d];
        const resultsA = [
            "[object Object]", "----1,2", "--/foo/", "------1",
            "function () {}", "----NaN", "---true", String(d)
        ];
        const resultsB = [
            "[object Object]", "1,2----", "/foo/--", "1------",
            "function () {}", "NaN----", "true---", String(d)
        ];

        values.forEach((value, idx) => {
            expect(padLeft(value, "-", 7)).toBe(resultsA[idx]);
            expect(padRight(value, "-", 7)).toBe(resultsB[idx]);
        });
    });
});
