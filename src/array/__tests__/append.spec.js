import * as lamb from "../..";
import { wannabeEmptyArrays } from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("append / appendTo", function () {
    var arr = ["a", "b", "c", "d", "e"];
    var s = "abcde";
    var r1 = ["a", "b", "c", "d", "e", "z"];
    var r2 = ["a", "b", "c", "d", "e", ["z"]];
    var r3 = ["a", "b", "c", "d", "e", void 0];

    afterEach(function () {
        expect(arr).toEqual(["a", "b", "c", "d", "e"]);
    });

    it("should append a value at the end of a copy of the given array", function () {
        expect(lamb.appendTo(arr, "z")).toEqual(r1);
        expect(lamb.append("z")(arr)).toEqual(r1);
        expect(lamb.appendTo(arr, ["z"])).toEqual(r2);
        expect(lamb.append(["z"])(arr)).toEqual(r2);
    });

    it("should accept array-like objects", function () {
        expect(lamb.appendTo(s, "z")).toEqual(r1);
        expect(lamb.append("z")(s)).toEqual(r1);
        expect(lamb.appendTo(s, ["z"])).toEqual(r2);
        expect(lamb.append(["z"])(s)).toEqual(r2);
    });

    it("should always return dense arrays", function () {
        /* eslint-disable no-sparse-arrays */
        expect(lamb.appendTo([1, , , 4], 5)).toStrictArrayEqual([1, void 0, void 0, 4, 5]);
        expect(lamb.append(5)([1, , , 4])).toStrictArrayEqual([1, void 0, void 0, 4, 5]);
        /* eslint-enable no-sparse-arrays */
    });

    it("should append an `undefined` value when the `value` parameter is missing", function () {
        expect(lamb.appendTo(arr)).toEqual(r3);
        expect(lamb.append()(arr)).toEqual(r3);
    });

    it("should throw an exception if called without the data argument", function () {
        expect(lamb.appendTo).toThrow();
        expect(lamb.append("z")).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", function () {
        expect(function () { lamb.appendTo(null, "z"); }).toThrow();
        expect(function () { lamb.appendTo(void 0, "z"); }).toThrow();
        expect(function () { lamb.append("z")(null); }).toThrow();
        expect(function () { lamb.append("z")(void 0); }).toThrow();
    });

    it("should treat every other value as an empty array", function () {
        wannabeEmptyArrays.forEach(function (value) {
            expect(lamb.appendTo(value, "z")).toEqual(["z"]);
            expect(lamb.append("z")(value)).toEqual(["z"]);
        });
    });
});
