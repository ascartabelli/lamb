import type from "../type";

describe("type", () => {
    it("should extract the \"type tag\" from the given value", () => {
        function getArgsType () {
            return type(arguments);
        }

        expect(getArgsType()).toBe("Arguments");
        expect(type(new getArgsType())).toBe("Object"); // eslint-disable-line new-cap
        expect(type(void 0)).toBe("Undefined");
        expect(type(null)).toBe("Null");
        expect(type(NaN)).toBe("Number");
        expect(type(0)).toBe("Number");
        expect(type(new Number())).toBe("Number");
        expect(type("")).toBe("String");
        expect(type(new String("foo"))).toBe("String");
        expect(type(/a/)).toBe("RegExp");
        expect(type(new RegExp())).toBe("RegExp");
        expect(type(new Date())).toBe("Date");
        expect(type(function () {})).toBe("Function");
        expect(type(new Function())).toBe("Function");
        expect(type([1, 2, 3])).toBe("Array");
        expect(type(new Array())).toBe("Array");
        expect(type(Object.create(null))).toBe("Object");
        expect(type({})).toBe("Object");
    });
});
