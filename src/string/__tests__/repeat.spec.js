import * as lamb from "../..";
import { zeroesAsIntegers } from "../../__tests__/commons";

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

    it("should convert to integer every other value passed as the `times` parameter", function () {
        zeroesAsIntegers.forEach(function (value) {
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
        var values = [{ a: 2 }, [1, 2], /foo/, 1, function () {}, NaN, true, d];
        var results = [
            "[object Object][object Object][object Object]",
            "1,21,21,2",
            "/foo//foo//foo/",
            "111",
            "function () {}function () {}function () {}",
            "NaNNaNNaN",
            "truetruetrue",
            String(d) + String(d) + String(d)
        ];

        values.forEach(function (value, idx) {
            expect(lamb.repeat(value, 3)).toBe(results[idx]);
        });
    });
});
