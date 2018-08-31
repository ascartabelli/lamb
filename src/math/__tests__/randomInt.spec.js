import * as lamb from "../..";

describe("randomInt", function () {
    it("should generate a random integer between the min and max provided values", function () {
        var n = lamb.randomInt(3, 42);

        expect(Math.floor(n)).toBe(n);
        expect(n).toBeGreaterThan(2);
        expect(n).toBeLessThan(43);

        var rndSpy = jest.spyOn(Math, "random").mockReturnValue(0.9999999999999999);

        expect(lamb.randomInt(0, 0)).toBe(0);
        expect(lamb.randomInt(0, 1)).toBe(1);
        expect(lamb.randomInt(0, 2)).toBe(2);

        rndSpy.mockReturnValue(0);

        expect(lamb.randomInt(0, 0)).toBe(0);
        expect(lamb.randomInt(0, 1)).toBe(0);
        expect(lamb.randomInt(0, 2)).toBe(0);

        rndSpy.mockRestore();
    });
});
