import deduct from "../deduct";
import subtract from "../subtract";

describe("subtract / deduct", () => {
    it("should subtract two numbers", () => {
        expect(subtract(5, 7)).toBe(-2);
        expect(deduct(7)(5)).toBe(-2);
    });
});
