import * as lamb from "../..";

describe("areSVZ / isSVZ", function () {
    it("should verify the equality of two values using the \"SameValueZero\" comparison", function () {
        var o = { foo: "bar" };

        expect(lamb.areSVZ(o, o)).toBe(true);
        expect(lamb.areSVZ(o, { foo: "bar" })).toBe(false);
        expect(lamb.areSVZ(42, 42)).toBe(true);
        expect(lamb.areSVZ([], [])).toBe(false);
        expect(lamb.areSVZ(0, -0)).toBe(true);
        expect(lamb.areSVZ(NaN, NaN)).toBe(true);

        expect(lamb.isSVZ(o)(o)).toBe(true);
        expect(lamb.isSVZ(o)({ foo: "bar" })).toBe(false);
        expect(lamb.isSVZ(42)(42)).toBe(true);
        expect(lamb.isSVZ([])([])).toBe(false);
        expect(lamb.isSVZ(0)(-0)).toBe(true);
        expect(lamb.isSVZ(NaN)(NaN)).toBe(true);
    });
});
