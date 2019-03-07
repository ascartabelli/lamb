import * as lamb from "../..";
import {
    nonStrings,
    nonStringsAsStrings,
    wannabeEmptyArrays
} from "../../__tests__/commons";

describe("join / joinWith", function () {
    var arr = [-0, 1, 2, 3, 4, 5];
    var s = "abcde";

    var joinWithDash = lamb.joinWith("-");

    it("should allow to join an array with the given separator", function () {
        expect(lamb.join(arr, "-")).toBe("0-1-2-3-4-5");
        expect(joinWithDash(arr)).toBe("0-1-2-3-4-5");
    });

    it("should accept any string, and not only chars, as separators", function () {
        var result = "0_foobarbaz_1_foobarbaz_2_foobarbaz_3_foobarbaz_4_foobarbaz_5";

        expect(lamb.join(arr, "_foobarbaz_")).toBe(result);
        expect(lamb.joinWith("_foobarbaz_")(arr)).toBe(result);
        expect(lamb.join(arr, "")).toBe("012345");
        expect(lamb.joinWith("")(arr)).toBe("012345");
    });

    it("should convert to string separators of other types", function () {
        var arr2 = [1, 2, 3];

        nonStrings.forEach(function (nonString, idx) {
            var result = "1" + nonStringsAsStrings[idx] + "2" + nonStringsAsStrings[idx] + "3";

            expect(lamb.join(arr2, nonString)).toBe(result);
            expect(lamb.joinWith(nonString)(arr2)).toBe(result);
        });

        expect(lamb.join(arr2)).toBe("1undefined2undefined3");
        expect(lamb.joinWith()(arr2)).toBe("1undefined2undefined3");
    });

    it("should work with array-like objects", function () {
        expect(lamb.join(s, "-")).toBe("a-b-c-d-e");
        expect(joinWithDash(s)).toBe("a-b-c-d-e");
    });

    it("should convert to string any other value in the source array, even `null` and `undefined` values, unlike the native method", function () {
        expect(lamb.join(nonStrings, "-")).toBe(lamb.join(nonStringsAsStrings, "-"));
        expect(joinWithDash(nonStrings)).toBe(joinWithDash(nonStringsAsStrings));
    });

    it("should not skip deleted or unassigned indexes in sparse arrays", function () {
        var sparseArr = [1, , , 4]; // eslint-disable-line no-sparse-arrays

        expect(lamb.join(sparseArr, "-")).toBe("1-undefined-undefined-4");
        expect(joinWithDash(sparseArr)).toBe("1-undefined-undefined-4");
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", function () {
        expect(function () { lamb.join(null, "-"); }).toThrow();
        expect(function () { lamb.join(void 0, "-"); }).toThrow();
        expect(function () { joinWithDash(null); }).toThrow();
        expect(function () { joinWithDash(void 0); }).toThrow();
    });

    it("should treat every other value as an empty array", function () {
        wannabeEmptyArrays.forEach(function (value) {
            expect(lamb.join(value, "-")).toBe("");
            expect(joinWithDash(value)).toBe("");
        });
    });
});
