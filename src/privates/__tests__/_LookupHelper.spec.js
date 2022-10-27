import _LookupHelper from "../_LookupHelper";

describe("_Lookuphelper", () => {
    describe("with Set", () => {
        it("should create a helper to facilitate lookup of values using a Set", () => {
            const helper = new _LookupHelper();

            expect(helper.has(3)).toBe(false);

            helper.add(3);

            expect(helper.has(3)).toBe(true);
        });

        it("should accept an array object to build a list of initial values for the lookup", () => {
            const helper = new _LookupHelper(["a", "b", "c"]);

            expect(helper.has("b")).toBe(true);
        });

        it("should accept an array-like object to build a list of initial values for the lookup", () => {
            const helper = new _LookupHelper("abc");

            expect(helper.has("b")).toBe(true);
        });

        it("should ignore other values passed to the constructor", () => {
            const helper = new _LookupHelper(1);

            expect(helper.has(1)).toBe(false);
        });

        it("should use the \"SameValueZero\" comparison", () => {
            const helper = new _LookupHelper([-0, NaN]);

            expect(helper.has(-0)).toBe(true);
            expect(helper.has(0)).toBe(true);
            expect(helper.has(0 / 0)).toBe(true);
        });
    });

    describe("without Set", () => {
        const originalSet = Set;

        beforeAll(() => {
            global.Set = null;
        });

        afterAll(() => {
            global.Set = originalSet;
        });

        it("should create a helper to facilitate lookup of values using an array", () => {
            const helper = new _LookupHelper();

            expect(helper.has(3)).toBe(false);

            helper.add(3);

            expect(helper.has(3)).toBe(true);
        });

        it("should accept an array object to build a list of initial values for the lookup", () => {
            const helper = new _LookupHelper(["a", "b", "c"]);

            expect(helper.has("b")).toBe(true);
        });

        it("should accept an array-like object to build a list of initial values for the lookup", () => {
            const helper = new _LookupHelper("abc");

            expect(helper.has("b")).toBe(true);
        });

        it("should ignore other values passed to the constructor", () => {
            const helper = new _LookupHelper(1);

            expect(helper.has(1)).toBe(false);
        });

        it("should use the \"SameValueZero\" comparison", () => {
            const helper = new _LookupHelper([-0, NaN]);

            expect(helper.has(-0)).toBe(true);
            expect(helper.has(0)).toBe(true);
            expect(helper.has(0 / 0)).toBe(true);
        });
    });
});
