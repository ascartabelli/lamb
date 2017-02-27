var commons = require("../commons.js");

var lamb = commons.lamb;

var nonFunctions = commons.vars.nonFunctions;
var nonNils = commons.vars.nonNils;
var nonNulls = commons.vars.nonNulls;
var nonUndefineds = commons.vars.nonUndefineds;
var valuesList = commons.vars.valuesList;

describe("lamb.type", function () {
    describe("isInstanceOf", function () {
        it("should build a predicate to check if an object is an instance of the given constructor", function () {
            function SomeObjA () {}
            function SomeObjB () {}

            var a = new SomeObjA();
            var b = new SomeObjB();

            expect(lamb.isInstanceOf(SomeObjA)(a)).toBe(true);
            expect(lamb.isInstanceOf(Object)(a)).toBe(true);
            expect(lamb.isInstanceOf(SomeObjB)(a)).toBe(false);

            expect(lamb.isInstanceOf(SomeObjA)(b)).toBe(false);

            SomeObjB.prototype = new SomeObjA();
            var c = new SomeObjB();

            expect(lamb.isInstanceOf(SomeObjA)(b)).toBe(false);
            expect(lamb.isInstanceOf(SomeObjA)(c)).toBe(true);

            expect(lamb.isInstanceOf(Object)({})).toBe(true);
            expect(lamb.isInstanceOf(Object)(Object.create(null))).toBe(false);
            expect(lamb.isInstanceOf(String)("foo")).toBe(false);
            expect(lamb.isInstanceOf(Object)("foo")).toBe(false);
            expect(lamb.isInstanceOf(String)(new String("foo"))).toBe(true);
            expect(lamb.isInstanceOf(Object)(new String("foo"))).toBe(true);
        });

        it("should build a predicate throwing an exception if the constructor isn't a function or is missing", function () {
            nonFunctions.forEach(function (value) {
                expect(lamb.isInstanceOf(value)).toThrow();
            });

            expect(lamb.isInstanceOf()).toThrow();
        });
    });

    describe("isNil", function () {
        it("should verify if the given value is null or undefined", function () {
            expect(lamb.isNil(null)).toBe(true);
            expect(lamb.isNil(void 0)).toBe(true);
        });

        it("should return true if called without arguments", function () {
            expect(lamb.isNil()).toBe(true);
        });

        it("should return false for every other value", function () {
            nonNils.forEach(function (value) {
                expect(lamb.isNil(value)).toBe(false);
            });
        });
    });

    describe("isNull", function () {
        it("should verify if the given value is null", function () {
            expect(lamb.isNull(null)).toBe(true);
        });

        it("should return false if called without arguments", function () {
            expect(lamb.isNull()).toBe(false);
        });

        it("should return false for every other value", function () {
            nonNulls.forEach(function (value) {
                expect(lamb.isNull(value)).toBe(false);
            });
        });
    });

    describe("isType", function () {
        it("should build a predicate that expects a value to check against the specified type", function () {
            var isArray = lamb.isType("Array");
            var isFunction = lamb.isType("Function");

            expect(isArray([1, 2, 3])).toBe(true);
            expect(isFunction(function () {})).toBe(true);
            expect(isArray({})).toBe(false);
            expect(isFunction(new Date())).toBe(false);
        });

        it("should build a function returning false for every value if called without arguments", function () {
            valuesList.forEach(function (value) {
                expect(lamb.isType()(value)).toBe(false);
            });
        });
    });

    describe("isUndefined", function () {
        it("should verify if the given value is undefined", function () {
            expect(lamb.isUndefined(void 0)).toBe(true);
        });

        it("should return true if called without arguments", function () {
            expect(lamb.isUndefined()).toBe(true);
        });

        it("should return false for every other value", function () {
            nonUndefineds.forEach(function (value) {
                expect(lamb.isUndefined(value)).toBe(false);
            });
        });
    });

    describe("type", function () {
        it("should extract the \"type tag\" from the given value", function () {
            var getArgsType = function () { return lamb.type(arguments); };
            expect(getArgsType()).toBe("Arguments");
            expect(lamb.type(new getArgsType())).toBe("Object");
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
});
