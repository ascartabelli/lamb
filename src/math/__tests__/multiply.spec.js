import * as lamb from "../..";

describe("multiply / multiplyBy", function () {
    it("should multiply two numbers", function () {
        expect(lamb.multiply(5, -3)).toBe(-15);
        expect(lamb.multiplyBy(5)(-3)).toBe(-15);
    });
});
