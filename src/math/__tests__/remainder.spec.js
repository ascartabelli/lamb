import remainder from "../remainder";

describe("remainder", () => {
    it("should calculate the remainder of the division of two numbers", () => {
        expect(remainder(5, 3)).toBe(2);
        expect(remainder(-5, 3)).toBe(-2);
        expect(isNaN(remainder(-5, 0))).toBe(true);
    });
});
