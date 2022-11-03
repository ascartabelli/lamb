import repeat from "../repeat";
import { zeroesAsIntegers } from "../../__tests__/commons";

describe("repeat", () => {
    const source = "foo";

    it("should build a new string by repeating the source string the desired amount of times", () => {
        expect(repeat(source, 0)).toBe("");
        expect(repeat(source, 1)).toBe("foo");
        expect(repeat(source, 3)).toBe("foofoofoo");
    });

    it("should consider negative values in the `times` parameter as zeroes", () => {
        expect(repeat(source, -1)).toBe("");
        expect(repeat(source, -99)).toBe("");
    });

    it("should floor floating point values passed as the `times` parameter", () => {
        expect(repeat(source, 3.2)).toBe("foofoofoo");
        expect(repeat(source, 3.8)).toBe("foofoofoo");
    });

    it("should convert to integer every other value passed as the `times` parameter", () => {
        zeroesAsIntegers.forEach(value => {
            expect(repeat("foo", value)).toBe("");
        });

        expect(repeat("foo")).toBe("");
        expect(repeat("foo", true)).toBe("foo");
        expect(repeat("foo", "2.5")).toBe("foofoo");
        expect(repeat("foo", new Date(3))).toBe("foofoofoo");
    });

    it("should throw an exception when the source is `null` or `undefined` and when it's called without arguments", () => {
        expect(() => { repeat(null, 10); }).toThrow();
        expect(() => { repeat(void 0, 10); }).toThrow();
        expect(repeat).toThrow();
    });

    it("should convert to string every other value passed as source", () => {
        const d = new Date();
        const values = [{ a: 2 }, [1, 2], /foo/, 1, function () {}, NaN, true, d];
        const results = [
            "[object Object][object Object][object Object]",
            "1,21,21,2",
            "/foo//foo//foo/",
            "111",
            "function () {}function () {}function () {}",
            "NaNNaNNaN",
            "truetruetrue",
            String(d) + String(d) + String(d)
        ];

        values.forEach((value, idx) => {
            expect(repeat(value, 3)).toBe(results[idx]);
        });
    });
});
