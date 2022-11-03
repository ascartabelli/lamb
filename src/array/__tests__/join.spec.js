import join from "../join";
import joinWith from "../joinWith";
import {
    nonStrings,
    nonStringsAsStrings,
    wannabeEmptyArrays
} from "../../__tests__/commons";

describe("join / joinWith", () => {
    const arr = [-0, 1, 2, 3, 4, 5];
    const s = "abcde";
    const joinWithDash = joinWith("-");

    it("should allow to join an array with the given separator", () => {
        expect(join(arr, "-")).toBe("0-1-2-3-4-5");
        expect(joinWithDash(arr)).toBe("0-1-2-3-4-5");
    });

    it("should accept any string, and not only chars, as separators", () => {
        const result = "0_foobarbaz_1_foobarbaz_2_foobarbaz_3_foobarbaz_4_foobarbaz_5";

        expect(join(arr, "_foobarbaz_")).toBe(result);
        expect(joinWith("_foobarbaz_")(arr)).toBe(result);
        expect(join(arr, "")).toBe("012345");
        expect(joinWith("")(arr)).toBe("012345");
    });

    it("should convert to string separators of other types", () => {
        const arr2 = [1, 2, 3];

        nonStrings.forEach((nonString, idx) => {
            const result = "1" + nonStringsAsStrings[idx] + "2" + nonStringsAsStrings[idx] + "3";

            expect(join(arr2, nonString)).toBe(result);
            expect(joinWith(nonString)(arr2)).toBe(result);
        });

        expect(join(arr2)).toBe("1undefined2undefined3");
        expect(joinWith()(arr2)).toBe("1undefined2undefined3");
    });

    it("should work with array-like objects", () => {
        expect(join(s, "-")).toBe("a-b-c-d-e");
        expect(joinWithDash(s)).toBe("a-b-c-d-e");
    });

    it("should convert to string any other value in the source array, even `null` and `undefined` values, unlike the native method", () => {
        expect(join(nonStrings, "-")).toBe(join(nonStringsAsStrings, "-"));
        expect(joinWithDash(nonStrings)).toBe(joinWithDash(nonStringsAsStrings));
    });

    it("should not skip deleted or unassigned indexes in sparse arrays", () => {
        const sparseArr = [1, , , 4]; // eslint-disable-line no-sparse-arrays

        expect(join(sparseArr, "-")).toBe("1-undefined-undefined-4");
        expect(joinWithDash(sparseArr)).toBe("1-undefined-undefined-4");
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", () => {
        expect(() => { join(null, "-"); }).toThrow();
        expect(() => { join(void 0, "-"); }).toThrow();
        expect(() => { joinWithDash(null); }).toThrow();
        expect(() => { joinWithDash(void 0); }).toThrow();
    });

    it("should treat every other value as an empty array", () => {
        wannabeEmptyArrays.forEach(value => {
            expect(join(value, "-")).toBe("");
            expect(joinWithDash(value)).toBe("");
        });
    });
});
