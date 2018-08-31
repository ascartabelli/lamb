import * as lamb from "../..";
import { nonArrayLikes, nonFunctions } from "../../__tests__/commons";

describe("pipe", function () {
    var double = function (n) { return n * 2; };
    var cube = function (n) { return Math.pow(n, 3); };
    var changeSign = function (n) { return -n; };

    it("should return a function that is the pipeline of the given ones", function () {
        var pipeline = lamb.pipe([cube, changeSign, double]);

        expect(pipeline(2)).toBe(-16);
    });

    it("should be possible to reuse piped functions", function () {
        var cubeAndDouble = lamb.pipe([cube, double]);
        var fn1 = lamb.pipe([cubeAndDouble, cube, double]);
        var fn2 = lamb.pipe([cubeAndDouble, cubeAndDouble]);

        expect(fn1(5)).toBe(31250000);
        expect(fn2(5)).toBe(31250000);
    });

    it("should behave like the received function if only one function is supplied", function () {
        var fn = function (a, b, c) { return a - b - c; };

        expect(lamb.pipe([fn])(5, 4, 3)).toBe(-2);
    });

    it("should behave like `identity` if no functions are passed", function () {
        var obj = {};

        expect(lamb.pipe([])(obj)).toBe(obj);
        expect(lamb.pipe([])()).toBeUndefined();
        expect(lamb.pipe([])(2, 3, 4)).toBe(2);
    });

    it("should throw an exception if the received parameter isn't an array", function () {
        nonArrayLikes.forEach(function (value) {
            expect(function () { lamb.pipe(value); }).toThrow();
        });

        expect(lamb.pipe).toThrow();
    });

    it("should build a function throwing an exception if any parameter is not a function", function () {
        nonFunctions.forEach(function (value) {
            expect(lamb.pipe([lamb.identity, value])).toThrow();
            expect(lamb.pipe([value, lamb.identity])).toThrow();
        });
    });
});
