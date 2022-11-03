import always from "../always";

describe("always", () => {
    it("should return a function that returns a constant value", () => {
        const o = { a: 1 };
        const fn = always(o);
        const r1 = fn("foo");
        const r2 = fn();

        expect(r1).toBe(o);
        expect(r2).toBe(o);
        expect(r1).toBe(r2);
    });

    it("should build a function returning `undefined` if called without arguments", () => {
        expect(always()()).toBeUndefined();
    });
});
