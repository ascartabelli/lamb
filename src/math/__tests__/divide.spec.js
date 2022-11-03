import divide from "../divide";
import divideBy from "../divideBy";

describe("divide / divideBy", () => {
    it("should divide two numbers", () => {
        const divideBy3 = divideBy(3);

        expect(divide(15, 3)).toBe(5);
        expect(divide(15, 0)).toBe(Infinity);
        expect(divideBy3(15)).toBe(5);
        expect(divideBy3(16)).toBe(5.333333333333333);
    });
});
