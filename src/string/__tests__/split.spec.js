import * as lamb from "../..";

describe("split / splitBy", function () {
    var s = "Lorem ipsum dolor sit amet, consectetur adipisicing elit,sed do eiusmod , tempor incididunt";
    var re = /\s*,\s*/;
    var r1 = [
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
    var r2 = [
        "Lorem ipsum dolor sit amet",
        "consectetur adipisicing elit",
        "sed do eiusmod",
        "tempor incididunt"
    ];

    it("should split a string by the given separator", () => {
        expect(lamb.split(s, " ")).toStrictEqual(r1);
        expect(lamb.splitBy(" ")(s)).toStrictEqual(r1);
    });

    it("should accept a regular expression as a separator", function () {
        expect(lamb.split(s, re)).toStrictEqual(r2);
        expect(lamb.splitBy(re)(s)).toStrictEqual(r2);
    });

    it("should convert to string other values received as separators", function () {
        var testArray = ["Lorem", "ipsum", "dolor", "sit"];
        var values = [{ a: 2 }, [1, 2], 1, function () {}, NaN, true, new Date()];

        values.forEach(function (value) {
            expect(lamb.split(testArray.join(String(value)), value)).toStrictEqual(testArray);
            expect(lamb.splitBy(value)(testArray.join(String(value)))).toStrictEqual(testArray);
        });
    });

    it("should only accept two arguments, unlike the native `split` that has a `limit` parameter", () => {
        expect(lamb.split(s, " ", 3)).toStrictEqual(r1);
        expect(lamb.splitBy(" ", 3)(s)).toStrictEqual(r1);
    });

    it("should throw an exception when the source is `null` or `undefined` and when it's called without arguments", function () {
        expect(function () { lamb.split(null, "."); }).toThrow();
        expect(function () { lamb.split(void 0, "."); }).toThrow();
        expect(function () { lamb.splitBy(".")(null); }).toThrow();
        expect(function () { lamb.splitBy(".")(void 0); }).toThrow();
        expect(lamb.split).toThrow();
        expect(lamb.splitBy(".")).toThrow();
    });

    it("should convert to string every other value passed as source", function () {
        var d = new Date();
        var values = [{ a: 2 }, [1, 2], /foo/, 1, function () {}, NaN, true, d];
        var results = [
            ["[object Object]"],
            ["1", "2"],
            ["/foo/"],
            ["1"],
            ["function () {}"],
            ["NaN"],
            ["true"],
            [String(d)]
        ];

        values.forEach(function (value, idx) {
            expect(lamb.split(value, ",")).toStrictEqual(results[idx]);
            expect(lamb.splitBy(",")(value)).toStrictEqual(results[idx]);
        });
    });
});
