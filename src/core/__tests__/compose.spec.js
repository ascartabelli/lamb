import compose from "../compose";
import identity from "../identity";
import { nonFunctions } from "../../__tests__/commons";

describe("compose", () => {
    const double = n => n * 2;
    const cube = n => n ** 3;
    const changeSign = n => -n;
    const cubeAndDouble = compose(double, cube);
    const doubleAndCube = compose(cube, double);

    it("should return a function that is the composition of the given functions; the first one consuming the return value of the function that follows", () => {
        expect(cubeAndDouble(5)).toBe(250);
        expect(doubleAndCube(5)).toBe(1000);
    });

    it("should be possible to reuse composed functions", () => {
        const changeSignCubeAndDouble = compose(cubeAndDouble, changeSign);

        expect(changeSignCubeAndDouble(2)).toBe(-16);
    });

    it("should behave like `identity` if no functions are passed", () => {
        const obj = {};

        expect(compose()(obj)).toBe(obj);
        expect(compose()()).toBeUndefined();
        expect(compose()(2, 3, 4)).toBe(2);
    });

    it("should ignore extra arguments", () => {
        expect(compose(double, cube, changeSign)(5)).toBe(250);
    });

    it("should build a function throwing an exception if any parameter is not a function", () => {
        nonFunctions.forEach(value => {
            expect(compose(identity, value)).toThrow();
            expect(compose(value, identity)).toThrow();
        });

        expect(compose(identity)).toThrow();
    });
});
