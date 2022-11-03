import allOf from "../../logic/allOf";
import filterWith from "../../array/filterWith";
import isNil from "../../core/isNil";
import isNull from "../../core/isNull";
import isType from "../../type/isType";
import keySatisfies from "../../object/keySatisfies";
import not from "../../logic/not";
import replace from "../replace";
import {
    nonFunctions,
    nonStrings,
    nonStringsAsStrings
} from "../../__tests__/commons";

describe("replace", () => {
    // These aren't converted to string and throw errors when used as parameters
    const excludeNullPrototype = filterWith(allOf([
        isType("Object"),
        keySatisfies(isNull, "prototype")
    ]));
    const excludeRegExps = filterWith(not(isType("RegExp")));
    const nullPrototypeObject = Object.create(null);

    it("should build a partial application of `String.prototype.replace` using the provided needle and substitution", () => {
        const haystack = "Lorem ipsum dolor sit amet, consectetur adipisicing elit";
        const expected = "Lorem ipsum dolor sIT amet, consectetur adipisicing elIT";
        const needle = /it/g;
        const sub = "IT";

        expect(replace(needle, sub)(haystack)).toBe(expected);
    });

    it("should throw an exception if an object with a null prototype is passed as \"needle\"", () => {
        expect(() => replace(nullPrototypeObject, "b")("a")).toThrow();
    });

    it("should convert any other non-regex value passed as \"needle\" to string", () => {
        const parts = [
            "Lorem ipsum dolor sit amet,",
            "consectetur adipisicing elit"
        ];
        const expected = parts.join("");

        excludeRegExps(nonStrings).forEach(value => {
            const haystack = parts.join(String(value));

            expect(replace(value, "")(haystack)).toBe(expected);
        });
    });

    it("should throw an exception if an object with a null prototype is passed as a subsitution", () => {
        expect(() => replace(/a/, nullPrototypeObject)("a")).toThrow();
    });

    it("should convert any other non-function value passed as a substitution to string", () => {
        excludeNullPrototype(nonFunctions).forEach(value => {
            const valueAsString = String(value);

            expect(replace(/a/, value)("a")).toBe(valueAsString);
        });
    });

    it("should throw an exception when the source string is `nil` or is missing", () => {
        expect(() => replace(/asd/, "")(null)).toThrow();
        expect(() => replace(/asd/, "")(void 0)).toThrow();
    });

    it("should throw an exception when a null prototype object is passed as the \"haystack\"", () => {
        expect(() => replace(/asd/, "")(nullPrototypeObject)).toThrow();
    });

    it("should convert to string any other value passed as the \"haystack\"", () => {
        const replaceWithSpaces = replace(/./g, " ");

        nonStrings.forEach((value, idx) => {
            if (!isNil(value)) {
                expect(replaceWithSpaces(value)).toBe(replaceWithSpaces(nonStringsAsStrings[idx]));
            }
        });
    });
});
