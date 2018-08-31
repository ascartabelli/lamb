import * as lamb from "../..";

describe("type", function () {
    it("should extract the \"type tag\" from the given value", function () {
        var getArgsType = function () { return lamb.type(arguments); };

        expect(getArgsType()).toBe("Arguments");
        expect(lamb.type(new getArgsType())).toBe("Object"); // eslint-disable-line new-cap
        expect(lamb.type(void 0)).toBe("Undefined");
        expect(lamb.type(null)).toBe("Null");
        expect(lamb.type(NaN)).toBe("Number");
        expect(lamb.type(0)).toBe("Number");
        expect(lamb.type(new Number())).toBe("Number");
        expect(lamb.type("")).toBe("String");
        expect(lamb.type(new String("foo"))).toBe("String");
        expect(lamb.type(/a/)).toBe("RegExp");
        expect(lamb.type(new RegExp())).toBe("RegExp");
        expect(lamb.type(new Date())).toBe("Date");
        expect(lamb.type(function () {})).toBe("Function");
        expect(lamb.type(new Function())).toBe("Function");
        expect(lamb.type([1, 2, 3])).toBe("Array");
        expect(lamb.type(new Array())).toBe("Array");
        expect(lamb.type(Object.create(null))).toBe("Object");
        expect(lamb.type({})).toBe("Object");
    });
});
