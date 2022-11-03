import areSVZ from "../areSVZ";
import isSVZ from "../isSVZ";

describe("areSVZ / isSVZ", () => {
    it("should verify the equality of two values using the \"SameValueZero\" comparison", () => {
        const o = { foo: "bar" };

        expect(areSVZ(o, o)).toBe(true);
        expect(areSVZ(o, { foo: "bar" })).toBe(false);
        expect(areSVZ(42, 42)).toBe(true);
        expect(areSVZ([], [])).toBe(false);
        expect(areSVZ(0, -0)).toBe(true);
        expect(areSVZ(NaN, NaN)).toBe(true);

        expect(isSVZ(o)(o)).toBe(true);
        expect(isSVZ(o)({ foo: "bar" })).toBe(false);
        expect(isSVZ(42)(42)).toBe(true);
        expect(isSVZ([])([])).toBe(false);
        expect(isSVZ(0)(-0)).toBe(true);
        expect(isSVZ(NaN)(NaN)).toBe(true);
    });
});
