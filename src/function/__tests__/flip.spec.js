import * as lamb from "../..";

describe("flip", function () {
    it("should return a function that applies its arguments to the original function in reverse order", function () {
        var appendTo = function (a, b) { return a + b; };
        var prependTo = lamb.flip(appendTo);

        expect(prependTo("foo", "bar")).toBe("barfoo");
    });
});
