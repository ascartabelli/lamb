import flip from "../flip";

describe("flip", () => {
    it("should return a function that applies its arguments to the original function in reverse order", () => {
        const appendTo = (a, b) => a + b;
        const prependTo = flip(appendTo);

        expect(prependTo("foo", "bar")).toBe("barfoo");
    });
});
