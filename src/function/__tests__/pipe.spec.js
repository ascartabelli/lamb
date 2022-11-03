import identity from "../../core/identity";
import pipe from "../pipe";
import { nonArrayLikes, nonFunctions } from "../../__tests__/commons";

describe("pipe", () => {
    const double = n => n * 2;
    const cube = n => n ** 3;
    const changeSign = n => -n;

    it("should return a function that is the pipeline of the given ones", () => {
        const pipeline = pipe([cube, changeSign, double]);

        expect(pipeline(2)).toBe(-16);
    });

    it("should be possible to reuse piped functions", () => {
        const cubeAndDouble = pipe([cube, double]);
        const fn1 = pipe([cubeAndDouble, cube, double]);
        const fn2 = pipe([cubeAndDouble, cubeAndDouble]);

        expect(fn1(5)).toBe(31250000);
        expect(fn2(5)).toBe(31250000);
    });

    it("should behave like the received function if only one function is supplied", () => {
        const fn = (a, b, c) => a - b - c;

        expect(pipe([fn])(5, 4, 3)).toBe(-2);
    });

    it("should behave like `identity` if no functions are passed", () => {
        const obj = {};

        expect(pipe([])(obj)).toBe(obj);
        expect(pipe([])()).toBeUndefined();
        expect(pipe([])(2, 3, 4)).toBe(2);
    });

    it("should throw an exception if the received parameter isn't an array", () => {
        nonArrayLikes.forEach(value => {
            expect(() => { pipe(value); }).toThrow();
        });

        expect(pipe).toThrow();
    });

    it("should build a function throwing an exception if any parameter is not a function", () => {
        nonFunctions.forEach(value => {
            expect(pipe([identity, value])).toThrow();
            expect(pipe([value, identity])).toThrow();
        });
    });
});
