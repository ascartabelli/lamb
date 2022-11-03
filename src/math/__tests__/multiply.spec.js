import multiply from "../multiply";
import multiplyBy from "../multiplyBy";

describe("multiply / multiplyBy", () => {
    it("should multiply two numbers", () => {
        expect(multiply(5, -3)).toBe(-15);
        expect(multiplyBy(5)(-3)).toBe(-15);
    });
});
