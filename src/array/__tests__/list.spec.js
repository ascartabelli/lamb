import * as lamb from "../..";

describe("list", function () {
    it("should build an array with the received arguments", function () {
        expect(lamb.list(123)).toEqual([123]);
        expect(lamb.list(1, 2, 3)).toEqual([1, 2, 3]);
        expect(lamb.list(null, void 0)).toEqual([null, void 0]);
        expect(lamb.list(void 0)).toEqual([void 0]);
    });

    it("should return an empty array if no arguments are supplied", function () {
        expect(lamb.list()).toEqual([]);
    });
});
