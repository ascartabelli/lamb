import * as lamb from "../..";

describe("comparison operators", function () {
    var d1 = new Date(2010, 11, 2);
    var d2 = new Date(2010, 11, 3);
    var d3 = new Date(2010, 11, 2);

    describe("gt / isGT", function () {
        it("should verify if the first argument is greater than the second", function () {
            expect(lamb.gt(2, 1)).toBe(true);
            expect(lamb.gt(1, 2)).toBe(false);
            expect(lamb.gt(2, 2)).toBe(false);
            expect(lamb.gt(true, false)).toBe(true);
            expect(lamb.gt(d2, d1)).toBe(true);
            expect(lamb.gt("a", "A")).toBe(true);
            expect(lamb.gt("", "a")).toBe(false);

            expect(lamb.isGT(1)(2)).toBe(true);
            expect(lamb.isGT(2)(1)).toBe(false);
            expect(lamb.isGT(2)(2)).toBe(false);
            expect(lamb.isGT(false)(true)).toBe(true);
            expect(lamb.isGT(d1)(d2)).toBe(true);
            expect(lamb.isGT("A")("a")).toBe(true);
            expect(lamb.isGT("a")("")).toBe(false);
        });
    });

    describe("gte / isGTE", function () {
        it("should verify if the first argument is greater than or equal to the second", function () {
            expect(lamb.gte(2, 1)).toBe(true);
            expect(lamb.gte(1, 2)).toBe(false);
            expect(lamb.gte(2, 2)).toBe(true);
            expect(lamb.gte(true, false)).toBe(true);
            expect(lamb.gte(d2, d1)).toBe(true);
            expect(lamb.gte(d1, d3)).toBe(true);
            expect(lamb.gte("a", "A")).toBe(true);
            expect(lamb.gte("", "a")).toBe(false);

            expect(lamb.isGTE(1)(2)).toBe(true);
            expect(lamb.isGTE(2)(1)).toBe(false);
            expect(lamb.isGTE(2)(2)).toBe(true);
            expect(lamb.isGTE(false)(true)).toBe(true);
            expect(lamb.isGTE(d1)(d2)).toBe(true);
            expect(lamb.isGTE(d3)(d1)).toBe(true);
            expect(lamb.isGTE("A")("a")).toBe(true);
            expect(lamb.isGTE("a")("")).toBe(false);
        });
    });

    describe("lt / isLT", function () {
        it("should verify if the first argument is less than the second", function () {
            expect(lamb.lt(2, 1)).toBe(false);
            expect(lamb.lt(1, 2)).toBe(true);
            expect(lamb.lt(2, 2)).toBe(false);
            expect(lamb.lt(true, false)).toBe(false);
            expect(lamb.lt(d2, d1)).toBe(false);
            expect(lamb.lt("a", "A")).toBe(false);
            expect(lamb.lt("", "a")).toBe(true);

            expect(lamb.isLT(1)(2)).toBe(false);
            expect(lamb.isLT(2)(1)).toBe(true);
            expect(lamb.isLT(2)(2)).toBe(false);
            expect(lamb.isLT(false)(true)).toBe(false);
            expect(lamb.isLT(d1)(d2)).toBe(false);
            expect(lamb.isLT("A")("a")).toBe(false);
            expect(lamb.isLT("a")("")).toBe(true);
        });
    });

    describe("lte / isLTE", function () {
        it("should verify if the first argument is less than or equal to the second", function () {
            expect(lamb.lte(2, 1)).toBe(false);
            expect(lamb.lte(1, 2)).toBe(true);
            expect(lamb.lte(2, 2)).toBe(true);
            expect(lamb.lte(true, false)).toBe(false);
            expect(lamb.lte(d2, d1)).toBe(false);
            expect(lamb.lte(d1, d3)).toBe(true);
            expect(lamb.lte("a", "A")).toBe(false);
            expect(lamb.lte("", "a")).toBe(true);

            expect(lamb.isLTE(1)(2)).toBe(false);
            expect(lamb.isLTE(2)(1)).toBe(true);
            expect(lamb.isLTE(2)(2)).toBe(true);
            expect(lamb.isLTE(false)(true)).toBe(false);
            expect(lamb.isLTE(d1)(d2)).toBe(false);
            expect(lamb.isLTE(d3)(d1)).toBe(true);
            expect(lamb.isLTE("A")("a")).toBe(false);
            expect(lamb.isLTE("a")("")).toBe(true);
        });
    });
});
