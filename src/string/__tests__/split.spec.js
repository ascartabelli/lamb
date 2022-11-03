import split from "../split";
import splitBy from "../splitBy";

describe("split / splitBy", () => {
    const s = "Lorem ipsum dolor sit amet, consectetur adipisicing elit,sed do eiusmod , tempor incididunt";
    const re = /\s*,\s*/;
    const r1 = [
        "Lorem",
        "ipsum",
        "dolor",
        "sit",
        "amet,",
        "consectetur",
        "adipisicing",
        "elit,sed",
        "do",
        "eiusmod",
        ",",
        "tempor",
        "incididunt"
    ];
    const r2 = [
        "Lorem ipsum dolor sit amet",
        "consectetur adipisicing elit",
        "sed do eiusmod",
        "tempor incididunt"
    ];

    it("should split a string by the given separator", () => {
        expect(split(s, " ")).toStrictEqual(r1);
        expect(splitBy(" ")(s)).toStrictEqual(r1);
    });

    it("should accept a regular expression as a separator", () => {
        expect(split(s, re)).toStrictEqual(r2);
        expect(splitBy(re)(s)).toStrictEqual(r2);
    });

    it("should convert to string other values received as separators", () => {
        const values = [{ a: 2 }, [1, 2], 1, function () {}, NaN, true, new Date()];
        const testArray = ["Lorem", "ipsum", "dolor", "sit"];

        values.forEach(value => {
            expect(split(testArray.join(String(value)), value)).toStrictEqual(testArray);
            expect(splitBy(value)(testArray.join(String(value)))).toStrictEqual(testArray);
        });
    });

    it("should only accept two arguments, unlike the native `split` that has a `limit` parameter", () => {
        expect(split(s, " ", 3)).toStrictEqual(r1);
        expect(splitBy(" ", 3)(s)).toStrictEqual(r1);
    });

    it("should throw an exception when the source is `null` or `undefined` and when it's called without arguments", () => {
        expect(() => { split(null, "."); }).toThrow();
        expect(() => { split(void 0, "."); }).toThrow();
        expect(() => { splitBy(".")(null); }).toThrow();
        expect(() => { splitBy(".")(void 0); }).toThrow();
        expect(split).toThrow();
        expect(splitBy(".")).toThrow();
    });

    it("should convert to string every other value passed as source", () => {
        const d = new Date();
        const values = [{ a: 2 }, [1, 2], /foo/, 1, function () {}, NaN, true, d];
        const results = [
            ["[object Object]"],
            ["1", "2"],
            ["/foo/"],
            ["1"],
            ["function () {}"],
            ["NaN"],
            ["true"],
            [String(d)]
        ];

        values.forEach((value, idx) => {
            expect(split(value, ",")).toStrictEqual(results[idx]);
            expect(splitBy(",")(value)).toStrictEqual(results[idx]);
        });
    });
});
