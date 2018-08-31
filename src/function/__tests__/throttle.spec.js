import * as lamb from "../..";

describe("throttle", function () {
    var value = 0;
    var foo = jest.fn(function () {
        ++value;
    });
    var now = Date.now();

    jest.spyOn(Date, "now")
        .mockReturnValueOnce(now)
        .mockReturnValueOnce(now + 10)
        .mockReturnValueOnce(now + 50)
        .mockReturnValueOnce(now + 101)
        .mockReturnValueOnce(now + 151)
        .mockReturnValueOnce(now + 201);

    it("should return a function that will invoke the passed function at most once in the given timespan", function () {
        var throttledFoo = lamb.throttle(foo, 100);

        throttledFoo();
        throttledFoo();
        throttledFoo();

        expect(foo).toHaveBeenCalledTimes(1);
        expect(value).toBe(1);

        foo.mockClear();

        throttledFoo();
        throttledFoo();

        expect(foo).toHaveBeenCalledTimes(1);
        expect(value).toBe(2);

        throttledFoo();

        expect(foo).toHaveBeenCalledTimes(2);
        expect(value).toBe(3);
    });
});
