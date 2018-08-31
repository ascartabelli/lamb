import * as lamb from "../..";

describe("remainder", function () {
    it("should calculate the remainder of the division of two numbers", function () {
        expect(lamb.remainder(5, 3)).toBe(2);
        expect(lamb.remainder(-5, 3)).toBe(-2);
        expect(isNaN(lamb.remainder(-5, 0))).toBe(true);
    });
});
