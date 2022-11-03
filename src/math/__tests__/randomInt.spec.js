import randomInt from "../randomInt";

describe("randomInt", () => {
    it("should generate a random integer between the min and max provided values", () => {
        const n = randomInt(3, 42);

        expect(Math.floor(n)).toBe(n);
        expect(n).toBeGreaterThan(2);
        expect(n).toBeLessThan(43);

        const rndSpy = jest.spyOn(Math, "random").mockReturnValue(0.9999999999999999);

        expect(randomInt(0, 0)).toBe(0);
        expect(randomInt(0, 1)).toBe(1);
        expect(randomInt(0, 2)).toBe(2);

        rndSpy.mockReturnValue(0);

        expect(randomInt(0, 0)).toBe(0);
        expect(randomInt(0, 1)).toBe(0);
        expect(randomInt(0, 2)).toBe(0);

        rndSpy.mockRestore();
    });
});
