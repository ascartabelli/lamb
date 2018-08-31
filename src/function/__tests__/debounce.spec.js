import * as lamb from "../..";

jest.useFakeTimers();

describe("debounce", function () {
    var value = 0;
    var testFn = jest.fn(function (n) {
        value += n;
    });

    it("should return a function that will execute the given function only if it stops being called for the specified timespan", function () {
        var debounced = lamb.debounce(testFn, 100);

        debounced(1);
        debounced(2);
        debounced(3);

        expect(testFn).toHaveBeenCalledTimes(0);
        expect(value).toBe(0);

        jest.advanceTimersByTime(101);

        expect(testFn).toHaveBeenCalledTimes(1);
        expect(value).toBe(3);
    });
});
