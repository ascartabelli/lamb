import add from "../add";
import sum from "../sum";

describe("add / sum", () => {
    it("should add two numbers", () => {
        expect(sum(2, -3)).toBe(-1);
        expect(add(2)(-3)).toBe(-1);
    });
});
