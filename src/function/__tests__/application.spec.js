import * as lamb from "../..";
import { nonArrayLikes, nonFunctions } from "../../__tests__/commons";

describe("application / apply / applyTo", function () {
    function Foo (value) {
        this.value = value;
    }

    Foo.prototype = {
        value: 0,
        bar: function (a, b) {
            return (this.value + a) / b;
        }
    };

    it("should apply the desired function to the given arguments", function () {
        expect(lamb.application(Math.max, [-1, 3, 2, 15, 7])).toBe(15);
        expect(lamb.apply(Math.max)([-1, 3, 2, 15, 7])).toBe(15);
        expect(lamb.applyTo([-1, 3, 2, 15, 7])(Math.max)).toBe(15);
    });

    it("should accept an array-like object as arguments for the function", function () {
        expect(lamb.application(Math.max, "3412")).toBe(4);
        expect(lamb.apply(Math.max)("3412")).toBe(4);
        expect(lamb.applyTo("3412")(Math.max)).toBe(4);
    });

    it("should not alter the function's context", function () {
        var obj = {
            value: 4,
            application: lamb.application,
            applyBar: lamb.apply(Foo.prototype.bar),
            baz: lamb.applyTo([1, 2])
        };

        expect(obj.application(Foo.prototype.bar, [1, 2])).toBe(2.5);
        expect(obj.applyBar([1, 2])).toBe(2.5);
        expect(obj.baz(Foo.prototype.bar)).toBe(2.5);
    });

    it("should treat non-array-like values for the `args` parameter as empty arrays", function () {
        var dummyFn = jest.fn();

        for (var i = 0, ofs = 0; i < nonArrayLikes.length; i++, ofs += 3) {
            lamb.application(dummyFn, nonArrayLikes[i]);
            lamb.apply(dummyFn)(nonArrayLikes[i]);
            lamb.applyTo(nonArrayLikes[i])(dummyFn);

            expect(dummyFn.mock.calls[ofs].length).toBe(0);
            expect(dummyFn.mock.calls[ofs + 1].length).toBe(0);
            expect(dummyFn.mock.calls[ofs + 2].length).toBe(0);
        }

        lamb.application(dummyFn);
        lamb.apply(dummyFn)();
        lamb.applyTo()(dummyFn);

        expect(dummyFn.mock.calls[ofs].length).toBe(0);
        expect(dummyFn.mock.calls[ofs + 1].length).toBe(0);
        expect(dummyFn.mock.calls[ofs + 2].length).toBe(0);
        expect(dummyFn).toHaveBeenCalledTimes(ofs + 3);
    });

    it("should throw an exception if `fn` isn't a function", function () {
        nonFunctions.forEach(function (value) {
            expect(function () { lamb.application(value, []); }).toThrow();
            expect(lamb.apply(value)).toThrow();
            expect(function () { lamb.applyTo([])(value); }).toThrow();
        });
    });
});
