import add from "../../math/add";
import invoke from "../../function/invoke";
import mapValues from "../mapValues";
import mapValuesWith from "../mapValuesWith";
import multiplyBy from "../../math/multiplyBy";
import { wannabeEmptyObjects } from "../../__tests__/commons";

describe("mapValues / mapValuesWith", () => {
    const baseFoo = Object.create(
        { a: 1 },
        { b: { value: 2, enumerable: true }, z: { value: 5 } }
    );
    const foo = Object.create(baseFoo, { c: { value: 3, enumerable: true } });
    const fooEquivalent = { a: 1, b: 2, c: 3, z: 5 };
    const inc = add(1);

    // The "toStrictEqual" matcher would have checked only own enumerable properties
    afterEach(() => {
        for (const key in fooEquivalent) {
            expect(fooEquivalent[key]).toBe(foo[key]);
        }
    });

    it("should create a new object by applying the received function to the values of the source one", () => {
        const times3 = multiplyBy(3);
        const r = { a: 3, b: 6, c: 9 };

        expect(mapValues(foo, times3)).toStrictEqual(r);
        expect(mapValuesWith(times3)(foo)).toStrictEqual(r);
    });

    it("should use all the enumerable properties of the source object, inherited or not", () => {
        const r = { a: 2, b: 3, c: 4 };

        expect(mapValues(foo, inc)).toStrictEqual(r);
        expect(mapValuesWith(inc)(foo)).toStrictEqual(r);
    });

    it("should pass the key value, its name and the object being traversed to the mapping function", () => {
        function deductFive (v, k, o) {
            expect(o).toBe(foo);
            expect(o[k]).toBe(v);

            return v - 5;
        }

        const r = { a: -4, b: -3, c: -2 };

        expect(mapValues(foo, deductFive)).toStrictEqual(r);
        expect(mapValuesWith(deductFive)(foo)).toStrictEqual(r);
    });

    it("should work with array-like objects", () => {
        const a = [97, 97, 98];
        const s = "abc";
        const r1 = { 0: 98, 1: 98, 2: 99 };
        const r2 = { 0: "A", 1: "B", 2: "C" };

        const toUpperCase = invoke("toUpperCase");

        expect(mapValues(a, inc)).toStrictEqual(r1);
        expect(mapValuesWith(inc)(a)).toStrictEqual(r1);

        expect(mapValues(s, toUpperCase)).toStrictEqual(r2);
        expect(mapValuesWith(toUpperCase)(s)).toStrictEqual(r2);
    });

    it("should throw an exception if called without arguments", () => {
        expect(mapValues).toThrow();
        expect(mapValuesWith()).toThrow();
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an object", () => {
        expect(() => { mapValues(null, inc); }).toThrow();
        expect(() => { mapValues(void 0, inc); }).toThrow();
        expect(() => { mapValuesWith(inc)(null); }).toThrow();
        expect(() => { mapValuesWith(inc)(void 0); }).toThrow();
    });

    it("should consider other values as empty objects", () => {
        wannabeEmptyObjects.forEach(value => {
            expect(mapValues(value, inc)).toStrictEqual({});
            expect(mapValuesWith(inc)(value)).toStrictEqual({});
        });
    });

    it("should throw an exception if `fn` isn't a function or if it's missing", () => {
        expect(() => { mapValues(foo); }).toThrow();
        expect(() => { mapValuesWith()(foo); }).toThrow();
    });
});
