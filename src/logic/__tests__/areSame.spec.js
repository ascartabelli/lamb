import * as lamb from "../..";

describe("areSame / is", function () {
    it("should verify the equality of two values", function () {
        var o = { foo: "bar" };

        expect(lamb.areSame(o, o)).toBe(true);
        expect(lamb.areSame(o, { foo: "bar" })).toBe(false);
        expect(lamb.areSame(42, 42)).toBe(true);
        expect(lamb.areSame([], [])).toBe(false);
        expect(lamb.areSame(0, -0)).toBe(false);
        expect(lamb.areSame(NaN, NaN)).toBe(true);

        expect(lamb.is(o)(o)).toBe(true);
        expect(lamb.is(o)({ foo: "bar" })).toBe(false);
        expect(lamb.is(42)(42)).toBe(true);
        expect(lamb.is([])([])).toBe(false);
        expect(lamb.is(0)(-0)).toBe(false);
        expect(lamb.is(NaN)(NaN)).toBe(true);
    });
});
