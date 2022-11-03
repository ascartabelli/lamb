import list from "../list";

describe("list", () => {
    it("should build an array with the received arguments", () => {
        expect(list(123)).toStrictEqual([123]);
        expect(list(1, 2, 3)).toStrictEqual([1, 2, 3]);
        expect(list(null, void 0)).toStrictEqual([null, void 0]);
        expect(list(void 0)).toStrictEqual([void 0]);
    });

    it("should return an empty array if no arguments are supplied", () => {
        expect(list()).toStrictEqual([]);
    });
});
