import reverse from "../reverse";
import { wannabeEmptyArrays } from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("reverse", () => {
    it("should reverse a copy of an array-like object", () => {
        const arr = [1, 2, 3, 4, 5];
        const s = "hello";

        expect(reverse(arr)).toStrictEqual([5, 4, 3, 2, 1]);
        expect(reverse(s)).toStrictEqual(["o", "l", "l", "e", "h"]);
        expect(arr).toStrictEqual([1, 2, 3, 4, 5]);
    });

    it("should always return dense arrays", () => {
        // eslint-disable-next-line no-sparse-arrays
        expect(reverse([1, , 3])).toStrictArrayEqual([3, void 0, 1]);
    });

    it("should throw an exception if called without arguments", () => {
        expect(reverse).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", () => {
        expect(() => { reverse(null); }).toThrow();
        expect(() => { reverse(void 0); }).toThrow();
    });

    it("should treat every other value as an empty array", () => {
        wannabeEmptyArrays.forEach(value => {
            expect(reverse(value)).toStrictEqual([]);
        });
    });
});
