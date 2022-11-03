import identity from "../identity";

describe("identity", () => {
    it("should return the value received as argument", () => {
        expect(identity(0)).toBe(0);
        expect(identity("foo")).toBe("foo");
        expect(identity(null)).toBe(null);
        expect(identity()).toBeUndefined();

        const someRefType = { foo: 5 };

        expect(identity(someRefType)).toBe(someRefType);
    });
});
