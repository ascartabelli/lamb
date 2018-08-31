import * as lamb from "../..";

describe("lamb.core", function () {
    describe("always", function () {
        it("should return a function that returns a constant value", function () {
            var o = { a: 1 };
            var fn = lamb.always(o);
            var r1 = fn("foo");
            var r2 = fn();

            expect(r1).toBe(o);
            expect(r2).toBe(o);
            expect(r1).toBe(r2);
        });

        it("should build a function returning `undefined` if called without arguments", function () {
            expect(lamb.always()()).toBeUndefined();
        });
    });
});
