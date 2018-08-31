import * as lamb from "../..";
import { zeroesAsIntegers } from "../../__tests__/commons";

describe("getArgAt", function () {
    it("should build a function that returns the argument received at the given index", function () {
        expect(lamb.getArgAt(1)("a", "b", "c")).toBe("b");
    });

    it("should allow negative indexes", function () {
        expect(lamb.getArgAt(-1)("a", "b", "c")).toBe("c");
        expect(lamb.getArgAt(-2)("a", "b", "c")).toBe("b");
    });

    it("should build a function returning `undefined` if no arguments are passed or if the index is out of bounds", function () {
        expect(lamb.getArgAt(6)("a", "b", "c")).toBeUndefined();
        expect(lamb.getArgAt(-4)("a", "b", "c")).toBeUndefined();
        expect(lamb.getArgAt(2)()).toBeUndefined();
    });

    it("should convert the `idx` parameter to integer", function () {
        zeroesAsIntegers.forEach(function (value) {
            expect(lamb.getArgAt(value)("a", "b", "c")).toBe("a");
        });

        [[1], 1.5, 1.25, 1.75, true, "1"].forEach(function (value) {
            expect(lamb.getArgAt(value)("a", "b", "c")).toBe("b");
        });

        expect(lamb.getArgAt(new Date())("a", "b", "c")).toBeUndefined();
        expect(lamb.getArgAt()("a", "b", "c")).toBe("a");
    });
});
