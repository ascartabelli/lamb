import application from "../application";
import apply from "../apply";
import applyTo from "../applyTo";
import { nonArrayLikes, nonFunctions } from "../../__tests__/commons";

describe("application / apply / applyTo", () => {
    function Foo (value) {
        this.value = value;
    }

    Foo.prototype = {
        value: 0,
        bar: function (a, b) {
            return (this.value + a) / b;
        }
    };

    it("should apply the desired function to the given arguments", () => {
        expect(application(Math.max, [-1, 3, 2, 15, 7])).toBe(15);
        expect(apply(Math.max)([-1, 3, 2, 15, 7])).toBe(15);
        expect(applyTo([-1, 3, 2, 15, 7])(Math.max)).toBe(15);
    });

    it("should accept an array-like object as arguments for the function", () => {
        expect(application(Math.max, "3412")).toBe(4);
        expect(apply(Math.max)("3412")).toBe(4);
        expect(applyTo("3412")(Math.max)).toBe(4);
    });

    it("should not alter the function's context", () => {
        const obj = {
            value: 4,
            application: application,
            applyBar: apply(Foo.prototype.bar),
            baz: applyTo([1, 2])
        };

        expect(obj.application(Foo.prototype.bar, [1, 2])).toBe(2.5);
        expect(obj.applyBar([1, 2])).toBe(2.5);
        expect(obj.baz(Foo.prototype.bar)).toBe(2.5);
    });

    it("should treat non-array-like values for the `args` parameter as empty arrays", () => {
        const dummyFn = jest.fn();
        let ofs = 0;

        for (let i = 0; i < nonArrayLikes.length; i++, ofs += 3) {
            application(dummyFn, nonArrayLikes[i]);
            apply(dummyFn)(nonArrayLikes[i]);
            applyTo(nonArrayLikes[i])(dummyFn);

            expect(dummyFn.mock.calls[ofs].length).toBe(0);
            expect(dummyFn.mock.calls[ofs + 1].length).toBe(0);
            expect(dummyFn.mock.calls[ofs + 2].length).toBe(0);
        }

        application(dummyFn);
        apply(dummyFn)();
        applyTo()(dummyFn);

        expect(dummyFn.mock.calls[ofs].length).toBe(0);
        expect(dummyFn.mock.calls[ofs + 1].length).toBe(0);
        expect(dummyFn.mock.calls[ofs + 2].length).toBe(0);
        expect(dummyFn).toHaveBeenCalledTimes(ofs + 3);
    });

    it("should throw an exception if `fn` isn't a function", () => {
        nonFunctions.forEach(value => {
            expect(() => { application(value, []); }).toThrow();
            expect(apply(value)).toThrow();
            expect(() => { applyTo([])(value); }).toThrow();
        });
    });
});
