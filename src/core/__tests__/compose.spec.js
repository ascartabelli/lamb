import * as lamb from "../..";
import { nonFunctions } from "../../__tests__/commons";

describe("compose", function () {
    var double = function (n) { return n * 2; };
    var cube = function (n) { return Math.pow(n, 3); };
    var changeSign = function (n) { return -n; };

    var cubeAndDouble = lamb.compose(double, cube);
    var doubleAndCube = lamb.compose(cube, double);

    it("should return a function that is the composition of the given functions; the first one consuming the return value of the function that follows", function () {
        expect(cubeAndDouble(5)).toBe(250);
        expect(doubleAndCube(5)).toBe(1000);
    });

    it("should be possible to reuse composed functions", function () {
        var changeSignCubeAndDouble = lamb.compose(cubeAndDouble, changeSign);

        expect(changeSignCubeAndDouble(2)).toBe(-16);
    });

    it("should behave like `identity` if no functions are passed", function () {
        var obj = {};

        expect(lamb.compose()(obj)).toBe(obj);
        expect(lamb.compose()()).toBeUndefined();
        expect(lamb.compose()(2, 3, 4)).toBe(2);
    });

    it("should ignore extra arguments", function () {
        expect(lamb.compose(double, cube, changeSign)(5)).toBe(250);
    });

    it("should build a function throwing an exception if any parameter is not a function", function () {
        nonFunctions.forEach(function (value) {
            expect(lamb.compose(lamb.identity, value)).toThrow();
            expect(lamb.compose(value, lamb.identity)).toThrow();
        });

        expect(lamb.compose(lamb.identity)).toThrow();
    });
});
