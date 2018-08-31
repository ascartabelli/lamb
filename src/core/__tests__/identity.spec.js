import * as lamb from "../..";

describe("identity", function () {
    it("should return the value received as argument", function () {
        expect(lamb.identity(0)).toBe(0);
        expect(lamb.identity("foo")).toBe("foo");
        expect(lamb.identity(null)).toBe(null);
        expect(lamb.identity()).toBeUndefined();

        var someRefType = { foo: 5 };

        expect(lamb.identity(someRefType)).toBe(someRefType);
    });
});
