import * as lamb from "../..";

describe("add / sum", function () {
    it("should add two numbers", function () {
        expect(lamb.sum(2, -3)).toBe(-1);
        expect(lamb.add(2)(-3)).toBe(-1);
    });
});
