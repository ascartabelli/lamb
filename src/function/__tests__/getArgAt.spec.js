import getArgAt from "../getArgAt";
import { zeroesAsIntegers } from "../../__tests__/commons";

describe("getArgAt", () => {
    it("should build a function that returns the argument received at the given index", () => {
        expect(getArgAt(1)("a", "b", "c")).toBe("b");
    });

    it("should allow negative indexes", () => {
        expect(getArgAt(-1)("a", "b", "c")).toBe("c");
        expect(getArgAt(-2)("a", "b", "c")).toBe("b");
    });

    it("should build a function returning `undefined` if no arguments are passed or if the index is out of bounds", () => {
        expect(getArgAt(6)("a", "b", "c")).toBeUndefined();
        expect(getArgAt(-4)("a", "b", "c")).toBeUndefined();
        expect(getArgAt(2)()).toBeUndefined();
    });

    it("should convert the `idx` parameter to integer", () => {
        zeroesAsIntegers.forEach(value => {
            expect(getArgAt(value)("a", "b", "c")).toBe("a");
        });

        [[1], 1.5, 1.25, 1.75, true, "1"].forEach(value => {
            expect(getArgAt(value)("a", "b", "c")).toBe("b");
        });

        expect(getArgAt(new Date())("a", "b", "c")).toBeUndefined();
        expect(getArgAt()("a", "b", "c")).toBe("a");
    });
});
