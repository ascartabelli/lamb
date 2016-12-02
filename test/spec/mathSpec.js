
var lamb = require("../../dist/lamb.js");

describe("lamb.math", function () {
    describe("add", function () {
        it("should add two numbers", function () {
            expect(lamb.add(2, -3)).toBe(-1);
        });
    });

    describe("clamp", function () {
        it("should clamp a number within the given limits", function () {
            expect(lamb.clamp(0, -5, 5)).toBe(0);
            expect(lamb.clamp(-5, -5, 5)).toBe(-5);
            expect(lamb.clamp(5, -5, 5)).toBe(5);
            expect(lamb.clamp(-6, -5, 5)).toBe(-5);
            expect(lamb.clamp(6, -5, 5)).toBe(5);
            expect(lamb.clamp(0, 0, 0)).toBe(0);
            expect(Object.is(lamb.clamp(-0, 0, 0), -0)).toBe(true);
            expect(Object.is(lamb.clamp(0, -0, 0), 0)).toBe(true);
            expect(Object.is(lamb.clamp(0, 0, -0), 0)).toBe(true);
        });
    });

    describe("divide", function () {
        it("should divide two numbers", function () {
            expect(lamb.divide(15, 3)).toBe(5);
            expect(lamb.divide(15, 0)).toBe(Infinity);
        });
    });

    describe("generate", function () {
        it("should generate a sequence of values of the desired length with the provided iteratee", function () {
            var context = {};
            var fibonacci = function (n, idx, list) {
                expect(this).toBe(context);
                return n + (list[idx - 1] || 0);
            };

            expect(lamb.generate(1, 20, fibonacci, context)).toEqual([1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765]);
        });
    });

    describe("isFinite", function () {
        it("should verify whether the received value is a finite number", function () {
            expect(lamb.isFinite(0)).toBe(true);
            expect(lamb.isFinite(-2e64)).toBe(true);
            expect(lamb.isFinite(new Number(5))).toBe(true);
            expect(lamb.isFinite(Infinity)).toBe(false);
            expect(lamb.isFinite(-Infinity)).toBe(false);
            expect(lamb.isFinite(NaN)).toBe(false);
        });

        it("should return `false` for any non-number value and when it's called without arguments", function () {
            ["2", null, void 0, {}, [1], /foo/, function () {}, true, new Date()].forEach(function (value) {
                expect(lamb.isFinite(value)).toBe(false);
            });

            expect(lamb.isFinite()).toBe(false);
        });
    });

    describe("isInteger", function () {
        it("should verify whether the received value is an integer", function () {
            expect(lamb.isInteger(0)).toBe(true);
            expect(lamb.isInteger(-2e64)).toBe(true);
            expect(lamb.isInteger(new Number(5))).toBe(true);
            expect(lamb.isInteger(2.4)).toBe(false);
            expect(lamb.isInteger(Infinity)).toBe(false);
            expect(lamb.isInteger(-Infinity)).toBe(false);
            expect(lamb.isInteger(NaN)).toBe(false);
        });

        it("should return `false` for any non-number value and when it's called without arguments", function () {
            ["2", null, void 0, {}, [1], /foo/, function () {}, true, new Date()].forEach(function (value) {
                expect(lamb.isInteger(value)).toBe(false);
            });

            expect(lamb.isInteger()).toBe(false);
        });
    });

    describe("isSafeInteger", function () {
        it("shoud verify whether the received value is a \"safe integer\"", function () {
            expect(lamb.isSafeInteger(0)).toBe(true);
            expect(lamb.isSafeInteger(-2e10)).toBe(true);
            expect(lamb.isSafeInteger(new Number(5))).toBe(true);
            expect(lamb.isSafeInteger(Math.pow(2, 53) - 1)).toBe(true);
            expect(lamb.isSafeInteger(2.4)).toBe(false);
            expect(lamb.isSafeInteger(Math.pow(2, 53))).toBe(false);
            expect(lamb.isSafeInteger(-2e64)).toBe(false);
            expect(lamb.isSafeInteger(Infinity)).toBe(false);
            expect(lamb.isSafeInteger(-Infinity)).toBe(false);
            expect(lamb.isSafeInteger(NaN)).toBe(false);
        });

        it("should return `false` for any non-number value and when it's called without arguments", function () {
            ["2", null, void 0, {}, [1], /foo/, function () {}, true, new Date()].forEach(function (value) {
                expect(lamb.isSafeInteger(value)).toBe(false);
            });

            expect(lamb.isSafeInteger()).toBe(false);
        });
    });

    describe("modulo", function () {
        it("should calculate the modulo of two numbers", function () {
            expect(lamb.modulo(5, 3)).toBe(2);
            expect(lamb.modulo(-5, 3)).toBe(1);
            expect(isNaN(lamb.modulo(-5, 0))).toBe(true);
        });
    });

    describe("multiply", function () {
        it("should multiply two numbers", function () {
            expect(lamb.multiply(5, -3)).toBe(-15);
        });
    });

    describe("randomInt", function () {
        var rndSpy;

        beforeEach(function () {
            rndSpy = spyOn(Math, "random").and.callThrough();
        });

        it("should generate a random integer between the min and max provided values", function () {
            var n = lamb.randomInt(3, 42);

            expect(Math.floor(n)).toBe(n);
            expect(n).toBeGreaterThan(2);
            expect(n).toBeLessThan(43);

            rndSpy.and.returnValue(0.9999999999999999);

            expect(lamb.randomInt(0, 0)).toBe(0);
            expect(lamb.randomInt(0, 1)).toBe(1);
            expect(lamb.randomInt(0, 2)).toBe(2);

            rndSpy.and.returnValue(0);

            expect(lamb.randomInt(0, 0)).toBe(0);
            expect(lamb.randomInt(0, 1)).toBe(0);
            expect(lamb.randomInt(0, 2)).toBe(0);
        });
    });

    describe("range", function () {
        it("should generate an arithmetic progression of integers with the given parameters", function () {
            expect(lamb.range(2, 10)).toEqual([2, 3, 4, 5, 6, 7, 8, 9]);
            expect(lamb.range(2, 10, 0)).toEqual([2]);
            expect(lamb.range(1, -10, -2)).toEqual([1, -1, -3, -5, -7, -9]);
            expect(lamb.range(1, -10, 2)).toEqual([1]);
            expect(lamb.range()).toEqual([void 0]);
            expect(lamb.range(2)).toEqual([2]);
            expect(lamb.range(2, NaN)).toEqual([2]);
        });
    });

    describe("remainder", function () {
        it("should calculate the remainder of the division of two numbers", function () {
            expect(lamb.remainder(5, 3)).toBe(2);
            expect(lamb.remainder(-5, 3)).toBe(-2);
            expect(isNaN(lamb.remainder(-5, 0))).toBe(true);
        });
    });

    describe("subtract", function () {
        it("should subtract two numbers", function () {
            expect(lamb.subtract(5, 7)).toBe(-2);
        });
    });
});
