import modulo from "../modulo";

describe("modulo", () => {
    it("should calculate the modulo of two numbers", () => {
        expect(modulo(5, 3)).toBe(2);
        expect(modulo(-5, 3)).toBe(1);
        expect(isNaN(modulo(-5, 0))).toBe(true);
    });
});
