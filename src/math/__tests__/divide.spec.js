import * as lamb from "../..";

describe("divide / divideBy", function () {
    it("should divide two numbers", function () {
        var divideBy3 = lamb.divideBy(3);

        expect(lamb.divide(15, 3)).toBe(5);
        expect(lamb.divide(15, 0)).toBe(Infinity);
        expect(divideBy3(15)).toBe(5);
        expect(divideBy3(16)).toBe(5.333333333333333);
    });
});
