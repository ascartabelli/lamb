var lamb = require("../../dist/lamb.js");

describe("lamb.type", function () {
    describe("isNil", function () {
        it("should verify if the given value is null or undefined", function () {
            expect(lamb.isNil(null)).toBe(true);
            expect(lamb.isNil(void 0)).toBe(true);
            expect(lamb.isNil(0)).toBe(false);
            expect(lamb.isNil(NaN)).toBe(false);
        });
    });

    describe("isNull", function () {
        it("should verify if the given value is null", function () {
            expect(lamb.isNull(null)).toBe(true);
            expect(lamb.isNull(void 0)).toBe(false);
            expect(lamb.isNull(0)).toBe(false);
            expect(lamb.isNull(NaN)).toBe(false);
        });
    });

    describe("isType", function () {
        it("should build a predicate that expects a value to check against the specified type", function () {
            var isArray = lamb.isType("Array");
            var isFunction = lamb.isType("Function");

            expect(isArray([1, 2, 3])).toBe(true);
            expect(isFunction(function () {})).toBe(true);
        });
    });

    describe("isUndefined", function () {
        it("should verify if the given value is undefined", function () {
            expect(lamb.isUndefined(null)).toBe(false);
            expect(lamb.isUndefined(void 0)).toBe(true);
            expect(lamb.isUndefined(0)).toBe(false);
            expect(lamb.isUndefined(NaN)).toBe(false);
        });
    });

    describe("typeOf", function () {
        it("should extract the \"type tag\" from the given value", function () {
            var getArgsType = function () { return lamb.typeOf(arguments); };
            expect(getArgsType()).toBe("Arguments");
            expect(lamb.typeOf(void 0)).toBe("Undefined");
            expect(lamb.typeOf(null)).toBe("Null");
            expect(lamb.typeOf(NaN)).toBe("Number");
            expect(lamb.typeOf(0)).toBe("Number");
            expect(lamb.typeOf(new Number())).toBe("Number");
            expect(lamb.typeOf("")).toBe("String");
            expect(lamb.typeOf(new String("foo"))).toBe("String");
            expect(lamb.typeOf(/a/)).toBe("RegExp");
            expect(lamb.typeOf(new RegExp())).toBe("RegExp");
            expect(lamb.typeOf(new Date())).toBe("Date");
            expect(lamb.typeOf(function () {})).toBe("Function");
            expect(lamb.typeOf(new Function())).toBe("Function");
            expect(lamb.typeOf([1, 2, 3])).toBe("Array");
            expect(lamb.typeOf(new Array())).toBe("Array");
            expect(lamb.typeOf(Object.create(null))).toBe("Object");
            expect(lamb.typeOf({})).toBe("Object");
            expect(lamb.typeOf(new getArgsType())).toBe("Object");
        });
    });
});
