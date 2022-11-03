import gt from "../gt";
import gte from "../gte";
import isGT from "../isGT";
import isGTE from "../isGTE";
import isLT from "../isLT";
import isLTE from "../isLTE";
import lt from "../lt";
import lte from "../lte";

describe("comparison operators", () => {
    const d1 = new Date(2010, 11, 2);
    const d2 = new Date(2010, 11, 3);
    const d3 = new Date(2010, 11, 2);

    describe("gt / isGT", () => {
        it("should verify if the first argument is greater than the second", () => {
            expect(gt(2, 1)).toBe(true);
            expect(gt(1, 2)).toBe(false);
            expect(gt(2, 2)).toBe(false);
            expect(gt(true, false)).toBe(true);
            expect(gt(d2, d1)).toBe(true);
            expect(gt("a", "A")).toBe(true);
            expect(gt("", "a")).toBe(false);

            expect(isGT(1)(2)).toBe(true);
            expect(isGT(2)(1)).toBe(false);
            expect(isGT(2)(2)).toBe(false);
            expect(isGT(false)(true)).toBe(true);
            expect(isGT(d1)(d2)).toBe(true);
            expect(isGT("A")("a")).toBe(true);
            expect(isGT("a")("")).toBe(false);
        });
    });

    describe("gte / isGTE", () => {
        it("should verify if the first argument is greater than or equal to the second", () => {
            expect(gte(2, 1)).toBe(true);
            expect(gte(1, 2)).toBe(false);
            expect(gte(2, 2)).toBe(true);
            expect(gte(true, false)).toBe(true);
            expect(gte(d2, d1)).toBe(true);
            expect(gte(d1, d3)).toBe(true);
            expect(gte("a", "A")).toBe(true);
            expect(gte("", "a")).toBe(false);

            expect(isGTE(1)(2)).toBe(true);
            expect(isGTE(2)(1)).toBe(false);
            expect(isGTE(2)(2)).toBe(true);
            expect(isGTE(false)(true)).toBe(true);
            expect(isGTE(d1)(d2)).toBe(true);
            expect(isGTE(d3)(d1)).toBe(true);
            expect(isGTE("A")("a")).toBe(true);
            expect(isGTE("a")("")).toBe(false);
        });
    });

    describe("lt / isLT", () => {
        it("should verify if the first argument is less than the second", () => {
            expect(lt(2, 1)).toBe(false);
            expect(lt(1, 2)).toBe(true);
            expect(lt(2, 2)).toBe(false);
            expect(lt(true, false)).toBe(false);
            expect(lt(d2, d1)).toBe(false);
            expect(lt("a", "A")).toBe(false);
            expect(lt("", "a")).toBe(true);

            expect(isLT(1)(2)).toBe(false);
            expect(isLT(2)(1)).toBe(true);
            expect(isLT(2)(2)).toBe(false);
            expect(isLT(false)(true)).toBe(false);
            expect(isLT(d1)(d2)).toBe(false);
            expect(isLT("A")("a")).toBe(false);
            expect(isLT("a")("")).toBe(true);
        });
    });

    describe("lte / isLTE", () => {
        it("should verify if the first argument is less than or equal to the second", () => {
            expect(lte(2, 1)).toBe(false);
            expect(lte(1, 2)).toBe(true);
            expect(lte(2, 2)).toBe(true);
            expect(lte(true, false)).toBe(false);
            expect(lte(d2, d1)).toBe(false);
            expect(lte(d1, d3)).toBe(true);
            expect(lte("a", "A")).toBe(false);
            expect(lte("", "a")).toBe(true);

            expect(isLTE(1)(2)).toBe(false);
            expect(isLTE(2)(1)).toBe(true);
            expect(isLTE(2)(2)).toBe(true);
            expect(isLTE(false)(true)).toBe(false);
            expect(isLTE(d1)(d2)).toBe(false);
            expect(isLTE(d3)(d1)).toBe(true);
            expect(isLTE("A")("a")).toBe(false);
            expect(isLTE("a")("")).toBe(true);
        });
    });
});
