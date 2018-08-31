import * as lamb from "../..";

describe("modulo", function () {
    it("should calculate the modulo of two numbers", function () {
        expect(lamb.modulo(5, 3)).toBe(2);
        expect(lamb.modulo(-5, 3)).toBe(1);
        expect(isNaN(lamb.modulo(-5, 0))).toBe(true);
    });
});
