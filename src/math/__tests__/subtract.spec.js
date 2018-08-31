import * as lamb from "../..";

describe("subtract / deduct", function () {
    it("should subtract two numbers", function () {
        expect(lamb.subtract(5, 7)).toBe(-2);
        expect(lamb.deduct(7)(5)).toBe(-2);
    });
});
