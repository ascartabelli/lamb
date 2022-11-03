import append from "../append";
import appendTo from "../appendTo";
import { wannabeEmptyArrays } from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("append / appendTo", () => {
    const arr = ["a", "b", "c", "d", "e"];
    const s = "abcde";
    const r1 = ["a", "b", "c", "d", "e", "z"];
    const r2 = ["a", "b", "c", "d", "e", ["z"]];
    const r3 = ["a", "b", "c", "d", "e", void 0];

    afterEach(() => {
        expect(arr).toStrictEqual(["a", "b", "c", "d", "e"]);
    });

    it("should append a value at the end of a copy of the given array", () => {
        expect(appendTo(arr, "z")).toStrictEqual(r1);
        expect(append("z")(arr)).toStrictEqual(r1);
        expect(appendTo(arr, ["z"])).toStrictEqual(r2);
        expect(append(["z"])(arr)).toStrictEqual(r2);
    });

    it("should accept array-like objects", () => {
        expect(appendTo(s, "z")).toStrictEqual(r1);
        expect(append("z")(s)).toStrictEqual(r1);
        expect(appendTo(s, ["z"])).toStrictEqual(r2);
        expect(append(["z"])(s)).toStrictEqual(r2);
    });

    it("should always return dense arrays", () => {
        /* eslint-disable no-sparse-arrays */
        expect(appendTo([1, , , 4], 5)).toStrictArrayEqual([1, void 0, void 0, 4, 5]);
        expect(append(5)([1, , , 4])).toStrictArrayEqual([1, void 0, void 0, 4, 5]);
        /* eslint-enable no-sparse-arrays */
    });

    it("should append an `undefined` value when the `value` parameter is missing", () => {
        expect(appendTo(arr)).toStrictEqual(r3);
        expect(append()(arr)).toStrictEqual(r3);
    });

    it("should throw an exception if called without the data argument", () => {
        expect(appendTo).toThrow();
        expect(append("z")).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", () => {
        expect(() => { appendTo(null, "z"); }).toThrow();
        expect(() => { appendTo(void 0, "z"); }).toThrow();
        expect(() => { append("z")(null); }).toThrow();
        expect(() => { append("z")(void 0); }).toThrow();
    });

    it("should treat every other value as an empty array", () => {
        wannabeEmptyArrays.forEach(value => {
            expect(appendTo(value, "z")).toStrictEqual(["z"]);
            expect(append("z")(value)).toStrictEqual(["z"]);
        });
    });
});
