import * as lamb from "../..";
import { wannabeEmptyObjects } from "../../__tests__/commons";

describe("enumerables", function () {
    it("should build an array with all the enumerables keys of an object", function () {
        var baseFoo = Object.create({ a: 1 }, { b: { value: 2 } });
        var foo = Object.create(baseFoo, {
            c: { value: 3 },
            d: { value: 4, enumerable: true }
        });

        expect(lamb.enumerables(foo)).toEqual(["d", "a"]);
    });

    it("should work with arrays and array-like objects", function () {
        expect(lamb.enumerables([1, 2, 3])).toEqual(["0", "1", "2"]);
        expect(lamb.enumerables("abc")).toEqual(["0", "1", "2"]);
    });

    it("should retrieve only defined keys in sparse arrays", function () {
        // eslint-disable-next-line comma-spacing, no-sparse-arrays
        expect(lamb.enumerables([, 5, 6, ,])).toStrictEqual(["1", "2"]);
    });

    it("should throw an exception if called without arguments", function () {
        expect(lamb.enumerables).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined`", function () {
        expect(function () { lamb.enumerables(null); }).toThrow();
        expect(function () { lamb.enumerables(void 0); }).toThrow();
    });

    it("should consider other values as empty objects", function () {
        wannabeEmptyObjects.forEach(function (value) {
            expect(lamb.enumerables(value)).toEqual([]);
        });
    });
});
