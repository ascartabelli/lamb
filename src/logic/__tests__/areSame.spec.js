import areSame from "../areSame";
import is from "../is";

describe("areSame / is", () => {
    it("should verify the equality of two values", () => {
        const o = { foo: "bar" };

        expect(areSame(o, o)).toBe(true);
        expect(areSame(o, { foo: "bar" })).toBe(false);
        expect(areSame(42, 42)).toBe(true);
        expect(areSame([], [])).toBe(false);
        expect(areSame(0, -0)).toBe(false);
        expect(areSame(NaN, NaN)).toBe(true);

        expect(is(o)(o)).toBe(true);
        expect(is(o)({ foo: "bar" })).toBe(false);
        expect(is(42)(42)).toBe(true);
        expect(is([])([])).toBe(false);
        expect(is(0)(-0)).toBe(false);
        expect(is(NaN)(NaN)).toBe(true);
    });
});
