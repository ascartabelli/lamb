import * as lamb from "../..";
import {
    nonFunctions,
    nonStrings,
    nonStringsAsStrings
} from "../../__tests__/commons";

describe("replace", () => {
    // These aren't converted to string and throw errors when used as parameters
    const excludeNullPrototype = lamb.filterWith(lamb.allOf([
        lamb.isType("Object"),
        lamb.keySatisfies(lamb.isNull, "prototype")
    ]));
    const excludeRegExps = lamb.filterWith(lamb.not(lamb.isType("RegExp")));
    const nullPrototypeObject = Object.create(null);

    it("should build a partial application of `String.prototype.replace` using the provided needle and substitution", () => {
        const haystack = "Lorem ipsum dolor sit amet, consectetur adipisicing elit";
        const expected = "Lorem ipsum dolor sIT amet, consectetur adipisicing elIT";
        const needle = /it/g;
        const sub = "IT";

        expect(lamb.replace(needle, sub)(haystack)).toBe(expected);
    });

    it("should throw an exception if an object with a null prototype is passed as \"needle\"", () => {
        expect(() => lamb.replace(nullPrototypeObject, "b")("a")).toThrow();
    });

    it("should convert any other non-regex value passed as \"needle\" to string", () => {
        const parts = [
            "Lorem ipsum dolor sit amet,",
            "consectetur adipisicing elit"
        ];
        const expected = parts.join("");

        excludeRegExps(nonStrings).forEach(value => {
            const haystack = parts.join(String(value));

            expect(lamb.replace(value, "")(haystack)).toBe(expected);
        });
    });

    it("should throw an exception if an object with a null prototype is passed as a subsitution", () => {
        expect(() => lamb.replace(/a/, nullPrototypeObject)("a")).toThrow();
    });

    it("should convert any other non-function value passed as a substitution to string", () => {
        excludeNullPrototype(nonFunctions).forEach(value => {
            const valueAsString = String(value);

            expect(lamb.replace(/a/, value)("a")).toBe(valueAsString);
        });
    });

    it("should throw an exception when the source string is `nil` or is missing", () => {
        expect(() => lamb.replace(/asd/, "")(null)).toThrow();
        expect(() => lamb.replace(/asd/, "")(void 0)).toThrow();
    });

    it("should throw an exception when a null prototype object is passed as the \"haystack\"", () => {
        expect(() => lamb.replace(/asd/, "")(nullPrototypeObject)).toThrow();
    });

    it("should convert to string any other value passed as the \"haystack\"", () => {
        const replaceWithSpaces = lamb.replace(/./g, " ");

        nonStrings.forEach((value, idx) => {
            if (!lamb.isNil(value)) {
                expect(replaceWithSpaces(value)).toBe(replaceWithSpaces(nonStringsAsStrings[idx]));
            }
        });
    });
});
